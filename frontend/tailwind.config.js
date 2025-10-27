/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy Background (#081A2A)
        navy: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9ddfe',
          300: '#7cc2fd',
          400: '#36a4fa',
          500: '#0c87eb',
          600: '#0069c9',
          700: '#0153a3',
          800: '#064786',
          900: '#0b3d70',
          950: '#081A2A', // Deep Navy - Primary Background
        },
        // Cyan → Blue → Purple gradient system
        'cyber-cyan': {
          DEFAULT: '#00FFFF', // Gradient start
          50: '#e6ffff',
          100: '#ccffff',
          200: '#99ffff',
          300: '#66ffff',
          400: '#33ffff',
          500: '#00FFFF',
          600: '#00cccc',
          700: '#009999',
          800: '#006666',
          900: '#003333',
        },
        'cyber-blue': {
          DEFAULT: '#3B82F6', // Gradient middle
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'cyber-purple': {
          DEFAULT: '#9333EA', // Gradient end
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333EA',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Legacy support (keeping for backward compatibility)
        electric: {
          blue: '#3B82F6',
          teal: '#00FFFF',
          cyan: '#00FFFF',
          violet: '#9333EA',
          purple: '#9333EA',
        },
        neon: {
          cyan: '#00FFFF',
          blue: '#3B82F6',
          purple: '#9333EA',
          violet: '#9333EA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        // Premium animations for hackathon-level design
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient': 'gradient 20s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-shimmer': 'text-shimmer 4s ease-in-out infinite',
        'wave': 'wave 10s ease-in-out infinite',
        'particle': 'particle 20s linear infinite',
        'ripple': 'ripple 0.6s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-25px) translateX(10px)' },
          '50%': { transform: 'translateY(-15px) translateX(-10px)' },
          '75%': { transform: 'translateY(-35px) translateX(5px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.4), 0 0 60px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.1)',
            filter: 'brightness(1)',
          },
          '50%': {
            boxShadow: '0 0 50px rgba(0, 212, 255, 0.7), 0 0 100px rgba(0, 212, 255, 0.4), inset 0 0 40px rgba(0, 212, 255, 0.2)',
            filter: 'brightness(1.3)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        'text-shimmer': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0%) translateY(0%) rotate(0deg)' },
          '25%': { transform: 'translateX(5%) translateY(-5%) rotate(1deg)' },
          '50%': { transform: 'translateX(0%) translateY(-10%) rotate(0deg)' },
          '75%': { transform: 'translateX(-5%) translateY(-5%) rotate(-1deg)' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0) scale(1)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(50px) scale(0.5)', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'border-glow': {
          '0%, 100%': { borderColor: 'rgba(0, 212, 255, 0.3)' },
          '50%': { borderColor: 'rgba(0, 212, 255, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        'neon-gradient': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
        'electric-gradient': 'linear-gradient(135deg, #00ffcc 0%, #00d4ff 50%, #a855f7 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.6)',
        'glass-lg': '0 20px 60px 0 rgba(31, 38, 135, 0.5)',
        'neon': '0 0 30px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3)',
        'neon-strong': '0 0 50px rgba(0, 212, 255, 0.8), 0 0 100px rgba(0, 212, 255, 0.4)',
        'electric': '0 0 40px rgba(0, 255, 204, 0.6), 0 0 80px rgba(0, 255, 204, 0.3)',
        'violet': '0 0 40px rgba(124, 58, 237, 0.6), 0 0 80px rgba(124, 58, 237, 0.3)',
        'glow-sm': '0 0 15px rgba(0, 212, 255, 0.3)',
        'glow-md': '0 0 30px rgba(0, 212, 255, 0.4)',
        'glow-lg': '0 0 50px rgba(0, 212, 255, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(0, 212, 255, 0.2)',
      },
    },
  },
  plugins: [],
};
