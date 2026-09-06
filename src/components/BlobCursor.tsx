import React, { useEffect, useRef } from 'react';

export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterStdDeviation?: number;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#00deff',
  trailCount = 3,
  sizes = [22, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = '#ffffff',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = '#1100eb',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterStdDeviation = 30,
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  zIndex = 100,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const blobsRef = useRef<Array<{ x: number; y: number }>>([]);
  const blobNodesRef = useRef<Array<HTMLDivElement | null>>([]);

  // Initialize blob positions
  if (blobsRef.current.length !== trailCount) {
    blobsRef.current = Array.from({ length: trailCount }, () => ({
      x: -1000,
      y: -1000,
    }));
  }

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      mouseRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    let animationFrameId: number;

    const updatePositions = () => {
      const target = mouseRef.current;
      const updated = blobsRef.current;

      if (containerRef.current) {
        let isOverFlowingMenu = false;
        if (target.x >= 0 && target.y >= 0) {
          const hoveredEl = document.elementFromPoint(target.x, target.y);
          if (hoveredEl && hoveredEl.closest('[data-flowing-menu], .flowing-menu')) {
            isOverFlowingMenu = true;
          }
        }
        containerRef.current.style.opacity = isOverFlowingMenu ? '0' : '1';
        containerRef.current.style.transform = isOverFlowingMenu ? 'scale(0.8)' : 'scale(1)';
        containerRef.current.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      }

      for (let i = 0; i < trailCount; i++) {
        const prev = i === 0 ? target : updated[i - 1];
        const factor =
          i === 0
            ? Math.min(1, 0.3 / Math.max(0.01, fastDuration))
            : Math.min(1, 0.15 / Math.max(0.01, slowDuration));

        updated[i] = {
          x: updated[i].x + (prev.x - updated[i].x) * factor,
          y: updated[i].y + (prev.y - updated[i].y) * factor,
        };

        const node = blobNodesRef.current[i];
        if (node) {
          node.style.left = `${updated[i].x}px`;
          node.style.top = `${updated[i].y}px`;
        }
      }

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trailCount, fastDuration, slowDuration]);

  const filterId = 'blob-cursor-goo-filter';

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const activeSizes = isMobile ? sizes.map((s) => Math.round(s * 0.45)) : sizes;
  const activeInnerSizes = isMobile ? innerSizes.map((s) => Math.round(s * 0.45)) : innerSizes;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="hidden">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation={filterStdDeviation} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}

      <div
        className="w-full h-full relative"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, idx) => {
          const size = activeSizes[idx] || activeSizes[0] || 50;
          const innerSize = activeInnerSizes[idx] || activeInnerSizes[0] || 20;
          const opacity = opacities[idx] ?? opacities[0] ?? 0.6;

          return (
            <div
              key={idx}
              ref={(el) => (blobNodesRef.current[idx] = el)}
              className="absolute flex items-center justify-center transition-transform duration-75"
              style={{
                left: -1000,
                top: -1000,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                backgroundColor: fillColor,
                borderRadius: blobType === 'circle' ? '50%' : '12px',
                opacity,
                boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
              }}
            >
              {innerSize > 0 && (
                <div
                  style={{
                    width: innerSize,
                    height: innerSize,
                    backgroundColor: innerColor,
                    borderRadius: blobType === 'circle' ? '50%' : '6px',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
