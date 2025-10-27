'use client';

export function ShimmerCard() {
  return (
    <div className="animate-pulse">
      <div className="p-8 rounded-3xl bg-navy-950/60 backdrop-blur-xl border border-white/10">
        <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 rounded-2xl mb-6" />
        <div className="h-12 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-4 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-6 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-2 bg-[length:200%_100%] animate-shimmer w-3/4" />
        <div className="h-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer w-full" />
      </div>
    </div>
  );
}

export function ShimmerStat() {
  return (
    <div className="animate-pulse">
      <div className="p-8 rounded-3xl bg-navy-950/80 backdrop-blur-xl border border-white/10">
        <div className="w-12 h-12 bg-gradient-to-br from-cyber-purple/20 to-cyber-cyan/20 rounded-xl mb-4" />
        <div className="h-16 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-3 bg-[length:200%_100%] animate-shimmer w-32" />
        <div className="h-5 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-2 bg-[length:200%_100%] animate-shimmer w-40" />
        <div className="h-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer" />
      </div>
    </div>
  );
}

export function ShimmerTable() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-navy-950/60 backdrop-blur-xl border border-white/10"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan/20 to-cyber-blue/20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer w-3/4" />
            <div className="h-3 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer w-1/2" />
          </div>
          <div className="w-20 h-8 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function ShimmerDonationCard() {
  return (
    <div className="animate-pulse">
      <div className="p-6 rounded-2xl bg-navy-950/60 backdrop-blur-xl border border-white/10">
        <div className="aspect-video bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-xl mb-4" />
        <div className="h-6 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-3 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-2 bg-[length:200%_100%] animate-shimmer w-3/4" />
        <div className="h-4 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg mb-4 bg-[length:200%_100%] animate-shimmer" />
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer" />
          <div className="w-10 h-10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg bg-[length:200%_100%] animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
