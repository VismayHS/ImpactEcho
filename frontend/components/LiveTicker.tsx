'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, Shield } from 'lucide-react';

interface TickerItem {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  timestamp: Date;
}

export default function LiveTicker() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const activities: TickerItem[] = [
    { id: '1', icon: Heart, text: 'John D. donated $100 to Clean Water Fund', timestamp: new Date() },
    { id: '2', icon: TrendingUp, text: 'Impact verified: 500 meals distributed', timestamp: new Date() },
    { id: '3', icon: Users, text: '10 new supporters joined the community', timestamp: new Date() },
    { id: '4', icon: Shield, text: 'Blockchain verified: Education Fund transaction', timestamp: new Date() },
    { id: '5', icon: Heart, text: 'Sarah M. donated $250 to Medical Aid', timestamp: new Date() },
    { id: '6', icon: TrendingUp, text: 'AI verified impact: 1,000 people helped', timestamp: new Date() },
  ];

  // Duplicate for seamless loop
  const duplicatedActivities = [...activities, ...activities];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-transparent via-[var(--theme-primary)]/5 to-transparent border-y border-[var(--theme-primary)]/20 py-3">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#081A2A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#081A2A] to-transparent z-10 pointer-events-none" />

      {/* Scrolling ticker */}
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -50 + '%'],
              }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
        }
      >
        {duplicatedActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={`${activity.id}-${index}`} className="flex items-center gap-3 px-4">
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        rotate: [0, 360],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                }
                className="flex-shrink-0"
              >
                <Icon className="w-5 h-5 text-[var(--theme-primary)]" />
              </motion.div>
              <span className="text-sm text-gray-300">{activity.text}</span>
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }
                }
                transition={
                  prefersReducedMotion
                    ? {}
                    : {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                className="w-2 h-2 rounded-full bg-[var(--theme-primary)] flex-shrink-0"
                style={{ boxShadow: '0 0 8px var(--theme-glow)' }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
