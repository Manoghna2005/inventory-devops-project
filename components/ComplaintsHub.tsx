
import React, { useState, useMemo } from 'react';
import { Complaint, Shop, AppRole } from '../types';
import { 
  AlertCircle, 
  Search, 
  ShieldAlert, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Fingerprint,
  Info,
  History,
  BrainCircuit,
  Zap,
  Lock,
  RefreshCw,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface ComplaintsHubProps {
  complaints: Complaint[];
  shops: Shop[];
  onSimulateBreach?: () => void;
}

const ComplaintsHub: React.FC<ComplaintsHubProps> = ({ complaints, shops, onSimulateBreach }) => {
  const [filter, setFilter] = useState<'ALL' | 'Verified' | 'Pending' | 'Rejected'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesFilter = filter === 'ALL' || c.status === filter;
      const matchesSearch = c.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.productName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [complaints, filter, searchTerm]);

  const handleSimulate = () => {
    setIsSimulating(true);
    if (onSimulateBreach) onSimulateBreach();
    setTimeout(() => setIsSimulating(false), 1500);
  };

  const systemStats = {
    integrityLevel: shops.every(s => s.complaintsCount < 3) ? 'SECURE' : 'HIGH RISK',
    activeInvestigations: complaints.filter(c => c.status === 'Pending').length,
    payoutLocks: shops.filter(s => s.reliabilityScore < 0.5).length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Top Status Bar: Command Center Style */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
          <BrainCircuit className="absolute right-[-20px] top-[-20px] w-64 h-64 opacity-5 text-indigo-400" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/30 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> System Integrity Monitor
              </div>
              <h2 className="text-4xl font-black tracking-tight leading-tight">
                Integrity Hub <span className="text-indigo-400">&</span> Fraud Radar
              </h2>
              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Gemini-powered behavioral analysis cross-references shop owner telemetry with 
                customer physical verifications to eliminate "Reward Farming."
              </p>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-4 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 min-w-[200px]">
              <div className="text-center">
                <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Status</p>
                <p className={`text-2xl font-black ${systemStats.integrityLevel === 'SECURE' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {systemStats.integrityLevel}
                </p>
              </div>
              <div className="w-full h-px bg-white/10" />
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Simulate Conflict
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Reward Locks
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{systemStats.payoutLocks}</span>
              <span className="text-xs font-bold text-slate-400 mb-1.5 uppercase">Shops Frozen</span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
            <p className="text-[10px] font-bold text-slate-500 italic leading-snug">
              "AI automatically freezes incentives when Reliability Drift exceeds 15% threshold."
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Risk Radar Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 mb-6">
              <Terminal className="w-4 h-4 text-indigo-600" /> Decision Logs
            </h3>
            <div className="space-y-4">
              {shops.filter(s => s.complaintsCount > 0).map(shop => (
                <div key={shop.id} className="group cursor-default">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-slate-800">{shop.name}</span>
                    <span className={`text-[10px] font-black ${shop.complaintsCount > 2 ? 'text-red-500' : 'text-amber-500'}`}>
                      {shop.complaintsCount > 2 ? 'CRITICAL DRIFT' : 'INVESTIGATING'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${shop.complaintsCount > 2 ? 'bg-red-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, shop.complaintsCount * 25)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 italic group-hover:text-slate-600 transition-colors">
                    {shop.complaintsCount > 2 ? 'Recommendation: 25% Reliability Reduction Applied.' : 'Observation: One-time discrepancy detected.'}
                  </p>
                </div>
              ))}
              {shops.every(s => s.complaintsCount === 0) && (
                <p className="text-xs text-slate-400 text-center py-8 italic">No anomalies detected across network.</p>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Fingerprint className="w-6 h-6 text-indigo-600" />
              <h4 className="font-bold text-indigo-900">Anti-Farming AI</h4>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Our model analyzes <strong>Temporal Variance</strong>. If an owner updates stock every 15 minutes but customer footfall is zero, the system flags for "Bot Simulation" or "Manual Reward Farming."
            </p>
          </div>
        </div>

        {/* Complaints List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Audit specific shop or item..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
              {(['ALL', 'Verified', 'Pending'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                    filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((complaint) => (
                <div key={complaint.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        complaint.status === 'Verified' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{complaint.shopName}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <History className="w-3 h-3" />
                          {new Date(complaint.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {complaint.issueType}
                      </span>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        <CheckCircle className="w-3 h-3" /> {complaint.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Detail: {complaint.productName}</p>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">AI Verified Breach</span>
                    </div>
                    <p className="text-slate-700 text-sm italic font-medium">"{complaint.comment}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                      <BrainCircuit className="w-4 h-4" /> Gemini Analysis Context: High Confidence Drift
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-slate-400 hover:text-red-600 transition-colors">
                        <XCircle className="w-4 h-4" /> Reject Report
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-100 transition-colors">
                        Investigate Further
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center text-slate-300 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                <ShieldCheck className="w-20 h-20 mx-auto mb-6 opacity-10" />
                <p className="text-xl font-bold text-slate-400">Security Feed Clear</p>
                <p className="text-sm mt-1">No verified integrity breaches at this time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsHub;
