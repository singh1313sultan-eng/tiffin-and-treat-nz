import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  Send, 
  Check,
  UtensilsCrossed
} from 'lucide-react';
import { STORE_LOCATIONS } from '../data/mockData';
import { StoreLocation } from '../types';

interface FooterProps {
  onOpenStoreSelector: () => void;
  onOpenCatering: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectStore: (store: StoreLocation) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStoreSelector,
  onOpenCatering,
  onSelectCategory,
  onSelectStore,
  onOpenAdmin
}) => {
  const [newsEmail, setNewsEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#1E1B18] text-[#EDE6DA] pt-14 pb-8 border-t border-[#38332C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Newsletter & Brand Banner */}
        <div className="bg-[#292522] rounded-3xl p-6 sm:p-8 border border-[#3E3832] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E06D53]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join The Tiffin & Treat Club</span>
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Unlock Secret Chef Specials & Weekly Menus
            </h3>
            <p className="text-xs text-[#A89E91] max-w-md">
              Receive secret weekend chef specials, weekly tiffin menus, and member-only promo codes.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>You're subscribed! Use coupon code <strong>WELCOME15</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  className="px-4 py-3 bg-[#1A1816] border border-[#453F39] rounded-xl text-xs text-white placeholder-[#857B6F] focus:outline-none focus:border-[#E06D53] w-full"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Multi-column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-4">
          
          {/* Col 1: Brand & Values */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E06D53] to-[#C95338] flex items-center justify-center text-white font-serif font-bold text-lg">
                T&T
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white">
                  Tiffin <span className="text-[#E06D53]">&</span> Treat
                </span>
                <span className="text-[10px] font-semibold text-[#8C8275] block">
                  tiffintreat.co.nz
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A89E91] leading-relaxed max-w-sm">
              Crafting wholesome homestyle tiffins, authentic Dum Biryanis, and artisanal fusion pizzas for Kiwi food lovers. Prepared fresh daily using 100% Halal certified meats and free-range NZ dairy.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#C5BBAE] pt-1">
              <div className="flex items-center gap-1 bg-[#292522] px-2.5 py-1 rounded-lg border border-[#3E3832]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Halal Certified</span>
              </div>
              <div className="flex items-center gap-1 bg-[#292522] px-2.5 py-1 rounded-lg border border-[#3E3832]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>NZ Food Safety Verified</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-[#A89E91]">
              <li>
                <button onClick={() => onSelectCategory('tiffins')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Tiffins & Thali Dabbas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pizzas')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Artisanal & Fusion Pizzas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('deals')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Value Combos & Deals
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('biryani')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Dum Biryani Pots
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('starters')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Street Eats & Entrées
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('desserts')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Cheesecakes & Sweet Treats
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Programs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2 text-[#A89E91]">
              <li>
                <button onClick={() => onSelectCategory('subscription')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  5-Day Office Lunch Pass
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('subscription')} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  7-Day Dinner Plan
                </button>
              </li>
              <li>
                <button onClick={onOpenCatering} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Corporate & Event Catering
                </button>
              </li>
              <li>
                <button onClick={onOpenStoreSelector} className="hover:text-[#E06D53] transition-colors cursor-pointer">
                  Click & Collect (Pickup)
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#E06D53] hover:underline font-bold transition-colors cursor-pointer flex items-center gap-1">
                  <span>★ Manager & Kitchen Portal</span>
                </button>
              </li>
              <li>
                <a 
                  href="/swagger" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>⚡ Swagger REST API Docs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Hubs */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Store Locations
            </h4>
            <ul className="space-y-2 text-[#A89E91]">
              {STORE_LOCATIONS.slice(0, 5).map(store => (
                <li key={store.id}>
                  <button
                    onClick={() => onSelectStore(store)}
                    className="hover:text-[#E06D53] transition-colors text-left cursor-pointer"
                  >
                    <span className="font-semibold text-white/90">{store.name}</span>
                    <span className="block text-[11px] text-[#786E60]">{store.suburb}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* NZ Payment Gateways Trust Bar */}
        <div className="p-5 bg-[#25211D] rounded-2xl border border-[#3A332B] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#C5BBAE]">
            <div className="w-6 h-6 rounded-lg bg-emerald-900/80 text-emerald-300 flex items-center justify-center font-mono font-bold text-[10px]">
              NZ
            </div>
            <span className="font-bold text-white">Accepted New Zealand Payment Gateways:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
            <span className="px-2.5 py-1 bg-[#1A1816] rounded-lg border border-[#423B33] text-emerald-400">
              Online EFTPOS (NZ Banks)
            </span>
            <span className="px-2.5 py-1 bg-[#1A1816] rounded-lg border border-[#423B33] text-white">
              Windcave (DPS) 3DS2
            </span>
            <span className="px-2.5 py-1 bg-[#1A1816] rounded-lg border border-[#423B33] text-blue-400">
              POLi Payments NZ
            </span>
            <span className="px-2.5 py-1 bg-[#1A1816] rounded-lg border border-[#423B33] text-[#B2FCE4]">
              Afterpay NZ (Pay in 4)
            </span>
            <span className="px-2.5 py-1 bg-[#1A1816] rounded-lg border border-[#423B33] text-gray-200">
               Pay & GPay
            </span>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-4 border-t border-[#2F2A25] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807669]">
          <div>
            © {new Date().getFullYear()} Tiffin and Treat (NZ) Ltd. All rights reserved. • Domain: <strong>tiffintreat.co.nz</strong> • NZ GST 15% Included
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#E06D53]">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#E06D53]">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-[#E06D53]">NZ Food Safety Regs</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
