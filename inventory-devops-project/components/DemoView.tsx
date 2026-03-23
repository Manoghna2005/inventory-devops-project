
import React, { useState } from 'react';
import { AppRole } from '../types';
import { 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Award, 
  Zap, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown,
  Info,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  behavior: {
    frequency: string;
    accuracy: string;
    complaints: number;
  };
  aiResult: {
    reliability: number;
    tier: 'Platinum' | 'Gold' | 'None' | 'Penalized';
    reward: string;
    status: string;
  };
  icon: any;
  color: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'honest',
    title: 'The Honest Provider',
    description: 'Updates stock 3 times a day. Customers always find what is shown in the app.',
    behavior: {
      frequency: '21 updates / week',
      accuracy: '99% match',
      complaints: 0
    },
    aiResult: {
      reliability: 0.98,
      tier: 'Platinum',
      reward: '$50 Weekly Bonus',
      status: 'High Trust Entity'
    },
    icon: CheckCircle2,
    color: 'emerald'
  },
  {
    id: 'honest-lazy',
    title: 'The Honest but Slow',
    description: 'Only updates stock once a week. Customers occasionally find discrepancies due to lag.',
    behavior: {
      frequency: '1 update / week',
      accuracy: '85% match',
      complaints: 1
    },
    aiResult: {
      reliability: 0.65,
      tier: 'Gold',
      reward: '$10 Weekly Bonus',
      status: 'Standard Trust'
    },
    icon: Zap,
    color: 'indigo'
  },
  {
    id: 'cheater',
    title: 'The "Reward Farmer"',
    description: 'Updates stock every hour to get "Frequency" points, but info is false to trick customers.',
    behavior: {
      frequency: '100+ updates / week',
      accuracy: '30% match',
      complaints: 8
    },
    aiResult: {
      reliability: 0.15,
      tier: 'Penalized',
      reward: '$0 (Frozen)',
      status: 'Fraud Detected'
    },
    icon: ShieldAlert,
    color: 'red'
  },
  {
    id: 'dormant',
    title: 'The Dormant Shop',
    description: 'Never uses the app. No data available for reliability prediction.',
    behavior: {
      frequency: '0 updates / week',
      accuracy: 'N/A',
      complaints: 0
    },
    aiResult: {
      reliability: 0.0,
      tier: 'None',
      reward: '$0',
      status: 'Inactive'
    },
    icon: Info,
    color: 'slate'
  }
];

interface DemoViewProps {
  onStartDemo: (role: AppRole) => void;
}

const DemoView: React.FC<DemoViewProps> = ({ onStartDemo }) => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest">
          <PlayCircle className="w-4 h-4" /> Interactive Demo
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Reward System Scenarios</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          See how our <strong>Behavioral Deep Learning</strong> model differentiates between honest retailers and "Reward Farmers" using real-time telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scenario Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Select a Case Study</h3>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                activeScenario.id === s.id 
                ? `bg-white border-indigo-600 shadow-xl shadow-indigo-100 -translate-y-1` 
                : 'bg-white border-transparent hover:border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                activeScenario.id === s.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm text-slate-900">{s.title}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{s.aiResult.status}</p>
              </div>
              <ChevronRightIcon className={`w-4 h-4 transition-transform ${activeScenario.id === s.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* AI Analysis Visualizer */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className={`h-2 w-full bg-${activeScenario.color}-500`} />
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{activeScenario.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{activeScenario.description}</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm border-2 ${
                activeScenario.aiResult.tier === 'Platinum' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                activeScenario.aiResult.tier === 'Gold' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                activeScenario.aiResult.tier === 'Penalized' ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <Award className="w-5 h-5" />
                Tier: {activeScenario.aiResult.tier}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <Zap className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Update Frequency</p>
                <p className="text-lg font-bold text-slate-800">{activeScenario.behavior.frequency}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer Validation</p>
                <p className="text-lg font-bold text-slate-800">{activeScenario.behavior.accuracy}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <ShieldAlert className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fraud Flags</p>
                <p className="text-lg font-bold text-slate-800">{activeScenario.behavior.complaints} Reports</p>
              </div>
            </div>

            <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <BrainCircuit className="absolute right-[-20px] top-[-20px] w-64 h-64 opacity-5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-500 p-2 rounded-lg">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold italic">Deep Learning Evaluation Logic</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest opacity-70">
                        <span>Reliability Score</span>
                        <span>{(activeScenario.aiResult.reliability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            activeScenario.aiResult.reliability > 0.8 ? 'bg-emerald-400' :
                            activeScenario.aiResult.reliability > 0.5 ? 'bg-indigo-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${activeScenario.aiResult.reliability * 100}%` }} 
                        />
                      </div>
                    </div>
                    <div className="w-32 bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                      <p className="text-[10px] font-bold opacity-60 mb-1">PAYOUT</p>
                      <p className="text-2xl font-black">{activeScenario.aiResult.reward}</p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full ${activeScenario.aiResult.reliability > 0.5 ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <p className="text-sm font-medium leading-relaxed italic">
                        "The model observes {activeScenario.behavior.frequency}. 
                        {activeScenario.behavior.complaints > 3 
                          ? ` High report-to-update ratio (Drift) indicates malicious Reward Farming. Score Penalized.` 
                          : ` Consistent validation confirms integrity. Score Optimized for Rewards.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logic Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> Reward Boosters
          </h4>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 flex-shrink-0"><Zap className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Consistency Multiplier</p>
                <p className="text-xs text-slate-500">Updating 3+ times daily for 7 days boosts reliability by 15%.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Zero-Conflict Streak</p>
                <p className="text-xs text-slate-500">100 consecutive successful customer verifications unlock Platinum Tier.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" /> Penalties
          </h4>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded-lg text-red-700 flex-shrink-0"><ShieldAlert className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Integrity Discrepancy</p>
                <p className="text-xs text-slate-500">Owner says "In Stock", Customer says "Out" = -25% Reliability instant penalty.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded-lg text-red-700 flex-shrink-0"><AlertTriangle className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Reward Farming Lock</p>
                <p className="text-xs text-slate-500">Abnormally high frequency without customer visits triggers AI fraud lock.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-indigo-400" />
          <div>
            <h4 className="text-xl font-bold tracking-tight">Ready to see the real system?</h4>
            <p className="text-slate-400 text-sm">Experience the shop owner and customer modules firsthand.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => onStartDemo(AppRole.SHOP_OWNER)}
            className="flex-1 md:flex-none bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Start Shop Owner Demo
          </button>
          <button 
            onClick={() => onStartDemo(AppRole.CUSTOMER)}
            className="flex-1 md:flex-none bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Test Customer Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoView;
