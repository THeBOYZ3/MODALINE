import React from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text?: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  delay = 150,
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  className = '',
  style = {},
  as: Component = 'p',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  const variants = {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      y: direction === 'top' ? -20 : 20,
    },
    visible: (i: number) => ({
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        delay: (i * delay) / 1000,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <Component className={`inline-flex flex-wrap ${className}`} style={style}>
      {elements.map((el, index) => (
        <motion.span
          key={index}
          custom={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={variants}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          className="inline-block whitespace-pre"
        >
          {el}
          {animateBy === 'words' && index < elements.length - 1 && ' '}
        </motion.span>
      ))}
    </Component>
  );
};

export default BlurText;
