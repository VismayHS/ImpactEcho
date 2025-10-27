'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Activity, Shield, TrendingUp, CheckCircle, Sparkles, Shield as ShieldLock } from 'lucide-react';

export default function EnhancedFeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Activity,
      title: 'AI-Powered Verification',
      description: 'Advanced machine learning algorithms verify every donation request in real-time, ensuring authenticity and preventing fraud.',
      highlights: ['Real-time analysis', '95% accuracy', 'Fraud detection'],
    },
    {
      icon: Shield,
      title: 'Blockchain Transparency',
      description: 'Every transaction is recorded on an immutable blockchain ledger, providing complete transparency and trust.',
      highlights: ['Immutable records', 'Public ledger', 'Smart contracts'],
    },
    {
      icon: TrendingUp,
      title: 'Zero Platform Fees',
      description: '100% of your donation reaches the beneficiary. No hidden charges, no middlemen. Pure impact.',
      highlights: ['0% fees', 'Direct transfer', 'Maximum impact'],
    },
  ];

  const benefits = [
    { icon: CheckCircle, text: 'Instant verification' },
    { icon: Sparkles, text: 'Lightning-fast transfers' },
    { icon: ShieldLock, text: 'Bank-grade security' },
  ];

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/30 to-transparent" />
      
      {/* Animated Grid Lines */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyber-cyan/20 via-cyber-blue/20 to-cyber-purple/20 border border-cyber-cyan/30 mb-6"
          >
            <span className="text-sm font-semibold text-cyber-cyan">CUTTING-EDGE TECHNOLOGY</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">The Future of</span>
            <br />
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Charitable Giving
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Powered by the latest in AI and blockchain technology to ensure every donation creates maximum impact
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative"
              >
                {/* Animated Glow Background */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyber-cyan/20 via-cyber-blue/10 to-transparent blur-2xl"
                />

                {/* Glass Card */}
                <div className="relative h-full p-8 rounded-3xl bg-navy-950/60 backdrop-blur-xl border border-white/10 group-hover:border-cyber-cyan/50 transition-all duration-500">
                  {/* Floating Icon */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="mb-6"
                  >
                    <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-cyber-cyan/20 to-transparent border border-cyber-cyan/30 group-hover:shadow-glow-md transition-all duration-500">
                      <Icon className="w-10 h-10 text-cyber-cyan" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyber-cyan transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-glow-sm" />
                        <span className="text-sm text-gray-300">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Hover Effect Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple origin-left rounded-b-3xl"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-transparent border border-cyber-cyan/30">
                  <Icon className="w-5 h-5 text-cyber-cyan" />
                </div>
                <span className="text-sm font-medium text-gray-300">{benefit.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
