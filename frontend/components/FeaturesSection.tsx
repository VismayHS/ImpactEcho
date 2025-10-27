'use client';

import { motion, useInView } from 'framer-motion';
import { CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: CheckCircle,
    title: 'AI Verification',
    description: 'Advanced machine learning algorithms analyze donation evidence, detecting fraud and ensuring authenticity with 95% accuracy.',
    gradient: 'from-electric-blue to-electric-teal',
  },
  {
    icon: Activity,
    title: 'Blockchain Ledger',
    description: 'Every donation is permanently recorded on the blockchain, creating an immutable and transparent history that anyone can verify.',
    gradient: 'from-electric-teal to-electric-violet',
  },
  {
    icon: TrendingUp,
    title: 'Full Transparency',
    description: 'Track your donations in real-time with complete visibility into fund allocation, impact metrics, and verification status.',
    gradient: 'from-electric-violet to-neon-pink',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Background Gradient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-violet/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Next-Gen{' '}
            <span className="text-gradient-electric">Technology Stack</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Combining AI, blockchain, and transparency tools to revolutionize charitable giving
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.2,
                  duration: 0.8,
                  type: 'spring',
                  stiffness: 100,
                }}
                className="relative group"
              >
                {/* Glass Card */}
                <div className="glass-panel p-8 h-full relative overflow-hidden">
                  {/* Animated Border */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-glow rounded-3xl transition-all duration-500" />

                  {/* Icon Container */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 relative`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    
                    {/* Icon Glow */}
                    <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient-premium transition-all">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

                  {/* Bottom Accent Line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
