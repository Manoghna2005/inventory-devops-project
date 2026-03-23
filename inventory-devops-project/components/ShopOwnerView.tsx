
import React, { useState, useEffect } from 'react';
import { Product, Shop, UpdateLog } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Award, 
  Clock, 
  MessageSquare, 
  TrendingDown, 
  AlertTriangle,
  BellRing,
  History,
  BrainCircuit,
  Zap,
  Activity,
  ChevronRight,
  ShieldAlert,
  Fingerprint,
  MapPin,
  Store
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface ShopOwnerViewProps {
  shop: Shop;
  updateLogs: UpdateLog[];
  onUpdateInventory: (productId: string, inStock: boolean) => void;
}

const ShopOwnerView: React.FC<ShopOwnerViewProps> = ({ shop, updateLogs, onUpdateInventory }) => {
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'warning' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdate = (productId: string, inStock: boolean, productName: string) => {
    onUpdateInventory(productId, inStock);
    if (!inStock) {
      setNotification({
        message: `Alert: ${productName} is now Out of Stock. This may impact your reliability score if not restocked soon!`,
        type: 'warning'
      });
    }
  };

  const outOfStockItems = shop.inventory.filter(p => !p.inStock);

  const feedbackHistory = [
    { value: (shop.customerFeedbackScore || 0.8) * 0.8 },
    { value: (shop.customerFeedbackScore || 0.8) * 0.85 },
    { value: (shop.customerFeedbackScore || 0.8) * 0.92 },
    { value: (shop.customerFeedbackScore || 0.8) * 0.88 },
    { value: (shop.customerFeedbackScore || 0.8) * 0.95 },
    { value: shop.customerFeedbackScore },
  ];

  const isPositiveTrend = feedbackHistory[feedbackHistory.length - 1].value >= feedbackHistory[feedbackHistory.length - 2].value;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-8 relative pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-bounce ${
          notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          {notification.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : <BellRing className="w-6 h-6" />}
          <p className="font-semibold text-sm sm:text-base">{notification.message}</p>
        </div>
      )}

      {/* --- VIVA PRESENTATION: WORKFLOW EXPLANATION SECTION --- */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-300" />
            <div>
              <h2 className="text-xl font-bold">Behavior-Aware System Workflow</h2>
              <p className="text-indigo-200 text-xs">AI cross-references updates with customer feedback to detect cheating.</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase">Anti-Fraud Engine Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {[
            { 
              step: "01", 
              title: "Stock Update", 
              desc: "Owner logs inventory. High frequency = Higher potential rewards.", 
              icon: Zap,
              color: "bg-amber-400" 
            },
            { 
              step: "02", 
              title: "Feedback Verification", 
              desc: "Customers report if stock is missing. This detects fake updates.", 
              icon: ShieldAlert,
              color: "bg-red-400" 
            },
            { 
              step: "03", 
              title: "Cheating Detection", 
              desc: "AI detects patterns where updates don't match reality.", 
              icon: BrainCircuit,
              color: "bg-indigo-400" 
            },
            { 
              step: "04", 
              title: "Adaptive Reward", 
              desc: "Rewards are reduced or frozen if fraud is detected.", 
              icon: Award,
              color: "bg-emerald-400" 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 relative group hover:bg-white/20 transition-all">
              <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                <item.icon className="w-6 h-6 text-indigo-900" />
              </div>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{item.step}</span>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-[11px] opacity-80 leading-relaxed">{item.desc}</p>
              {idx < 3 && <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 w-6 h-6" />}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold truncate tracking-tight">{shop.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> {shop.location}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Live Sync</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Owner Mode</div>
          </div>
          <p className="text-slate-500 text-xs mb-4 truncate font-medium">{shop.address}</p>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <TrendingUp className="w-5 h-5" />
            <span>Reliability: {(shop.reliabilityScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg flex flex-col justify-between transition-colors ${
          shop.complaintsCount > 0 ? 'bg-red-600' : 'bg-indigo-600'
        }`}>
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg font-medium opacity-90">Incentives</h3>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <span className="text-4xl font-bold text-white">${shop.incentivesEarned}</span>
            {shop.complaintsCount > 0 ? (
              <p className="text-[10px] bg-red-900/50 text-red-100 px-2 py-1 rounded mt-2 font-bold animate-pulse">
                WARNING: {shop.complaintsCount} COMPLAINTS. REWARDS AT RISK.
              </p>
            ) : (
              <p className="text-sm text-white/75 mt-2">Target: {'>'}92% for Platinum Bonus</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Integrity Score</h3>
            <ShieldAlert className={`w-4 h-4 ${shop.complaintsCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
          </div>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-bold">{(shop.customerFeedbackScore * 100).toFixed(0)}%</span>
            <div className={`flex items-center text-xs font-medium mb-1 ${shop.complaintsCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {shop.complaintsCount === 0 ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
              {shop.complaintsCount === 0 ? 'Zero Flags' : `${shop.complaintsCount} Reports`}
            </div>
          </div>
          <div className="h-10 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feedbackHistory}>
                <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                <Line type="monotone" dataKey="value" stroke={shop.complaintsCount === 0 ? "#10b981" : "#ef4444"} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Fraud Detection Params</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1 text-[10px]"><Activity className="w-3 h-3" /> Update Drift</span>
              <span className="font-bold text-[10px]">NORMAL</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 flex items-center gap-1 text-[10px]"><ShieldAlert className="w-3 h-3" /> Report Conflict</span>
              <span className={`font-bold text-[10px] ${shop.complaintsCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {shop.complaintsCount > 0 ? 'DETECTED' : 'CLEAR'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Cheating Explanation Banner */}
      {shop.complaintsCount > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-6 text-red-900 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-red-600 p-3 rounded-full text-white shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-black uppercase tracking-tighter italic">Fraud Detection Alert!</p>
            <p className="text-sm mt-1 font-medium">
              Our Behavioral Deep Learning model has detected <span className="underline font-bold">{shop.complaintsCount} discrepancies</span> between your stock updates and customer verification. 
              <strong> Cheating attempts result in immediate incentive freezes and a 25% reliability penalty.</strong>
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors">Dispute Findings</button>
              <button className="bg-white border border-red-200 px-4 py-2 rounded-lg text-sm font-bold text-red-600">Review Integrity Guidelines</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Operational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Inventory Management</h2>
              <p className="text-slate-500 text-sm">Update accuracy is verified by customers to prevent reward manipulation.</p>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {shop.inventory.map((product) => (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-xs text-slate-400">
                    Category: {product.category} • 
                    Qty: <span className={`font-bold ${product.quantity < 5 ? 'text-amber-600' : 'text-slate-500'}`}>{product.quantity}</span> • 
                    Last updated: {new Date(product.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUpdate(product.id, true, product.name)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      product.inStock 
                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-green-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> In Stock
                  </button>
                  <button
                    onClick={() => handleUpdate(product.id, false, product.name)}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      !product.inStock 
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500 shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-red-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> Out
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold">Verification Feed</h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            {updateLogs.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {updateLogs.map((log, index) => {
                  const isInStock = log.status === 'In Stock';
                  const isSale = log.status === 'Sale';
                  return (
                    <div key={log.id} className={`p-4 hover:bg-slate-50 transition-colors border-l-4 ${
                      isSale ? 'border-amber-500' : isInStock ? 'border-green-500' : 'border-red-500'
                    } ${index === 0 ? 'bg-indigo-50/30' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-800 flex items-center gap-1">
                            {log.itemName}
                            {index === 0 && <span className="bg-indigo-600 text-white text-[8px] px-1 rounded uppercase tracking-tighter animate-pulse">New</span>}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <Clock className="w-3 h-3" /> {formatTime(log.timestamp)}
                          </div>
                          {log.prevQty !== undefined && log.newQty !== undefined && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Stock Change:</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{log.prevQty}</span>
                                <ChevronRight className="w-3 h-3 text-slate-300" />
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded font-bold ${
                                  log.newQty < log.prevQty ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                }`}>
                                  {log.newQty}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide ${
                          isSale ? 'bg-amber-50 text-amber-700' : isInStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {isSale ? <Zap className="w-3 h-3" /> : isInStock ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} 
                          {log.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="text-sm">No activity recorded yet.</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Cheating Prevention Engaged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerView;
