import React, { useState, useMemo } from 'react';
import { 
  PlacedOrder, 
  OrderStatus, 
  StoreLocation 
} from '../../types';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Package, 
  Truck, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Search, 
  Filter, 
  Printer, 
  DollarSign, 
  X, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Ban,
  ShoppingBag,
  ExternalLink,
  Store
} from 'lucide-react';

interface AdminLiveOrdersProps {
  orders: PlacedOrder[];
  stores: StoreLocation[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onCancelOrder: (orderId: string) => void;
}

export const AdminLiveOrders: React.FC<AdminLiveOrdersProps> = ({
  orders,
  stores,
  onUpdateOrderStatus,
  onCancelOrder
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('active');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingOrder, setInspectingOrder] = useState<PlacedOrder | null>(null);

  // Filter calculations
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Store filter
      if (selectedStoreFilter !== 'all' && order.store.id !== selectedStoreFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter === 'active') {
        if (order.status === 'delivered' || order.status === 'cancelled') return false;
      } else if (selectedStatusFilter !== 'all') {
        if (order.status !== selectedStatusFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = order.orderNumber.toLowerCase().includes(q);
        const matchesName = order.customerDetails.name.toLowerCase().includes(q);
        const matchesPhone = order.customerDetails.phone.toLowerCase().includes(q);
        const matchesItem = order.items.some(i => i.menuItem.name.toLowerCase().includes(q));
        if (!matchesNum && !matchesName && !matchesPhone && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, selectedStoreFilter, selectedStatusFilter, searchQuery]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      active: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
      received: orders.filter(o => o.status === 'received').length,
      kitchen: orders.filter(o => o.status === 'kitchen').length,
      packed: orders.filter(o => o.status === 'packed').length,
      on_the_way: orders.filter(o => o.status === 'on_the_way').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      all: orders.length
    };
  }, [orders]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            New Order Received
          </span>
        );
      case 'kitchen':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <ChefHat className="w-3.5 h-3.5" />
            In Kitchen (Prep)
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Package className="w-3.5 h-3.5" />
            Packed / Ready
          </span>
        );
      case 'on_the_way':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5" />
            Out for Delivery / En Route
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered / Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Ban className="w-3.5 h-3.5" />
            Cancelled / Refunded
          </span>
        );
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar & Search */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Order # (e.g. TT-892105), customer name, phone or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181614] border border-neutral-700 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] placeholder-neutral-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Store Location Filter */}
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedStoreFilter}
              onChange={(e) => setSelectedStoreFilter(e.target.value)}
              className="bg-[#181614] border border-neutral-700 text-white rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53]"
            >
              <option value="all">All Store Branches ({stores.length})</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Pipeline Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'active', label: 'Active Pipeline', count: counts.active },
            { id: 'received', label: 'New / Received', count: counts.received },
            { id: 'kitchen', label: 'In Kitchen', count: counts.kitchen },
            { id: 'packed', label: 'Packed & Ready', count: counts.packed },
            { id: 'on_the_way', label: 'Out for Delivery', count: counts.on_the_way },
            { id: 'delivered', label: 'Completed', count: counts.delivered },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
            { id: 'all', label: 'All Orders', count: counts.all },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                selectedStatusFilter === tab.id
                  ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-lg shadow-[#E06D53]/20'
                  : 'bg-[#181614] text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedStatusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-800 text-neutral-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-white font-serif font-bold text-lg">No orders found</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">
            No orders match the selected status filter or search keywords. New incoming orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const hasAllergy = !!order.customerDetails.allergyNotice;
            const hasNotes = !!order.customerDetails.deliveryNotes;

            return (
              <div 
                key={order.orderId}
                className="bg-[#24211D] border border-neutral-800 hover:border-neutral-700 rounded-3xl p-5 shadow-xl space-y-4 transition-all relative overflow-hidden"
              >
                {/* Header with Order # and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-extrabold text-white">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        order.customerDetails.orderMode === 'delivery' 
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {order.customerDetails.orderMode === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                      </span>
                      <span className="text-neutral-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                      <span className="text-[#E06D53] font-semibold">{order.store.name}</span>
                      <span>•</span>
                      <span>Target: {order.estimatedDeliveryTime}</span>
                    </div>
                  </div>

                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Banner */}
                <div className="bg-[#181614] rounded-2xl p-3 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{order.customerDetails.name}</span>
                      <a 
                        href={`tel:${order.customerDetails.phone}`} 
                        className="text-neutral-400 hover:text-white inline-flex items-center gap-1 text-[11px] bg-neutral-800 px-2 py-0.5 rounded-lg"
                      >
                        <Phone className="w-3 h-3 text-[#E06D53]" />
                        {order.customerDetails.phone}
                      </a>
                    </div>
                    {order.customerDetails.orderMode === 'delivery' && (
                      <div className="text-neutral-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span>{order.customerDetails.address}, {order.customerDetails.suburb}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-3 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Total NZD</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Allergy / Delivery Alert if exists */}
                {hasAllergy && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">ALLERGY WARNING: </span>
                      <span>{order.customerDetails.allergyNotice}</span>
                    </div>
                  </div>
                )}

                {hasNotes && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-2.5 text-[11px] text-amber-200">
                    <span className="font-bold text-amber-400">Special Notes: </span>
                    <span>{order.customerDetails.deliveryNotes}</span>
                  </div>
                )}

                {/* Items Summary */}
                <div className="space-y-2 pt-1 border-t border-neutral-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-[#181614] rounded-xl p-2.5 border border-neutral-800/80 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#E06D53]/20 text-[#E06D53] text-[11px] font-bold flex items-center justify-center">
                              {item.quantity}x
                            </span>
                            <span>{item.menuItem.name}</span>
                          </div>

                          {/* Customization specifics */}
                          {item.customization && (
                            <div className="text-[11px] text-neutral-400 pl-7 space-y-0.5">
                              {item.customization.size && (
                                <div>Size: <span className="text-neutral-200">{item.customization.size}</span></div>
                              )}
                              {item.customization.crust && (
                                <div>Crust: <span className="text-neutral-200">{item.customization.crust}</span></div>
                              )}
                              {item.customization.spiceLevel && (
                                <div>Spice: <span className="text-orange-400 font-bold">{item.customization.spiceLevel}</span></div>
                              )}
                              {item.customization.tiffinMealChoice && (
                                <div>Tiffin Curries: <span className="text-neutral-200">{item.customization.tiffinMealChoice}</span></div>
                              )}
                              {item.customization.specialInstructions && (
                                <div className="text-amber-300 italic">"{item.customization.specialInstructions}"</div>
                              )}
                            </div>
                          )}
                        </div>

                        <span className="font-mono text-neutral-300 font-semibold text-xs">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Gateway badge */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 bg-neutral-900/60 px-3 py-2 rounded-xl">
                  <span>Payment: <strong className="text-neutral-200">{order.customerDetails.paymentGatewayDetails?.gateway || order.customerDetails.paymentMethod}</strong></span>
                  <span className="font-mono text-[10px] text-neutral-500">Ref: {order.customerDetails.paymentGatewayDetails?.receiptRef || 'Direct'}</span>
                </div>

                {/* Action Controls & Stepper */}
                <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingOrder(order)}
                    className="py-2 px-3 bg-[#181614] hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Kitchen Docket</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {order.status === 'received' && (
                      <>
                        <button
                          onClick={() => onCancelOrder(order.orderId)}
                          className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
                        >
                          Reject / Cancel
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'kitchen')}
                          className="py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Kitchen Prep</span>
                        </button>
                      </>
                    )}

                    {order.status === 'kitchen' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'packed')}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Packed & Ready</span>
                      </button>
                    )}

                    {order.status === 'packed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'on_the_way')}
                        className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.customerDetails.orderMode === 'delivery' ? 'Dispatch with Driver' : 'Customer Ready for Pickup'}</span>
                      </button>
                    )}

                    {order.status === 'on_the_way' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'delivered')}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Order Completed</span>
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Order Completed
                      </span>
                    )}

                    {order.status === 'cancelled' && (
                      <span className="text-rose-400 text-xs font-bold flex items-center gap-1">
                        <Ban className="w-4 h-4" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Kitchen Docket Printable Simulation Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-3xl max-w-md w-full p-6 font-mono text-xs shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="text-center border-b border-dashed border-neutral-300 pb-4 space-y-1">
              <h2 className="font-bold text-lg uppercase tracking-wider">TIFFIN & TREAT NZ</h2>
              <p className="text-[11px] text-neutral-600">{inspectingOrder.store.name}</p>
              <p className="text-[10px] text-neutral-500">{inspectingOrder.store.address}</p>
              <p className="text-[10px] text-neutral-500 font-bold">GST No: 124-889-102</p>
            </div>

            <div className="flex justify-between border-b border-dashed border-neutral-300 pb-3">
              <div>
                <div className="font-bold text-sm">ORDER #{inspectingOrder.orderNumber}</div>
                <div>{new Date(inspectingOrder.createdAt).toLocaleTimeString()}</div>
              </div>
              <div className="text-right">
                <div className="font-bold uppercase text-xs px-2 py-0.5 bg-neutral-100 rounded">
                  {inspectingOrder.customerDetails.orderMode}
                </div>
                <div>Status: {inspectingOrder.status.toUpperCase()}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 space-y-1">
              <div className="font-bold">CUSTOMER: {inspectingOrder.customerDetails.name}</div>
              <div>PHONE: {inspectingOrder.customerDetails.phone}</div>
              {inspectingOrder.customerDetails.orderMode === 'delivery' && (
                <div>ADDRESS: {inspectingOrder.customerDetails.address}, {inspectingOrder.customerDetails.suburb}</div>
              )}
              {inspectingOrder.customerDetails.allergyNotice && (
                <div className="text-rose-600 font-bold">ALLERGY: {inspectingOrder.customerDetails.allergyNotice}</div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2 border-b border-dashed border-neutral-300 pb-3">
              <div className="font-bold uppercase text-[11px]">KITCHEN ITEMS:</div>
              {inspectingOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <span className="font-bold">{item.quantity}x {item.menuItem.name}</span>
                    {item.customization?.spiceLevel && (
                      <div className="text-[10px] text-orange-700">SPICE: {item.customization.spiceLevel}</div>
                    )}
                    {item.customization?.crust && (
                      <div className="text-[10px] text-neutral-600">CRUST: {item.customization.crust}</div>
                    )}
                    {item.customization?.tiffinMealChoice && (
                      <div className="text-[10px] text-neutral-600">TIERS: {item.customization.tiffinMealChoice}</div>
                    )}
                  </div>
                  <span className="font-bold">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Money breakdown */}
            <div className="space-y-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${inspectingOrder.subtotal.toFixed(2)}</span>
              </div>
              {inspectingOrder.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-${inspectingOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>${inspectingOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>NZ GST (15% Included):</span>
                <span>${inspectingOrder.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-neutral-300">
                <span>TOTAL PAID (NZD):</span>
                <span>${inspectingOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center gap-3">
              <button
                onClick={() => setInspectingOrder(null)}
                className="flex-1 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-black font-bold rounded-xl cursor-pointer"
              >
                Close Ticket
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Docket</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
