'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning circles */}
      <div className="relative">
        {/* Outer circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-4 border-transparent border-t-green-400 border-r-blue-500`}
        />
        
        {/* Inner circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-500 border-l-purple-500`}
        />
        
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
        />
      </div>

      {/* Text */}
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-sm font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
