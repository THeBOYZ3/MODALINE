import React, { useEffect, useRef } from 'react';

export interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  xGap?: number;
  yGap?: number;
  className?: string;
}

export const Waves: React.FC<WavesProps> = ({
  lineColor = '#007aff',
  backgroundColor = 'transparent',
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    lx: number;
    ly: number;
    sx: number;
    sy: number;
    v: number;
    a: number;
    set: boolean;
  }>({
    x: -1000,
    y: -1000,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    a: 0,
    set: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth || 300);
    let height = (canvas.height = container.clientHeight || 300);
    let step = 0;

    interface Point {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
    }

    let lines: Point[][] = [];

    const initLines = () => {
      width = canvas.width = container.clientWidth || 300;
      height = canvas.height = container.clientHeight || 300;
      lines = [];

      const totalLines = Math.ceil(height / yGap) + 2;
      const pointsPerLine = Math.ceil(width / xGap) + 4;

      for (let i = 0; i < totalLines; i++) {
        const line: Point[] = [];
        const baseY = (i - 1) * yGap;

        for (let j = 0; j < pointsPerLine; j++) {
          const baseX = (j - 2) * xGap;
          line.push({
            x: baseX,
            y: baseY,
            ox: baseX,
            oy: baseY,
            vx: 0,
            vy: 0,
          });
        }
        lines.push(line);
      }
    };

    initLines();

    const handleResize = () => {
      initLines();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.set = true;
    };

    const handleMouseLeave = () => {
      const mouse = mouseRef.current;
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.set = false;
    };

    const parent = container.parentElement || container;
    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.28;

      const mouse = mouseRef.current;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        ctx.beginPath();

        for (let j = 0; j < line.length; j++) {
          const point = line[j];

          // Natural sine wave motion
          const waveX = Math.sin(step * waveSpeedX + i * 0.3 + j * 0.1) * waveAmpX * 0.15;
          const waveY = Math.cos(step * waveSpeedY + i * 0.2 + j * 0.15) * waveAmpY * 0.25;

          const targetX = point.ox + waveX;
          const targetY = point.oy + waveY;

          // Mouse interaction physics
          if (mouse.set) {
            const dx = mouse.x - point.x;
            const dy = mouse.y - point.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxCursorMove) {
              const force = (1 - dist / maxCursorMove) * 8;
              const angle = Math.atan2(dy, dx);
              point.vx -= Math.cos(angle) * force * 0.5;
              point.vy -= Math.sin(angle) * force * 0.5;
            }
          }

          // Spring physics
          point.vx += (targetX - point.x) * tension;
          point.vy += (targetY - point.y) * tension;
          point.vx *= friction;
          point.vy *= friction;

          point.x += point.vx;
          point.y += point.vy;

          if (j === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            const prev = line[j - 1];
            const cx = (prev.x + point.x) / 2;
            const cy = (prev.y + point.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
          }
        }

        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [
    lineColor,
    backgroundColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    friction,
    tension,
    maxCursorMove,
    xGap,
    yGap,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ position: 'absolute' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default Waves;
