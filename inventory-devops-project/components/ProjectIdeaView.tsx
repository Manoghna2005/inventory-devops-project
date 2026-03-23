
import React from 'react';
import { 
  Lightbulb, 
  Target, 
  Database, 
  BrainCircuit, 
  Gift, 
  Users, 
  Zap, 
  Settings, 
  ArrowRight,
  ChartBar,
  Code,
  ShieldAlert
} from 'lucide-react';

const ProjectIdeaView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-700 rounded-full mb-2">
          <Lightbulb className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Project Design Plan
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium italic">
          "Behavior-Aware Deep Learning System for Predicting Inventory Reliability in Offline Retail Shops"
        </p>
      </div>

      {/* 1. System Overview */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <Target className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">1. System Overview</h2>
        </div>
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
          <p className="text-indigo-900 font-semibold text-lg">
            Goal: Predict inventory reliability of offline shops and motivate shop owners to maintain accurate stock information using incentives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
          {[
            { label: 'Shop Owner Module', desc: 'Inventory updates' },
            { label: 'Data Storage', desc: 'Updates & Verification' },
            { label: 'AI Module', desc: 'Score Prediction' },
            { label: 'Incentive Engine', desc: 'Rewards' },
            { label: 'Customer Module', desc: 'Search & Reliability' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block font-bold text-slate-800 text-sm mb-1">{item.label}</span>
              <span className="block text-slate-500 text-xs">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Module-Wise Design */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <Settings className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">2. Module-Wise Design</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
            <Users className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">2.1 Shop Owner Module</h3>
              <p className="text-sm text-slate-600">Simple UI for one-tap availability updates. Features OTP login and batch updates to ensure low friction for retailers.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
            <Database className="w-10 h-10 text-emerald-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">2.2 Data Storage Module</h3>
              <p className="text-sm text-slate-600">Collects Behavioral Data: update frequency, accuracy history, customer feedback, and response delay (latency).</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
            <BrainCircuit className="w-10 h-10 text-indigo-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">2.3 Deep Learning Module</h3>
              <p className="text-sm text-slate-600">Simple MLP or LSTM architecture. Inputs behavioral features to output a 0-1 Reliability Score for each shop.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4">
            <Gift className="w-10 h-10 text-amber-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold mb-2">2.4 Incentive Engine</h3>
              <p className="text-sm text-slate-600">Reward Logic: Score &gt; 0.8 grants high rewards. Rewards include points, coupons, or direct monetary bonuses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Data Flow Diagram */}
      <section className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-64 h-64" />
        </div>
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <Zap className="w-8 h-8 text-amber-400" />
          <h2 className="text-2xl font-bold">3. Data Flow Diagram</h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 w-full md:w-40 text-center">
            <span className="text-xs font-bold block mb-1">Update</span>
            <span className="text-[10px] opacity-70">Shop Owner</span>
          </div>
          <ArrowRight className="w-6 h-6 text-indigo-400 hidden md:block" />
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 w-full md:w-40 text-center">
            <span className="text-xs font-bold block mb-1">Storage</span>
            <span className="text-[10px] opacity-70">Behavior Logs</span>
          </div>
          <ArrowRight className="w-6 h-6 text-indigo-400 hidden md:block" />
          <div className="bg-indigo-500 p-4 rounded-xl shadow-lg w-full md:w-40 text-center border border-indigo-400">
            <span className="text-xs font-bold block mb-1">DL Model</span>
            <span className="text-[10px] opacity-70">Prediction</span>
          </div>
          <ArrowRight className="w-6 h-6 text-indigo-400 hidden md:block" />
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 w-full md:w-40 text-center">
            <span className="text-xs font-bold block mb-1">Rewards</span>
            <span className="text-[10px] opacity-70">Incentive Engine</span>
          </div>
        </div>
      </section>

      {/* 4. Revenue Model & Profitability */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <ChartBar className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">4. Revenue Model & Profitability</h2>
        </div>
        <p className="text-slate-600 mb-8">How the platform sustains itself while providing incentives to shop owners:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Transaction Fees", 
              desc: "A small 2-5% commission on every 'Buy Now' transaction processed through the app.",
              icon: Zap,
              color: "text-amber-500"
            },
            { 
              title: "Brand Partnerships", 
              desc: "FMCG brands (like Nestle, Amul) pay to have their products tracked reliably and offer their own rewards.",
              icon: Users,
              color: "text-blue-500"
            },
            { 
              title: "Data Insights", 
              desc: "Selling anonymized, aggregated stock velocity data to distributors for supply chain optimization.",
              icon: Database,
              color: "text-emerald-500"
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
              <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
              <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <Gift className="w-5 h-5" /> The "Incentive" Secret
          </h4>
          <p className="text-sm text-indigo-800 leading-relaxed">
            Incentives aren't just cash out of your pocket. They are <strong>Performance-Based Discounts</strong>. Reliable shops get lower transaction fees, while unreliable shops pay a premium. This creates a "Self-Funding Reward Pool" where the platform always stays profitable.
          </p>
        </div>
      </section>

      {/* 5. Technical Deep Dive (The "How it Works") */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <Code className="w-8 h-8 text-indigo-600" />
          <h2 className="text-2xl font-bold">5. Technical Deep Dive</h2>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <BrainCircuit className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Behavioral AI Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instead of simple logic, we use <strong>Gemini 3 Flash</strong> to analyze "Update Drift". It looks at how often a shop updates vs. how many complaints they get. If a shop updates 10 times but gets 5 "Not in Stock" reports, the AI detects a <strong>Behavioral Discrepancy</strong> and drops their score.
              </p>
            </div>

            <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Real-Time State Sync</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The system uses a <strong>Uni-directional Data Flow</strong>. When a customer clicks "Buy Now", the state is updated in the central store. This immediately reflects in the Shop Owner's dashboard and logs a "Sale" event, ensuring the "Source of Truth" is always current.
              </p>
            </div>

            <div className="md:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Anti-Fraud Verification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We implemented a <strong>Crowdsourced Verification Loop</strong>. Every customer report acts as a "Validation Node". If multiple customers report an item as missing while the owner says it's available, the system triggers an "Integrity Breach" alert.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white font-mono text-xs">
            <p className="text-indigo-400 mb-2">// Core AI Logic Snippet</p>
            <p>const reliability = await Gemini.predict({'{'}</p>
            <p className="pl-4">updateFrequency: shop.logs.perWeek,</p>
            <p className="pl-4">accuracyRate: shop.verifiedUpdates / totalUpdates,</p>
            <p className="pl-4">feedbackSignal: customer.sentimentScore</p>
            <p>{'}'});</p>
            <p className="mt-4 text-emerald-400">// Result: Adaptive Incentive Calculation</p>
          </div>
        </div>
      </section>

      {/* 6. Evaluation Metrics & Tech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <ChartBar className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold">Evaluation Metrics</h2>
          </div>
          <ul className="space-y-4">
            {[
              { l: 'Data Accuracy', d: '% of verified updates' },
              { l: 'Reliability Score', d: 'Model output precision' },
              { l: 'Customer Satisfaction', d: 'Visit fulfillment rate' },
              { l: 'Incentive Impact', d: 'Change in update behavior' },
            ].map((m, i) => (
              <li key={i} className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="font-bold text-slate-800 text-sm">{m.l}</span>
                <span className="text-slate-500 text-xs italic">{m.d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <Code className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl font-bold">Tech Stack Details</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Frontend Architecture</p>
              <p className="text-sm font-bold">React 19 / TypeScript</p>
              <p className="text-[10px] text-slate-500">Component-based UI with Hooks for state management.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Styling Engine</p>
              <p className="text-sm font-bold">Tailwind CSS 4.0</p>
              <p className="text-[10px] text-slate-500">Utility-first CSS for responsive, high-performance UI.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase text-slate-400 font-bold">AI Integration</p>
              <p className="text-sm font-bold">Google Gemini SDK</p>
              <p className="text-[10px] text-slate-500">Generative AI for complex behavioral reasoning.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Data Viz</p>
              <p className="text-sm font-bold">Recharts</p>
              <p className="text-[10px] text-slate-500">SVG-based charts for real-time integrity tracking.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Final Summary Card */}
      <div className="bg-indigo-700 rounded-3xl p-8 text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Core Innovation</h3>
        <p className="text-indigo-100 max-w-3xl mx-auto leading-relaxed">
          The combination of <strong>Deep Learning + Behavioral Analysis + Incentive Mechanics</strong> creates a self-sustaining ecosystem. It solves the "offline stock drift" problem by making accuracy profitable for shops and reliable for customers.
        </p>
      </div>
    </div>
  );
};

export default ProjectIdeaView;
