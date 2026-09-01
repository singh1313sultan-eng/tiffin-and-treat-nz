import React, { useState } from 'react';
import { 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Clock3, 
  CheckCircle2, 
  Percent
} from 'lucide-react';
import { OrderMode, StoreLocation } from '../types';
import { NZ_SUBURBS_LIST } from '../data/mockData';

interface HeroBannerProps {
  orderMode: OrderMode;
  onSetOrderMode: (mode: OrderMode) => void;
  selectedStore: StoreLocation;
  deliveryAddress: string;
  onSetDeliveryAddress: (address: string) => void;
  onOpenStoreSelector: () => void;
  onScrollToCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  orderMode,
  onSetOrderMode,
  selectedStore,
  deliveryAddress,
  onSetDeliveryAddress,
  onOpenStoreSelector,
  onScrollToCategory
}) => {
  const [addressInput, setAddressInput] = useState(deliveryAddress || '');
  const [filteredSuburbs, setFilteredSuburbs] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddressChange = (text: string) => {
    setAddressInput(text);
    if (text.trim().length > 1) {
      const matches = NZ_SUBURBS_LIST.filter(s => 
        s.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuburbs(matches);
      setShowDropdown(true);
    } else {
      setFilteredSuburbs([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuburb = (suburb: string) => {
    setAddressInput(suburb);
    onSetDeliveryAddress(suburb);
    setShowDropdown(false);
  };

  const handleConfirmAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressInput.trim()) {
      onSetDeliveryAddress(addressInput.trim());
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6] via-[#FAF7F2] to-[#FAF7F2] pt-6 pb-12 sm:pb-16 border-b border-[#EBE3D5]">
      
      {/* Subtle decorative background circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E06D53]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#D97706]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Address / Pickup Box */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E06D53]/10 border border-[#E06D53]/20 text-[#C95338] text-[11px] sm:text-xs font-semibold max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
              <span className="truncate">TNT Menu • Flavours You'll Love • Made Fresh For You!</span>
            </div>

            {/* Desktop Headline & Description */}
            <div className="hidden lg:block space-y-4">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E1B18] tracking-tight leading-[1.15]">
                Fresh. Tasty. Desi. <span className="text-[#E06D53] italic">Always!</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5A5043] font-normal leading-relaxed max-w-2xl">
                From hot butter-glazed stuffed parathas and Amritsari kulchas to authentic homestyle tiffins, crispy street chaat, desi burgers, and slow-simmered masala tea.
              </p>
            </div>

            {/* Compact Mobile Title */}
            <div className="block lg:hidden">
              <h1 className="font-serif text-2xl font-bold text-[#1E1B18] tracking-tight">
                Fresh. Tasty. Desi. <span className="text-[#E06D53]">Always!</span>
              </h1>
            </div>

            {/* Interactive Order Mode & Suburb Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-lg shadow-neutral-900/5 border border-[#E5DCD0] max-w-xl w-full">
              
              {/* Order Mode Toggle Pills */}
              <div className="flex bg-[#F5EFE6] p-1 rounded-xl mb-3">
                <button
                  id="hero-toggle-delivery"
                  onClick={() => onSetOrderMode('delivery')}
                  className={`flex-1 py-2 px-1 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                    orderMode === 'delivery'
                      ? 'bg-white text-[#1E1B18] shadow-xs'
                      : 'text-[#7A7063] hover:text-[#1E1B18]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#E06D53] shrink-0"></span>
                  <span className="truncate">Delivery ({selectedStore.deliveryTime})</span>
                </button>
                <button
                  id="hero-toggle-pickup"
                  onClick={() => onSetOrderMode('pickup')}
                  className={`flex-1 py-2 px-1 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                    orderMode === 'pickup'
                      ? 'bg-white text-[#1E1B18] shadow-xs'
                      : 'text-[#7A7063] hover:text-[#1E1B18]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0"></span>
                  <span className="truncate">Pickup ({selectedStore.pickupTime})</span>
                </button>
              </div>

              {/* Dynamic input according to mode */}
              {orderMode === 'delivery' ? (
                <div className="relative">
                  <form onSubmit={handleConfirmAddress} className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                      <MapPin className="w-4 h-4 text-[#E06D53] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="hero-delivery-suburb-input"
                        type="text"
                        placeholder="Enter NZ suburb (e.g. Ponsonby, CBD)"
                        value={addressInput}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() => { if (addressInput.length > 0) setShowDropdown(true); }}
                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs sm:text-sm text-[#1E1B18] placeholder-[#9E9486] focus:outline-none focus:border-[#E06D53] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      id="hero-delivery-search-btn"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 bg-[#E06D53] hover:bg-[#D45E44] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Find Food</span>
                      <span className="inline sm:hidden">Find</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Suburb autocomplete dropdown */}
                  {showDropdown && filteredSuburbs.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E5DCD0] rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto">
                      <div className="p-1.5 text-[11px] font-bold text-[#8C8275] uppercase px-3">
                        Suggested NZ Suburbs
                      </div>
                      {filteredSuburbs.map((suburb) => (
                        <button
                          key={suburb}
                          type="button"
                          onClick={() => handleSelectSuburb(suburb)}
                          className="w-full text-left px-3.5 py-2 text-xs text-[#2E2923] hover:bg-[#FAF7F2] hover:text-[#E06D53] font-medium flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#A89D8E] shrink-0" />
                            <span className="truncate">{suburb}</span>
                          </span>
                          <span className="text-[10px] text-[#A89D8E] shrink-0">Available</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 sm:p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#2E2923] min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="font-bold truncate">{selectedStore.name}</div>
                      <div className="text-[#706658] text-[11px] truncate">{selectedStore.address}</div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenStoreSelector}
                    id="hero-change-store-btn"
                    className="px-2.5 py-1 text-xs font-semibold text-[#2563EB] bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Promo Coupon pill */}
              <div className="mt-3 pt-2.5 border-t border-[#F0E8DC] flex items-center justify-between gap-1 flex-wrap text-xs text-[#6E6354]">
                <div className="flex items-center gap-1.5 truncate">
                  <Percent className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
                  <span className="text-[11px] sm:text-xs truncate">Use code <strong className="font-mono text-[#1E1B18] bg-[#F5EFE6] px-1 py-0.5 rounded">WELCOME15</strong> for 15% OFF</span>
                </div>
                <button
                  onClick={() => onScrollToCategory('deals')}
                  className="text-xs font-bold text-[#E06D53] hover:underline cursor-pointer shrink-0 ml-auto"
                >
                  Deals →
                </button>
              </div>
            </div>

            {/* Value Props Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4A4237] font-medium truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">100% Halal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4A4237] font-medium truncate">
                <Flame className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
                <span className="truncate">Hot Thermal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4A4237] font-medium truncate">
                <Clock3 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate">Fast 30-Min</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#4A4237] font-medium truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">NZ Free-Range</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Feature Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image Card: Royal 4-Tier Tiffin Box */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
                    alt="Royal Tiffin Box"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-[#E06D53] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    TNT Special Tiffin
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-lg font-serif font-bold">Special Tiffin Feast Tray</div>
                    <div className="text-xs text-white/80 flex items-center justify-between mt-1">
                      <span>4 Hot Rotis • Royal Curry • Jeera Rice & Sweet</span>
                      <span className="font-mono font-bold text-sm text-[#FDE68A]">NZD $17.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Daily Homestyle Tiffins CTA */}
              <div 
                onClick={() => onScrollToCategory('deals')}
                className="absolute -bottom-3 left-2 sm:-bottom-6 sm:-left-6 bg-white p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-[#E8E0D2] flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:border-[#E06D53] hover:shadow-2xl transition-all group max-w-[85%] sm:max-w-xs"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1B18] group-hover:text-[#E06D53] transition-colors flex items-center gap-1">
                    <span>Allo Paratha Combo</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#7A7063]">
                    Paratha + Curd + Pickle + Lassi/Tea • $20
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Weekly Tiffin Subscriptions */}
              <div 
                onClick={() => onScrollToCategory('subscription')}
                className="absolute -top-3 right-2 sm:-top-4 sm:-right-4 bg-[#211E1B] text-white p-2 sm:p-3 rounded-2xl shadow-xl border border-neutral-700 flex items-center gap-2 sm:gap-2.5 cursor-pointer hover:bg-neutral-900 transition-all"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#E06D53] text-white flex items-center justify-center font-bold text-[11px] sm:text-xs">
                  5-Day
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-white">Office Lunch Pass</div>
                  <div className="text-[9px] sm:text-[10px] text-amber-300 font-semibold">$15.50 / meal delivered</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
