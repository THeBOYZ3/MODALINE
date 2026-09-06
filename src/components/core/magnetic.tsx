import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

export interface MagneticProps {
  children: React.ReactElement;
  intensity?: number;
  range?: number;
  actionArea?: 'parent' | 'self' | 'global';
  springOptions?: { bounce?: number; damping?: number; stiffness?: number; mass?: number };
}

export function Magnetic({
  children,
  intensity = 0.5,
  range = 120,
  springOptions,
}: MagneticProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    if (Math.hypot(distanceX, distanceY) < range) {
      setPosition({ x: distanceX * intensity, y: distanceY * intensity });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
        ...springOptions,
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

export default Magnetic;
