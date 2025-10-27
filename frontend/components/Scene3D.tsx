'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

interface HolographicSphereProps {
  mouseX: number;
  mouseY: number;
}

function HolographicSphere({ mouseX, mouseY }: HolographicSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  
  // Theme-aware colors
  const primaryColor = theme === 'impact-blue' ? '#3B82F6' : '#FFD700';
  const secondaryColor = theme === 'impact-blue' ? '#9333EA' : '#FF8C00';

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth rotation based on time
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    
    // Cursor-reactive tilt
    const targetRotationX = (mouseY - 0.5) * 0.5;
    const targetRotationY = (mouseX - 0.5) * 0.5;
    
    meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={secondaryColor}
          emissiveIntensity={0.5}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      {/* Outer glow ring */}
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color={secondaryColor}
          emissive={secondaryColor}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
}

function FloatingNodes() {
  const { theme } = useTheme();
  const nodeColor = theme === 'impact-blue' ? '#00FFFF' : '#FFD700';
  
  // Generate random positions for floating nodes
  const nodes = useRef(
    Array.from({ length: 15 }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: Math.random() * 0.1 + 0.05,
    }))
  );

  return (
    <>
      {nodes.current.map((node, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.5 + Math.random() * 0.5}
        >
          <Sphere args={[node.scale, 16, 16]} position={node.position}>
            <meshStandardMaterial
              color={nodeColor}
              emissive={nodeColor}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.z = 5;
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#9333EA" intensity={0.5} />
      
      <HolographicSphere mouseX={mouseX} mouseY={mouseY} />
      <FloatingNodes />
      
      {/* Uncomment for manual camera controls during development */}
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </>
  );
}

export default function Scene3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Don't render on server or if reduced motion is preferred
  if (!isMounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Scene mouseX={mousePosition.x} mouseY={mousePosition.y} />
        </Suspense>
      </Canvas>
    </div>
  );
}
