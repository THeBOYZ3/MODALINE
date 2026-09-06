import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface LightRaysProps {
  className?: string;
  count?: number;
  color?: string;
}

export function LightRays({ className = '', count = 12, color = 'rgba(160, 210, 255, 0.3)' }: LightRaysProps) {
  const [rays, setRays] = useState<{ id: number; rotation: number; scale: number; opacity: number }[]>([]);

  useEffect(() => {
    const newRays = Array.from({ length: count }).map((_, i) => ({
      id: i,
      rotation: Math.random() * 360,
      scale: 1 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setRays(newRays);
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-slate-950 mix-blend-multiply" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh]">
        {rays.map((ray) => (
          <motion.div
            key={ray.id}
            className="absolute left-1/2 top-1/2 h-[1px] w-[50%]"
            style={{
              backgroundColor: color,
              transformOrigin: 'left center',
              rotate: ray.rotation,
              scale: ray.scale,
              opacity: ray.opacity,
            }}
            animate={{
              rotate: [ray.rotation, ray.rotation + 360],
              opacity: [ray.opacity, ray.opacity * 0.5, ray.opacity],
            }}
            transition={{
              rotate: {
                duration: 50 + Math.random() * 50,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
    </div>
  );
}
