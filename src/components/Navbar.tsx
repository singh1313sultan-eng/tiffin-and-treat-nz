import React, { useState } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Search, 
  Sparkles, 
  Menu as MenuIcon, 
  X, 
  PhoneCall, 
  UtensilsCrossed, 
  CalendarCheck,
  Flame,
  ChevronDown,
  ChefHat,
  ShieldAlert,
  User,
  UserCheck,
  LogOut,
  Star
} from 'lucide-react';
import { OrderMode, StoreLocation, CartItem, CustomerRecord, AdminUser } from '../types';

interface NavbarProps {
  orderMode: OrderMode;
  selectedStore: StoreLocation;
  deliveryAddress: string;
  cartItems: CartItem[];
  currentCustomer: CustomerRecord | null;
  currentAdmin: AdminUser | null;
  onOpenCustomerAuth: (mode?: 'login' | 'register') => void;
  onOpenCustomerProfile: () => void;
  onOpenStoreSelector: () => void;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenCatering: () => void;
  onOpenSubscription: () => void;
  onOpenAdmin: () => void;
  activeOrdersCount?: number;
  hasActiveOrder: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  orderMode,
  selectedStore,
  deliveryAddress,
  cartItems,
  currentCustomer,
  currentAdmin,
  onOpenCustomerAuth,
  onOpenCustomerProfile,
  onOpenStoreSelector,
  onOpenCart,
  onOpenTracker,
  onOpenCatering,
  onOpenSubscription,
  onOpenAdmin,
  activeOrdersCount = 0,
  hasActiveOrder,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EBE3D5] transition-all">
      {/* Top micro-bar: NZ announcements & Quick Perks */}
      <div className="bg-[#211E1B] text-[#EDE6DA] text-xs py-1.5 px-3 sm:px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs truncate">
            <span className="inline-flex items-center gap-1 font-medium text-[#E06D53] truncate">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">100% Halal & Free Range</span>
            </span>
            <span className="hidden md:inline text-neutral-400">•</span>
            <span className="hidden md:inline text-neutral-300 truncate">
              Hot Thermal Dabba Delivery Across NZ
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-medium shrink-0">
            {/* Manager / Kitchen Portal link */}
            <button
              id="topbar-admin-btn"
              onClick={onOpenAdmin}
              className="px-2.5 py-0.5 rounded-lg bg-neutral-800 hover:bg-[#E06D53] text-white hover:text-white transition-all cursor-pointer flex items-center gap-1 border border-neutral-700 text-[10px] sm:text-[11px] font-bold shrink-0"
            >
              <ChefHat className="w-3 h-3 text-[#E06D53]" />
              <span className="hidden sm:inline">Admin & Kitchen Portal</span>
              <span className="inline sm:hidden">Admin</span>
              {activeOrdersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E06D53] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button 
              id="header-catering-btn"
              onClick={onOpenCatering}
              className="hover:text-[#E06D53] transition-colors cursor-pointer flex items-center gap-1 hidden sm:flex"
            >
              <UtensilsCrossed className="w-3 h-3 text-[#E06D53]" />
              Corporate & Event Catering
            </button>
            <span className="text-neutral-500 hidden sm:inline">•</span>
            <a 
              href={`tel:${selectedStore.phone}`}
              className="hover:text-[#E06D53] transition-colors flex items-center gap-1 hidden sm:flex"
            >
              <PhoneCall className="w-3 h-3 text-[#E06D53]" />
              {selectedStore.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E06D53] to-[#C95338] flex items-center justify-center text-white shadow-md shadow-[#E06D53]/20 group-hover:scale-105 transition-transform">
                <span className="font-serif font-bold text-xl tracking-tight">T&T</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-xl sm:text-2xl text-[#1E1B18] tracking-tight">
                    Tiffin <span className="text-[#E06D53]">&</span> Treat
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest text-[#8C8275] uppercase px-1.5 py-0.5 bg-[#F2ECE1] rounded">
                    .co.nz
                  </span>
                </div>
                <span className="text-[11px] text-[#786E60] font-medium tracking-normal hidden sm:block">
                  Homestyle Tiffins & Artisanal Pizzas
                </span>
              </div>
            </a>

            {/* Delivery / Pickup Status Pill */}
            <button
              id="navbar-store-selector-trigger"
              onClick={onOpenStoreSelector}
              className="hidden lg:flex items-center gap-3 py-2 px-3.5 bg-white rounded-full border border-[#E5DC CE] border-[#E8E0D2] shadow-xs hover:border-[#E06D53] hover:shadow-sm transition-all text-left group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                orderMode === 'delivery' ? 'bg-[#E06D53]/10 text-[#E06D53]' : 'bg-[#3B82F6]/10 text-[#2563EB]'
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1E1B18]">
                    {orderMode === 'delivery' ? 'Delivery to' : 'Pickup from'}
                  </span>
                  <span className="text-[10px] bg-[#EDE4D5] text-[#5C5346] px-1.5 py-0.2 rounded font-semibold">
                    {orderMode === 'delivery' ? selectedStore.deliveryTime : selectedStore.pickupTime}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#6B6154] font-medium max-w-[200px] truncate">
                  <span className="truncate">
                    {orderMode === 'delivery' ? (deliveryAddress || 'Select Delivery Suburb') : selectedStore.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#A89D8E] group-hover:text-[#E06D53] transition-colors shrink-0" />
                </div>
              </div>
            </button>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-3">
            
            {/* Live Search trigger */}
            <div className="relative hidden md:block">
              {showSearchInput ? (
                <div className="flex items-center bg-white border border-[#E06D53] rounded-full px-3 py-1.5 shadow-xs w-64">
                  <Search className="w-4 h-4 text-[#8C8275] mr-2" />
                  <input
                    id="navbar-search-input"
                    type="text"
                    placeholder="Search tiffins, pizzas, sides..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="w-full text-xs text-[#1E1B18] placeholder-[#9E9486] focus:outline-none"
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); onSearchChange(''); }}
                    className="text-[#9E9486] hover:text-[#1E1B18] text-xs p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="navbar-search-toggle"
                  onClick={() => setShowSearchInput(true)}
                  className="flex items-center gap-2 py-2 px-3 bg-white/80 hover:bg-white text-xs text-[#6B6154] border border-[#E8E0D2] rounded-full hover:border-[#D9CFBF] transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#8C8275]" />
                  <span>Search food...</span>
                </button>
              )}
            </div>

            {/* Customer Auth / Profile Button */}
            {currentCustomer ? (
              <button
                id="navbar-customer-profile-btn"
                onClick={onOpenCustomerProfile}
                className="hidden sm:inline-flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white border border-[#E8E0D2] hover:border-[#E06D53] rounded-full shadow-xs transition-all cursor-pointer group"
                title="View My Account & Past Orders"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentCustomer.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1 text-xs font-bold text-[#1E1B18] group-hover:text-[#E06D53]">
                    <span>{currentCustomer.name.split(' ')[0]}</span>
                    {currentCustomer.isVIP && (
                      <span className="text-amber-500 font-extrabold text-[10px]">★</span>
                    )}
                  </div>
                  <span className="text-[9px] text-emerald-700 font-semibold leading-none">
                    {currentCustomer.totalOrders} orders
                  </span>
                </div>
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  id="navbar-customer-login-btn"
                  onClick={() => onOpenCustomerAuth('login')}
                  className="py-2 px-3 text-xs font-bold text-[#3D372E] hover:text-[#E06D53] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  id="navbar-customer-register-btn"
                  onClick={() => onOpenCustomerAuth('register')}
                  className="py-1.5 px-3 rounded-full text-xs font-bold bg-[#FAF0ED] text-[#E06D53] border border-[#F0D5CD] hover:bg-[#E06D53] hover:text-white transition-all cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Weekly Tiffin Plan button */}
            <button
              id="navbar-subscription-btn"
              onClick={onOpenSubscription}
              className="hidden md:inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full text-xs font-semibold text-[#854D0E] bg-[#FEF3C7] border border-[#FDE68A] hover:bg-[#FDE68A] transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Weekly Tiffin Plan</span>
            </button>

            {/* Live Order Tracker (if active or available) */}
            {hasActiveOrder && (
              <button
                id="navbar-live-tracker-btn"
                onClick={onOpenTracker}
                className="flex items-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm shadow-emerald-600/30 animate-pulse-subtle cursor-pointer hover:opacity-95"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Track Order</span>
                <span className="inline sm:hidden">Live</span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              id="navbar-cart-trigger"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 py-2 px-4 rounded-full bg-[#E06D53] hover:bg-[#D45E44] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#E06D53]/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#211E1B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 border-l border-white/20 pl-2">
                <span>NZD</span>
                <span className="font-bold font-mono text-sm">${cartSubtotal.toFixed(2)}</span>
              </div>
            </button>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#3D372E] bg-white border border-[#E8E0D2] hover:bg-[#F2ECE1] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Quick Location pill */}
        <div className="lg:hidden py-2 border-t border-[#EBE3D5] flex items-center justify-between">
          <button
            onClick={onOpenStoreSelector}
            className="flex items-center gap-2 text-xs font-medium text-[#4A4338] truncate"
          >
            <MapPin className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
            <span className="font-bold text-[#1E1B18] uppercase text-[11px]">
              {orderMode}:
            </span>
            <span className="truncate max-w-[200px] text-[#6B6154]">
              {orderMode === 'delivery' ? (deliveryAddress || 'Set Auckland / NZ Suburb') : selectedStore.name}
            </span>
            <ChevronDown className="w-3 h-3 text-[#8C8275]" />
          </button>

          <span className="text-[11px] font-bold text-[#E06D53] bg-[#E06D53]/10 px-2 py-0.5 rounded-full shrink-0">
            {orderMode === 'delivery' ? selectedStore.deliveryTime : selectedStore.pickupTime}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E0D2] px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="mb-3">
            <div className="flex items-center bg-[#FAF7F2] border border-[#E8E0D2] rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-[#8C8275] mr-2" />
              <input
                type="text"
                placeholder="Search food, curries, pizzas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs text-[#1E1B18] bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')}>
                  <X className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Customer Account block */}
          <div className="mb-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2]">
            {currentCustomer ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1E1B18] flex items-center gap-1">
                      <span>{currentCustomer.name}</span>
                      {currentCustomer.isVIP && <span className="text-amber-500">★</span>}
                    </div>
                    <div className="text-[10px] text-neutral-500">{currentCustomer.phone}</div>
                  </div>
                </div>

                <button
                  onClick={() => { onOpenCustomerProfile(); setMobileMenuOpen(false); }}
                  className="py-1.5 px-3 bg-white border border-[#E8E0D2] rounded-xl text-xs font-bold text-[#E06D53]"
                >
                  My Profile
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-[#706658]">
                  <span>Sign in for saved addresses & rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { onOpenCustomerAuth('login'); setMobileMenuOpen(false); }}
                    className="py-1.5 px-3 bg-white border border-[#E8E0D2] rounded-xl text-xs font-bold text-[#1E1B18]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenCustomerAuth('register'); setMobileMenuOpen(false); }}
                    className="py-1.5 px-3 bg-[#E06D53] text-white rounded-xl text-xs font-bold"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-semibold">
            <button
              onClick={() => { onOpenStoreSelector(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-[#3D372E]"
            >
              <MapPin className="w-4 h-4 text-[#E06D53]" />
              <span>Change Store / Address</span>
            </button>

            <button
              onClick={() => { onOpenSubscription(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#854D0E]"
            >
              <CalendarCheck className="w-4 h-4 text-[#B45309]" />
              <span>Weekly Tiffins</span>
            </button>

            <button
              onClick={() => { onOpenCatering(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-[#3D372E]"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#E06D53]" />
              <span>Catering & Parties</span>
            </button>

            {hasActiveOrder ? (
              <button
                onClick={() => { onOpenTracker(); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
              >
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Live Tracker</span>
              </button>
            ) : (
              <a
                href={`tel:${selectedStore.phone}`}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E0D2] text-[#3D372E]"
              >
                <PhoneCall className="w-4 h-4 text-[#E06D53]" />
                <span>Call Store</span>
              </a>
            )}

            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="col-span-2 flex items-center justify-between p-2.5 rounded-xl bg-[#211E1B] text-white"
            >
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#E06D53]" />
                <span>Store Admin & Kitchen Portal</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#E06D53] text-[10px] font-bold">
                  {activeOrdersCount} Active
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
