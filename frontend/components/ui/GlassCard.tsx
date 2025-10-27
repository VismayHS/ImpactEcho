'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  gradient = false
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`
        relative overflow-hidden rounded-2xl
        ${gradient 
          ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent' 
          : 'bg-white/10'
        }
        backdrop-blur-lg backdrop-saturate-150
        border border-white/20
        shadow-xl shadow-black/10
        ${glow ? 'animate-glow' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-500/10 to-indigo-600/10 pointer-events-none" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
