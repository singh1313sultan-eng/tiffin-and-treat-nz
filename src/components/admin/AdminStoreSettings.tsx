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
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
              isCloudConnected ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-amber-600 to-orange-600'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-white">
                  Cloud Database & Realtime Sync
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isCloudConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {isCloudConnected ? '🟢 Supabase PostgreSQL Connected' : '🟡 Offline-First / Local Mode'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
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
              className="py-2 px-3.5 bg-[#E06D53] hover:bg-[#D45E44] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>⚡ Swagger API Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
            >
              <span>Supabase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Status Breakdown & Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#181614] rounded-2xl p-3.5 border border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase text-neutral-400">Database Engine</div>
            <div className="font-bold text-white">PostgreSQL 15+ with RLS</div>
            <div className="text-[11px] text-neutral-500">Orders, Menu, Customers, Branches</div>
          </div>

          <div className="bg-[#181614] rounded-2xl p-3.5 border border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase text-neutral-400">Live KDS WebSockets</div>
            <div className="font-bold text-emerald-400">Realtime Replication Active</div>
            <div className="text-[11px] text-neutral-500">Instant kitchen dockets & chimes</div>
          </div>

          <div className="bg-[#181614] rounded-2xl p-3.5 border border-neutral-800 space-y-1">
            <div className="text-[10px] font-bold uppercase text-neutral-400">SQL Schema Script</div>
            <div className="font-bold text-amber-400">supabase/schema.sql</div>
            <div className="text-[11px] text-neutral-500">Includes seed menu, stores & GST</div>
          </div>
        </div>

        {!isCloudConnected && (
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>How to connect your live Supabase cloud database:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-[11px]">
              <li>Create a free PostgreSQL project on <strong>https://supabase.com</strong>.</li>
              <li>Go to <strong>SQL Editor</strong> and run the provided <code>supabase/schema.sql</code> script to build all tables & seed data.</li>
              <li>Copy your <strong>Project URL</strong> and <strong>anon key</strong> into the <code>.env</code> file.</li>
            </ol>
          </div>
        )}
      </div>

      {/* Global Store Broadcast Announcement Banner */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Storefront Top Announcement Banner</span>
          </h4>
          <span className="text-xs text-neutral-400">Broadcasts live across customer storefront</span>
        </div>

        <form onSubmit={handleSaveBanner} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={bannerInput}
            onChange={(e) => setBannerInput(e.target.value)}
            placeholder="e.g. Free Gulab Jamun Sundae on all orders over NZD $45 this weekend!"
            className="flex-1 bg-[#181614] border border-neutral-700 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E06D53]"
          />
          <button
            type="submit"
            className="py-2.5 px-5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E06D53]/20 shrink-0"
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
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-[#E06D53] flex items-center justify-center">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-sm text-white">Kitchen Order Audio Chime</div>
            <div className="text-xs text-neutral-400">Play notification chime when a new online customer order is received</div>
          </div>
        </div>

        <button
          onClick={onToggleSound}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            soundEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
          }`}
        >
          {soundEnabled ? 'Chime ON' : 'Muted'}
        </button>
      </div>

      {/* Branch Operations & Opening Hours Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-[#E06D53]" />
            <span>NZ Branch Hub Operations & Prep Times</span>
          </h4>
          <span className="text-xs text-neutral-400">{stores.length} Locations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div 
              key={store.id}
              className={`bg-[#24211D] border rounded-3xl p-5 shadow-xl space-y-4 transition-all ${
                store.isOpen 
                  ? 'border-neutral-800 hover:border-neutral-700' 
                  : 'border-rose-900/40 bg-neutral-900/40 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <span>{store.name}</span>
                    <span className="text-[11px] text-neutral-400 font-sans font-normal">({store.suburb})</span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{store.address}</span>
                  </div>
                </div>

                {/* Open / Closed Toggle Switch */}
                <button
                  onClick={() => onToggleStoreStatus(store.id, !store.isOpen)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    store.isOpen
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{store.isOpen ? 'OPEN' : 'PAUSED'}</span>
                </button>
              </div>

              {/* Delivery and Pickup Times */}
              <div className="bg-[#181614] rounded-2xl p-3.5 border border-neutral-800 text-xs space-y-2">
                {editingStoreId === store.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Pickup Estimate</label>
                        <input
                          type="text"
                          value={editPickupTime}
                          onChange={(e) => setEditPickupTime(e.target.value)}
                          className="w-full bg-[#24211D] border border-neutral-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E06D53]"
                          placeholder="e.g. 15-20 mins"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Delivery Estimate</label>
                        <input
                          type="text"
                          value={editDeliveryTime}
                          onChange={(e) => setEditDeliveryTime(e.target.value)}
                          className="w-full bg-[#24211D] border border-neutral-700 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E06D53]"
                          placeholder="e.g. 35-45 mins"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingStoreId(null)}
                        className="py-1 px-3 bg-neutral-800 text-neutral-300 rounded-lg text-[11px]"
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
                      <div className="text-neutral-300 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Pickup: <strong>{store.pickupTime}</strong> • Delivery: <strong>{store.deliveryTime}</strong></span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
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
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span>Hours: {store.hours}</span>
                <span className="font-mono">{store.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Simulation Data */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-white">Reset Demo Orders & Stock</div>
          <div className="text-xs text-neutral-400">Restore all initial mock orders, customer profiles and menu pricing defaults</div>
        </div>

        <button
          onClick={onResetDemoData}
          className="py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-2xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reload Initial Mock Data</span>
        </button>
      </div>

    </div>
  );
};
