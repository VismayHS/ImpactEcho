'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'impact-blue' | 'impact-gold';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  'impact-blue': {
    primary: '#00FFFF',
    secondary: '#3B82F6',
    accent: '#9333EA',
    glow: 'rgba(0, 255, 255, 0.6)',
  },
  'impact-gold': {
    primary: '#FFD700',
    secondary: '#FF8C00',
    accent: '#FFA500',
    glow: 'rgba(255, 215, 0, 0.6)',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('impact-blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('impact-theme') as ThemeMode;
    if (stored && (stored === 'impact-blue' || stored === 'impact-gold')) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('impact-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update CSS variables
      const colors = themeColors[theme];
      document.documentElement.style.setProperty('--theme-primary', colors.primary);
      document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
      document.documentElement.style.setProperty('--theme-accent', colors.accent);
      document.documentElement.style.setProperty('--theme-glow', colors.glow);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'impact-blue' ? 'impact-gold' : 'impact-blue');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
