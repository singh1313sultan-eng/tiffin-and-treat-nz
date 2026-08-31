import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  Check, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  Sparkles, 
  Truck, 
  Store as StoreIcon, 
  DollarSign, 
  Lock,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CartItem, 
  OrderMode, 
  StoreLocation, 
  CustomerDetails, 
  PlacedOrder,
  NZPaymentGatewayMethod,
  CustomerRecord
} from '../types';
import { NZPaymentGatewaySelector, NZ_BANKS } from './NZPaymentGatewaySelector';
import { NZGatewayProcessorModal } from './NZGatewayProcessorModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderMode: OrderMode;
  selectedStore: StoreLocation;
  deliveryAddress: string;
  appliedCoupon?: string;
  discountAmount: number;
  currentCustomer?: CustomerRecord | null;
  onOpenCustomerAuth?: (mode?: 'login' | 'register') => void;
  onOrderPlaced: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderMode,
  selectedStore,
  deliveryAddress,
  appliedCoupon,
  discountAmount,
  currentCustomer,
  onOpenCustomerAuth,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentCustomer ? currentCustomer.name : 'Sarah Jenkins');
  const [email, setEmail] = useState(currentCustomer ? currentCustomer.email : 'sarah.jenkins@gmail.com');
  const [phone, setPhone] = useState(currentCustomer ? currentCustomer.phone : '021 884 9231');
  const [streetAddress, setStreetAddress] = useState(currentCustomer?.primaryAddress || deliveryAddress || '142 Ponsonby Road');
  const [apartmentUnit, setApartmentUnit] = useState(currentCustomer?.apartmentUnit || 'Apt 4B');
  const [suburb, setSuburb] = useState(currentCustomer?.suburb || selectedStore.suburb || 'Ponsonby');
  const [city, setCity] = useState(currentCustomer?.city || selectedStore.city || 'Auckland');
  const [postcode, setPostcode] = useState(currentCustomer?.postcode || '1011');
  const [deliveryNotes, setDeliveryNotes] = useState('Leave on porch table, please don’t ring bell.');
  const [timeType, setTimeType] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('Today at 6:30 PM');
  
  // NZ Payment Gateway States
  const [paymentMethod, setPaymentMethod] = useState<NZPaymentGatewayMethod>('online_eftpos');
  const [selectedBankId, setSelectedBankId] = useState<string>('anz');
  const [mobileForBank, setMobileForBank] = useState<string>('021 884 9231');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8841');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('382');
  const [tipAmount, setTipAmount] = useState<number>(3.00);
  const [allergyNotice, setAllergyNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGatewayProcessorOpen, setIsGatewayProcessorOpen] = useState(false);
  const [pendingOrderNumber, setPendingOrderNumber] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = orderMode === 'delivery' ? (subtotal >= 60 ? 0 : selectedStore.deliveryFee) : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount);
  const gstAmount = totalAmount * 0.15;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const randomOrderNum = `TT-${Math.floor(100000 + Math.random() * 900000)}`;
    setPendingOrderNumber(randomOrderNum);

    // If payment is Cash/EFTPOS at door, complete directly
    if (paymentMethod === 'cash_eftpos_delivery') {
      finalizeOrder(randomOrderNum, {
        gateway: orderMode === 'delivery' ? 'Cash / Mobile EFTPOS with Driver' : 'Pay at Counter Register',
        authCode: 'CASH-NZD-PENDING',
        receiptRef: `COD-${Date.now().toString().slice(-6)}`
      });
      return;
    }

    // Otherwise, open the interactive NZ Gateway Processor
    setIsGatewayProcessorOpen(true);
  };

  const finalizeOrder = (
    orderNum: string, 
    gatewayMeta?: { gateway: string; bankName?: string; authCode: string; receiptRef: string; installmentAmount?: number }
  ) => {
    setIsSubmitting(true);

    const customerDetails: CustomerDetails = {
      name,
      email,
      phone,
      address: streetAddress,
      apartmentUnit,
      suburb,
      city,
      postcode,
      deliveryNotes,
      orderMode,
      storeId: selectedStore.id,
      deliveryTimeType: timeType,
      scheduledTime: timeType === 'scheduled' ? scheduledTime : undefined,
      paymentMethod,
      paymentGatewayDetails: gatewayMeta,
      tipAmount,
      allergyNotice
    };

    const placedOrder: PlacedOrder = {
      orderId: `order-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerDetails,
      items,
      subtotal,
      deliveryFee,
      discount: discountAmount,
      appliedCoupon,
      tip: tipAmount,
      gstAmount,
      totalAmount,
      estimatedDeliveryTime: orderMode === 'delivery' ? '30 - 40 Mins' : '15 - 20 Mins',
      status: 'received',
      store: selectedStore
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsGatewayProcessorOpen(false);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
      onOrderPlaced(placedOrder);
      onClose();
    }, 600);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-[#EBE3D5] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
                  Checkout & NZ Payment Gateway
                </h2>
                <p className="text-xs text-[#706658]">
                  {orderMode === 'delivery' ? `Delivery via ${selectedStore.name}` : `Pickup at ${selectedStore.name}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#E2D8C9] flex items-center justify-center text-[#706658] hover:text-[#1E1B18] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleStartPayment} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
            
            {/* Section 1: Customer Contact */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#E06D53]" />
                <span>1. Contact Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#706658] mb-1">Full Name</label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#706658] mb-1">NZ Mobile (for SMS driver/bank alerts)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setMobileForBank(e.target.value);
                      }}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#706658] mb-1">Email (for GST invoice & tracking)</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Address / Location */}
            {orderMode === 'delivery' ? (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E06D53]" />
                  <span>2. NZ Delivery Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">Street Address</label>
                    <input
                      id="checkout-address"
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">Apt / Suite / Unit</label>
                    <input
                      id="checkout-unit"
                      type="text"
                      value={apartmentUnit}
                      onChange={(e) => setApartmentUnit(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">Suburb</label>
                    <input
                      id="checkout-suburb"
                      type="text"
                      required
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">City</label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">NZ Postcode</label>
                    <input
                      id="checkout-postcode"
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>

                  <div className="sm:col-span-12">
                    <label className="block text-[11px] font-semibold text-[#706658] mb-1">Driver Delivery Instructions / Gate Code</label>
                    <input
                      id="checkout-delivery-instructions"
                      type="text"
                      placeholder="e.g. Leave on porch table, gate code 1234, call upon arrival"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <StoreIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1E1B18]">
                      Pickup Branch: {selectedStore.name}
                    </div>
                    <div className="text-xs text-[#5A5043]">
                      {selectedStore.address} • Ph: {selectedStore.phone}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Time Slot */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E06D53]" />
                <span>3. Order Timing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeType('asap')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    timeType === 'asap'
                      ? 'border-[#E06D53] bg-[#FAF0ED] text-[#1E1B18] ring-1 ring-[#E06D53]'
                      : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                  }`}
                >
                  <div className="font-bold text-xs">ASAP (Standard Kitchen Queue)</div>
                  <div className="text-[11px] text-[#706658] mt-0.5">
                    {orderMode === 'delivery' ? 'Estimated 30 - 45 mins' : 'Ready in 15 - 20 mins'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeType('scheduled')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    timeType === 'scheduled'
                      ? 'border-[#E06D53] bg-[#FAF0ED] text-[#1E1B18] ring-1 ring-[#E06D53]'
                      : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                  }`}
                >
                  <div className="font-bold text-xs">Schedule For Later</div>
                  <div className="text-[11px] text-[#706658] mt-0.5">Choose lunch or dinner time window</div>
                </button>
              </div>

              {timeType === 'scheduled' && (
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18]"
                >
                  <option value="Today at 12:30 PM">Today at 12:30 PM</option>
                  <option value="Today at 1:00 PM">Today at 1:00 PM</option>
                  <option value="Today at 6:00 PM">Today at 6:00 PM</option>
                  <option value="Today at 6:30 PM">Today at 6:30 PM</option>
                  <option value="Today at 7:00 PM">Today at 7:00 PM</option>
                  <option value="Today at 7:30 PM">Today at 7:30 PM</option>
                  <option value="Today at 8:00 PM">Today at 8:00 PM</option>
                  <option value="Tomorrow at 12:30 PM">Tomorrow at 12:30 PM</option>
                  <option value="Tomorrow at 6:30 PM">Tomorrow at 6:30 PM</option>
                </select>
              )}
            </div>

            {/* Section 4: Allergy & Kitchen Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#706658] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Allergy or Kitchen Notes (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Mild spice, no coriander, extra garlic raita"
                value={allergyNotice}
                onChange={(e) => setAllergyNotice(e.target.value)}
                className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none"
              />
            </div>

            {/* Section 5: Driver & Kitchen Tip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  Driver Tip & Kitchen Appreciation
                </span>
                <span className="text-xs font-mono font-bold text-[#E06D53]">
                  +${tipAmount.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 2.00, 3.00, 5.00].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tipAmount === amount
                        ? 'border-[#E06D53] bg-[#FAF0ED] text-[#E06D53]'
                        : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                    }`}
                  >
                    {amount === 0 ? 'No Tip' : `+$${amount.toFixed(2)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 6: NZ PAYMENT GATEWAYS */}
            <div className="pt-2 border-t border-[#EBE3D5]">
              <NZPaymentGatewaySelector
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                selectedBank={selectedBankId}
                onSelectBank={setSelectedBankId}
                totalAmount={totalAmount}
                mobileNumber={mobileForBank}
                onMobileChange={setMobileForBank}
                cardNumber={cardNumber}
                onCardNumberChange={setCardNumber}
                cardExpiry={cardExpiry}
                onCardExpiryChange={setCardExpiry}
                cardCvc={cardCvc}
                onCardCvcChange={setCardCvc}
                orderMode={orderMode}
              />
            </div>

            {/* Section 7: Summary Table with GST */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2] space-y-2 text-xs text-[#5A5043]">
              <div className="font-serif font-bold text-sm text-[#1E1B18] mb-1 flex items-center justify-between">
                <span>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span className="text-[10px] text-[#706658] font-mono">NZ GST 15% Included</span>
              </div>
              {items.map(item => (
                <div key={item.cartItemId} className="flex justify-between text-[11px]">
                  <span className="truncate pr-2">{item.quantity}x {item.menuItem.name}</span>
                  <span className="font-mono font-semibold text-[#1E1B18]">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E2D8C9] flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({appliedCoupon})</span>
                  <span className="font-mono font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {orderMode === 'delivery' && (
                <div className="flex justify-between">
                  <span>NZ Local Courier Delivery</span>
                  <span className="font-mono font-semibold">
                    {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Staff / Driver Tip</span>
                  <span className="font-mono font-semibold">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-[#706658]">
                <span>Estimated NZ GST (15%)</span>
                <span className="font-mono">${gstAmount.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2D8C9] flex justify-between font-bold text-sm text-[#1E1B18]">
                <span>Total Payable</span>
                <span className="font-mono text-lg text-[#E06D53]">NZD ${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              id="checkout-confirm-pay-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#E06D53] hover:bg-[#D45E44] disabled:opacity-75 text-white font-bold text-base rounded-2xl shadow-lg shadow-[#E06D53]/30 transition-all flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>
                  {paymentMethod === 'online_eftpos' && 'Proceed with Online EFTPOS NZ'}
                  {paymentMethod === 'poli_nz' && 'Proceed to POLi Bank Login'}
                  {paymentMethod === 'windcave_card' && 'Pay via Windcave 3DS2'}
                  {paymentMethod === 'afterpay_nz' && 'Proceed to Afterpay NZ'}
                  {paymentMethod === 'apple_google_pay' && 'Pay with  Pay / GPay'}
                  {paymentMethod === 'cash_eftpos_delivery' && 'Confirm & Pay at Delivery/Counter'}
                </span>
              </span>
              <span className="font-mono font-bold">
                NZD ${totalAmount.toFixed(2)}
              </span>
            </button>

          </form>

        </div>
      </div>

      {/* NZ Gateway Interactive Simulation Modal */}
      <NZGatewayProcessorModal
        isOpen={isGatewayProcessorOpen}
        gatewayMethod={paymentMethod}
        selectedBankId={selectedBankId}
        totalAmount={totalAmount}
        mobileNumber={mobileForBank}
        customerName={name}
        orderNumber={pendingOrderNumber}
        onSuccess={(gatewayMeta) => finalizeOrder(pendingOrderNumber, gatewayMeta)}
        onCancel={() => setIsGatewayProcessorOpen(false)}
      />
    </>
  );
};
