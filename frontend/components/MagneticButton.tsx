'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number; // Magnetic pull strength (0-1)
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.3,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Motion values for smooth magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth magnetic attraction
  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Scale effect on hover
  const scale = useTransform(
    () => (isHovered && !prefersReducedMotion ? 1.05 : 1)
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!buttonRef.current || prefersReducedMotion || disabled) return;

    const button = buttonRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Apply magnetic pull with strength multiplier
      const magneticX = distanceX * strength;
      const magneticY = distanceY * strength;

      x.set(magneticX);
      y.set(magneticY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, x, y, strength, prefersReducedMotion, disabled]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className}`}
      style={{
        x: springX,
        y: springY,
        scale,
      }}
      whileTap={!prefersReducedMotion && !disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
      
      {/* Magnetic glow effect on hover */}
      {isHovered && !prefersReducedMotion && !disabled && (
        <motion.div
          className="absolute inset-0 -z-10 rounded-full blur-xl opacity-50"
          style={{
            background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.button>
  );
}
