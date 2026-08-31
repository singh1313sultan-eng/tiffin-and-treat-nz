/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  MenuItem, 
  ProductCategory, 
  DietaryType, 
  OrderMode, 
  StoreLocation, 
  CartItem, 
  ComboDeal, 
  WeeklySubscriptionPlan, 
  PlacedOrder,
  CustomerRecord,
  OrderStatus,
  AdminUser
} from './types';
import { 
  MENU_ITEMS, 
  STORE_LOCATIONS, 
  PROMO_COUPONS, 
  COMBO_DEALS,
  WEEKLY_SUBSCRIPTION_PLANS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS
} from './data/mockData';
import {
  dbFetchMenuItems,
  dbAddMenuItem,
  dbUpdateMenuItem,
  dbDeleteMenuItem,
  dbToggleMenuItemSoldOut,
  dbQuickUpdatePrice,
  dbFetchOrders,
  dbCreateOrder,
  dbUpdateOrderStatus,
  dbFetchCustomers,
  dbUpsertCustomer,
  dbToggleVIP,
  dbUpdateCustomerNotes,
  dbFetchStores,
  dbToggleStoreStatus,
  dbUpdateStoreTimes,
  dbFetchAnnouncementBanner,
  dbUpdateAnnouncementBanner,
  dbSubscribeToRealtimeOrders,
  dbSubscribeToRealtimeMenu
} from './services/dbService';

// Component imports
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MenuFilterBar } from './components/MenuFilterBar';
import { MenuCard } from './components/MenuCard';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { HalfAndHalfBuilderModal } from './components/HalfAndHalfBuilderModal';
import { OrderTypeSelectorModal } from './components/OrderTypeSelectorModal';
import { DealsSection } from './components/DealsSection';
import { WeeklySubscriptionSection } from './components/WeeklySubscriptionSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CateringModal } from './components/CateringModal';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { AdminLoginModal } from './components/auth/AdminLoginModal';
import { CustomerProfileModal } from './components/auth/CustomerProfileModal';

// Lucide icons
import { 
  Sparkles, 
  Flame, 
  Layers, 
  Pizza, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  Info, 
  CalendarCheck,
  ChefHat,
  Bell,
  User,
  Key
} from 'lucide-react';

