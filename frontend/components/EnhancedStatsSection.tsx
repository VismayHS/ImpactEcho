'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';
import { Activity, Shield, TrendingUp, CheckCircle } from 'lucide-react';

export default function EnhancedStatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      id: 1,
      icon: Activity,
      label: 'AI Accuracy',
      value: 95,
      suffix: '%',
      description: 'Verified donations with AI precision',
      gradientFrom: 'from-cyber-cyan',
      gradientTo: 'to-cyber-blue',
    },
    {
      id: 2,
      icon: Shield,
      label: 'Transparency',
      value: 100,
      suffix: '%',
      description: 'All transactions on blockchain',
      gradientFrom: 'from-cyber-blue',
      gradientTo: 'to-cyber-purple',
    },
    {
      id: 3,
      icon: TrendingUp,
      label: 'Platform Fees',
      value: 0,
      prefix: '₹',
      description: 'Every rupee reaches those in need',
      gradientFrom: 'from-cyber-purple',
      gradientTo: 'to-cyber-cyan',
    },
    {
      id: 4,
      icon: CheckCircle,
      label: 'Total Donations',
      value: 1250000,
      prefix: '₹',
      description: 'Raised and verified through platform',
      gradientFrom: 'from-cyber-cyan',
      gradientTo: 'to-cyber-purple',
      decimals: 0,
    },
  ];

  return (
    <section id="stats-section" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-transparent to-navy-950/50" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyber-cyan/20 via-cyber-blue/20 to-cyber-purple/20 border border-cyber-cyan/30 mb-6"
          >
            <span className="text-sm font-semibold text-cyber-cyan">REAL-TIME IMPACT</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Trust Through
            </span>
            <br />
            <span className="text-white">Transparency</span>
          </h2>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Every metric is live, every number is verified, every donation makes a real impact
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                {/* Glowing Border */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradientFrom} ${stat.gradientTo} opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-xl`} />
                
                {/* Card */}
                <div className="relative h-full p-8 rounded-3xl bg-navy-950/80 backdrop-blur-xl border border-white/10 group-hover:border-cyber-cyan/50 transition-all duration-500">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} bg-opacity-20 mb-6`}
                  >
                    <Icon className="w-8 h-8 text-cyber-cyan" />
                  </motion.div>

                  {/* Stat Value with CountUp */}
                  <div className="mb-3">
                    <div className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.gradientFrom} ${stat.gradientTo} bg-clip-text text-transparent`}>
                      {isInView && (
                        <>
                          {stat.prefix}
                          <CountUp
                            end={stat.value}
                            duration={2.5}
                            separator=","
                            decimals={stat.decimals}
                            decimal="."
                          />
                          {stat.suffix}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Animated Progress Bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple origin-left rounded-b-3xl"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Join thousands of donors making a verified impact
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple font-bold text-white shadow-neon hover:shadow-neon-strong transition-all duration-300"
          >
            Start Making Impact
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
