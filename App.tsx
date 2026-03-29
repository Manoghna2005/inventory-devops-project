import React, { useState, useCallback, useEffect } from 'react';
import { AppRole, Shop, UpdateLog, Complaint } from './types';
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

// Sync channel
const syncChannel = new BroadcastChannel('retail_reliability_sync');

const App: React.FC = () => {

  const [role, setRole] = useState<AppRole>(AppRole.IDEA_PLAN);
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [updateLogs, setUpdateLogs] = useState<UpdateLog[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync across tabs
  useEffect(() => {
    const handleSync = (event: MessageEvent) => {
      if (event.data.type === 'SYNC_STATE') {
        setShops(event.data.shops);
        setUpdateLogs(event.data.updateLogs);
        setComplaints(event.data.complaints);

        if (role === AppRole.SHOP_OWNER && event.data.lastAction === 'SALE') {
          const latestLog = event.data.updateLogs[0];
          toast.success(`New Sale: ${latestLog.itemName}`, {
            description: `Stock updated: ${latestLog.prevQty} → ${latestLog.newQty}`,
            icon: <Zap className="w-4 h-4 text-amber-500" />,
          });
        }
      }
    };

    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [role]);

  const broadcastState = useCallback((newShops: Shop[], newLogs: UpdateLog[], newComplaints: Complaint[], lastAction?: string) => {
    syncChannel.postMessage({
      type: 'SYNC_STATE',
      shops: newShops,
      updateLogs: newLogs,
      complaints: newComplaints,
      lastAction
    });
  }, []);

  // INVENTORY UPDATE
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
        id: Math.random().toString(36),
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
            return {
              ...shop,
              reliabilityScore: prediction.score
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

  // UI
  return (
    <Layout activeRole={role} onRoleChange={setRole}>
      <Toaster position="top-right" />

      {isUpdating && <div>Loading...</div>}

      {role === AppRole.IDEA_PLAN && <ProjectIdeaView />}
      {role === AppRole.DEMO && <DemoView onStartDemo={setRole} />}
      {role === AppRole.SHOP_OWNER && (
        <ShopOwnerView
          shop={shops.find(s => s.id === 's1') || shops[0]}
          updateLogs={updateLogs}
          onUpdateInventory={handleInventoryUpdate}
        />
      )}
      {role === AppRole.CUSTOMER && (
        <CustomerView
          shops={shops}
          onReportIssue={() => {}}
          onPurchase={() => {}}
        />
      )}
      {role === AppRole.ADMIN && (
        <AdminDashboard shops={shops} complaints={complaints} />
      )}
    </Layout>
  );
};

export default App;
