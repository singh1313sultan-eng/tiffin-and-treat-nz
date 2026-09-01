import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Percent, 
  Check, 
  AlertCircle, 
  Flame, 
  Sparkles,
  Layers,
  Truck
} from 'lucide-react';
import { CartItem, OrderMode, StoreLocation, MenuItem } from '../types';
import { MENU_ITEMS, PROMO_COUPONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onQuickAddItem: (item: MenuItem) => void;
  orderMode: OrderMode;
  selectedStore: StoreLocation;
  appliedCoupon: string;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  discountAmount: number;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onQuickAddItem,
  orderMode,
  selectedStore,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
  onProceedToCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderMode === 'delivery' ? (subtotal >= 60 ? 0 : selectedStore.deliveryFee) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const gstAmount = total * 0.15; // 15% NZ GST included

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponSuccess(`Coupon ${couponInput.trim().toUpperCase()} applied successfully!`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code or minimum order threshold not met.');
    }
  };

  // Upsell items (sides & drinks)
  const upsellItems = MENU_ITEMS.filter(item => 
    (item.id === 'side-cheesy-garlic-naan-sticks' || 
     item.id === 'drink-alphonso-mango-lassi' || 
     item.id === 'dessert-molten-lava-cake' ||
     item.id === 'side-samosa-chaat') &&
    !items.some(cartItem => cartItem.menuItem.id === item.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8E0D2]">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-[#EBE3D5] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#1E1B18]">
                  Your Food Basket
                </h2>
                <div className="text-[11px] text-[#706658]">
                  {orderMode === 'delivery' ? `Delivery via ${selectedStore.name}` : `Pickup from ${selectedStore.name}`}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#E2D8C9] flex items-center justify-center text-[#706658] hover:text-[#1E1B18] hover:bg-[#F2ECE1] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Delivery threshold progress bar */}
          {orderMode === 'delivery' && (
            <div className="bg-[#F5EFE6] px-5 py-2.5 border-b border-[#E8E0D2] text-xs">
              {subtotal >= 60 ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Congratulations! You unlocked <strong>FREE Delivery</strong> 🎉</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#5A5043]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#E06D53]" />
                      <span>Add <strong>NZD ${(60 - subtotal).toFixed(2)}</strong> more for FREE delivery</span>
                    </span>
                    <span className="font-bold">{Math.round((subtotal / 60) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#E2D8C9] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#E06D53] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 60) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Items List Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div className="font-serif font-bold text-lg text-[#1E1B18]">
                  Your basket is empty
                </div>
                <p className="text-xs text-[#706658] max-w-xs mx-auto">
                  Explore our authentic parathas, homestyle tiffins, kulchas, and street snacks to begin your order.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 py-2 px-5 bg-[#E06D53] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => (
                <div 
                  key={cartItem.cartItemId}
                  className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2] flex gap-3 group"
                >
                  <img
                    src={cartItem.menuItem.image}
                    alt={cartItem.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E2D8C9] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1E1B18] leading-tight">
                          {cartItem.menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.cartItemId)}
                          className="text-[#9E9486] hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <div className="text-[11px] text-[#706658] space-y-0.5 mt-1">
                        {cartItem.customization?.size && (
                          <div>Size: <span className="font-semibold text-[#1E1B18]">{cartItem.customization.size}</span></div>
                        )}
                        {cartItem.customization?.crust && (
                          <div className="truncate">Crust: <span className="font-semibold text-[#1E1B18]">{cartItem.customization.crust}</span></div>
                        )}
                        {cartItem.customization?.spiceLevel && (
                          <div className="flex items-center gap-1 text-[#E06D53] font-medium">
                            <Flame className="w-3 h-3" />
                            <span>Spice: {cartItem.customization.spiceLevel}</span>
                          </div>
                        )}
                        {cartItem.customization?.tiffinMealChoice && (
                          <div className="truncate">Choice: <span className="font-medium text-[#1E1B18]">{cartItem.customization.tiffinMealChoice}</span></div>
                        )}
                        {cartItem.customization?.selectedToppings && cartItem.customization.selectedToppings.length > 0 && (
                          <div className="text-[10px] text-[#5A5043] truncate">
                            + {cartItem.customization.selectedToppings.map(t => t.name).join(', ')}
                          </div>
                        )}
                        {cartItem.customization?.specialInstructions && (
                          <div className="text-[10px] italic text-[#8C8275]">
                            Note: "{cartItem.customization.specialInstructions}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price Row */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#E8E0D2]/60">
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-[#E2D8C9]">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#5A5043] hover:text-[#1E1B18]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold text-[#1E1B18] w-3 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#5A5043] hover:text-[#1E1B18]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono font-bold text-xs sm:text-sm text-[#1E1B18]">
                        NZD ${cartItem.totalPrice.toFixed(2)}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}

            {/* Upsell carousel if cart not empty */}
            {items.length > 0 && upsellItems.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A7063] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E06D53]" />
                  <span>Treat Yourself With An Add-on</span>
                </div>

                <div className="space-y-2">
                  {upsellItems.slice(0, 2).map((upsell) => (
                    <div
                      key={upsell.id}
                      className="p-2.5 bg-white border border-[#E8E0D2] rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={upsell.image}
                          alt={upsell.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-xs text-[#1E1B18] truncate">
                            {upsell.name}
                          </div>
                          <div className="font-mono font-bold text-xs text-[#E06D53]">
                            ${upsell.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onQuickAddItem(upsell)}
                        className="py-1 px-2.5 bg-[#FAF0ED] hover:bg-[#E06D53] text-[#C95338] hover:text-white text-xs font-bold rounded-lg border border-[#F0D5CD] transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo coupon input */}
            {items.length > 0 && (
              <div className="pt-2">
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Percent className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="cart-coupon-input"
                        type="text"
                        placeholder="Promo Code (e.g. WELCOME15)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs uppercase font-mono font-semibold text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#211E1B] hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <div className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{couponError}</span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Code <strong>{appliedCoupon}</strong> active (-${discountAmount.toFixed(2)})</span>
                      </div>
                      <button
                        onClick={onRemoveCoupon}
                        className="text-[11px] text-neutral-500 hover:text-red-500 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

          </div>

          {/* Cart Footer / Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8E0D2] bg-[#FAF7F2] space-y-3 shrink-0">
              
              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5A5043]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-[#1E1B18]">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Promo Discount ({appliedCoupon})</span>
                    <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {orderMode === 'delivery' && (
                  <div className="flex items-center justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-mono font-semibold">
                      {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-[#8C8275]">
                  <span>Includes 15% NZ GST</span>
                  <span className="font-mono">${gstAmount.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-[#E2D8C9] flex items-center justify-between text-sm font-bold text-[#1E1B18]">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-[#E06D53]">NZD ${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm rounded-2xl shadow-md shadow-[#E06D53]/25 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <span>${total.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
