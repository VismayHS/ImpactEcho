'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Smooth spring physics for cursor
  const cursorX = useSpring(0, { stiffness: 150, damping: 20 });
  const cursorY = useSpring(0, { stiffness: 150, damping: 20 });
  
  // Parallax layers
  const parallaxX1 = useSpring(0, { stiffness: 100, damping: 25 });
  const parallaxY1 = useSpring(0, { stiffness: 100, damping: 25 });
  const parallaxX2 = useSpring(0, { stiffness: 80, damping: 30 });
  const parallaxY2 = useSpring(0, { stiffness: 80, damping: 30 });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;

    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: clientX, y: clientY });
        
        // Update spring positions
        cursorX.set(clientX);
        cursorY.set(clientY);
        
        // Parallax effect (slower layers)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = (clientX - centerX) / 20;
        const offsetY = (clientY - centerY) / 20;
        
        parallaxX1.set(offsetX);
        parallaxY1.set(offsetY);
        parallaxX2.set(offsetX * 1.5);
        parallaxY2.set(offsetY * 1.5);
        
        setIsVisible(true);
      });

      // Hide cursor glow after inactivity
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(false), 3000);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [isReducedMotion, cursorX, cursorY, parallaxX1, parallaxY1, parallaxX2, parallaxY2]);

  if (isReducedMotion) return null;

  return (
    <>
      {/* Layer 1: Large ambient glow (slowest) */}
      <motion.div
        className="fixed pointer-events-none z-40 mix-blend-screen will-change-transform"
        style={{
          width: '600px',
          height: '600px',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          x: parallaxX1,
          y: parallaxY1,
        }}
        animate={{
          opacity: isVisible ? 0.4 : 0,
          scale: isVisible ? 1 : 0.9,
        }}
        transition={{
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(
              circle,
              var(--theme-glow, rgba(0, 255, 255, 0.2)) 0%,
              rgba(var(--theme-secondary-rgb, 59, 130, 246), 0.1) 40%,
              transparent 70%
            )`,
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      {/* Layer 2: Medium glow (medium speed) */}
      <motion.div
        className="fixed pointer-events-none z-41 mix-blend-screen will-change-transform"
        style={{
          width: '400px',
          height: '400px',
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          x: parallaxX2,
          y: parallaxY2,
        }}
        animate={{
          opacity: isVisible ? 0.5 : 0,
          scale: isVisible ? 1 : 0.85,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3 },
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(
              circle,
              var(--theme-glow, rgba(0, 255, 255, 0.25)) 0%,
              rgba(var(--theme-accent-rgb, 147, 51, 234), 0.12) 50%,
              transparent 80%
            )`,
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Layer 3: Core glow (follows cursor directly) */}
      <motion.div
        className="fixed pointer-events-none z-42 will-change-transform"
        style={{
          width: '30px',
          height: '30px',
          x: cursorX,
          y: cursorY,
          translateX: '-15px',
          translateY: '-15px',
        }}
        animate={{
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{
          opacity: { duration: 0.2 },
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle, var(--theme-primary, #00FFFF), transparent 70%)`,
            boxShadow: `0 0 20px var(--theme-glow, rgba(0, 255, 255, 0.8))`,
          }}
        />
      </motion.div>

      {/* Layer 4: Trail particles */}
      <motion.div
        className="fixed pointer-events-none z-41 will-change-transform"
        style={{
          width: '8px',
          height: '8px',
          x: cursorX,
          y: cursorY,
          translateX: '-4px',
          translateY: '-4px',
        }}
        animate={{
          opacity: isVisible ? [0.7, 0.3, 0.7] : 0,
          scale: isVisible ? [1, 1.3, 1] : 0.5,
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity },
          scale: { duration: 2, repeat: Infinity },
        }}
      >
        <div
          className="w-full h-full rounded-full blur-sm"
          style={{
            background: `var(--theme-primary, #00FFFF)`,
            boxShadow: `0 0 15px var(--theme-glow, rgba(0, 255, 255, 0.6))`,
          }}
        />
      </motion.div>
    </>
  );
}
