'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/contract';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Award } from 'lucide-react';

export default function DashboardPage() {
  const { address } = useWallet();
  const [donations, setDonations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/donations`, {
        params: { donor: address, limit: 20 }
      });
      setDonations(response.data);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    }
  }, [address]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const [overallRes, donorRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/analytics`),
        address ? axios.get(`${API_BASE_URL}/api/analytics/donor/${address}`) : null,
      ]);
      
      setAnalytics({
        overall: overallRes.data,
        donor: donorRes?.data,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchDonations();
      fetchAnalytics();
    }
  }, [address, fetchDonations, fetchAnalytics]);

  const statusColors: { [key: string]: string } = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    verifying: 'bg-blue-100 text-blue-800',
    manual_review: 'bg-orange-100 text-orange-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusIcons: { [key: string]: any } = {
    verified: CheckCircle,
    pending: Clock,
    verifying: Clock,
    manual_review: AlertCircle,
    rejected: AlertCircle,
  };

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
        <p className="text-gray-600">Please connect your wallet to view your donations and impact.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Impact Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Donations', value: analytics?.donor?.totalDonations || 0, icon: TrendingUp },
          { label: 'Verified', value: analytics?.donor?.totalVerified || 0, icon: CheckCircle },
          { label: 'Total Amount', value: `${analytics?.donor?.totalAmount || '0'} MATIC`, icon: Award },
          { label: 'Badges Earned', value: analytics?.donor?.badgesMinted || 0, icon: Award },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">{stat.label}</span>
                <Icon className="w-5 h-5 text-primary-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      {analytics?.overall && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Campaign Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Campaign Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.overall.campaigns.slice(0, 5)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.overall.campaigns.slice(0, 5).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Verification Stats */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Verification Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(analytics.overall.statusBreakdown || {}).map(([status, count]) => ({ status, count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold">Your Donations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No donations yet. <a href="/donate" className="text-primary-600 hover:underline">Make your first donation!</a>
                  </td>
                </tr>
              ) : (
                donations.map((donation) => {
                  const StatusIcon = statusIcons[donation.status] || Clock;
                  return (
                    <tr key={donation.donationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">#{donation.donationId}</td>
                      <td className="px-6 py-4">{donation.campaign}</td>
                      <td className="px-6 py-4 font-semibold">{donation.amount} MATIC</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[donation.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {donation.verificationScore ? (
                          <span className="font-semibold">{donation.verificationScore}/100</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
