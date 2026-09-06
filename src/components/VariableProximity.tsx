import React, { useRef, useEffect, ReactNode } from 'react';

export interface VariableProximityProps {
  label?: string;
  children?: ReactNode;
  className?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  containerRef?: React.RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  style?: React.CSSProperties;
}

export const VariableProximity: React.FC<VariableProximityProps> = ({
  label,
  children,
  className = '',
  containerRef,
  radius = 120,
  falloff = 'linear',
  style,
}) => {
  const textContent = label || (typeof children === 'string' ? children : '');
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerElementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      letterRefs.current.forEach((letterSpan) => {
        if (!letterSpan) return;

        const rect = letterSpan.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const distance = Math.hypot(clientX - letterCenterX, clientY - letterCenterY);

        if (distance < radius) {
          const normDistance = distance / radius;
          let factor = 1 - normDistance;

          if (falloff === 'exponential') {
            factor = Math.pow(factor, 2);
          } else if (falloff === 'gaussian') {
            factor = Math.exp(-Math.pow(normDistance, 2) * 4);
          }

          factor = Math.max(0, Math.min(1, factor));

          // Interpolate font-weight / scale
          const minWeight = 400;
          const maxWeight = 900;
          const interpolatedWeight = Math.round(minWeight + (maxWeight - minWeight) * factor);
          const interpolatedScale = 1 + factor * 0.08;

          letterSpan.style.fontWeight = `${interpolatedWeight}`;
          letterSpan.style.transform = `scale(${interpolatedScale})`;
          letterSpan.style.color = factor > 0.3 ? '#0CC0DF' : '';
        } else {
          letterSpan.style.fontWeight = '700';
          letterSpan.style.transform = 'scale(1)';
          letterSpan.style.color = '';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [containerRef, radius, falloff]);

  if (!textContent) {
    return <span className={className} style={style}>{children}</span>;
  }

  const words = textContent.split(' ');

  return (
    <span
      ref={containerElementRef}
      className={`inline-block ${className}`}
      style={style}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => {
            const globalIdx = words.slice(0, wordIdx).join(' ').length + (wordIdx > 0 ? 1 : 0) + charIdx;
            return (
              <span
                key={charIdx}
                ref={(el) => {
                  letterRefs.current[globalIdx] = el;
                }}
                className="inline-block transition-transform duration-100 ease-out"
                style={{
                  willChange: 'transform, font-weight',
                }}
              >
                {char}
              </span>
            );
          })}
          {wordIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

export default VariableProximity;