export default function App() {
  // Global Operational State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<PlacedOrder[]>(INITIAL_ORDERS);
  const [stores, setStores] = useState<StoreLocation[]>(STORE_LOCATIONS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [announcementBanner, setAnnouncementBanner] = useState<string>(
    '⚡ Free Gulab Jamun Sundae on all orders over NZD $45 across Auckland & Christchurch!'
  );

  // Authentication State - Only load saved user/admin sessions (No hardcoded default login)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerRecord | null>(() => {
    try {
      const saved = localStorage.getItem('tt_current_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('tt_current_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [customerAuthInitialMode, setCustomerAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // App Customer Core State
  const [orderMode, setOrderMode] = useState<OrderMode>('delivery');
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(stores[0]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Ponsonby, Auckland');
  
  // Cart & Active Orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('WELCOME15');
  const [activePlacedOrder, setActivePlacedOrder] = useState<PlacedOrder | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>([]);

  // Modal Triggers
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isHalfAndHalfOpen, setIsHalfAndHalfOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast / Feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load data from Cloud DB / LocalStorage on mount + Setup Realtime listeners
  useEffect(() => {
    dbFetchMenuItems().then(setMenuItems);
    dbFetchOrders().then(setOrders);
    dbFetchCustomers().then(setCustomers);
    dbFetchStores().then(setStores);
    dbFetchAnnouncementBanner().then(setAnnouncementBanner);

    const unsubOrders = dbSubscribeToRealtimeOrders(
      (newOrder) => {
        setOrders(prev => [newOrder, ...prev.filter(o => o.orderId !== newOrder.orderId)]);
        showToast(`🔔 Realtime Order Received: #${newOrder.orderNumber}`);
      },
      (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      }
    );

    const unsubMenu = dbSubscribeToRealtimeMenu(() => {
      dbFetchMenuItems().then(setMenuItems);
    });

    return () => {
      unsubOrders();
      unsubMenu();
    };
  }, []);

  // Auth Handlers
  const handleOpenCustomerAuth = (mode: 'login' | 'register' = 'login') => {
    setCustomerAuthInitialMode(mode);
    setIsCustomerAuthOpen(true);
  };

  const handleCustomerLogin = (customer: CustomerRecord) => {
    setCurrentCustomer(customer);
    try {
      localStorage.setItem('tt_current_customer', JSON.stringify(customer));
    } catch {}
    showToast(`Welcome back, ${customer.name}!`);
  };

  const handleCustomerRegister = (newCustomer: CustomerRecord) => {
    setCustomers(prev => [newCustomer, ...prev]);
    setCurrentCustomer(newCustomer);
    try {
      localStorage.setItem('tt_current_customer', JSON.stringify(newCustomer));
    } catch {}
    dbUpsertCustomer(newCustomer);
    showToast(`Welcome to Tiffin & Treat NZ, ${newCustomer.name}!`);
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    try {
      localStorage.removeItem('tt_current_customer');
    } catch {}
    showToast('Signed out successfully');
  };

  const handleOpenAdminPortal = () => {
    if (currentAdmin) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setIsAdminOpen(true);
    try {
      localStorage.setItem('tt_current_admin', JSON.stringify(admin));
    } catch {}
    showToast(`Staff Authenticated: ${admin.name} (${admin.role})`);
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setIsAdminOpen(false);
    try {
      localStorage.removeItem('tt_current_admin');
    } catch {}
    showToast('Manager session locked & signed out');
  };

  const handleReorderItems = (items: CartItem[]) => {
    items.forEach(item => {
      handleAddToCart(item);
    });
    setIsCartOpen(true);
    showToast('Past order items added to basket!');
  };

  // Active Live Orders Count for Kitchen Badge
  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
  }, [orders]);

  // Menu Management Handlers
  const handleAddItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    dbAddMenuItem(newItem);
    showToast(`"${newItem.name}" added to menu!`);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    dbUpdateMenuItem(updatedItem);
    showToast(`"${updatedItem.name}" updated!`);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== itemId));
    dbDeleteMenuItem(itemId);
    showToast('Dish removed from menu');
  };

  const handleToggleSoldOut = (itemId: string, isSoldOut: boolean) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, isSoldOut } : i));
    dbToggleMenuItemSoldOut(itemId, isSoldOut);
    showToast(`Dish marked ${isSoldOut ? 'SOLD OUT' : 'AVAILABLE'}`);
  };

  const handleQuickUpdatePrice = (itemId: string, newPrice: number) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, price: newPrice } : i));
    dbQuickUpdatePrice(itemId, newPrice);
    showToast(`Price updated to NZD $${newPrice.toFixed(2)}`);
  };

  // Order Management Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    if (activePlacedOrder && activePlacedOrder.orderId === orderId) {
      setActivePlacedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    dbUpdateOrderStatus(orderId, newStatus);
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'cancelled');
  };

  // Customer CRM Handlers
  const handleToggleVIP = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    const newVIP = cust ? !cust.isVIP : true;
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, isVIP: newVIP } : c));
    dbToggleVIP(customerId, newVIP);
  };

  const handleUpdateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, notes } : c));
    dbUpdateCustomerNotes(customerId, notes);
  };

  // Store Management Handlers
  const handleToggleStoreStatus = (storeId: string, isOpen: boolean) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, isOpen } : s));
    dbToggleStoreStatus(storeId, isOpen);
  };

  const handleUpdateStoreTimes = (storeId: string, pickupTime: string, deliveryTime: string) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, pickupTime, deliveryTime } : s));
    dbUpdateStoreTimes(storeId, pickupTime, deliveryTime);
  };

  const handleUpdateAnnouncement = (msg: string) => {
    setAnnouncementBanner(msg);
    dbUpdateAnnouncementBanner(msg);
  };

  const handleResetDemoData = () => {
    setMenuItems(MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setStores(STORE_LOCATIONS);
    setCustomers(INITIAL_CUSTOMERS);
    showToast('Demo data reloaded');
  };

  // Calculate Discount Amount
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const coupon = PROMO_COUPONS.find(c => c.code === appliedCoupon);
    if (!coupon) return 0;
    if (subtotal < coupon.minOrder) return 0;
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    }
    return coupon.discountValue;
  }, [appliedCoupon, subtotal]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTag = item.tagline?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // 2. Category Filter
      if (activeCategory !== 'all' && activeCategory !== 'deals' && activeCategory !== 'subscription') {
        if (item.category !== activeCategory) return false;
      }

      // 3. Dietary Filters
      if (selectedDietary.length > 0) {
        const hasAllDietary = selectedDietary.every(d => item.dietary.includes(d));
        if (!hasAllDietary) return false;
      }

      return true;
    });
  }, [menuItems, searchQuery, activeCategory, selectedDietary]);

  // Cart Operations
  const handleAddToCart = (itemToAdd: CartItem) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.menuItem.id === itemToAdd.menuItem.id &&
        JSON.stringify(item.customization) === JSON.stringify(itemToAdd.customization)
      );

      if (existingIdx > -1) {
        const next = [...prev];
        const updated = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + itemToAdd.quantity,
          totalPrice: next[existingIdx].totalPrice + itemToAdd.totalPrice
        };
        next[existingIdx] = updated;
        return next;
      } else {
        return [...prev, itemToAdd];
      }
    });

    showToast(`Added "${itemToAdd.menuItem.name}" to your order!`);
  };

  const handleQuickAdd = (menuItem: MenuItem) => {
    const cartItem: CartItem = {
      cartItemId: `${menuItem.id}-${Date.now()}`,
      menuItem,
      unitPrice: menuItem.price,
      quantity: 1,
      totalPrice: menuItem.price
    };
    handleAddToCart(cartItem);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const handleApplyCoupon = (code: string): boolean => {
    const found = PROMO_COUPONS.find(c => c.code === code);
    if (!found) return false;
    if (subtotal < found.minOrder) return false;
    setAppliedCoupon(code);
    showToast(`Coupon ${code} activated!`);
    return true;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    showToast('Coupon removed');
  };

  // Add Combo Deal to Cart
  const handleAddComboToCart = (deal: ComboDeal) => {
    const comboMenuItem: MenuItem = {
      id: `combo-${deal.id}`,
      name: deal.title,
      tagline: deal.tagline,
      category: 'tiffins',
      description: deal.itemsIncluded.join(', '),
      price: deal.price,
      originalPrice: deal.originalPrice,
      image: deal.image,
      dietary: ['halal', 'chef-special'],
      customizable: false
    };

    const cartItem: CartItem = {
      cartItemId: `deal-${deal.id}-${Date.now()}`,
      menuItem: comboMenuItem,
      unitPrice: deal.price,
      quantity: 1,
      totalPrice: deal.price
    };

    handleAddToCart(cartItem);
    setIsCartOpen(true);
  };

  // Add Weekly Subscription to Cart
  const handleSelectSubscriptionPlan = (
    plan: WeeklySubscriptionPlan,
    preferences: { dietary: string; timeSlot: string; startDay: string }
  ) => {
    const subMenuItem: MenuItem = {
      id: `sub-${plan.id}`,
      name: `Weekly Plan: ${plan.title}`,
      tagline: `${plan.mealsPerWeek} Hot Meals Delivered Weekly`,
      category: 'tiffins',
      description: `${preferences.dietary} • Time: ${preferences.timeSlot} • Begins: ${preferences.startDay}`,
      price: plan.weeklyTotal,
      image: plan.image,
      dietary: ['chef-special', 'halal'],
      customizable: false
    };

    const cartItem: CartItem = {
      cartItemId: `sub-${plan.id}-${Date.now()}`,
      menuItem: subMenuItem,
      customization: {
        specialInstructions: `${preferences.dietary} | ${preferences.timeSlot} | ${preferences.startDay}`
      },
      unitPrice: plan.weeklyTotal,
      quantity: 1,
      totalPrice: plan.weeklyTotal
    };

    handleAddToCart(cartItem);
    setIsCartOpen(true);
  };

  // Customizer Trigger
  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizerOpen(true);
  };

  // Toggle Dietary
  const handleToggleDietary = (dietary: DietaryType) => {
    setSelectedDietary(prev => 
      prev.includes(dietary) ? prev.filter(d => d !== dietary) : [...prev, dietary]
    );
  };

  const handleOrderPlaced = (order: PlacedOrder) => {
    setActivePlacedOrder(order);
    setOrders(prev => [order, ...prev]);
    dbCreateOrder(order);

    // Update Customer CRM record
    setCustomers(prev => {
      const existingIdx = prev.findIndex(c => 
        c.email.toLowerCase() === order.customerDetails.email.toLowerCase() ||
        c.phone === order.customerDetails.phone
      );

      let updatedCust: CustomerRecord;

      if (existingIdx > -1) {
        const next = [...prev];
        const c = next[existingIdx];
        updatedCust = {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + order.totalAmount,
          lastOrderDate: new Date().toISOString().slice(0, 10),
          primaryAddress: `${order.customerDetails.address}, ${order.customerDetails.apartmentUnit ? order.customerDetails.apartmentUnit + ', ' : ''}${order.customerDetails.suburb}`
        };
        next[existingIdx] = updatedCust;
        dbUpsertCustomer(updatedCust);
        return next;
      } else {
        updatedCust = {
          id: `cust-${Date.now()}`,
          name: order.customerDetails.name,
          email: order.customerDetails.email,
          phone: order.customerDetails.phone,
          primaryAddress: `${order.customerDetails.address}, ${order.customerDetails.apartmentUnit ? order.customerDetails.apartmentUnit + ', ' : ''}${order.customerDetails.suburb}`,
          suburb: order.customerDetails.suburb,
          city: order.customerDetails.city,
          totalOrders: 1,
          totalSpent: order.totalAmount,
          firstOrderDate: new Date().toISOString().slice(0, 10),
          lastOrderDate: new Date().toISOString().slice(0, 10),
          isVIP: false,
          favoriteItems: order.items.map(i => i.menuItem.name)
        };
        dbUpsertCustomer(updatedCust);
        return [updatedCust, ...prev];
      }
    });

    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
    showToast(`Order #${order.orderNumber} confirmed & sent to kitchen!`);
  };

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat as ProductCategory);
    const element = document.getElementById('menu-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] selection:bg-[#E06D53] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211E1B] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#3E3832] flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#E06D53]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Optional Storefront Announcement Broadcast Bar */}
      {announcementBanner && (
        <div className="bg-gradient-to-r from-[#E06D53] via-[#D45E44] to-amber-600 text-white text-xs py-2 px-4 text-center font-bold flex items-center justify-center gap-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{announcementBanner}</span>
        </div>
      )}

      {/* Main Header / Navigation */}
      <Navbar
        orderMode={orderMode}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        cartItems={cartItems}
        currentCustomer={currentCustomer}
        currentAdmin={currentAdmin}
        onOpenCustomerAuth={handleOpenCustomerAuth}
        onOpenCustomerProfile={() => setIsCustomerProfileOpen(true)}
        onOpenStoreSelector={() => setIsStoreSelectorOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenCatering={() => setIsCateringOpen(true)}
        onOpenSubscription={() => {
          setActiveCategory('subscription');
          const el = document.getElementById('subscription-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdminPortal}
        activeOrdersCount={activeOrdersCount}
        hasActiveOrder={!!activePlacedOrder}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat as ProductCategory)}
      />

      {/* Hero Banner with Fast Address & Mode Selector */}
      <HeroBanner
        orderMode={orderMode}
        onSetOrderMode={setOrderMode}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        onSetDeliveryAddress={(addr) => {
          setDeliveryAddress(addr);
          showToast(`Delivery area updated to ${addr}`);
        }}
        onOpenStoreSelector={() => setIsStoreSelectorOpen(true)}
        onOpenHalfAndHalf={() => setIsHalfAndHalfOpen(true)}
        onScrollToCategory={scrollToCategory}
      />

      {/* Menu Sticky Filter Bar */}
      <MenuFilterBar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        selectedDietary={selectedDietary}
        onToggleDietary={handleToggleDietary}
        onClearDietary={() => setSelectedDietary([])}
        itemCount={filteredMenuItems.length}
      />

      {/* Main Menu Grid Section */}
      <main id="menu-section" className="flex-1 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        
        {/* If user selected 'deals', show Deals prominently */}
        {activeCategory === 'deals' ? (
          <DealsSection
            onAddComboToCart={handleAddComboToCart}
            onApplyCouponCode={(code) => handleApplyCoupon(code)}
            appliedCoupon={appliedCoupon}
          />
        ) : activeCategory === 'subscription' ? (
          <WeeklySubscriptionSection
            onSelectPlan={handleSelectSubscriptionPlan}
          />
        ) : (
          <>
            {/* Quick Half & Half Promo Bar */}
            <div className="bg-gradient-to-r from-[#211E1B] to-[#38322B] rounded-3xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-neutral-700">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#E06D53] text-white flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif font-bold text-lg sm:text-xl">
                    Craving Two Flavors at Once?
                  </div>
                  <div className="text-xs text-neutral-300">
                    Create a customized Half & Half pizza with two independent toppings and recipes.
                  </div>
                </div>
              </div>

              <button
                id="app-open-half-half-btn"
                onClick={() => setIsHalfAndHalfOpen(true)}
                className="py-2.5 px-5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Launch Half & Half Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Cards Grid */}
            {filteredMenuItems.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-[#E8E0D2]">
                <div className="w-12 h-12 rounded-full bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center mx-auto">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1E1B18]">
                  No matching dishes found
                </h3>
                <p className="text-xs text-[#706658] max-w-sm mx-auto">
                  Try clearing your dietary filters or search keywords to view all our tiffins and pizzas.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDietary([]);
                    setActiveCategory('all');
                  }}
                  className="py-2 px-4 bg-[#1E1B18] text-white font-bold text-xs rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    onCustomize={handleOpenCustomizer}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}

            {/* Also include Deals Section below the standard menu */}
            <DealsSection
              onAddComboToCart={handleAddComboToCart}
              onApplyCouponCode={(code) => handleApplyCoupon(code)}
              appliedCoupon={appliedCoupon}
            />

            {/* Also include Weekly Tiffin Subscriptions Section */}
            <WeeklySubscriptionSection
              onSelectPlan={handleSelectSubscriptionPlan}
            />
          </>
        )}

      </main>

      {/* Floating Bottom Quick Cart Sticky Pill on Mobile */}
      {cartItems.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-5 bg-[#E06D53] text-white font-bold text-sm rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer border border-white/20"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>View Basket ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
            </div>
            <span className="font-mono text-base font-bold">
              NZD ${subtotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* Floating Quick Store Manager Button (Desktop & Tablet) */}
      <button
        onClick={handleOpenAdminPortal}
        className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#211E1B] hover:bg-black text-white rounded-full shadow-2xl border border-neutral-700 text-xs font-bold transition-all hover:scale-105 cursor-pointer group"
      >
        <ChefHat className="w-4 h-4 text-[#E06D53] group-hover:rotate-12 transition-transform" />
        <span>{currentAdmin ? `${currentAdmin.name.split(' ')[0]} (Console)` : 'Store Manager Portal'}</span>
        {activeOrdersCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-[#E06D53] text-white text-[10px] font-bold animate-pulse">
            {activeOrdersCount}
          </span>
        )}
      </button>

      {/* Modals & Drawers */}
      <OrderTypeSelectorModal
        isOpen={isStoreSelectorOpen}
        onClose={() => setIsStoreSelectorOpen(false)}
        currentMode={orderMode}
        onSelectMode={setOrderMode}
        selectedStore={selectedStore}
        onSelectStore={(store) => {
          setSelectedStore(store);
          showToast(`Selected store: ${store.name}`);
        }}
        deliveryAddress={deliveryAddress}
        onSelectDeliveryAddress={(addr) => {
          setDeliveryAddress(addr);
          showToast(`Delivery set to: ${addr}`);
        }}
      />

      <ItemCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        item={customizingItem}
        onAddToCart={handleAddToCart}
      />

      <HalfAndHalfBuilderModal
        isOpen={isHalfAndHalfOpen}
        onClose={() => setIsHalfAndHalfOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onQuickAddItem={handleQuickAdd}
        orderMode={orderMode}
        selectedStore={selectedStore}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        discountAmount={discountAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        orderMode={orderMode}
        selectedStore={selectedStore}
        deliveryAddress={deliveryAddress}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        currentCustomer={currentCustomer}
        onOpenCustomerAuth={handleOpenCustomerAuth}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        order={activePlacedOrder}
        onStartNewOrder={() => {
          setIsTrackerOpen(false);
          setActivePlacedOrder(null);
        }}
      />

      <CateringModal
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
      />

      {/* Customer Login & Registration Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        initialMode={customerAuthInitialMode}
        customers={customers}
        onLogin={handleCustomerLogin}
        onRegister={handleCustomerRegister}
      />

      {/* Customer Profile & Past Orders Modal */}
      {currentCustomer && (
        <CustomerProfileModal
          isOpen={isCustomerProfileOpen}
          onClose={() => setIsCustomerProfileOpen(false)}
          customer={currentCustomer}
          orders={orders}
          onUpdateCustomer={(updated) => {
            setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
            setCurrentCustomer(updated);
            showToast('Profile and default address saved!');
          }}
          onLogout={handleCustomerLogout}
          onReorderItems={handleReorderItems}
        />
      )}

      {/* Staff & Admin Manager Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        stores={stores}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Comprehensive Restaurant Admin & Kitchen Portal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentAdmin={currentAdmin}
        onAdminLogout={handleAdminLogout}
        menuItems={menuItems}
        orders={orders}
        stores={stores}
        customers={customers}
        announcementBanner={announcementBanner}
        onUpdateAnnouncementBanner={handleUpdateAnnouncement}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onToggleSoldOut={handleToggleSoldOut}
        onQuickUpdatePrice={handleQuickUpdatePrice}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onCancelOrder={handleCancelOrder}
        onToggleVIP={handleToggleVIP}
        onUpdateCustomerNotes={handleUpdateCustomerNotes}
        onToggleStoreStatus={handleToggleStoreStatus}
        onUpdateStoreTimes={handleUpdateStoreTimes}
        onResetDemoData={handleResetDemoData}
      />

      {/* Rich Sophisticated Footer */}
      <Footer
        onOpenStoreSelector={() => setIsStoreSelectorOpen(true)}
        onOpenCatering={() => setIsCateringOpen(true)}
        onSelectCategory={scrollToCategory}
        onSelectStore={(store) => {
          setSelectedStore(store);
          setIsStoreSelectorOpen(true);
        }}
        onOpenAdmin={handleOpenAdminPortal}
      />

    </div>
  );
}

