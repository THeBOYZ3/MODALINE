import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Compass,
  ArrowUpRight,
  Bot,
  User,
  Paperclip,
  Minus,
} from 'lucide-react';
import Lenis from 'lenis';
import { useShop } from '@/context/ShopContext';
import { scrollToTarget } from '@/lib/lenis';

interface ChatMessage {
  id: string;
  sender: 'user' | 'guide';
  text: string;
  timestamp: Date;
}

interface TextToken {
  type: 'link' | 'bold' | 'text';
  text?: string;
  label?: string;
  href?: string;
}

const SUGGESTED_QUESTIONS = [
  { label: 'Show me around', prompt: 'Show me around the website.' },
  { label: 'What is Modaline?', prompt: 'What is Modaline and what products do you sell?' },
  { label: 'Explore products', prompt: 'Tell me about your product collection and prices.' },
  { label: 'How does ordering work?', prompt: 'How does ordering and adding items to cart work?' },
];

export const TourGuideChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, navigate, setIsCartOpen, showToast } = useShop();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'guide',
      text: "Hey! Welcome to **Modaline**. Looking for something specific or want me to **[Show me around](#shop)**? You can ask about our **T-shirts**, **fabric & sizing**, or click any highlighted section to explore!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const chatLenisRef = useRef<Lenis | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize isolated smooth Lenis scrolling inside the chat message container
  useEffect(() => {
    if (!isOpen || !scrollAreaRef.current) return;

    const wrapper = scrollAreaRef.current;
    const content = scrollContentRef.current || (wrapper.firstElementChild as HTMLElement) || wrapper;

    const lenis = new Lenis({
      wrapper,
      content,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    chatLenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      chatLenisRef.current = null;
    };
  }, [isOpen]);

  const scrollToBottom = (smooth = true) => {
    if (chatLenisRef.current && scrollAreaRef.current) {
      chatLenisRef.current.scrollTo('bottom', {
        duration: smooth ? 0.6 : 0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  const handleNavigateTarget = (href: string) => {
    if (!href) return;

    if (href === '#cart' || href === 'action:cart' || href === '/cart' || href === 'cart') {
      setIsCartOpen(true);
      if (showToast) showToast('Opened your Shopping Cart');
      return;
    }

    if (href.startsWith('/product/') || (href === '/' && currentPath !== '/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (showToast) showToast('Navigated to product page');
      return;
    }

    if (href.startsWith('#') || href.startsWith('/#')) {
      const targetHash = href.startsWith('/#') ? href.slice(1) : href;
      if (currentPath.startsWith('/product/')) {
        navigate('/');
        setTimeout(() => {
          scrollToTarget(targetHash);
        }, 200);
      } else {
        scrollToTarget(targetHash);
      }
      if (showToast) showToast(`Navigated to ${targetHash.replace('#', '')}`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isLoading, streamingMessageId, isOpen]);

  // Clean up any ongoing stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || streamingMessageId) return;

    // Abort previous stream if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const guideId = (Date.now() + 1).toString();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Build brief history for API
      const history = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      // Connect to real-time streaming endpoint
      const response = await fetch('/api/guide/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to connect to guide server.');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported by browser.');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';
      let messageCreated = false;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.slice(5).trim();

          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulatedText += parsed.text;

              if (!messageCreated) {
                setIsLoading(false);
                setStreamingMessageId(guideId);
                setMessages((prev) => [
                  ...prev,
                  {
                    id: guideId,
                    sender: 'guide',
                    text: accumulatedText,
                    timestamp: new Date(),
                  },
                ]);
                messageCreated = true;
              } else {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === guideId ? { ...msg, text: accumulatedText } : msg
                  )
                );
              }
            }
          } catch (jsonErr) {
            if (jsonErr instanceof Error && jsonErr.message !== 'Unexpected end of JSON input') {
              // Ignore partial JSON chunks
            }
          }
        }
      }

      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      setIsLoading(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;

      // Fallback to standard fast endpoint if streaming is blocked or fails
      try {
        const history = messages
          .filter((m) => m.id !== 'welcome-1')
          .slice(-6)
          .map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          }));

        const fallbackRes = await fetch('/api/guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, history }),
        });

        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.reply) {
          const cleanText = (fallbackData.reply as string)
            .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
            .trim();
          setMessages((prev) => [
            ...prev,
            {
              id: guideId,
              sender: 'guide',
              text: cleanText,
              timestamp: new Date(),
            },
          ]);
          return;
        }
      } catch {
        // Fallback failed as well, display error message
      }

      let errorMsg =
        err instanceof Error
          ? err.message
          : 'Sorry, I hit a temporary network snag. Please try again in a moment.';

      if (errorMsg.includes('UNAVAILABLE') || errorMsg.includes('503') || errorMsg.includes('high demand')) {
        errorMsg = 'Our AI guide is currently experiencing high demand. Please try asking again in a moment!';
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'guide',
        text: errorMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  // Tokenize line into text, bold, and interactive links
  const tokenizeLine = (lineText: string): TextToken[] => {
    const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
    const parts = lineText.split(tokenRegex);
    const tokens: TextToken[] = [];

    for (const part of parts) {
      if (!part) continue;

      // Match [Label](href)
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        const cleanLabel = linkMatch[1].replace(/\*\*/g, '').trim();
        tokens.push({
          type: 'link',
          label: cleanLabel,
          href: linkMatch[2].trim(),
        });
        continue;
      }

      // Match **Text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const inner = part.slice(2, -2);
        // Check if bold wraps a link inside like **[Label](href)**
        const innerLinkMatch = inner.match(/^\[(.*?)\]\((.*?)\)$/);
        if (innerLinkMatch) {
          tokens.push({
            type: 'link',
            label: innerLinkMatch[1].replace(/\*\*/g, '').trim(),
            href: innerLinkMatch[2].trim(),
          });
        } else {
          tokens.push({
            type: 'bold',
            text: inner,
          });
        }
        continue;
      }

      // Regular text
      tokens.push({
        type: 'text',
        text: part,
      });
    }

    return tokens;
  };

  // Helper to render bold, markdown links, list bullets, and active streaming cursor
  const renderFormattedText = (text: string, isUser: boolean, isStreaming = false) => {
    // Ensure unclosed ** is temporarily closed during streaming so it doesn't break formatting
    let sanitized = text;
    const boldCount = (sanitized.match(/\*\*/g) || []).length;
    if (boldCount % 2 !== 0) {
      sanitized += '**';
    }

    const lines = sanitized.split('\n');
    return (
      <div className="space-y-1.5">
        {lines.map((line, lIdx) => {
          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
          const lineContent = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line;
          const tokens = tokenizeLine(lineContent);
          const isLastLine = lIdx === lines.length - 1;

          return (
            <div
              key={lIdx}
              className={`leading-relaxed ${
                isBullet ? 'flex items-start gap-2 pl-1 py-0.5' : ''
              }`}
            >
              {isBullet && (
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0CC0DF] shrink-0" />
              )}
              <p className="flex-1">
                {tokens.map((token, tIdx) => {
                  if (token.type === 'link' && token.label && token.href) {
                    return (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => handleNavigateTarget(token.href!)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 my-0.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 group/link text-left align-baseline ${
                          isUser
                            ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                            : 'bg-[#0CC0DF]/10 hover:bg-[#0CC0DF]/20 text-[#07889e] hover:text-[#066e80] border border-[#0CC0DF]/30 shadow-2xs hover:shadow-xs'
                        }`}
                        title={`Launch to ${token.label}`}
                      >
                        <span className="underline decoration-[#0CC0DF]/60 underline-offset-2">
                          {token.label}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-[#0CC0DF] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform shrink-0" />
                      </button>
                    );
                  }

                  if (token.type === 'bold' && token.text) {
                    return (
                      <strong
                        key={tIdx}
                        className={`font-bold tracking-tight ${
                          isUser ? 'text-white underline underline-offset-2' : 'text-slate-900 font-semibold'
                        }`}
                      >
                        {token.text}
                      </strong>
                    );
                  }

                  return <span key={tIdx}>{token.text}</span>;
                })}

                {isStreaming && isLastLine && (
                  <span
                    className="inline-block w-1.5 h-3.5 bg-[#0CC0DF] rounded-xs ml-1 animate-pulse align-baseline shadow-xs"
                    aria-hidden="true"
                  />
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto font-sans">
      {/* Chat Window Container - Modern Card with Aqua Blue Theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modaline-chat-window"
            id="tour-guide-chat-window"
            data-lenis-prevent="true"
            initial={{ opacity: 0, scale: 0.85, y: 25, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: 20,
              filter: 'blur(4px)',
              transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
            }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 350,
              mass: 0.75,
            }}
            style={{ transformOrigin: 'bottom right' }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[380px] max-w-[420px] h-[550px] max-h-[82vh] bg-white border border-slate-200/90 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.14),0_0_0_1px_rgba(12,192,223,0.12)] flex flex-col overflow-hidden text-slate-800 overscroll-contain touch-pan-y"
          >
            {/* Header Area - Aqua Blue Background with Virtual Assistant Title and Minimize Bar */}
            <div className="px-5 py-4 bg-[#0CC0DF] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">
                  <span className="text-[#003B73] font-bold">Modaline</span> assistant
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Minimize Chat"
                  title="Minimize"
                >
                  <Minus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Message Area - Clean White with Smooth Lenis Scroll and Differentiated Avatars */}
            <div className="flex-1 relative overflow-hidden bg-white flex flex-col">
              <div
                ref={scrollAreaRef}
                id="tour-guide-messages-scroll-area"
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="flex-1 p-4 overflow-y-auto text-xs sm:text-sm relative z-10 scrollbar-thin scrollbar-thumb-slate-200 overscroll-y-contain touch-pan-y"
              >
                <div ref={scrollContentRef} className="space-y-4">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isStreaming = msg.id === streamingMessageId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isUser ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Differentiated User / Assistant Header */}
                        {isUser ? (
                          <div className="flex items-center gap-1.5 mb-1.5 pr-1">
                            <span className="text-xs font-medium text-slate-600">
                              You
                            </span>
                            <div className="w-5 h-5 rounded-full bg-[#8A3FFC] text-white flex items-center justify-center p-0.5 shadow-2xs">
                              <User className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mb-1.5 pl-1">
                            <div className="w-6 h-6 rounded-lg bg-[#0CC0DF] text-white flex items-center justify-center shadow-2xs">
                              <Bot className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 tracking-tight">
                              Modaline Guide
                            </span>
                          </div>
                        )}

                        {/* Intuitive and Clear Bubble */}
                        <div
                          className={`max-w-[85%] px-4 py-3 text-xs sm:text-[13px] leading-relaxed transition-all ${
                            isUser
                              ? 'bg-[#0CC0DF] text-white rounded-2xl rounded-tr-xs font-normal shadow-xs'
                              : 'bg-[#F0F2F5] text-slate-800 rounded-2xl rounded-tl-xs font-normal border border-slate-200/40 shadow-2xs'
                          }`}
                        >
                          {renderFormattedText(msg.text, isUser, isStreaming)}
                        </div>

                        {/* Timestamp */}
                        <span
                          className={`text-[10px] text-slate-400 mt-1 font-normal ${
                            isUser ? 'pr-1 text-right' : 'pl-1 text-left'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                        </span>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2 mb-1.5 pl-1">
                        <div className="w-6 h-6 rounded-lg bg-[#0CC0DF] text-white flex items-center justify-center shadow-2xs">
                          <Bot className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800">
                          Modaline Guide
                        </span>
                      </div>
                      <div className="bg-[#F0F2F5] border border-slate-200/40 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2.5 shadow-2xs">
                        <div className="flex items-center gap-1 py-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0CC0DF] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0CC0DF] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0CC0DF] animate-bounce" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Guide is thinking...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Quick Prompt Action Buttons */}
            <div className="px-3.5 py-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  disabled={isLoading || !!streamingMessageId}
                  onClick={() => handleQuickPrompt(item.prompt)}
                  className="text-[11px] px-3.5 py-1.5 rounded-xl border border-[#0CC0DF] bg-white hover:bg-[#0CC0DF]/10 text-[#0CC0DF] font-semibold transition-all text-left disabled:opacity-50 cursor-pointer shadow-2xs active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Clear Text Input Field */}
            <div className="p-3 bg-white border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-1.5 pl-3.5 flex items-center gap-2 focus-within:border-[#0CC0DF] focus-within:ring-2 focus-within:ring-[#0CC0DF]/20 transition-all shadow-2xs"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isLoading
                      ? 'Guide is thinking...'
                      : streamingMessageId
                      ? 'Guide is responding...'
                      : 'Type a message'
                  }
                  disabled={isLoading || !!streamingMessageId}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none border-none font-normal"
                />
                
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Show me the product catalog and available colors.')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
                  aria-label="Attach File / Suggest"
                  title="Browse Catalog"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || !!streamingMessageId}
                  className="p-1.5 text-[#0CC0DF] hover:text-[#0aa6c2] disabled:text-slate-300 transition-colors cursor-pointer rounded-lg hover:bg-[#0CC0DF]/10 active:scale-90"
                  aria-label="Send Message"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button with Spring Entrance Pop & Physics */}
      <motion.button
        id="tour-guide-toggle-btn"
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 20 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 22,
          delay: 0.6,
        }}
        whileHover={{
          scale: 1.05,
          y: -2,
        }}
        whileTap={{
          scale: 0.9,
        }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setUnreadCount(0);
        }}
        className="group relative flex items-center justify-center w-[50px] hover:w-[140px] h-[50px] rounded-full hover:rounded-[50px] bg-white hover:bg-slate-50 text-[#0CC0DF] font-semibold border border-white shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden cursor-pointer select-none"
        aria-label="Open Tour Guide"
      >
        {/* Default Icon */}
        <span className="flex items-center justify-center transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0">
          <Compass
            className={`w-5 h-5 text-[#0CC0DF] transition-transform duration-300 ${
              isOpen ? 'rotate-90 scale-110' : ''
            }`}
          />
        </span>

        {/* Text on Hover */}
        <span className="absolute opacity-0 group-hover:opacity-100 font-bold text-xs tracking-wider uppercase transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 text-[#0CC0DF]">
          {isOpen ? 'Close Guide' : 'Guide'}
        </span>

        {/* Unread Badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#0CC0DF] rounded-full border-2 border-white animate-pulse group-hover:opacity-0 transition-opacity" />
        )}
      </motion.button>
    </div>
  );
};

export default TourGuideChat;
