import { 
  MenuItem, 
  PlacedOrder, 
  StoreLocation, 
  CustomerRecord, 
  OrderStatus, 
  AdminUser,
  DietaryType,
  PaymentMode 
} from '../types';
import { 
  MENU_ITEMS, 
  STORE_LOCATIONS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS 
} from '../data/mockData';
import { 
  supabase, 
  isSupabaseConfigured 
} from './supabaseClient';

// Registered Staff Accounts for Production Security
export const REGISTERED_STAFF_ACCOUNTS = [
  {
    id: 'staff-gm-9876',
    email: '9876777416',
    phone: '9876777416',
    pin: 'orbit',
    password: 'orbit',
    name: 'Store General Manager',
    role: 'Store General Manager' as const,
    badgeId: '9876777416',
    storeId: 'all'
  },
  {
    id: 'staff-101',
    email: 'manager@tiffintreat.co.nz',
    phone: '0218849200',
    pin: '8899',
    password: 'admin',
    name: 'Aarav Sharma',
    role: 'Store General Manager' as const,
    badgeId: 'NZ-MGR-8821',
    storeId: 'all'
  },
  {
    id: 'staff-102',
    email: 'chef.rakesh@tiffintreat.co.nz',
    phone: '0218849201',
    pin: '5544',
    password: 'chef',
    name: 'Chef Rakesh Nair',
    role: 'Head Chef & Kitchen Lead' as const,
    badgeId: 'NZ-CHEF-3310',
    storeId: 'akl-ponsonby'
  },
  {
    id: 'staff-103',
    email: 'dispatch@tiffintreat.co.nz',
    phone: '0218849202',
    pin: '1122',
    password: 'driver',
    name: 'Tamati Williams',
    role: 'Dispatch Supervisor' as const,
    badgeId: 'NZ-DISP-4409',
    storeId: 'all'
  }
];

// Local in-memory / LocalStorage database for live persistence
const DB_KEYS = {
  CUSTOMERS: 'tt_live_customers',
  ORDERS: 'tt_live_orders',
  MENU: 'tt_live_menu',
  STORES: 'tt_live_stores'
};

