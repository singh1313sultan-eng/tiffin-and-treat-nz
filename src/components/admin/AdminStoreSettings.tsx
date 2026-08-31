import React, { useState } from 'react';
import { 
  StoreLocation 
} from '../../types';
import { isSupabaseConfigured, getSupabaseConfig } from '../../services/supabaseClient';
import { 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Power, 
  AlertCircle, 
  Save, 
  Check, 
  Sparkles, 
  RotateCcw,
  Volume2,
  VolumeX,
  Bell,
  Database,
  CloudCheck,
  Key,
  ExternalLink,
  Copy,
  CheckCheck
} from 'lucide-react';

interface AdminStoreSettingsProps {
  stores: StoreLocation[];
  onToggleStoreStatus: (storeId: string, isOpen: boolean) => void;
  onUpdateStoreTimes: (storeId: string, pickupTime: string, deliveryTime: string) => void;
  announcementBanner: string;
  onUpdateAnnouncementBanner: (msg: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetDemoData: () => void;
}

export const AdminStoreSettings: React.FC<AdminStoreSettingsProps> = ({
  stores,
  onToggleStoreStatus,
  onUpdateStoreTimes,
  announcementBanner,
  onUpdateAnnouncementBanner,
  soundEnabled,
  onToggleSound,
  onResetDemoData
}) => {
  const [bannerInput, setBannerInput] = useState(announcementBanner);
  const [bannerSaved, setBannerSaved] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editPickupTime, setEditPickupTime] = useState('');
  const [editDeliveryTime, setEditDeliveryTime] = useState('');
  const [copiedEnv, setCopiedEnv] = useState(false);

  const supabaseInfo = getSupabaseConfig();
  const isCloudConnected = supabaseInfo.isConfigured;

  const handleCopySqlGuide = () => {
    navigator.clipboard.writeText(`-- Run the complete script located in supabase/schema.sql in your Supabase SQL Editor`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncementBanner(bannerInput);
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2500);
  };

  const startEditTimes = (store: StoreLocation) => {
    setEditingStoreId(store.id);
    setEditPickupTime(store.pickupTime);
    setEditDeliveryTime(store.deliveryTime);
  };

