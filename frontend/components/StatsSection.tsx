'use client';

import { motion, useInView } from 'framer-motion';
import { DollarSign, CheckCircle, TrendingUp } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface Stat {
  value: string;
  label: string;
  icon: typeof DollarSign;
  suffix?: string;
  prefix?: string;
}

const stats: Stat[] = [
  {
    value: '0',
    label: 'Platform Fees',
    icon: DollarSign,
    prefix: '₹',
  },
  {
    value: '95',
    label: 'AI Verification Accuracy',
    icon: CheckCircle,
    suffix: '%',
  },
  {
    value: '100',
    label: 'Blockchain Transparency',
    icon: TrendingUp,
    suffix: '%',
  },
];

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-bold">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose{' '}
            <span className="text-gradient-electric">ImpactEcho</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powered by cutting-edge technology for maximum transparency
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-card p-8 md:p-10 text-center group cursor-pointer"
              >
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-blue/20 to-electric-violet/20 mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-10 h-10 text-electric-blue group-hover:text-electric-teal transition-colors" />
                </motion.div>

                {/* Animated Number */}
                <div className="text-gradient-premium mb-3">
                  <AnimatedCounter
                    target={parseInt(stat.value)}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>

                {/* Label */}
                <p className="text-gray-300 text-lg font-medium">{stat.label}</p>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-electric-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
