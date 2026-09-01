import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Flame, 
  Truck, 
  ShieldCheck, 
  Navigation, 
  Utensils, 
  PackageCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { PlacedOrder } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PlacedOrder | null;
  onStartNewOrder: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  order,
  onStartNewOrder
}) => {
  if (!isOpen || !order) return null;

  // Step simulation: 0: Received, 1: Kitchen, 2: Packed, 3: On the way, 4: Delivered
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [estimatedMinutes, setEstimatedMinutes] = useState(28);

  useEffect(() => {
    // Progress the order status automatically for realistic interactive experience
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(2);
      setEstimatedMinutes(22);
    }, 12000);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(3);
      setEstimatedMinutes(14);
    }, 25000);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(4);
      setEstimatedMinutes(0);
    }, 45000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const steps = [
    {
      title: 'Order Confirmed',
      desc: 'Sent to restaurant kitchen',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      title: 'Cooking in Kitchen',
      desc: 'Clay tandoor & hearth ovens firing',
      icon: <Flame className="w-4 h-4" />
    },
    {
      title: 'Packed in Thermal Dabba',
      desc: 'Sealed hot in insulated containers',
      icon: <PackageCheck className="w-4 h-4" />
    },
    {
      title: order.customerDetails.orderMode === 'delivery' ? 'Driver On The Way' : 'Ready For Collection',
      desc: order.customerDetails.orderMode === 'delivery' ? 'Dispatched with hot bag' : 'At pickup counter',
      icon: <Truck className="w-4 h-4" />
    },
    {
      title: 'Delivered / Enjoy Feast',
      desc: 'Freshly arrived & ready to relish',
      icon: <Utensils className="w-4 h-4" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE3D5] bg-[#211E1B] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E06D53] bg-white/10 px-2 py-0.5 rounded-full">
                Live Food Tracker
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                #{order.orderNumber}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
              {currentStepIndex === 4 ? 'Feast Delivered!' : 'Your Order is in Progress'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          
          {/* Estimated Time Card */}
          <div className="bg-[#FAF0ED] border border-[#F0D5CD] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#E06D53] text-white flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#C95338]">
                  Estimated Delivery Arrival
                </div>
                <div className="font-serif font-extrabold text-2xl text-[#1E1B18]">
                  {estimatedMinutes > 0 ? `~${estimatedMinutes} Minutes` : 'Delivered Just Now'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#E06D53] bg-white px-3 py-1 rounded-full border border-[#F0D5CD]">
                {order.customerDetails.orderMode.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#706658]">
              Live Progress Status
            </div>

            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isPending = idx > currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center gap-3.5 transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/10'
                        : isCompleted
                        ? 'bg-[#FAF7F2] border-[#E8E0D2] opacity-80'
                        : 'bg-white border-neutral-200 opacity-40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white animate-bounce'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {step.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs sm:text-sm font-bold ${
                        isCurrent ? 'text-emerald-950' : 'text-[#1E1B18]'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-[#706658] truncate">
                        {step.desc}
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md shrink-0">
                        In Real-time
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Simulated NZ Map Route */}
          <div className="rounded-2xl border border-[#E8E0D2] overflow-hidden bg-[#EAE5DC] relative h-44 shadow-inner">
            {/* SVG simulated street map */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5B9A5_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Road lines */}
            <svg className="absolute inset-0 w-full h-full stroke-[#C9BDAB] stroke-[4]" fill="none">
              <path d="M 40 120 Q 150 40 300 100 T 550 60" />
              <path d="M 120 180 Q 220 100 400 140 T 600 90" strokeDasharray="6 6" />
            </svg>

            {/* Store Pin (Start) */}
            <div className="absolute top-8 left-8 bg-white p-2 rounded-xl shadow-md border border-[#E2D8C9] flex items-center gap-1.5 z-10 text-[11px] font-bold text-[#1E1B18]">
              <div className="w-5 h-5 rounded-full bg-[#E06D53] text-white flex items-center justify-center">
                <Utensils className="w-3 h-3" />
              </div>
              <span>{order.store.name}</span>
            </div>

            {/* Destination Pin (End) */}
            <div className="absolute bottom-6 right-8 bg-white p-2 rounded-xl shadow-md border border-[#E2D8C9] flex items-center gap-1.5 z-10 text-[11px] font-bold text-[#1E1B18]">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <MapPin className="w-3 h-3" />
              </div>
              <span className="max-w-[140px] truncate">{order.customerDetails.address || order.customerDetails.suburb}</span>
            </div>

            {/* Animated Moving Driver Pin */}
            <div 
              className="absolute bg-[#211E1B] text-white p-2 rounded-xl shadow-xl flex items-center gap-1.5 z-20 transition-all duration-1000"
              style={{
                top: `${40 + (currentStepIndex * 12)}%`,
                left: `${20 + (currentStepIndex * 15)}%`
              }}
            >
              <Truck className="w-4 h-4 text-[#E06D53]" />
              <span className="text-[10px] font-bold">Driver on Way</span>
            </div>
          </div>

          {/* Driver & Support Row */}
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E0D2] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                KS
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1B18]">Driver: Kavish S.</div>
                <div className="text-[11px] text-[#706658]">Silver Toyota Aqua (Reg: TT921) • 4.9★</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="tel:0212779279"
                className="py-1.5 px-2.5 bg-white border border-[#E2D8C9] text-xs font-bold text-[#1E1B18] rounded-xl hover:border-[#E06D53] transition-colors flex items-center gap-1"
                title="Call 0212779279"
              >
                <Phone className="w-3 h-3 text-[#E06D53]" />
                <span>0212779279</span>
              </a>
              <a
                href="tel:0277479279"
                className="py-1.5 px-2.5 bg-white border border-[#E2D8C9] text-xs font-bold text-[#1E1B18] rounded-xl hover:border-[#E06D53] transition-colors flex items-center gap-1"
                title="Call 0277479279"
              >
                <Phone className="w-3 h-3 text-[#E06D53]" />
                <span>0277479279</span>
              </a>
            </div>
          </div>

          {/* Order items and NZ Payment Gateway Receipt */}
          <div className="p-4 bg-white border border-[#E8E0D2] rounded-2xl space-y-3 text-xs text-[#5A5043]">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs uppercase text-[#706658]">
                Ordered Items ({order.items.length})
              </span>
              {order.customerDetails.paymentGatewayDetails && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified NZ Gateway
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              {order.items.map(item => (
                <div key={item.cartItemId} className="flex justify-between text-[11px]">
                  <span className="truncate">{item.quantity}x {item.menuItem.name}</span>
                  <span className="font-mono font-semibold text-[#1E1B18]">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* NZ Gateway Receipt Details */}
            {order.customerDetails.paymentGatewayDetails && (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D2] space-y-1 text-[11px]">
                <div className="font-bold text-[#1E1B18] flex items-center justify-between">
                  <span>NZ Payment Method:</span>
                  <span className="text-emerald-800 font-semibold">
                    {order.customerDetails.paymentGatewayDetails.gateway}
                  </span>
                </div>
                {order.customerDetails.paymentGatewayDetails.bankName && (
                  <div className="flex justify-between text-[#706658]">
                    <span>Bank Partner:</span>
                    <span className="font-semibold text-[#1E1B18]">{order.customerDetails.paymentGatewayDetails.bankName}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#706658]">
                  <span>Gateway Auth Code:</span>
                  <span className="font-mono font-bold text-[#1E1B18]">{order.customerDetails.paymentGatewayDetails.authCode}</span>
                </div>
                <div className="flex justify-between text-[#706658]">
                  <span>Receipt Reference:</span>
                  <span className="font-mono text-[#1E1B18]">{order.customerDetails.paymentGatewayDetails.receiptRef}</span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#E8E0D2] space-y-1">
              <div className="flex justify-between text-[11px] text-[#706658]">
                <span>NZ GST (15% Included)</span>
                <span className="font-mono">${order.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs text-[#1E1B18]">
                <span>Total Paid</span>
                <span className="font-mono text-sm text-[#E06D53]">NZD ${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E0D2] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-[#E2D8C9] text-xs font-bold text-[#5A5043] rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Keep Window Open
          </button>
          <button
            onClick={() => {
              onStartNewOrder();
              onClose();
            }}
            className="flex-1 py-3 bg-[#E06D53] hover:bg-[#D45E44] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Start Another Order
          </button>
        </div>

      </div>
    </div>
  );
};
