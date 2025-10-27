'use client';

import { motion } from 'framer-motion';
import { Heart, LayoutDashboard, Upload, Activity, Shield, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { icon: Activity, href: '#', label: 'AI Platform', color: 'hover:text-cyber-cyan' },
  { icon: Shield, href: '#', label: 'Blockchain', color: 'hover:text-cyber-blue' },
  { icon: TrendingUp, href: '#', label: 'Analytics', color: 'hover:text-cyber-purple' },
  { icon: Sparkles, href: '#', label: 'Features', color: 'hover:text-cyber-cyan' },
];

export default function Footer() {
  return (
    <footer className="relative py-20 px-4 overflow-hidden border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/50 to-transparent" />
      
      {/* Animated Grid Pattern */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
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

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyber-purple/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="relative">
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-xl blur-lg opacity-50 animate-pulse" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-neon">
                  <Heart className="w-7 h-7 text-white" fill="white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                ImpactEcho
              </span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg mb-6 leading-relaxed max-w-md"
            >
              Transforming charitable giving through AI-powered verification and blockchain transparency. 
              Every donation verified. Every impact measured.
            </motion.p>

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3">
              {['100% Transparent', 'AI Verified', '0% Fees'].map((badge, i) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-cyber-cyan/30 text-sm text-gray-300"
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-cyber-cyan to-cyber-blue rounded" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Donate', href: '/donate' },
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'How it Works', href: '#features' },
              ].map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-cyber-cyan transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-cyber-cyan group-hover:w-4 transition-all duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-cyber-blue to-cyber-purple rounded" />
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map(({ icon: Icon, href, label, color }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative w-12 h-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyber-cyan/50 flex items-center justify-center text-gray-400 ${color} transition-all duration-300`}
                  aria-label={label}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-blue opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  
                  <Icon className="w-5 h-5 relative z-10" />
                  
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-navy-950 border border-cyber-cyan/30 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-cyber-cyan/50 focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-lg text-sm font-semibold hover:shadow-neon transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span>© {new Date().getFullYear()} ImpactEcho.</span>
              <span className="hidden md:inline">Built for transparency and social impact.</span>
            </p>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                Made with 
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-cyber-cyan" fill="currentColor" />
                </motion.div>
                for a better world
              </div>
              
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30">
                <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
                <span className="text-xs text-cyber-cyan font-semibold">LIVE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Glowing Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent origin-center"
      />
    </footer>
  );
}
