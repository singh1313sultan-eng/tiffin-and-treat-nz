import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  MenuItem, 
  PlacedOrder, 
  StoreLocation, 
  CustomerRecord, 
  OrderStatus 
} from '../types';
import { 
  MENU_ITEMS, 
  STORE_LOCATIONS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS 
} from '../data/mockData';

// Local storage cache keys for offline-first operation
const LS_KEYS = {
  MENU: 'tt_menu_items_tnt_live_v3',
  ORDERS: 'tt_orders_v2',
  CUSTOMERS: 'tt_customers_v2',
  STORES: 'tt_stores_v3',
  SETTINGS: 'tt_settings_v2'
};

// Helper to safely read from LocalStorage
const getLocalStorageData = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Helper to safely write to LocalStorage
const setLocalStorageData = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[LocalStorage] Failed to cache key "${key}"`, e);
  }
};

// ==============================================================================
// Broadcast channel for instantaneous cross-tab & component synchronization
const menuBroadcastChannel = typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined' 
  ? new BroadcastChannel('tnt_menu_sync') 
  : null;

export const broadcastMenuUpdate = () => {
  try {
    if (menuBroadcastChannel) {
      menuBroadcastChannel.postMessage({ type: 'MENU_UPDATED', timestamp: Date.now() });
    }
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tnt-menu-updated'));
  }
};

// ==============================================================================
// 1. MENU ITEMS API
// ==============================================================================

export const dbFetchMenuItems = async (): Promise<MenuItem[]> => {
  // 1. Primary Source of Truth: Supabase Cloud Database
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');

      if (!error && data && data.length > 0) {
        const formatted: MenuItem[] = data.map(row => {
          const defaultItem = MENU_ITEMS.find(m => m.id === row.id);
          return {
            id: row.id,
            name: row.name,
            tagline: row.tagline || defaultItem?.tagline || '',
            category: row.category as any,
            price: Number(row.price),
            originalPrice: row.original_price ? Number(row.original_price) : defaultItem?.originalPrice,
            description: row.description || defaultItem?.description || '',
            image: row.image || defaultItem?.image || '',
            dietary: row.dietary || [],
            isPopular: row.is_popular ?? row.is_bestseller ?? defaultItem?.isPopular ?? false,
            isChefSpecial: row.is_chef_special ?? row.is_featured ?? defaultItem?.isChefSpecial ?? false,
            calories: row.calories ? (typeof row.calories === 'number' ? `${row.calories} kcal` : row.calories) : defaultItem?.calories,
            serves: row.serves || defaultItem?.serves || '1 person',
            customizable: row.customizable ?? defaultItem?.customizable ?? true,
            isSoldOut: row.is_sold_out || false,
            includedTiers: defaultItem?.includedTiers
          };
        });

        // Maintain menu ordering: if items exist in MENU_ITEMS, preserve that sequence
        formatted.sort((a, b) => {
          const idxA = MENU_ITEMS.findIndex(m => m.id === a.id);
          const idxB = MENU_ITEMS.findIndex(m => m.id === b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.name.localeCompare(b.name);
        });

        setLocalStorageData(LS_KEYS.MENU, formatted);
        return formatted;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch menu items from cloud, checking fallback', e);
    }
  }

  // 2. Secondary fallback: Local REST API endpoint or static JSON
  try {
    const apiRes = await fetch('/api/menu');
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocalStorageData(LS_KEYS.MENU, data);
        return data;
      }
    }
  } catch (e) {
    console.warn('[API] /api/menu not reachable, checking static data', e);
  }

  try {
    const staticRes = await fetch('/data/menu.json');
    if (staticRes.ok) {
      const data = await staticRes.json();
      if (Array.isArray(data) && data.length > 0) {
        setLocalStorageData(LS_KEYS.MENU, data);
        return data;
      }
    }
  } catch (e) {}

  return getLocalStorageData(LS_KEYS.MENU, MENU_ITEMS);
};

export const dbAddMenuItem = async (item: MenuItem): Promise<void> => {
  // Always update local cache for zero perceived latency
  const cached = getLocalStorageData<MenuItem[]>(LS_KEYS.MENU, MENU_ITEMS);
  setLocalStorageData(LS_KEYS.MENU, [item, ...cached.filter(i => i.id !== item.id)]);

  // Push through REST API
  try {
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch (e) {
    console.warn('[API] Could not POST /api/menu', e);
  }

  // Push to Supabase Cloud DB
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('menu_items').insert({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        dietary: item.dietary || [],
        calories: item.calories ? parseInt(item.calories.replace(/\D/g, '')) || null : null,
        is_sold_out: item.isSoldOut || false,
        is_bestseller: !!item.isPopular,
        is_featured: !!item.isChefSpecial
      });
    } catch (e) {
      console.error('[Supabase] Failed to insert menu item to cloud', e);
    }
  }

  broadcastMenuUpdate();
};

export const dbUpdateMenuItem = async (item: MenuItem): Promise<void> => {
  // Always update local cache
  const cached = getLocalStorageData<MenuItem[]>(LS_KEYS.MENU, MENU_ITEMS);
  setLocalStorageData(LS_KEYS.MENU, cached.map(i => i.id === item.id ? item : i));

  // Push through REST API
  try {
    await fetch(`/api/menu/${encodeURIComponent(item.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  } catch (e) {
    console.warn('[API] Could not PUT /api/menu', e);
  }

  // Push to Supabase Cloud DB
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('menu_items').update({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image: item.image,
        dietary: item.dietary || [],
        calories: item.calories ? parseInt(item.calories.replace(/\D/g, '')) || null : null,
        is_sold_out: item.isSoldOut || false,
        is_bestseller: !!item.isPopular,
        is_featured: !!item.isChefSpecial
      }).eq('id', item.id);
    } catch (e) {
      console.error('[Supabase] Failed to update menu item in cloud', e);
    }
  }

  broadcastMenuUpdate();
};

