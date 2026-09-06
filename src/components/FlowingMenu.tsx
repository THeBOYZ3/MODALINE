import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

export interface MenuItem {
  link?: string;
  text: string;
  image: string;
}

export interface FlowingMenuProps {
  items: MenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#ffffff',
  bgColor = 'transparent',
  marqueeBgColor = '#ffffff',
  marqueeTextColor = '#120F17',
  borderColor = 'transparent',
}: FlowingMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  const updatePositionAndHover = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });

    let foundIndex: number | null = null;
    for (let i = 0; i < items.length; i++) {
      const itemEl = itemRefs.current[i];
      if (itemEl) {
        const itemRect = itemEl.getBoundingClientRect();
        if (
          clientY >= itemRect.top &&
          clientY <= itemRect.bottom &&
          clientX >= itemRect.left &&
          clientX <= itemRect.right
        ) {
          foundIndex = i;
          break;
        }
      }
    }
    setHoveredIndex(foundIndex);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleTouchStartMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updatePositionAndHover(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setHoveredIndex(null);
  };

  return (
    <div
      ref={containerRef}
      data-flowing-menu="true"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStartMove}
      onTouchMove={handleTouchStartMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="relative w-full h-full flex flex-col justify-stretch overflow-hidden select-none flowing-menu"
      style={{ backgroundColor: bgColor }}
    >
      {/* Floating Image Preview Following Mouse */}
      {hoveredIndex !== null && items[hoveredIndex] && (
        <motion.div
          className="pointer-events-none fixed z-30 w-48 h-32 md:w-64 md:h-40 overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: mousePos.x - 128,
            y: mousePos.y - 80,
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, opacity: { duration: 0.2 } }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <img
            src={items[hoveredIndex].image}
            alt={items[hoveredIndex].text}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Menu List */}
      <div className="flex-1 flex flex-col justify-evenly">
        {items.map((item, idx) => {
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={idx}
              ref={(el) => (itemRefs.current[idx] = el)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex-1 flex items-center justify-center overflow-hidden cursor-pointer group"
              style={{ borderColor: borderColor }}
            >
              {/* Default Text */}
              <a
                href={item.link || '#'}
                className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider transition-colors duration-300 font-anton text-center px-4"
                style={{ color: textColor }}
              >
                {item.text}
              </a>

              {/* Hover Marquee Overlay */}
              <motion.div
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{
                  clipPath: isHovered
                    ? 'inset(0% 0% 0% 0%)'
                    : 'inset(100% 0% 0% 0%)',
                }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                className="absolute inset-0 z-20 flex items-center overflow-hidden pointer-events-none"
                style={{ backgroundColor: marqueeBgColor }}
              >
                <div
                  className="flex whitespace-nowrap animate-marquee"
                  style={{
                    animationDuration: `${Math.max(5, 30 - speed)}s`,
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <span
                      key={i}
                      className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider font-anton px-8 flex items-center gap-6"
                      style={{ color: marqueeTextColor }}
                    >
                      {item.text}
                      <span className="text-xl md:text-2xl opacity-40">•</span>
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Inline Marquee Keyframes style if needed */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}
