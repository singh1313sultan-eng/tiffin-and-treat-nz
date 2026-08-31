import React, { useState } from 'react';
import { 
  CustomerRecord, 
  PlacedOrder, 
  CartItem, 
  DietaryType 
} from '../../types';
import { NZ_SUBURBS_LIST } from '../../data/mockData';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Clock, 
  LogOut, 
  X, 
  Edit3, 
  Check, 
  Star, 
  Sparkles, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerRecord;
  orders: PlacedOrder[];
  onUpdateCustomer: (updated: CustomerRecord) => void;
  onLogout: () => void;
  onReorderItems: (items: CartItem[]) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  customer,
  orders,
  onUpdateCustomer,
  onLogout,
  onReorderItems
}) => {
  if (!isOpen) return null;

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(customer.primaryAddress);
  const [suburb, setSuburb] = useState(customer.suburb);
  const [city, setCity] = useState(customer.city);
  const [phone, setPhone] = useState(customer.phone);

  const customerOrders = orders.filter(o => 
    o.customerDetails.email.toLowerCase() === customer.email.toLowerCase() ||
    o.customerDetails.phone === customer.phone
  );

  const handleSaveProfile = () => {
    onUpdateCustomer({
      ...customer,
      primaryAddress: address,
      suburb,
      city,
      phone
    });
    setIsEditingAddress(false);
  };

  const handleReorder = (order: PlacedOrder) => {
    onReorderItems(order.items);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#1E1B18] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D2] p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Top Header with Avatar and Logout */}
        <div className="flex items-start justify-between border-b border-[#E8E0D2] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-lg">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1E1B18]">
                  {customer.name}
                </h2>
                {customer.isVIP && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                    ★ VIP Patron
                  </span>
                )}
              </div>
              <div className="text-xs text-[#706658] mt-0.5">
                Member since {customer.firstOrderDate} • <span className="font-semibold text-emerald-800">{customerOrders.length} orders placed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 border border-rose-200 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customer Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E0D2] text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">Lifetime Orders</div>
            <div className="font-mono text-xl font-bold text-[#1E1B18] mt-0.5">{customer.totalOrders}</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E0D2] text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">Total NZD Spend</div>
            <div className="font-mono text-xl font-bold text-emerald-700 mt-0.5">${customer.totalSpent.toFixed(2)}</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E0D2] text-center shadow-xs">
            <div className="text-[10px] font-bold uppercase text-[#8C8275]">Rewards Credit</div>
            <div className="font-mono text-xl font-bold text-[#E06D53] mt-0.5">$10.00</div>
          </div>
        </div>

        {/* Contact & Saved Address Details */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E0D2] space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#1E1B18] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E06D53]" />
              <span>Default Delivery Address & Contact</span>
            </h3>
            {!isEditingAddress ? (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-xs text-[#E06D53] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Address</span>
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            )}
          </div>

          {!isEditingAddress ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#4A4237]">
              <div>
                <span className="text-[#8C8275] block text-[10px] uppercase font-bold">Delivery Address:</span>
                <span className="font-medium text-black">{customer.primaryAddress}, {customer.suburb}, {customer.city}</span>
              </div>
              <div>
                <span className="text-[#8C8275] block text-[10px] uppercase font-bold">Contact Phone & Email:</span>
                <span className="font-medium text-black">{customer.phone} • {customer.email}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="text-[10px] text-[#8C8275] uppercase font-bold">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#8C8275] uppercase font-bold">Suburb</label>
                <select
                  value={suburb}
                  onChange={(e) => setSuburb(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                >
                  {NZ_SUBURBS_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#8C8275] uppercase font-bold">Mobile Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Past Orders History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[#1E1B18] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E06D53]" />
              <span>Past Orders & Re-order</span>
            </h3>
            <span className="text-xs text-[#706658]">{customerOrders.length} Total Orders</span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {customerOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#E8E0D2] space-y-2">
                <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs text-[#706658]">No previous online orders found. Place your first order today!</p>
              </div>
            ) : (
              customerOrders.map(order => (
                <div 
                  key={order.orderId}
                  className="bg-white rounded-2xl p-4 border border-[#E8E0D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#1E1B18]">#{order.orderNumber}</span>
                      <span className="text-[10px] text-[#8C8275]">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#4A4237]">
                      {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </div>
                    <div className="text-[11px] text-[#8C8275]">
                      Total: <strong className="text-emerald-800 font-mono">${order.totalAmount.toFixed(2)}</strong> ({order.customerDetails.orderMode})
                    </div>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="py-2 px-3.5 bg-[#FAF0ED] hover:bg-[#E06D53] text-[#C95338] hover:text-white font-bold text-xs rounded-xl border border-[#F0D5CD] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Re-order to Cart</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
