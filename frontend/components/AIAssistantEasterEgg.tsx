'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function AIAssistantEasterEgg() {
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [connections, setConnections] = useState<Array<{ from: number; to: number; energy: number }>>([]);
  const [isLowPower, setIsLowPower] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Detect low-power mode or reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsLowPower(mediaQuery.matches || navigator.hardwareConcurrency < 4);

    // Generate neural network nodes
    const nodeCount = isLowPower ? 15 : 30;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: i,
    }));
    setNodes(newNodes);

    // Create connections between nearby nodes with energy levels
    const newConnections: Array<{ from: number; to: number; energy: number }> = [];
    newNodes.forEach((node, i) => {
      newNodes.forEach((otherNode, j) => {
        if (i < j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          if (distance < 20) {
            newConnections.push({ 
              from: i, 
              to: j,
              energy: Math.random()
            });
          }
        }
      });
    });
    setConnections(newConnections);

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLowPower, mouseX, mouseY]);

  // Pulse energy through connections
  useEffect(() => {
    if (isLowPower) return;

    const interval = setInterval(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        energy: (conn.energy + 0.05) % 1
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [isLowPower]);

  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20 overflow-hidden">
      {/* SVG for connections with GPU acceleration */}
      <svg className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }}>
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--theme-primary, #00FFFF)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--theme-secondary, #3B82F6)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--theme-accent, #9333EA)" stopOpacity="0.2" />
          </linearGradient>
          
          <filter id="neuralGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn, i) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={i}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="url(#neuralGradient)"
              strokeWidth="1.5"
              filter="url(#neuralGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [conn.energy, (conn.energy + 0.3) % 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: isLowPower ? 4 : 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'linear',
              }}
              style={{ willChange: 'opacity' }}
            />
          );
        })}
      </svg>

      {/* Neural nodes with parallax */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute inset-0"
      >
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              background: `radial-gradient(circle, var(--theme-primary, #00FFFF), transparent)`,
              boxShadow: `0 0 ${isLowPower ? '5' : '10'}px var(--theme-glow, rgba(0, 255, 255, 0.6))`,
              willChange: 'transform, opacity',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2 + (node.id % 3),
              repeat: Infinity,
              delay: node.id * 0.1,
            }}
          />
        ))}
      </motion.div>

      {/* Pulsing AI Core in center */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ x: parallaxX, y: parallaxY }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative">
          {/* Orbital rings with GPU optimization */}
          {[...Array(isLowPower ? 2 : 3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${(i + 1) * 60}px`,
                height: `${(i + 1) * 60}px`,
                left: `${-(i + 1) * 30}px`,
                top: `${-(i + 1) * 30}px`,
                border: `2px solid var(--theme-primary, #00FFFF)`,
                willChange: 'transform, opacity',
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}

          {/* Core with gradient */}
          <div 
            className="w-10 h-10 rounded-full"
            style={{
              background: `radial-gradient(circle, var(--theme-primary, #00FFFF), var(--theme-secondary, #3B82F6), var(--theme-accent, #9333EA))`,
              boxShadow: `0 0 30px var(--theme-glow, rgba(0, 255, 255, 0.8))`,
            }}
          />
        </div>
      </motion.div>

      {/* Energy particles with reduced count on low power */}
      {[...Array(isLowPower ? 10 : 25)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `var(--theme-primary, #00FFFF)`,
            boxShadow: `0 0 5px var(--theme-glow, rgba(0, 255, 255, 0.8))`,
            willChange: 'transform, opacity',
          }}
          animate={{
            x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
            y: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
