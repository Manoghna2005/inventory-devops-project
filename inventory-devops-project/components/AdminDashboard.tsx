
import React from 'react';
import { Shop, Complaint } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Brain, Users, RefreshCcw, DollarSign, AlertCircle, Clock, CheckCircle, ShieldX, Fingerprint, Activity } from 'lucide-react';

interface AdminDashboardProps {
  shops: Shop[];
  complaints: Complaint[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ shops, complaints }) => {
  const chartData = shops.map(shop => ({
    name: shop.name,
    reliability: Math.round(shop.reliabilityScore * 100),
    incentives: shop.incentivesEarned,
    complaints: shop.complaintsCount
  }));

  const totalIncentives = shops.reduce((acc, shop) => acc + shop.incentivesEarned, 0);
  const avgReliability = (shops.reduce((acc, shop) => acc + shop.reliabilityScore, 0) / shops.length) * 100;
  const totalFraudFlags = shops.reduce((acc, shop) => acc + shop.complaintsCount, 0);

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shops', value: shops.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Reliability', value: `${avgReliability.toFixed(1)}%`, icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Fraud Flags', value: totalFraudFlags, icon: ShieldX, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Payouts', value: `$${totalIncentives}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative group overflow-hidden transition-all hover:border-indigo-200">
            <div className="flex items-center gap-4">
              <div className={`${kpi.bg} ${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-0 group-hover:w-full transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Fraud Detection & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reliability Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold">Reliability Benchmarks</h3>
              <p className="text-xs text-slate-500 italic">Red bars indicate potential "Reward Farming" attempts.</p>
            </div>
            <Activity className="w-5 h-5 text-slate-300" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="reliability">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.complaints > 3 ? '#ef4444' : entry.reliability > 80 ? '#4f46e5' : '#fbbf24'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Inconsistency Radar */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl border border-slate-800 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Fingerprint className="w-6 h-6 text-indigo-400" />
            <h3 className="text-lg font-bold">Anti-Cheat Radar</h3>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto">
            {complaints.length > 0 ? (
              complaints.map((c) => (
                <div key={c.id} className="relative pl-6 border-l border-indigo-500/30">
                  <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-indigo-500 animate-pulse" />
                  <div className="mb-1">
                    <span className="text-[10px] font-black uppercase text-indigo-400">{c.shopName}</span>
                    <h4 className="text-xs font-bold leading-tight">{c.issueType}: {c.productName}</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mb-2">"{c.comment}"</p>
                  <div className="flex items-center gap-2">
                    <button className="text-[9px] bg-red-600 px-2 py-0.5 rounded font-bold hover:bg-red-700">PENALIZE</button>
                    <button className="text-[9px] bg-slate-700 px-2 py-0.5 rounded font-bold hover:bg-slate-600">DISMISS</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
                <ShieldX className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">No fraud alerts detected in the current cycle.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>System Integrity</span>
              <span className="text-emerald-400">99.2% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Insights Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Deep Learning Model Analysis (Cheating Detection)</h3>
            <p className="text-sm text-slate-500">Cross-verifying shop owner behaviors with customer physical truth observations.</p>
          </div>
          <Brain className="w-6 h-6 text-indigo-500" />
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm font-semibold">
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Update Patterns</th>
                <th className="px-6 py-4">Conflict Rate</th>
                <th className="px-6 py-4">Reliability Index</th>
                <th className="px-6 py-4">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shops.map(shop => (
                <tr key={shop.id} className={`hover:bg-slate-50 text-sm ${shop.complaintsCount > 3 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4 font-bold flex items-center gap-2">
                    {shop.name}
                    {shop.complaintsCount > 2 && (
                      <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">FRAUD RISK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {shop.lastUpdateFrequency.toFixed(1)} Upd/Wk • Acc: {(shop.pastAccuracy * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>{shop.complaintsCount} Reports</span>
                        <span className={shop.complaintsCount > 3 ? 'text-red-500' : 'text-slate-400'}>
                          {((shop.complaintsCount / (shop.lastUpdateFrequency || 1)) * 10).toFixed(1)}% Drift
                        </span>
                      </div>
                      <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${shop.complaintsCount > 3 ? 'bg-red-500' : 'bg-amber-500'}`} 
                          style={{ width: `${Math.min(100, (shop.complaintsCount * 20))}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-black ${
                      shop.reliabilityScore > 0.8 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                      shop.reliabilityScore > 0.5 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {(shop.reliabilityScore * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 font-bold text-xs">
                      <div className={`w-2 h-2 rounded-full ${shop.reliabilityScore > 0.8 ? 'bg-emerald-500' : shop.reliabilityScore > 0.5 ? 'bg-amber-500' : 'bg-red-500 animate-ping'}`} />
                      {shop.reliabilityScore > 0.8 ? 'PAYOUT READY' : shop.reliabilityScore > 0.5 ? 'IN REVIEW' : 'REWARDS FROZEN'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
