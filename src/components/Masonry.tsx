import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface MasonryItem {
  id: string;
  img: string;
  url?: string;
  height?: number;
  title?: string;
}

export interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
}

export default function Masonry({
  items,
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = false,
  colorShiftOnHover = false,
}: MasonryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getInitialOffset = () => {
    switch (animateFrom) {
      case 'bottom':
        return { y: 40, opacity: 0 };
      case 'top':
        return { y: -40, opacity: 0 };
      case 'left':
        return { x: -40, opacity: 0 };
      case 'right':
        return { x: 40, opacity: 0 };
      default:
        return { y: 40, opacity: 0 };
    }
  };

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, index) => {
        const isHovered = hoveredId === item.id;
        const isAnyHovered = hoveredId !== null;

        return (
          <motion.div
            key={item.id}
            initial={getInitialOffset()}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration,
              delay: index * stagger,
              ease: [0.25, 1, 0.5, 1],
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative overflow-hidden rounded-2xl group cursor-pointer bg-navy/5 border border-navy/10 shadow-sm transition-all duration-300"
            style={{
              height: item.height ? `${item.height}px` : '220px',
            }}
          >
            <motion.div
              animate={{
                scale: scaleOnHover && isHovered ? hoverScale : 1,
                filter: blurToFocus && isAnyHovered && !isHovered ? 'blur(3px) opacity(0.6)' : 'blur(0px) opacity(1)',
              }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <img
                src={item.img}
                alt={item.title || `masonry-${item.id}`}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  colorShiftOnHover && isHovered ? 'contrast-125 saturate-150' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                {item.title && (
                  <span className="text-white text-xs font-semibold tracking-wider uppercase font-montserrat">
                    {item.title}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
