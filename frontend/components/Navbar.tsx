'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LayoutDashboard, Upload, X, Sparkles } from 'lucide-react';
import WalletConnectButton from './WalletConnectButton';
import ThemeToggle from './ThemeToggle';

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Heart },
    { href: '/donate', label: 'Donate', icon: Upload },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-navy-950/60 backdrop-blur-2xl border-b border-cyber-cyan/20 shadow-glass' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient glow-text">
                ImpactEcho
              </span>
              <span className="text-xs text-cyber-cyan/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Powered by AI & Blockchain
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-cyber-cyan shadow-neon'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-xl border border-cyber-cyan/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Wallet & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <div className="hidden md:block">
              <WalletConnectButton />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <MenuIcon />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-navy-950/95 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 text-cyber-cyan border border-cyber-cyan/30'
                            : 'text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-4">
                <WalletConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Effect on Scroll */}
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
        />
      )}
    </motion.nav>
  );
}
