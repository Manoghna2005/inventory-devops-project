
import React, { useState, useCallback, useEffect } from 'react';
import { AppRole, Shop, Product, UpdateLog, Complaint } from './types';
import { MOCK_SHOPS } from './constants';
import Layout from './components/Layout';
import ProjectIdeaView from './components/ProjectIdeaView';
import ShopOwnerView from './components/ShopOwnerView';
import CustomerView from './components/CustomerView';
import AdminDashboard from './components/AdminDashboard';
import ComplaintsHub from './components/ComplaintsHub';
import DemoView from './components/DemoView';
import { predictReliabilityScore } from './services/geminiService';
import { Loader2, Zap, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Create a BroadcastChannel to sync state across tabs for the demo
const syncChannel = new BroadcastChannel('retail_reliability_sync');

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>(AppRole.IDEA_PLAN);
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state across tabs
  useEffect(() => {
    const handleSync = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_STATE') {
        setShops(event.data.shops);
        setUpdateLogs(event.data.updateLogs);
        setComplaints(event.data.complaints);
        
        // If we are the shop owner, show a notification for new sales
        if (role === AppRole.SHOP_OWNER && event.data.lastAction === 'SALE') {
          const latestLog = event.data.updateLogs[0];
          toast.success(`New Sale: ${latestLog.itemName}`, {
            description: `Stock updated: ${latestLog.prevQty} → ${latestLog.newQty}`,
            icon: <Zap className="w-4 h-4 text-amber-500" />,
            duration: 5000,
          });
        }
      }
    };

    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [role]);

  // Broadcast state changes
  const broadcastState = useCallback((newShops: Shop[], newLogs: UpdateLog[], newComplaints: Complaint[], lastAction?: string) => {
    syncChannel.postMessage({
      type: 'SYNC_STATE',
      shops: newShops,
      updateLogs: newLogs,
      complaints: newComplaints,
      lastAction
    });
  }, []);

  // Function to handle shop inventory updates and trigger score re-prediction
  const handleInventoryUpdate = useCallback(async (productId: string, inStock: boolean) => {
    setIsUpdating(true);
    let updatedItemName = '';
    let prevQty = 0;
    let newQty = 0;

    const newShops = shops.map(shop => {
      if (shop.id === 's1') {
        const updatedInventory = shop.inventory.map(p => {
          if (p.id === productId) {
            updatedItemName = p.name;
            prevQty = p.quantity;
            newQty = inStock && p.quantity === 0 ? 10 : inStock ? p.quantity : 0;
            return { ...p, inStock, quantity: newQty, lastUpdated: new Date().toISOString() };
          }
          return p;
        });
        return {
          ...shop,
          inventory: updatedInventory,
          lastUpdateFrequency: shop.lastUpdateFrequency + 0.1
        };
      }
      return shop;
    });

    const newLogs: UpdateLog[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        itemName: updatedItemName || 'Unknown Item',
        status: inStock ? 'In Stock' : 'Out of Stock',
        prevQty,
        newQty,
        timestamp: new Date().toISOString()
      },
      ...updateLogs
    ].slice(0, 10);

    setShops(newShops);
    setUpdateLogs(newLogs);
    broadcastState(newShops, newLogs, complaints, 'UPDATE');

    const targetShop = newShops.find(s => s.id === 's1');
    if (targetShop) {
      try {
        const prediction = await predictReliabilityScore(
          targetShop.lastUpdateFrequency,
          targetShop.pastAccuracy,
          0.1, 
          targetShop.customerFeedbackScore
        );

        const finalShops = newShops.map(shop => {
          if (shop.id === 's1') {
            const incentiveBonus = prediction.incentiveTier === 'High' ? 10 : prediction.incentiveTier === 'Medium' ? 5 : 0;
            return {
              ...shop,
              reliabilityScore: prediction.score,
              incentivesEarned: shop.incentivesEarned + incentiveBonus
            };
          }
          return shop;
        });
        
        setShops(finalShops);
        broadcastState(finalShops, newLogs, complaints, 'AI_UPDATE');
      } catch (err) {
        console.error("AI Update Failed", err);
      } finally {
        setIsUpdating(false);
      }
    }
  }, [shops, updateLogs, complaints, broadcastState]);

  const handlePurchase = useCallback(async (shopId: string, productId: string) => {
    setIsUpdating(true);
    let purchasedItemName = '';
    let prevQty = 0;
    let newQty = 0;

    const newShops = shops.map(shop => {
      if (shop.id === shopId) {
        const updatedInventory = shop.inventory.map(p => {
          if (p.id === productId) {
            purchasedItemName = p.name;
            prevQty = p.quantity;
            newQty = Math.max(0, p.quantity - 1);
            return { 
              ...p, 
              quantity: newQty, 
              inStock: newQty > 0,
              lastUpdated: new Date().toISOString() 
            };
          }
          return p;
        });
        return {
          ...shop,
          inventory: updatedInventory,
          lastUpdateFrequency: shop.lastUpdateFrequency + 0.05 
        };
      }
      return shop;
    });

    const newLogs: UpdateLog[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        itemName: purchasedItemName || 'Unknown Item',
        status: 'Sale',
        prevQty,
        newQty,
        timestamp: new Date().toISOString()
      },
      ...updateLogs
    ].slice(0, 10);

    setShops(newShops);
    setUpdateLogs(newLogs);
    broadcastState(newShops, newLogs, complaints, 'SALE');

    // Trigger AI score update
    const targetShop = newShops.find(s => s.id === shopId);
    if (targetShop) {
      try {
        const prediction = await predictReliabilityScore(
          targetShop.lastUpdateFrequency + 0.05,
          targetShop.pastAccuracy,
          0.05, 
          targetShop.customerFeedbackScore
        );

        const finalShops = newShops.map(shop => {
          if (shop.id === shopId) {
            return {
              ...shop,
              reliabilityScore: prediction.score,
            };
          }
          return shop;
        });
        
        setShops(finalShops);
        broadcastState(finalShops, newLogs, complaints, 'AI_UPDATE');
      } catch (err) {
        console.error("AI Update Failed", err);
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsUpdating(false);
    }

    toast.success(`Purchase successful!`, {
      description: `You bought ${purchasedItemName}. The shop's inventory has been automatically updated in real-time.`,
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    });
  }, [shops, updateLogs, complaints, broadcastState]);

  const handleComplaintSubmit = useCallback(async (data: Omit<Complaint, 'id' | 'timestamp' | 'status'>) => {
    setIsUpdating(true);
    
    const newComplaint: Complaint = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      status: 'Verified'
    };

    const newComplaints = [newComplaint, ...complaints];
    setComplaints(newComplaints);

    const newShops = shops.map(shop => {
      if (shop.id === data.shopId) {
        const newFeedbackScore = Math.max(0, shop.customerFeedbackScore - 0.1);
        const newReliabilityScore = Math.max(0, shop.reliabilityScore - 0.15);
        
        return {
          ...shop,
          complaintsCount: shop.complaintsCount + 1,
          customerFeedbackScore: newFeedbackScore,
          reliabilityScore: newReliabilityScore
        };
      }
      return shop;
    });
    
    setShops(newShops);
    broadcastState(newShops, updateLogs, newComplaints, 'COMPLAINT');

    setTimeout(() => setIsUpdating(false), 1000);
  }, [shops, updateLogs, complaints, broadcastState]);

  const handleSimulateBreach = useCallback(() => {
    const targetShop = shops[1] || shops[0]; // Quick Stop Mart for breach demo
    handleComplaintSubmit({
      shopId: targetShop.id,
      shopName: targetShop.name,
      productName: targetShop.inventory[0].name,
      issueType: 'Not in stock',
      comment: 'DEMO BREACH: System detected a 4-hour update delay vs actual empty shelf reported by 3 users.'
    });
  }, [shops, handleComplaintSubmit]);

  return (
    <Layout activeRole={role} onRoleChange={setRole}>
      <Toaster position="top-right" richColors closeButton />
      <div className="relative">
        {isUpdating && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] z-[60] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="font-bold text-slate-800">AI Integrity Processing</p>
                <p className="text-sm text-slate-500">Cross-verifying behavioral discrepancy signals...</p>
              </div>
            </div>
          </div>
        )}

        {role === AppRole.IDEA_PLAN && (
          <ProjectIdeaView />
        )}
        {role === AppRole.DEMO && (
          <DemoView onStartDemo={setRole} />
        )}
        {role === AppRole.SHOP_OWNER && (
          <ShopOwnerView 
            shop={shops.find(s => s.id === 's1')!} 
            updateLogs={updateLogs}
            onUpdateInventory={handleInventoryUpdate} 
          />
        )}
        {role === AppRole.CUSTOMER && (
          <CustomerView shops={shops} onReportIssue={handleComplaintSubmit} onPurchase={handlePurchase} />
        )}
        {role === AppRole.COMPLAINTS && (
          <ComplaintsHub complaints={complaints} shops={shops} onSimulateBreach={handleSimulateBreach} />
        )}
        {role === AppRole.ADMIN && (
          <AdminDashboard shops={shops} complaints={complaints} />
        )}
      </div>
    </Layout>
  );
};

export default App;
