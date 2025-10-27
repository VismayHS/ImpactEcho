'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle, DollarSign, Users, Award, Activity } from 'lucide-react';
import StatCard from '../ui/StatCard';
import GlassCard from '../ui/GlassCard';

interface DashboardData {
  overview: {
    totalDonations: number;
    verifiedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalAmount: string;
    avgScore: string;
    verificationRate: string;
  };
  campaigns: Array<{ _id: string; count: number; total: number }>;
  trends: Array<{ _id: string; count: number; amount: number }>;
}

interface AnalyticsDashboardProps {
  data: DashboardData;
  loading?: boolean;
}

export default function AnalyticsDashboard({ data, loading = false }: AnalyticsDashboardProps) {
  const COLORS = ['#00ff88', '#00d4ff', '#9d00ff', '#ff006e', '#ffd000'];

  // Transform data for charts
  const campaignData = data.campaigns.map((c) => ({
    name: c._id,
    donations: c.count,
    amount: c.total,
  }));

  const trendData = data.trends.map((t) => ({
    month: t._id,
    donations: t.count,
    amount: t.amount,
  }));

  const statusData = [
    { name: 'Verified', value: data.overview.verifiedCount, color: '#00ff88' },
    { name: 'Pending', value: data.overview.pendingCount, color: '#ffd000' },
    { name: 'Rejected', value: data.overview.rejectedCount, color: '#ff006e' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Analytics <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-gray-300 text-lg">Real-time insights into donation verification</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Amount"
          value={`₹${parseFloat(data.overview.totalAmount).toLocaleString()}`}
          subtitle="All donations combined"
          gradient="from-green-400 to-emerald-500"
          delay={0}
        />
        
        <StatCard
          icon={CheckCircle}
          title="Verified"
          value={data.overview.verifiedCount}
          subtitle={`${data.overview.verificationRate}% success rate`}
          gradient="from-blue-400 to-cyan-500"
          delay={0.1}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          icon={Clock}
          title="Pending Review"
          value={data.overview.pendingCount}
          subtitle="Awaiting verification"
          gradient="from-yellow-400 to-orange-500"
          delay={0.2}
        />
        
        <StatCard
          icon={Award}
          title="Avg Score"
          value={`${data.overview.avgScore}%`}
          subtitle="AI confidence average"
          gradient="from-purple-400 to-pink-500"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-6" gradient>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Monthly Donation Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#00ff88" 
                  strokeWidth={3}
                  fill="url(#colorDonations)"
                  dot={{ fill: '#00ff88', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6" gradient>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Verification Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard className="p-6" gradient>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Campaign Performance
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={campaignData}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9d00ff" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="donations" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="amount" fill="#00ff88" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GlassCard className="p-8 text-center" gradient glow>
          <h3 className="text-3xl font-bold text-white mb-4">
            🎉 Total Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {data.overview.totalDonations}
              </div>
              <p className="text-gray-300">Donations Processed</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                ₹{parseFloat(data.overview.totalAmount).toLocaleString()}
              </div>
              <p className="text-gray-300">Funds Verified</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {data.overview.verificationRate}%
              </div>
              <p className="text-gray-300">Trust Score</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
