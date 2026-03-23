
import React, { useState } from 'react';
import { Shop, Complaint, Product } from '../types';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Info, 
  AlertCircle, 
  X, 
  Send, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface CustomerViewProps {
  shops: Shop[];
  onReportIssue: (complaint: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => void;
  onPurchase: (shopId: string, productId: string) => void;
}

type CustomerViewMode = 'LIST' | 'DETAILS' | 'SUCCESS' | 'PURCHASE_SUCCESS';

const CustomerView: React.FC<CustomerViewProps> = ({ shops, onReportIssue, onPurchase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<CustomerViewMode>('LIST');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    productName: '',
    issueType: 'Not in stock' as Complaint['issueType'],
    comment: ''
  });

  const filteredShops = shops.filter(shop => 
    searchTerm === '' || 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.inventory.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.inStock)
  );

  const handleSelectShop = (shop: Shop) => {
    setSelectedShop(shop);
    setViewMode('DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (showComplaintForm) {
      setShowComplaintForm(false);
    } else {
      setViewMode('LIST');
      setSelectedShop(null);
    }
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop) return;

    onReportIssue({
      shopId: selectedShop.id,
      shopName: selectedShop.name,
      ...complaintForm
    });

    setViewMode('SUCCESS');
    setShowComplaintForm(false);
    setComplaintForm({ productName: '', issueType: 'Not in stock', comment: '' });
  };

  // --- SUB-COMPONENT: SHOP LIST ---
  if (viewMode === 'LIST') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Find Reliable Products Nearby</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for shops or items (milk, eggs, bread...)"
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.length > 0 ? (
            filteredShops.sort((a, b) => b.reliabilityScore - a.reliabilityScore).map((shop) => (
              <div 
                key={shop.id} 
                onClick={() => handleSelectShop(shop)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{shop.name}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-bold ${
                      shop.reliabilityScore > 0.8 ? 'bg-green-100 text-green-700' : 
                      shop.reliabilityScore > 0.5 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                      {(shop.reliabilityScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm gap-1 mb-4">
                    <MapPin className="w-4 h-4" />
                    {shop.address}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {shop.inventory.filter(p => p.inStock).slice(0, 3).map(p => (
                        <span key={p.id} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                          {p.name}
                        </span>
                      ))}
                      {shop.inventory.filter(p => p.inStock).length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">+{shop.inventory.filter(p => p.inStock).length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-indigo-600 font-bold text-xs uppercase tracking-widest">
                  <span>View Full Stock</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No shops matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SUB-COMPONENT: SHOP DETAILS ---
  if (viewMode === 'DETAILS' && selectedShop) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Search
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-8 text-white relative overflow-hidden">
            <ShieldCheck className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{selectedShop.name}</h2>
                <div className="flex items-center gap-2 opacity-80 text-sm mb-4">
                  <MapPin className="w-4 h-4" /> {selectedShop.address}
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <p className="text-[10px] font-bold uppercase opacity-60">Reliability</p>
                    <p className="text-xl font-bold">{(selectedShop.reliabilityScore * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                    <p className="text-[10px] font-bold uppercase opacity-60">Verified Logs</p>
                    <p className="text-xl font-bold">{(selectedShop.pastAccuracy * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Navigate Now
                </button>
                <button 
                  onClick={() => setShowComplaintForm(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" /> Raise Complaint
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" /> Current Inventory Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedShop.inventory.map((product) => (
                <div key={product.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{product.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{product.category}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'Available' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-200/50">
                    <div className="text-xs font-bold text-slate-500">
                      Qty: <span className={product.quantity < 5 ? 'text-amber-600' : 'text-slate-700'}>{product.quantity}</span>
                    </div>
                    {product.inStock && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onPurchase(selectedShop.id, product.id);
                          setViewMode('PURCHASE_SUCCESS');
                        }}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complaint Modal */}
        {showComplaintForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Report Stock Issue</h3>
                  <p className="text-red-100 text-xs">Help the AI identify shop owner cheating</p>
                </div>
                <button onClick={() => setShowComplaintForm(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Which product?</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
                    value={complaintForm.productName}
                    onChange={(e) => setComplaintForm({...complaintForm, productName: e.target.value})}
                    required
                  >
                    <option value="">Select a product...</option>
                    {selectedShop.inventory.map(p => (
                      <option key={p.id} value={p.name}>{p.name} {p.inStock ? '(Shown Available)' : '(Shown Out)'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Issue Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Not in stock', 'Wrong info', 'Late update', 'Poor service'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setComplaintForm({...complaintForm, issueType: type})}
                        className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${
                          complaintForm.issueType === type 
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Comments</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-none text-sm"
                    placeholder="e.g. Visited now, they said it was sold out 2 hours ago but app shows it's available."
                    value={complaintForm.comment}
                    onChange={(e) => setComplaintForm({...complaintForm, comment: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200 uppercase tracking-widest text-sm"
                >
                  <Send className="w-4 h-4" /> Submit Complaint
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- SUB-COMPONENT: PURCHASE SUCCESS SCREEN ---
  if (viewMode === 'PURCHASE_SUCCESS') {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Purchase Successful!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
          Your purchase has been recorded. The shop's inventory has been automatically updated in real-time, helping maintain accurate data for other customers.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-left">
          <p className="text-xs text-amber-800 font-bold uppercase mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> System Integrity Note
          </p>
          <p className="text-[11px] text-amber-700 leading-tight">
            This transaction automatically verified the shop's stock status. The shop owner's reliability score has been adjusted based on this real-world confirmation.
          </p>
        </div>
        <button 
          onClick={() => {
            setViewMode('LIST');
            setSelectedShop(null);
          }}
          className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
        >
          Return to Search
        </button>
      </div>
    );
  }

  // --- SUB-COMPONENT: SUCCESS SCREEN ---
  if (viewMode === 'SUCCESS') {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Complaint Submitted!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
          Thank you for your feedback. Our Behavioral AI will verify this against the shop's update patterns to adjust their reliability score and rewards.
        </p>
        <button 
          onClick={() => {
            setViewMode('LIST');
            setSelectedShop(null);
          }}
          className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
        >
          Return to Search
        </button>
      </div>
    );
  }

  return null;
};

export default CustomerView;
