'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Simplified or no animation for reduced motion preference
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Blur transition overlay */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(0px)' }}
          exit={{ backdropFilter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Holographic wipe effect */}
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--theme-primary) 50%, transparent 100%)',
            opacity: 0.2,
          }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
