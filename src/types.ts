export type DietaryType = 'veg' | 'vegan' | 'halal' | 'gf' | 'nut-free' | 'dairy-free' | 'spicy' | 'chef-special';

export type SpiceLevel = 'Mild' | 'Medium' | 'Kiwi Hot' | 'Indian Fire 🔥';

export type PizzaSize = 'Regular 10"' | 'Large 12"' | 'Jumbo 15"';

export type PizzaCrust = 
  | 'Hand Tossed Classic' 
  | 'Thin & Crispy' 
  | 'Cheese-Burst Stuffed Crust (+NZD $4.50)' 
  | 'Gluten-Free Base (+NZD $4.00)'
  | 'Garlic Butter Infused Crust (+NZD $2.50)';

export type ProductCategory = 
  | 'all'
  | 'paratha'
  | 'chat'
  | 'rolls'
  | 'kulcha'
  | 'burgers'
  | 'maggi'
  | 'fries'
  | 'rice'
  | 'drinks'
  | 'tiffins'
  | 'tiffin_extras'
  | 'deals'
  | 'subscription';

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  category: 'cheese' | 'meat' | 'veg' | 'sauce';
}

export interface MenuItem {
  id: string;
  name: string;
  tagline?: string;
  category: 'paratha' | 'chat' | 'rolls' | 'kulcha' | 'burgers' | 'maggi' | 'fries' | 'rice' | 'drinks' | 'tiffins' | 'tiffin_extras';
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  dietary?: DietaryType[];
  isPopular?: boolean;
  isChefSpecial?: boolean;
  calories?: string;
  serves?: string;
  customizable?: boolean;
  defaultSpice?: SpiceLevel;
  includedTiers?: string[]; // for tiffins or sets
  isSoldOut?: boolean;
}

export interface CartCustomization {
  size?: PizzaSize;
  crust?: PizzaCrust;
  spiceLevel?: SpiceLevel;
  selectedToppings?: { name: string; price: number }[];
  tiffinMealChoice?: string; // e.g. "Butter Chicken + Yellow Tadka Dal"
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  customization?: CartCustomization;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type OrderMode = 'delivery' | 'pickup';

export interface StoreLocation {
  id: string;
  name: string;
  suburb: string;
  city: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  hours: string;
  pickupTime: string; // e.g. "15-20 min"
  deliveryTime: string; // e.g. "30-45 min"
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  coords: { lat: number; lng: number };
}

export interface ComboDeal {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  price: number;
  originalPrice: number;
  image: string;
  serves: string;
  itemsIncluded: string[];
  description: string;
}

export interface PromoCoupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
}

export interface WeeklySubscriptionPlan {
  id: string;
  title: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  weeklyTotal: number;
  badge?: string;
  description: string;
  features: string[];
  image: string;
}

export type NZPaymentGatewayMethod = 
  | 'windcave_card' // Windcave (DPS) Credit/Debit Card
  | 'online_eftpos'  // Online EFTPOS (Paymark / Worldline NZ) via NZ Banking Apps
  | 'poli_nz'        // POLi Internet Banking NZ (ANZ, ASB, BNZ, Kiwibank, Westpac, TSB)
  | 'afterpay_nz'    // Afterpay NZ (4x fortnightly installments)
  | 'zip_nz'         // Zip NZ (PartPay)
  | 'apple_google_pay' // Apple Pay / Google Pay NZ
  | 'cash_eftpos_delivery'; // Cash or Wireless EFTPOS at door/counter

export interface NZBankOption {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logoText: string;
  supportsOnlineEftpos: boolean;
  supportsPoli: boolean;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  apartmentUnit: string;
  suburb: string;
  city: string;
  postcode: string;
  deliveryNotes: string;
  orderMode: OrderMode;
  storeId: string;
  deliveryTimeType: 'asap' | 'scheduled';
  scheduledTime?: string;
  paymentMethod: NZPaymentGatewayMethod | string;
  paymentGatewayDetails?: {
    gateway: string;
    bankName?: string;
    authCode?: string;
    installmentAmount?: number;
    receiptRef?: string;
  };
  tipAmount: number;
  allergyNotice: string;
}

export type OrderStatus = 'received' | 'kitchen' | 'packed' | 'on_the_way' | 'delivered' | 'cancelled';

export type PaymentMode = 'Cash' | 'Card' | 'Credit';

export interface PlacedOrder {
  orderId: string;
  orderNumber: string;
  createdAt: string;
  customerDetails: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon?: string;
  tip: number;
  gstAmount: number;
  totalAmount: number;
  estimatedDeliveryTime: string;
  status: OrderStatus;
  store: StoreLocation;
  // Payment settlement and accounting fields
  amountPaid?: number; // Actual money handed over / paid by customer
  paymentDifference?: number; // Difference: totalAmount - (amountPaid || 0)
  paymentMode?: PaymentMode | string; // Cash, Card, Credit
  paymentStatus?: 'paid' | 'partial' | 'credit' | 'pending';
  paymentSettledAt?: string;
  settledBy?: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  primaryAddress: string;
  apartmentUnit?: string;
  suburb: string;
  city: string;
  postcode?: string;
  totalOrders: number;
  totalSpent: number;
  firstOrderDate: string;
  lastOrderDate: string;
  isVIP?: boolean;
  dietaryPreferences?: DietaryType[];
  favoriteItems?: string[];
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  role: 'Store General Manager' | 'Head Chef & Kitchen Lead' | 'Dispatch Supervisor';
  email: string;
  storeId: string; // 'all' or branch id
  badgeId: string;
}

export type AdminTabType = 'orders' | 'menu' | 'financials' | 'customers' | 'settings';


