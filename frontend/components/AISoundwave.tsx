'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AISoundwaveProps {
  className?: string;
  barCount?: number;
  height?: string;
}

export default function AISoundwave({
  className = '',
  barCount = 40,
  height = '80px',
}: AISoundwaveProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate bars with varying heights and delays
  const bars = Array.from({ length: barCount }, (_, i) => {
    const delay = (i * 0.05) % 1;
    const duration = 0.8 + Math.random() * 0.4;
    const heightPercent = 20 + Math.random() * 80;

    return {
      delay,
      duration,
      heightPercent,
    };
  });

  if (prefersReducedMotion) {
    // Show static soundwave for reduced motion
    return (
      <div className={`flex items-end justify-center gap-[2px] ${className}`} style={{ height }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-[var(--theme-primary)] to-[var(--theme-secondary)] opacity-30"
            style={{ height: `${bar.heightPercent}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-end justify-center gap-[2px] ${className}`} style={{ height }}>
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-gradient-to-t from-[var(--theme-primary)] via-[var(--theme-secondary)] to-[var(--theme-accent)]"
          style={{
            boxShadow: '0 0 8px var(--theme-glow)',
          }}
          animate={{
            height: [`${bar.heightPercent * 0.3}%`, `${bar.heightPercent}%`, `${bar.heightPercent * 0.3}%`],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