export const dbDeleteMenuItem = async (itemId: string): Promise<void> => {
  const cached = getLocalStorageData<MenuItem[]>(LS_KEYS.MENU, MENU_ITEMS);
  setLocalStorageData(LS_KEYS.MENU, cached.filter(i => i.id !== itemId));

  try {
    await fetch(`/api/menu/${encodeURIComponent(itemId)}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('[API] Could not DELETE /api/menu', e);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('menu_items').delete().eq('id', itemId);
    } catch (e) {
      console.error('[Supabase] Failed to delete menu item from cloud', e);
    }
  }

  broadcastMenuUpdate();
};

export const dbToggleMenuItemSoldOut = async (itemId: string, isSoldOut: boolean): Promise<void> => {
  const cached = getLocalStorageData<MenuItem[]>(LS_KEYS.MENU, MENU_ITEMS);
  setLocalStorageData(LS_KEYS.MENU, cached.map(i => i.id === itemId ? { ...i, isSoldOut } : i));

  try {
    await fetch(`/api/menu/${encodeURIComponent(itemId)}/sold-out`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSoldOut })
    });
  } catch (e) {
    console.warn('[API] Could not PATCH /api/menu/:id/sold-out', e);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('menu_items').update({ is_sold_out: isSoldOut }).eq('id', itemId);
    } catch (e) {
      console.error('[Supabase] Failed to toggle sold out in cloud', e);
    }
  }

  broadcastMenuUpdate();
};

export const dbQuickUpdatePrice = async (itemId: string, price: number): Promise<void> => {
  const cached = getLocalStorageData<MenuItem[]>(LS_KEYS.MENU, MENU_ITEMS);
  setLocalStorageData(LS_KEYS.MENU, cached.map(i => i.id === itemId ? { ...i, price } : i));

  try {
    await fetch(`/api/menu/${encodeURIComponent(itemId)}/price`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price })
    });
  } catch (e) {
    console.warn('[API] Could not PATCH /api/menu/:id/price', e);
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('menu_items').update({ price }).eq('id', itemId);
    } catch (e) {
      console.error('[Supabase] Failed to update price in cloud', e);
    }
  }

  broadcastMenuUpdate();
};

// ==============================================================================
// 2. ORDERS API (Live Kitchen KDS)
// ==============================================================================

export const dbFetchOrders = async (): Promise<PlacedOrder[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: PlacedOrder[] = data.map(row => ({
          orderId: row.order_id,
          orderNumber: row.order_number,
          createdAt: row.created_at,
          customerDetails: row.customer_details,
          items: row.items,
          subtotal: Number(row.subtotal),
          deliveryFee: Number(row.delivery_fee),
          discount: Number(row.discount),
          appliedCoupon: row.applied_coupon,
          tip: Number(row.tip),
          gstAmount: Number(row.gst_amount),
          totalAmount: Number(row.total_amount),
          estimatedDeliveryTime: row.estimated_delivery_time,
          status: row.status as OrderStatus,
          store: row.store_data
        }));
        setLocalStorageData(LS_KEYS.ORDERS, formatted);
        return formatted;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch orders from cloud, using cache', e);
    }
  }

  return getLocalStorageData(LS_KEYS.ORDERS, INITIAL_ORDERS);
};

export const dbCreateOrder = async (order: PlacedOrder): Promise<void> => {
  const cached = getLocalStorageData<PlacedOrder[]>(LS_KEYS.ORDERS, INITIAL_ORDERS);
  setLocalStorageData(LS_KEYS.ORDERS, [order, ...cached]);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('orders').insert({
        order_id: order.orderId,
        order_number: order.orderNumber,
        created_at: order.createdAt,
        customer_details: order.customerDetails,
        items: order.items,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        discount: order.discount,
        applied_coupon: order.appliedCoupon || null,
        tip: order.tip,
        gst_amount: order.gstAmount,
        total_amount: order.totalAmount,
        estimated_delivery_time: order.estimatedDeliveryTime,
        status: order.status,
        store_id: order.store.id,
        store_data: order.store
      });
    } catch (e) {
      console.error('[Supabase] Failed to insert new order to cloud', e);
    }
  }
};

export const dbUpdateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  const cached = getLocalStorageData<PlacedOrder[]>(LS_KEYS.ORDERS, INITIAL_ORDERS);
  setLocalStorageData(LS_KEYS.ORDERS, cached.map(o => o.orderId === orderId ? { ...o, status } : o));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('order_id', orderId);
    } catch (e) {
      console.error('[Supabase] Failed to update order status in cloud', e);
    }
  }
};

// ==============================================================================
// 3. CUSTOMERS & CRM API
// ==============================================================================

export const dbFetchCustomers = async (): Promise<CustomerRecord[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('total_spent', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted: CustomerRecord[] = data.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          primaryAddress: row.primary_address,
          apartmentUnit: row.apartment_unit,
          suburb: row.suburb,
          city: row.city,
          postcode: row.postcode,
          totalOrders: Number(row.total_orders),
          totalSpent: Number(row.total_spent),
          firstOrderDate: row.first_order_date,
          lastOrderDate: row.last_order_date,
          isVIP: row.is_vip,
          dietaryPreferences: row.dietary_preferences || [],
          favoriteItems: row.favorite_items || [],
          notes: row.notes
        }));
        setLocalStorageData(LS_KEYS.CUSTOMERS, formatted);
        return formatted;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch customers from cloud, using cache', e);
    }
  }

  return getLocalStorageData(LS_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
};

export const dbUpsertCustomer = async (customer: CustomerRecord): Promise<void> => {
  const cached = getLocalStorageData<CustomerRecord[]>(LS_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  const existingIdx = cached.findIndex(c => c.id === customer.id || c.email.toLowerCase() === customer.email.toLowerCase());
  if (existingIdx > -1) {
    cached[existingIdx] = customer;
  } else {
    cached.unshift(customer);
  }
  setLocalStorageData(LS_KEYS.CUSTOMERS, cached);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('customers').upsert({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        primary_address: customer.primaryAddress,
        apartment_unit: customer.apartmentUnit || null,
        suburb: customer.suburb,
        city: customer.city,
        postcode: customer.postcode || '1011',
        total_orders: customer.totalOrders,
        total_spent: customer.totalSpent,
        first_order_date: customer.firstOrderDate,
        last_order_date: customer.lastOrderDate,
        is_vip: customer.isVIP || false,
        dietary_preferences: customer.dietaryPreferences || [],
        favorite_items: customer.favoriteItems || [],
        notes: customer.notes || null
      });
    } catch (e) {
      console.error('[Supabase] Failed to upsert customer to cloud', e);
    }
  }
};

export const dbToggleVIP = async (customerId: string, isVIP: boolean): Promise<void> => {
  const cached = getLocalStorageData<CustomerRecord[]>(LS_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  setLocalStorageData(LS_KEYS.CUSTOMERS, cached.map(c => c.id === customerId ? { ...c, isVIP } : c));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('customers').update({ is_vip: isVIP }).eq('id', customerId);
    } catch (e) {
      console.error('[Supabase] Failed to toggle VIP status in cloud', e);
    }
  }
};

export const dbUpdateCustomerNotes = async (customerId: string, notes: string): Promise<void> => {
  const cached = getLocalStorageData<CustomerRecord[]>(LS_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  setLocalStorageData(LS_KEYS.CUSTOMERS, cached.map(c => c.id === customerId ? { ...c, notes } : c));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('customers').update({ notes }).eq('id', customerId);
    } catch (e) {
      console.error('[Supabase] Failed to update customer notes in cloud', e);
    }
  }
};

// ==============================================================================
// 4. STORES & BRANCH HUBS API
// ==============================================================================

export const dbFetchStores = async (): Promise<StoreLocation[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('city', { ascending: true });

      if (!error && data && data.length > 0) {
        const formatted: StoreLocation[] = data.map(row => ({
          id: row.id,
          name: row.name,
          address: row.address,
          suburb: row.suburb,
          city: row.city,
          phone: row.phone || '0212779279',
          secondaryPhone: '0277479279',
          email: row.email || 'orders@tiffintreat.co.nz',
          hours: row.opening_hours || row.hours || '11:00 AM - 10:30 PM (7 Days)',
          pickupTime: row.pickup_time || '15-20 min',
          deliveryTime: row.delivery_time || '30-45 min',
          deliveryFee: Number(row.delivery_fee || 4.99),
          minOrder: Number(row.min_order || 25.00),
          isOpen: row.is_open ?? true,
          coords: row.coords || { lat: -36.8509, lng: 174.7645 }
        }));
        setLocalStorageData(LS_KEYS.STORES, formatted);
        return formatted;
      }
    } catch (e) {
      console.warn('[Supabase] Failed to fetch stores from cloud, using cache', e);
    }
  }

  return getLocalStorageData(LS_KEYS.STORES, STORE_LOCATIONS);
};

export const dbToggleStoreStatus = async (storeId: string, isOpen: boolean): Promise<void> => {
  const cached = getLocalStorageData<StoreLocation[]>(LS_KEYS.STORES, STORE_LOCATIONS);
  setLocalStorageData(LS_KEYS.STORES, cached.map(s => s.id === storeId ? { ...s, isOpen } : s));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('stores').update({ is_open: isOpen }).eq('id', storeId);
    } catch (e) {
      console.error('[Supabase] Failed to update store status in cloud', e);
    }
  }
};

export const dbUpdateStoreTimes = async (storeId: string, pickupTime: string, deliveryTime: string): Promise<void> => {
  const cached = getLocalStorageData<StoreLocation[]>(LS_KEYS.STORES, STORE_LOCATIONS);
  setLocalStorageData(LS_KEYS.STORES, cached.map(s => s.id === storeId ? { ...s, pickupTime, deliveryTime } : s));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('stores').update({ pickup_time: pickupTime, delivery_time: deliveryTime }).eq('id', storeId);
    } catch (e) {
      console.error('[Supabase] Failed to update store times in cloud', e);
    }
  }
};

// ==============================================================================
// 5. GLOBAL STORE ANNOUNCEMENT
// ==============================================================================

export const dbFetchAnnouncementBanner = async (): Promise<string> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'announcement_banner')
        .single();

      if (data && data.value) {
        return data.value;
      }
    } catch (e) {
      // ignore fallback
    }
  }

  return getLocalStorageData(
    LS_KEYS.SETTINGS, 
    '⚡ Free Gulab Jamun Sundae on all orders over NZD $45 across Auckland & Christchurch!'
  );
};

export const dbUpdateAnnouncementBanner = async (banner: string): Promise<void> => {
  setLocalStorageData(LS_KEYS.SETTINGS, banner);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('store_settings').upsert({
        key: 'announcement_banner',
        value: banner
      });
    } catch (e) {
      console.error('[Supabase] Failed to update announcement in cloud', e);
    }
  }
};

// ==============================================================================
// 6. REALTIME WEBSOCKET SUBSCRIPTIONS (Instant Kitchen KDS Sync)
// ==============================================================================

export const dbSubscribeToRealtimeOrders = (
  onOrderReceived: (order: PlacedOrder) => void,
  onOrderStatusUpdated: (orderId: string, status: OrderStatus) => void
) => {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  const channel = supabase
    .channel('realtime_orders_kds')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const row = payload.new;
        const newOrder: PlacedOrder = {
          orderId: row.order_id,
          orderNumber: row.order_number,
          createdAt: row.created_at,
          customerDetails: row.customer_details,
          items: row.items,
          subtotal: Number(row.subtotal),
          deliveryFee: Number(row.delivery_fee),
          discount: Number(row.discount),
          appliedCoupon: row.applied_coupon,
          tip: Number(row.tip),
          gstAmount: Number(row.gst_amount),
          totalAmount: Number(row.total_amount),
          estimatedDeliveryTime: row.estimated_delivery_time,
          status: row.status as OrderStatus,
          store: row.store_data
        };
        onOrderReceived(newOrder);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => {
        const row = payload.new;
        onOrderStatusUpdated(row.order_id, row.status as OrderStatus);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const dbSubscribeToRealtimeMenu = (
  onMenuUpdated: () => void
) => {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  const channel = supabase
    .channel('realtime_menu_stock')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'menu_items' },
      () => {
        onMenuUpdated();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
