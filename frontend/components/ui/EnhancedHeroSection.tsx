'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Activity, Shield, TrendingUp, Sparkles, Wallet, LayoutDashboard } from 'lucide-react';
import Typewriter from '../Typewriter';
import AISoundwave from '../AISoundwave';
import MagneticButton from '../MagneticButton';
import GradientText from '../GradientText';

export default function EnhancedHeroSection() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };

  const scrollToDashboard = () => {
    const element = document.getElementById('stats-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWalletModal = () => {
    // This will be handled by WalletConnectButton
    const walletButton = document.querySelector('[data-wallet-connect]');
    if (walletButton instanceof HTMLElement) {
      walletButton.click();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 -left-40 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-cyber-cyan/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              AI-Powered Blockchain Charity Platform
            </span>
          </motion.div>

          {/* Main Headline with Gradient Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* AI Soundwave behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-20 pointer-events-none">
              <AISoundwave height="120px" barCount={50} />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight relative z-10">
              <GradientText className="block">
                Transparent Charity
              </GradientText>
              <span className="text-white">Powered by AI</span>
            </h1>
          </motion.div>

          {/* Subtitle with Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            <p className="mb-2">
              <Typewriter 
                texts={[
                  'Every donation verified by artificial intelligence.',
                  'Every transaction secured on blockchain.',
                  'Complete transparency. Zero platform fees.',
                  'Join the future of charitable giving.',
                ]}
                typingSpeed={60}
                deletingSpeed={40}
                pauseDuration={3000}
              />
            </p>
            <span className="text-cyber-cyan font-semibold">100% transparency. 0% platform fees.</span>
          </motion.div>

          {/* CTA Buttons with Glass Reflection Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <MagneticButton
              onClick={openWalletModal}
              strength={0.4}
              className="px-10 py-5 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:shadow-neon-strong"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              
              <span className="relative z-10 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Start Donating
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={scrollToDashboard}
              strength={0.3}
              className="px-10 py-5 bg-white/5 backdrop-blur-md border-2 border-cyber-cyan/30 rounded-2xl font-bold text-lg text-white hover:bg-white/10 hover:border-cyber-cyan hover:shadow-glow-lg transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 group-hover:text-cyber-cyan transition-colors" />
                View Dashboard
              </span>
            </MagneticButton>
          </motion.div>

          {/* Floating Feature Icons */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: Activity, label: 'AI Verification', delay: 0.8 },
              { icon: Shield, label: 'Blockchain Security', delay: 1 },
              { icon: TrendingUp, label: 'Real-time Impact', delay: 1.2 },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyber-cyan/50 transition-all duration-300 hover:shadow-glow-md"
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cyber-cyan/20 to-transparent border border-cyber-cyan/30 group-hover:shadow-glow-sm transition-all duration-300">
                    <Icon className="w-8 h-8 text-cyber-cyan group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {feature.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator (only show when there's content below) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-cyber-cyan/50 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ height: ['0%', '50%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-cyber-cyan rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
