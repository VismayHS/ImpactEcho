'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isGold = theme === 'impact-gold';

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Impact Mode Theme"
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
        style={{
          background: isGold 
            ? 'linear-gradient(to right, rgb(250 204 21), rgb(249 115 22))' 
            : 'linear-gradient(to right, rgb(34 211 238), rgb(59 130 246))'
        }}
      />

      {/* Icon container */}
      <div className="relative flex items-center gap-2">
        <motion.div
          animate={{ rotate: isGold ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Sparkles 
            className="w-5 h-5 transition-colors duration-300"
            style={{ color: isGold ? 'rgb(250 204 21)' : 'rgb(34 211 238)' }}
          />
        </motion.div>

        {/* Theme indicator */}
        <div className="flex items-center gap-1">
          <div
            className="w-8 h-4 rounded-full relative transition-colors duration-300"
            style={{ backgroundColor: isGold ? 'rgba(234 179 8 / 0.3)' : 'rgba(6 182 212 / 0.3)' }}
          >
            <motion.div
              className="absolute top-0.5 w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: isGold ? 'rgb(250 204 21)' : 'rgb(34 211 238)' }}
              animate={{ x: isGold ? 16 : 2 }}
              transition={{ type: 'spring', stiffness: 700, damping: 35, mass: 0.5 }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
