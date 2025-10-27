'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hoverEffect?: boolean;
}

export default function GradientText({
  children,
  className = '',
  animate = true,
  hoverEffect = true,
}: GradientTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = animate && !prefersReducedMotion;

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: shouldAnimate
          ? 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary), var(--theme-accent), var(--theme-primary))'
          : 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
        backgroundSize: shouldAnimate ? '200% 100%' : '100% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={
        shouldAnimate
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : {}
      }
      transition={
        shouldAnimate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }
          : {}
      }
    >
      {children}
      
      {/* Enhanced glow on hover */}
      {hoverEffect && isHovered && !prefersReducedMotion && (
        <motion.span
          className="absolute inset-0 blur-lg opacity-50 -z-10"
          style={{
            background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary), var(--theme-accent))',
            backgroundSize: '200% 100%',
            filter: 'blur(20px)',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 0.5,
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            opacity: { duration: 0.3 },
            backgroundPosition: {
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      )}
    </motion.span>
  );
}
