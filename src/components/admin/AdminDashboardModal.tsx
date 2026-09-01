import React, { useState, useEffect } from 'react';
import { 
  MenuItem, 
  PlacedOrder, 
  StoreLocation, 
  CustomerRecord, 
  OrderStatus, 
  AdminTabType,
  AdminUser
} from '../../types';
import { AdminLiveOrders } from './AdminLiveOrders';
import { AdminMenuManager } from './AdminMenuManager';
import { AdminFinancials } from './AdminFinancials';
import { AdminCustomerCRM } from './AdminCustomerCRM';
import { AdminStoreSettings } from './AdminStoreSettings';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  ChefHat, 
  UtensilsCrossed, 
  DollarSign, 
  Users, 
  Settings, 
  X, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Bell, 
  Volume2, 
  VolumeX, 
  Store, 
  CheckCircle2,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: AdminUser | null;
  onAdminLogout: () => void;
  menuItems: MenuItem[];
  orders: PlacedOrder[];
  stores: StoreLocation[];
  customers: CustomerRecord[];
  announcementBanner: string;
  onUpdateAnnouncementBanner: (msg: string) => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleSoldOut: (itemId: string, isSoldOut: boolean) => void;
  onQuickUpdatePrice: (itemId: string, newPrice: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
  onToggleVIP: (customerId: string) => void;
  onUpdateCustomerNotes: (customerId: string, notes: string) => void;
  onToggleStoreStatus: (storeId: string, isOpen: boolean) => void;
  onUpdateStoreTimes: (storeId: string, pickupTime: string, deliveryTime: string) => void;
  onResetDemoData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentAdmin,
  onAdminLogout,
  menuItems,
  orders,
  stores,
  customers,
  announcementBanner,
  onUpdateAnnouncementBanner,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleSoldOut,
  onQuickUpdatePrice,
  onUpdateOrderStatus,
  onCancelOrder,
  onToggleVIP,
  onUpdateCustomerNotes,
  onToggleStoreStatus,
  onUpdateStoreTimes,
  onResetDemoData
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<AdminTabType>('orders');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // Play audio chime if new order arrives or action occurs
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    onUpdateOrderStatus(orderId, status);
    playChime();
    showAdminToast(`Order status updated to "${status.toUpperCase()}"`);
  };

  const handleSoldOutToggle = (itemId: string, isSoldOut: boolean) => {
    onToggleSoldOut(itemId, isSoldOut);
    playChime();
    showAdminToast(`Item marked ${isSoldOut ? 'SOLD OUT' : 'AVAILABLE'}`);
  };

  const handlePriceUpdate = (itemId: string, price: number) => {
    onQuickUpdatePrice(itemId, price);
    playChime();
    showAdminToast(`Price updated to NZD $${price.toFixed(2)}`);
  };

  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] text-[#1E1B18] flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Admin Toast Alert */}
      {adminToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#E06D53] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top duration-300 text-xs font-bold border border-white/20">
          <Sparkles className="w-4 h-4 text-white" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Top Console Navigation Bar */}
      <header className="bg-white border-b border-[#E8E0D2] px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shrink-0 shadow-xs">
        
        {/* Left: Brand & Return */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-3 bg-[#FAF0ED] hover:bg-[#F0D5CD] text-[#E06D53] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#F0D5CD] transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Storefront</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E06D53] to-amber-600 flex items-center justify-center text-white shadow-md shadow-[#E06D53]/20">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-[#1E1B18] flex items-center gap-2">
                <span>Tiffin & Treat NZ</span>
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider bg-[#FAF0ED] text-[#E06D53] px-2 py-0.5 rounded-md border border-[#F0D5CD]">
                  Manager Portal
                </span>
              </div>
              <div className="text-[11px] text-[#706658] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live NZ System Online</span>
                <span>•</span>
                <span className="font-mono text-[#3D372E] font-semibold">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#F5EFE6] p-1.5 rounded-2xl border border-[#E8E0D2] overflow-x-auto scrollbar-none">
          
          {/* Orders / KDS */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#E06D53] text-white shadow-sm'
                : 'text-[#706658] hover:text-[#1E1B18] hover:bg-white/60'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Live Orders</span>
            {activeOrdersCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'orders' ? 'bg-white text-[#E06D53]' : 'bg-[#E06D53] text-white'
              }`}>
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* Menu & Stock */}
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#E06D53] text-white shadow-sm'
                : 'text-[#706658] hover:text-[#1E1B18] hover:bg-white/60'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu & Stock</span>
            <span className="text-[10px] text-[#A89E91] font-mono">({menuItems.length})</span>
          </button>

          {/* Financials & GST */}
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'financials'
                ? 'bg-[#E06D53] text-white shadow-sm'
                : 'text-[#706658] hover:text-[#1E1B18] hover:bg-white/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financials & GST</span>
          </button>

          {/* Customer CRM */}
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-[#E06D53] text-white shadow-sm'
                : 'text-[#706658] hover:text-[#1E1B18] hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer CRM</span>
            <span className="text-[10px] text-[#A89E91] font-mono">({customers.length})</span>
          </button>

          {/* Store Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#E06D53] text-white shadow-sm'
                : 'text-[#706658] hover:text-[#1E1B18] hover:bg-white/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Branch Hubs</span>
          </button>

        </nav>

        {/* Right: Staff Info, Sound toggle and Close */}
        <div className="flex items-center justify-end gap-2.5">
          {currentAdmin && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] rounded-xl border border-[#E8E0D2] text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-[#1E1B18] leading-tight">{currentAdmin.name}</span>
                <span className="text-[10px] text-[#706658] leading-tight">{currentAdmin.role}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              showAdminToast(soundEnabled ? 'Kitchen chime muted' : 'Kitchen chime activated');
            }}
            className="p-2 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl border border-[#E8E0D2] transition-all cursor-pointer shadow-2xs"
            title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E06D53]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              onAdminLogout();
              onClose();
            }}
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Lock & Logout Admin Session"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Lock / Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl border border-[#E8E0D2] transition-all cursor-pointer shadow-2xs"
            title="Close Manager Console"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Tab Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <ErrorBoundary fallbackTitle="Admin Tab Error - Restoring View">
          {activeTab === 'orders' && (
            <AdminLiveOrders
              orders={orders}
              stores={stores}
              onUpdateOrderStatus={handleStatusChange}
              onCancelOrder={(id) => {
                onCancelOrder(id);
                showAdminToast('Order cancelled');
              }}
            />
          )}

          {activeTab === 'menu' && (
            <AdminMenuManager
              menuItems={menuItems}
              onAddItem={(item) => {
                onAddItem(item);
                showAdminToast(`Added "${item.name}" to menu!`);
              }}
              onUpdateItem={(item) => {
                onUpdateItem(item);
                showAdminToast(`Updated "${item.name}"`);
              }}
              onDeleteItem={(id) => {
                onDeleteItem(id);
                showAdminToast('Dish removed from menu');
              }}
              onToggleSoldOut={handleSoldOutToggle}
              onQuickUpdatePrice={handlePriceUpdate}
            />
          )}

          {activeTab === 'financials' && (
            <AdminFinancials
              orders={orders}
              stores={stores}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomerCRM
              customers={customers}
              orders={orders}
              onToggleVIP={(id) => {
                onToggleVIP(id);
                showAdminToast('Customer VIP status updated');
              }}
              onUpdateCustomerNotes={(id, notes) => {
                onUpdateCustomerNotes(id, notes);
                showAdminToast('Customer notes saved');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <AdminStoreSettings
              stores={stores}
              onToggleStoreStatus={(id, open) => {
                onToggleStoreStatus(id, open);
                showAdminToast(`Branch status updated to ${open ? 'OPEN' : 'PAUSED'}`);
              }}
              onUpdateStoreTimes={(id, p, d) => {
                onUpdateStoreTimes(id, p, d);
                showAdminToast('Branch pickup & delivery estimates updated');
              }}
              announcementBanner={announcementBanner}
              onUpdateAnnouncementBanner={(msg) => {
                onUpdateAnnouncementBanner(msg);
                showAdminToast('Storefront announcement broadcast updated');
              }}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              onResetDemoData={() => {
                onResetDemoData();
                showAdminToast('Demo orders and menu reset to defaults');
              }}
            />
          )}
        </ErrorBoundary>
      </main>

    </div>
  );
};
