import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export interface StackProps {
  cards?: React.ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  cardDimensions?: { width?: number | string; height?: number | string };
  animationConfig?: { stiffness?: number; damping?: number };
}

export default function Stack({
  cards = [],
  randomRotation = false,
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 2000,
  pauseOnHover = false,
}: StackProps) {
  // Stack order stores indices of cards: first element is top card, last is bottom card
  const [stack, setStack] = useState<number[]>(() =>
    cards.map((_, index) => index)
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync stack array if cards prop length changes
  useEffect(() => {
    setStack((prevStack) => {
      if (prevStack.length === cards.length) return prevStack;
      return cards.map((_, index) => index);
    });
  }, [cards.length]);

  // Function to move top card to back
  const sendToBack = () => {
    if (cards.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setStack((prevStack) => {
      const [first, ...rest] = prevStack;
      return [...rest, first];
    });
    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  // Autoplay handler
  useEffect(() => {
    if (!autoplay || cards.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    timerRef.current = setInterval(() => {
      sendToBack();
    }, autoplayDelay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered, cards.length, isAnimating]);

  const handleCardClick = () => {
    if (sendToBackOnClick) {
      sendToBack();
    }
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {stack.map((cardIndex, position) => {
          // position 0 is top, position 1 is middle, position 2 is back...
          const isTop = position === 0;
          // Scale & Y offset based on depth in stack
          const scale = 1 - position * 0.05;
          const translateY = position * 10;
          const zIndex = cards.length - position;
          const rotation = randomRotation
            ? ((cardIndex * 37) % 12) - 6
            : (position % 2 === 0 ? 1 : -1) * (position * 2);

          return (
            <motion.div
              key={cardIndex}
              layout
              initial={false}
              animate={{
                scale,
                y: translateY,
                rotate: rotation,
                zIndex,
                opacity: position > 3 ? 0 : 1 - position * 0.15,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              onClick={isTop ? handleCardClick : undefined}
              className={`absolute inset-0 rounded-2xl overflow-hidden shadow-xl border border-navy/10 bg-white cursor-pointer ${
                isTop ? 'hover:shadow-2xl transition-shadow' : 'pointer-events-none'
              }`}
              style={{
                transformOrigin: 'bottom center',
              }}
            >
              {cards[cardIndex]}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