const getStored = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStored = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[LiveDB] Could not write ${key}`, e);
  }
};

// ==============================================================================
// 1. CUSTOMER AUTHENTICATION APIS
// ==============================================================================

export interface AuthResponse {
  success: boolean;
  user: CustomerRecord;
  token: string;
  message: string;
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
}

/**
 * Real API: Customer Login
 * Checks database. If user does NOT exist, throws 404 / 401 error.
 */
export const apiLoginCustomer = async (emailOrPhone: string, password?: string): Promise<AuthResponse> => {
  // Simulate network latency (250ms)
  await new Promise(r => setTimeout(r, 250));

  const term = emailOrPhone.trim().toLowerCase();
  if (!term) {
    throw {
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Please provide an email address or NZ mobile phone number.'
    } as ApiErrorResponse;
  }

  // 1. If Supabase is connected, query Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`email.ilike.${term},phone.eq.${term}`)
        .single();

      if (error || !data) {
        throw {
          status: 404,
          code: 'USER_NOT_FOUND',
          message: `Account not found. No registered customer found for "${emailOrPhone}". Please check your details or create a new account.`
        } as ApiErrorResponse;
      }

      const customer: CustomerRecord = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        primaryAddress: data.primary_address,
        apartmentUnit: data.apartment_unit,
        suburb: data.suburb,
        city: data.city,
        postcode: data.postcode,
        totalOrders: Number(data.total_orders),
        totalSpent: Number(data.total_spent),
        firstOrderDate: data.first_order_date,
        lastOrderDate: data.last_order_date,
        isVIP: data.is_vip,
        dietaryPreferences: data.dietary_preferences || [],
        favoriteItems: data.favorite_items || []
      };

      return {
        success: true,
        user: customer,
        token: `jwt-tt-${customer.id}-${Date.now()}`,
        message: `Welcome back, ${customer.name}!`
      };
    } catch (e: any) {
      if (e.status) throw e;
    }
  }

  // 2. Local Database / Mock Customers Query
  const customers = getStored<CustomerRecord[]>(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  const found = customers.find(c => 
    c.email.toLowerCase() === term ||
    c.phone.replace(/\s+/g, '') === term.replace(/\s+/g, '')
  );

  if (!found) {
    throw {
      status: 404,
      code: 'USER_NOT_FOUND',
      message: `Account not found. No registered customer found for "${emailOrPhone}". Please register a new account to continue.`
    } as ApiErrorResponse;
  }

  // Verify password if set
  if (found.password && password && found.password !== password) {
    throw {
      status: 401,
      code: 'INVALID_CREDENTIALS',
      message: 'Incorrect password. Please verify your password and try again.'
    } as ApiErrorResponse;
  }

  return {
    success: true,
    user: found,
    token: `jwt-tt-${found.id}-${Date.now()}`,
    message: `Welcome back, ${found.name}!`
  };
};

/**
 * Real API: Customer Registration
 * Validates unique email and phone. Throws 409 if already exists.
 */
export const apiRegisterCustomer = async (payload: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  primaryAddress: string;
  apartmentUnit?: string;
  suburb: string;
  city: string;
  postcode?: string;
  dietaryPreferences?: DietaryType[];
}): Promise<AuthResponse> => {
  await new Promise(r => setTimeout(r, 300));

  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone.trim();

  if (!payload.name.trim()) {
    throw { status: 400, code: 'INVALID_NAME', message: 'Full name is required.' } as ApiErrorResponse;
  }
  if (!email || !email.includes('@')) {
    throw { status: 400, code: 'INVALID_EMAIL', message: 'A valid email address is required.' } as ApiErrorResponse;
  }
  if (!phone || phone.length < 7) {
    throw { status: 400, code: 'INVALID_PHONE', message: 'A valid NZ mobile number is required (e.g. 021 884 9231).' } as ApiErrorResponse;
  }

  // Check duplicate
  const customers = getStored<CustomerRecord[]>(DB_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  const exists = customers.some(c => 
    c.email.toLowerCase() === email || 
    c.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')
  );

  if (exists) {
    throw {
      status: 409,
      code: 'USER_ALREADY_EXISTS',
      message: `An account with email "${email}" or phone "${phone}" already exists. Please sign in instead.`
    } as ApiErrorResponse;
  }

  const newCustomer: CustomerRecord = {
    id: `cust-${Date.now()}`,
    name: payload.name.trim(),
    email,
    phone,
    password: payload.password || 'password123',
    primaryAddress: payload.primaryAddress.trim() || '142 Ponsonby Road',
    apartmentUnit: payload.apartmentUnit?.trim() || '',
    suburb: payload.suburb || 'Ponsonby',
    city: payload.city || 'Auckland',
    postcode: payload.postcode || '1011',
    totalOrders: 0,
    totalSpent: 0,
    firstOrderDate: new Date().toISOString().slice(0, 10),
    lastOrderDate: new Date().toISOString().slice(0, 10),
    isVIP: false,
    dietaryPreferences: payload.dietaryPreferences || []
  };

  // Persist locally
  setStored(DB_KEYS.CUSTOMERS, [newCustomer, ...customers]);

  // Persist to Supabase if connected
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('customers').insert({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        primary_address: newCustomer.primaryAddress,
        apartment_unit: newCustomer.apartmentUnit || null,
        suburb: newCustomer.suburb,
        city: newCustomer.city,
        postcode: newCustomer.postcode,
        total_orders: 0,
        total_spent: 0,
        first_order_date: newCustomer.firstOrderDate,
        last_order_date: newCustomer.lastOrderDate,
        is_vip: false,
        dietary_preferences: newCustomer.dietaryPreferences
      });
    } catch (e) {
      console.warn('[Supabase] Failed to register customer in cloud', e);
    }
  }

  return {
    success: true,
    user: newCustomer,
    token: `jwt-tt-${newCustomer.id}-${Date.now()}`,
    message: `Account created successfully! Welcome to Tiffin & Treat, ${newCustomer.name}!`
  };
};

// ==============================================================================
// 2. ADMIN & STAFF AUTHENTICATION API
// ==============================================================================

export interface AdminAuthResponse {
  success: boolean;
  adminUser: AdminUser;
  token: string;
  message: string;
}

export const apiAdminLogin = async (
  emailOrId: string, 
  pinOrPassword: string, 
  role: 'Store General Manager' | 'Head Chef & Kitchen Lead' | 'Dispatch Supervisor',
  storeId: string = 'all'
): Promise<AdminAuthResponse> => {
  await new Promise(r => setTimeout(r, 300));

  const query = emailOrId.trim().toLowerCase();
  const pin = pinOrPassword.trim();

  if (!query) {
    throw {
      status: 400,
      code: 'BAD_REQUEST',
      message: 'Please provide your Staff Email or Badge ID.'
    } as ApiErrorResponse;
  }

  // Look up in registered staff
  const staff = REGISTERED_STAFF_ACCOUNTS.find(s => 
    s.email.toLowerCase() === query || 
    s.badgeId.toLowerCase() === query ||
    (s.phone && s.phone.replace(/\s+/g, '') === query.replace(/\s+/g, '')) ||
    s.id.toLowerCase() === query
  );

  // If staff not found
  if (!staff) {
    throw {
      status: 404,
      code: 'STAFF_NOT_FOUND',
      message: `Staff member not found: No employee account registered for "${emailOrId}". Access is restricted to authorized Tiffin & Treat personnel.`
    } as ApiErrorResponse;
  }

  // Validate PIN / Passcode
  const validPins = [staff.pin, staff.password].filter(Boolean);
  if (!validPins.includes(pin)) {
    throw {
      status: 401,
      code: 'INVALID_STAFF_PIN',
      message: `Access Denied: Incorrect Security PIN or password for ${staff.name}. Please check your credentials.`
    } as ApiErrorResponse;
  }

  const authorizedAdmin: AdminUser = {
    id: staff?.id || `staff-${Date.now().toString().slice(-4)}`,
    name: staff?.name || (query.includes('@') ? query.split('@')[0].toUpperCase() : 'Store Manager'),
    role: staff?.role || role,
    email: staff?.email || (query.includes('@') ? query : 'manager@tiffintreat.co.nz'),
    storeId,
    badgeId: staff?.badgeId || `NZ-MGR-${Math.floor(1000 + Math.random() * 9000)}`
  };

  return {
    success: true,
    adminUser: authorizedAdmin,
    token: `staff-token-${authorizedAdmin.badgeId}-${Date.now()}`,
    message: `Authenticated as ${authorizedAdmin.name} (${authorizedAdmin.role})`
  };
};

// ==============================================================================
// 3. MENU ITEMS API
// ==============================================================================

export const apiGetMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const res = await fetch('/api/menu');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setStored(DB_KEYS.MENU, data);
        return data;
      }
    }
  } catch (e) {
    console.warn('[API] /api/menu fetch error', e);
  }
  return getStored<MenuItem[]>(DB_KEYS.MENU, MENU_ITEMS);
};

export const apiToggleSoldOut = async (itemId: string, isSoldOut: boolean): Promise<MenuItem> => {
  await new Promise(r => setTimeout(r, 150));
  const items = getStored<MenuItem[]>(DB_KEYS.MENU, MENU_ITEMS);
  const target = items.find(i => i.id === itemId);
  if (!target) {
    throw { status: 404, code: 'ITEM_NOT_FOUND', message: `Dish ID "${itemId}" not found.` } as ApiErrorResponse;
  }

  const updated: MenuItem = { ...target, isSoldOut };
  setStored(DB_KEYS.MENU, items.map(i => i.id === itemId ? updated : i));

  try {
    await fetch(`/api/menu/${encodeURIComponent(itemId)}/sold-out`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isSoldOut })
    });
  } catch (e) {
    console.warn('[API] Error patching sold out', e);
  }

  if (isSupabaseConfigured() && supabase) {
    await supabase.from('menu_items').update({ is_sold_out: isSoldOut }).eq('id', itemId);
  }

  return updated;
};

export const apiUpdatePrice = async (itemId: string, price: number): Promise<MenuItem> => {
  await new Promise(r => setTimeout(r, 150));
  if (price <= 0) {
    throw { status: 400, code: 'INVALID_PRICE', message: 'Price must be greater than $0.00 NZD.' } as ApiErrorResponse;
  }

  const items = getStored<MenuItem[]>(DB_KEYS.MENU, MENU_ITEMS);
  const target = items.find(i => i.id === itemId);
  if (!target) {
    throw { status: 404, code: 'ITEM_NOT_FOUND', message: `Dish ID "${itemId}" not found.` } as ApiErrorResponse;
  }

  const updated: MenuItem = { ...target, price };
  setStored(DB_KEYS.MENU, items.map(i => i.id === itemId ? updated : i));

  try {
    await fetch(`/api/menu/${encodeURIComponent(itemId)}/price`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price })
    });
  } catch (e) {
    console.warn('[API] Error patching price', e);
  }

  if (isSupabaseConfigured() && supabase) {
    await supabase.from('menu_items').update({ price }).eq('id', itemId);
  }

  return updated;
};

// ==============================================================================
// 4. ORDERS & DISPATCH API
// ==============================================================================

export const apiGetOrders = async (): Promise<PlacedOrder[]> => {
  return getStored<PlacedOrder[]>(DB_KEYS.ORDERS, INITIAL_ORDERS);
};

export const apiSubmitOrder = async (order: PlacedOrder): Promise<{ success: boolean; order: PlacedOrder; orderNumber: string }> => {
  await new Promise(r => setTimeout(r, 350));

  if (!order.items || order.items.length === 0) {
    throw { status: 400, code: 'EMPTY_CART', message: 'Cannot place an order with an empty basket.' } as ApiErrorResponse;
  }
  if (!order.customerDetails.phone) {
    throw { status: 400, code: 'MISSING_PHONE', message: 'Customer contact phone number is required for dispatch.' } as ApiErrorResponse;
  }

  // Prepend to orders database
  const orders = getStored<PlacedOrder[]>(DB_KEYS.ORDERS, INITIAL_ORDERS);
  setStored(DB_KEYS.ORDERS, [order, ...orders]);

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
      console.warn('[Supabase] Failed to write order to cloud', e);
    }
  }

  return {
    success: true,
    order,
    orderNumber: order.orderNumber
  };
};

export const apiUpdateOrderStatus = async (orderId: string, status: OrderStatus): Promise<PlacedOrder> => {
  await new Promise(r => setTimeout(r, 150));
  const orders = getStored<PlacedOrder[]>(DB_KEYS.ORDERS, INITIAL_ORDERS);
  const target = orders.find(o => o.orderId === orderId);
  if (!target) {
    throw { status: 404, code: 'ORDER_NOT_FOUND', message: `Order #${orderId} not found.` } as ApiErrorResponse;
  }

  const updated: PlacedOrder = { ...target, status };
  setStored(DB_KEYS.ORDERS, orders.map(o => o.orderId === orderId ? updated : o));

  if (isSupabaseConfigured() && supabase) {
    await supabase.from('orders').update({ status }).eq('order_id', orderId);
  }

  return updated;
};

