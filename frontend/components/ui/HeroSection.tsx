'use client';

import { motion } from 'framer-motion';
import { Activity, Shield, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroSection() {
  const router = useRouter();
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Floating icons for background decoration
  const floatingIcons = [
    { Icon: Activity, delay: 0, position: 'top-20 left-20', color: 'text-electric-blue' },
    { Icon: Shield, delay: 0.2, position: 'top-40 right-32', color: 'text-electric-teal' },
    { Icon: TrendingUp, delay: 0.4, position: 'bottom-32 left-40', color: 'text-electric-violet' },
    { Icon: Sparkles, delay: 0.6, position: 'bottom-20 right-20', color: 'text-neon-teal' },
  ];

  const handleDonateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    setTimeout(() => router.push('/donate'), 300);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
      </div>
      
      {/* Animated Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-electric-violet/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-teal/15 rounded-full blur-3xl"
      />
      
      {/* Floating 3D Icons with Parallax */}
      {floatingIcons.map(({ Icon, delay, position, color }, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay, duration: 1, type: 'spring' }}
          className={`absolute ${position} hidden lg:block`}
        >
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, delay }}
            className={`${color} drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]`}
          >
            <Icon className="w-20 h-20" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="inline-flex items-center gap-3 px-6 py-3 mb-10 glass-card border-neon"
        >
          <Sparkles className="w-5 h-5 text-electric-blue animate-pulse" />
          <span className="text-sm md:text-base font-medium text-white">
            AI-Powered Blockchain Donation Verification
          </span>
          <div className="w-2 h-2 bg-electric-teal rounded-full animate-ping-slow" />
        </motion.div>

        {/* Main Headline - Ultra Premium */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
        >
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="block text-gradient-electric text-glow"
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Transform Charity
          </motion.span>
          <span className="block text-white mt-4">
            with Blockchain{' '}
            <span className="text-gradient-premium">Trust</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl text-gray-300 mb-14 max-w-4xl mx-auto leading-relaxed"
        >
          Verify donations with AI, record on blockchain, and ensure every rupee makes a real impact.
          <br />
          <span className="text-gradient-premium font-semibold text-shimmer">
            100% transparent. 100% verified. 100% free.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {/* Primary Button with Ripple Effect */}
          <button
            onClick={handleDonateClick}
            className="btn-electric group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Donating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute bg-white/30 rounded-full animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                }}
              />
            ))}
          </button>

          <motion.button
            onClick={() => router.push('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-glass"
          >
            View Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