  const handleSaveTimes = (storeId: string) => {
    onUpdateStoreTimes(storeId, editPickupTime, editDeliveryTime);
    setEditingStoreId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Cloud Database & Realtime Sync Status Card */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
              isCloudConnected ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-amber-600 to-orange-600'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-[#1E1B18]">
                  Cloud Database & Realtime Sync
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isCloudConnected ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {isCloudConnected ? '🟢 Supabase PostgreSQL Connected' : '🟡 Offline-First / Local Mode'}
                </span>
              </div>
              <p className="text-xs text-[#706658] mt-0.5">
                {isCloudConnected 
                  ? `Connected to Supabase PostgreSQL database at ${supabaseInfo.url}`
                  : 'Operating in high-speed local mode. Ready to link to Supabase PostgreSQL in 2 steps.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <a
              href="/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 bg-[#E06D53] hover:bg-[#D45E44] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>⚡ Swagger API Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#D9CFBF] transition-all cursor-pointer shadow-2xs"
            >
              <span>Supabase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Status Breakdown & Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E8E0D2] space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">Database Engine</div>
            <div className="font-bold text-[#1E1B18]">PostgreSQL 15+ with RLS</div>
            <div className="text-[11px] text-[#706658]">Orders, Menu, Customers, Branches</div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E8E0D2] space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">Live KDS WebSockets</div>
            <div className="font-bold text-emerald-700">Realtime Replication Active</div>
            <div className="text-[11px] text-[#706658]">Instant kitchen dockets & chimes</div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E8E0D2] space-y-1">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">SQL Schema Script</div>
            <div className="font-bold text-amber-800">supabase/schema.sql</div>
            <div className="text-[11px] text-[#706658]">Includes seed menu, stores & GST</div>
          </div>
        </div>

        {!isCloudConnected && (
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E0D2] space-y-2 text-xs">
            <div className="font-bold text-[#1E1B18] flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-600" />
              <span>How to connect your live Supabase cloud database:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#706658] text-[11px]">
              <li>Create a free PostgreSQL project on <strong>https://supabase.com</strong>.</li>
              <li>Go to <strong>SQL Editor</strong> and run the provided <code>supabase/schema.sql</code> script to build all tables & seed data.</li>
              <li>Copy your <strong>Project URL</strong> and <strong>anon key</strong> into the <code>.env</code> file.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Global Store Broadcast Announcement Banner */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-[#1E1B18] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Storefront Top Announcement Banner</span>
          </h4>
          <span className="text-xs text-[#706658]">Broadcasts live across customer storefront</span>
        </div>

        <form onSubmit={handleSaveBanner} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={bannerInput}
            onChange={(e) => setBannerInput(e.target.value)}
            placeholder="e.g. Free Gulab Jamun Sundae on all orders over NZD $45 this weekend!"
            className="flex-1 bg-[#FAF7F2] border border-[#D9CFBF] rounded-2xl px-4 py-2.5 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
          />
          <button
            type="submit"
            className="py-2.5 px-5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#E06D53]/20 shrink-0"
          >
            {bannerSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Broadcast Updated!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Banner</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Audio & Alert Preferences */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-sm text-[#1E1B18]">Kitchen Order Audio Chime</div>
            <div className="text-xs text-[#706658]">Play notification chime when a new online customer order is received</div>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            soundEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-[#FAF7F2] text-[#706658] border-[#D9CFBF]'
          }`}
        >
          {soundEnabled ? 'Chime ON' : 'Muted'}
        </button>
      </div>

      {/* Branch Operations & Opening Hours Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-[#1E1B18] flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E06D53]" />
            <span>NZ Branch Hub Operations & Prep Times</span>
          </h4>
          <span className="text-xs text-[#706658]">{stores.length} Locations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div 
              key={store.id}
              className={`bg-white border rounded-3xl p-5 shadow-xs space-y-4 transition-all ${
                store.isOpen 
                  ? 'border-[#E8E0D2] hover:border-[#D4C8B5]' 
                  : 'border-rose-200 bg-rose-50/40 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-base text-[#1E1B18] flex items-center gap-2">
                    <span>{store.name}</span>
                    <span className="text-[11px] text-[#706658] font-sans font-normal">({store.suburb})</span>
                  </div>
                  <div className="text-xs text-[#706658] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8C8275] shrink-0" />
                    <span>{store.address}</span>
                  </div>
                </div>

                {/* Open / Closed Toggle Switch */}
                <button
                  onClick={() => onToggleStoreStatus(store.id, !store.isOpen)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    store.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{store.isOpen ? 'OPEN' : 'PAUSED'}</span>
                </button>
              </div>

              {/* Delivery and Pickup Times */}
              <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#E8E0D2] text-xs space-y-2">
                {editingStoreId === store.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#706658] font-bold uppercase">Pickup Estimate</label>
                        <input
                          type="text"
                          value={editPickupTime}
                          onChange={(e) => setEditPickupTime(e.target.value)}
                          className="w-full bg-white border border-[#D9CFBF] text-[#1E1B18] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E06D53]"
                          placeholder="e.g. 15-20 mins"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#706658] font-bold uppercase">Delivery Estimate</label>
                        <input
                          type="text"
                          value={editDeliveryTime}
                          onChange={(e) => setEditDeliveryTime(e.target.value)}
                          className="w-full bg-white border border-[#D9CFBF] text-[#1E1B18] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E06D53]"
                          placeholder="e.g. 35-45 mins"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingStoreId(null)}
                        className="py-1 px-3 bg-[#EBE3D5] text-[#1E1B18] rounded-lg text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveTimes(store.id)}
                        className="py-1 px-3 bg-[#E06D53] text-white font-bold rounded-lg text-[11px]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[#1E1B18] flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#8C8275]" />
                        <span>Pickup: <strong>{store.pickupTime}</strong> • Delivery: <strong>{store.deliveryTime}</strong></span>
                      </div>
                      <div className="text-[11px] text-[#706658]">
                        Min Order: ${store.minOrder.toFixed(2)} • Standard Delivery Fee: ${store.deliveryFee.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => startEditTimes(store)}
                      className="text-[#E06D53] hover:underline text-[11px] font-semibold cursor-pointer"
                    >
                      Adjust Times
                    </button>
                  </div>
                )}
              </div>

              {/* Hours & Contact */}
              <div className="flex items-center justify-between text-[11px] text-[#706658] pt-1">
                <span>Hours: {store.hours}</span>
                <span className="font-mono">{store.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Simulation Data */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-[#1E1B18]">Reset Demo Orders & Stock</div>
          <div className="text-xs text-[#706658]">Restore all initial mock orders, customer profiles and menu pricing defaults</div>
        </div>

        <button
          onClick={onResetDemoData}
          className="py-2.5 px-4 bg-[#FAF7F2] hover:bg-white text-[#5A5043] hover:text-[#1E1B18] rounded-2xl text-xs font-semibold flex items-center gap-2 border border-[#D9CFBF] transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reload Initial Mock Data</span>
        </button>
      </div>

    </div>
  );
};
