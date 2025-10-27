'use client';

import EnhancedHeroSection from '@/components/ui/EnhancedHeroSection';
import EnhancedStatsSection from '@/components/EnhancedStatsSection';
import EnhancedFeaturesSection from '@/components/EnhancedFeaturesSection';
import PoweredBySection from '@/components/PoweredBySection';
import HolographicCTA from '@/components/HolographicCTA';
import TSParticlesBackground from '@/components/TSParticlesBackground';
import AIAssistantEasterEgg from '@/components/AIAssistantEasterEgg';
import Scene3D from '@/components/Scene3D';
import LiveTicker from '@/components/LiveTicker';
import LiveCounter from '@/components/LiveCounter';

export default function Home() {
  return (
    <>
      {/* 3D Holographic Scene Layer */}
      <Scene3D />
      
      {/* Interactive TSParticles Background */}
      <TSParticlesBackground />
      
      {/* AI Neural Network Easter Egg */}
      <AIAssistantEasterEgg />
      
      {/* Main Content */}
      <main className="relative z-10">
        <EnhancedHeroSection />
        
        {/* Live Activity Ticker */}
        <LiveTicker />
        
        {/* Live Counters Section */}
        <section className="relative py-16 bg-gradient-to-b from-transparent via-[var(--theme-primary)]/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <LiveCounter
                label="Total Donations"
                initialValue={1250000}
                increment={500}
                interval={5000}
                prefix="₹"
              />
              <LiveCounter
                label="People Helped"
                initialValue={45280}
                increment={3}
                interval={4000}
              />
              <LiveCounter
                label="Active Supporters"
                initialValue={12450}
                increment={1}
                interval={6000}
              />
            </div>
          </div>
        </section>
        
        <EnhancedStatsSection />
        <EnhancedFeaturesSection />
        <PoweredBySection />
        <HolographicCTA />
      </main>
    </>
  );
}
