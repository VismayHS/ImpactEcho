'use client';

import { motion, useInView } from 'framer-motion';
import { Sparkles, ArrowRight, Users, Heart, TrendingUp } from 'lucide-react';
import { useRef, useState } from 'react';

export default function HolographicCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isExpanded, setIsExpanded] = useState(false);

  const impactStories = [
    {
      title: 'Clean Water Initiative',
      amount: '₹50,000',
      impact: '200 families',
      verified: true,
    },
    {
      title: 'Education Support',
      amount: '₹75,000',
      impact: '150 students',
      verified: true,
    },
    {
      title: 'Medical Relief',
      amount: '₹100,000',
      impact: '500 beneficiaries',
      verified: true,
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Donors' },
    { icon: Heart, value: '₹5M+', label: 'Total Donated' },
    { icon: TrendingUp, value: '99%', label: 'Verification Rate' },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
      
      {/* Holographic Light Rays */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 opacity-20"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-full origin-top"
            style={{
              transform: `rotate(${i * 45}deg)`,
              background: `linear-gradient(to bottom, rgba(0, 255, 255, 0.3), transparent)`,
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Holographic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          className="max-w-6xl mx-auto"
        >
          {/* Outer Glow */}
          <motion.div
            animate={{
              opacity: isExpanded ? 0.6 : 0.3,
              scale: isExpanded ? 1.02 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-3xl blur-xl"
          />

          {/* Card Container */}
          <div className="relative bg-navy-950/80 backdrop-blur-xl border-2 border-white/20 rounded-3xl overflow-hidden">
            {/* Holographic Shine Effect */}
            <motion.div
              animate={{
                x: isExpanded ? ['0%', '200%'] : '0%',
              }}
              transition={{
                duration: 1.5,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
            />

            {/* Content Grid */}
            <div className="relative p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: CTA Content */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-cyan/20 to-cyber-blue/20 border border-cyber-cyan/30 mb-4">
                      <Sparkles className="w-4 h-4 text-cyber-cyan animate-pulse" />
                      <span className="text-sm font-semibold text-cyber-cyan">EXCLUSIVE ACCESS</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      <span className="text-white">Join Our</span>
                      <br />
                      <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                        Beta Community
                      </span>
                    </h2>

                    <p className="text-lg text-gray-300 leading-relaxed mb-8">
                      Be among the first to experience the future of transparent charitable giving. 
                      Get early access to exclusive features and help shape the platform.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-8 py-4 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl font-bold text-white overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Request Beta Access
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 rounded-xl font-bold text-white bg-navy-900/50 backdrop-blur-sm transition-all duration-300"
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Stats Pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap gap-4 pt-6"
                  >
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
                        >
                          <Icon className="w-5 h-5 text-cyber-cyan" />
                          <div>
                            <span className="font-bold text-white block">{stat.value}</span>
                            <span className="text-xs text-gray-400">{stat.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Right: Impact Stories */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-cyber-cyan" />
                    Recent Impact Stories
                  </h3>

                  {impactStories.map((story, index) => (
                    <motion.div
                      key={story.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="relative group"
                    >
                      {/* Card Glow on Hover */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 group-hover:border-cyber-cyan/50 rounded-2xl p-5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-semibold">{story.title}</h4>
                          {story.verified && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/30">
                              <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse" />
                              <span className="text-xs text-cyber-cyan font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-blue bg-clip-text text-transparent">
                            {story.amount}
                          </span>
                          <span className="text-sm text-gray-400">{story.impact}</span>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={isInView ? { scaleX: 1 } : {}}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue origin-left"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom Animated Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple origin-left"
            />
          </div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyber-cyan/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
