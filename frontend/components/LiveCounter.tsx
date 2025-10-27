'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

interface LiveCounterProps {
  label: string;
  initialValue: number;
  increment?: number;
  interval?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function LiveCounter({
  label,
  initialValue,
  increment = 1,
  interval = 3000,
  prefix = '',
  suffix = '',
  className = '',
}: LiveCounterProps) {
  const [count, setCount] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setCount((prev) => prev + increment);
        setIsUpdating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [increment, interval]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="text-center"
        animate={isUpdating && !prefersReducedMotion ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <div className="relative inline-block">
          <CountUp
            start={count - increment}
            end={count}
            duration={2}
            separator=","
            prefix={prefix}
            suffix={suffix}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--theme-primary)] via-[var(--theme-secondary)] to-[var(--theme-accent)] bg-clip-text text-transparent"
          />
          
          {/* Pulse effect on update */}
          <AnimatePresence>
            {isUpdating && !prefersReducedMotion && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 rounded-full bg-[var(--theme-primary)] blur-xl"
                style={{ zIndex: -1 }}
              />
            )}
          </AnimatePresence>
        </div>
        
        <p className="mt-2 text-sm md:text-base text-gray-400 font-medium">{label}</p>
        
        {/* Live indicator dot */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-[var(--theme-primary)]"
            style={{ boxShadow: '0 0 8px var(--theme-glow)' }}
          />
          <span className="text-xs text-[var(--theme-primary)] font-medium">LIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