export const apiUpdateOrderPayment = async (
  orderId: string, 
  amountPaid: number, 
  paymentMode: PaymentMode | string, 
  settledBy: string = 'Staff'
): Promise<PlacedOrder> => {
  await new Promise(r => setTimeout(r, 150));
  const orders = getStored<PlacedOrder[]>(DB_KEYS.ORDERS, INITIAL_ORDERS);
  const targetIndex = orders.findIndex(o => o.orderId === orderId);

  if (targetIndex === -1) {
    throw { status: 404, code: 'ORDER_NOT_FOUND', message: `Order #${orderId} not found.` } as ApiErrorResponse;
  }

  const target = orders[targetIndex];
  const total = Number(target.totalAmount) || 0;
  const difference = Number((total - amountPaid).toFixed(2));
  const paymentStatus = difference <= 0 ? 'paid' : (paymentMode === 'Credit' ? 'credit' : (amountPaid > 0 ? 'partial' : 'pending'));
  const now = new Date().toISOString();

  const updated: PlacedOrder = {
    ...target,
    amountPaid,
    paymentDifference: difference,
    paymentMode,
    paymentStatus,
    paymentSettledAt: now,
    settledBy,
    customerDetails: {
      ...target.customerDetails,
      amountPaid,
      paymentDifference: difference,
      paymentMode,
      paymentStatus
    }
  };

  orders[targetIndex] = updated;
  setStored(DB_KEYS.ORDERS, orders);

  // Sync to REST API
  try {
    await fetch(`/api/orders/${encodeURIComponent(orderId)}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountPaid, paymentMode, settledBy })
    });
  } catch {}

  // Sync to Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: current } = await supabase.from('orders').select('customer_details').eq('order_id', orderId).single();
      const newCust = {
        ...(current?.customer_details || {}),
        amountPaid,
        paymentDifference: difference,
        paymentMode,
        paymentStatus,
        paymentSettledAt: now,
        settledBy
      };
      await supabase.from('orders').update({ customer_details: newCust }).eq('order_id', orderId);
    } catch (e) {
      console.warn('[Supabase] Failed to write payment update to cloud', e);
    }
  }

  return updated;
};
