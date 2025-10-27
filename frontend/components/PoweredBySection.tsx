'use client';

import { motion, useInView } from 'framer-motion';
import { Activity, Shield, TrendingUp, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { useRef } from 'react';

export default function PoweredBySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const technologies = [
    {
      icon: Activity,
      title: 'Artificial Intelligence',
      description: 'Advanced ML models verify evidence authenticity',
      color: 'from-cyber-cyan to-cyber-blue',
      delay: 0.1,
    },
    {
      icon: Shield,
      title: 'Blockchain',
      description: 'Immutable ledger ensures complete transparency',
      color: 'from-cyber-blue to-cyber-purple',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      title: 'Real-time Processing',
      description: 'Instant verification and transaction confirmation',
      color: 'from-cyber-purple to-cyber-cyan',
      delay: 0.3,
    },
  ];

  const features = [
    { icon: CheckCircle, text: 'IPFS Storage', color: 'text-cyber-cyan' },
    { icon: Sparkles, text: 'Smart Contracts', color: 'text-cyber-blue' },
    { icon: Heart, text: 'Decentralized', color: 'text-cyber-purple' },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Neural Network Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyber-cyan/20 via-cyber-blue/20 to-cyber-purple/20 border border-cyber-cyan/30 mb-6"
          >
            <span className="text-sm font-semibold text-cyber-cyan">POWERED BY</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              AI & Blockchain
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Harnessing cutting-edge technology to revolutionize charitable giving
          </p>
        </motion.div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: tech.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Animated Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${tech.color} rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />

                {/* Card Content */}
                <div className="relative h-full bg-navy-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-cyber-cyan/50 transition-all duration-500">
                  {/* Floating Icon */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="mb-6"
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tech.color} p-0.5`}>
                      <div className="w-full h-full bg-navy-950 rounded-2xl flex items-center justify-center">
                        <Icon className="w-10 h-10 text-cyber-cyan" />
                      </div>
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyber-cyan transition-colors">
                    {tech.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {tech.description}
                  </p>

                  {/* Animated Bottom Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1, delay: tech.delay + 0.3 }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tech.color} origin-left rounded-b-3xl`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-navy-900/50 backdrop-blur-sm border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-300"
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-white font-medium">{feature.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />
    </section>
  );
}
