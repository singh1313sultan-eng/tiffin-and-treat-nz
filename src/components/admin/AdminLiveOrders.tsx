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
  Store,
  LayoutList,
  LayoutGrid
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
  const [viewMode, setViewMode] = useState<'list' | 'tile'>('list');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('active');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingOrder, setInspectingOrder] = useState<PlacedOrder | null>(null);

  // Filter calculations
  const filteredOrders = useMemo(() => {
    return (orders || []).filter(order => {
      if (!order) return false;
      // Store filter
      if (selectedStoreFilter !== 'all' && order.store?.id !== selectedStoreFilter) {
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
        const matchesNum = (order.orderNumber || '').toLowerCase().includes(q);
        const matchesName = (order.customerDetails?.name || '').toLowerCase().includes(q);
        const matchesPhone = (order.customerDetails?.phone || '').toLowerCase().includes(q);
        const matchesItem = (order.items || []).some(i => (i.menuItem?.name || '').toLowerCase().includes(q));
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            New Order Received
          </span>
        );
      case 'kitchen':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200">
            <ChefHat className="w-3.5 h-3.5 text-orange-600" />
            In Kitchen (Prep)
          </span>
        );
      case 'packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Package className="w-3.5 h-3.5 text-blue-600" />
            Packed / Ready
          </span>
        );
      case 'on_the_way':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-600" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <Ban className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
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
      {/* Top Filter Bar, Search & View Switcher */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Order # (e.g. TT-892105), customer name, phone or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] placeholder-[#8C8275] shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle: List (default) vs Tile */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#D9CFBF] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#E06D53] text-white shadow-xs'
                    : 'text-[#706658] hover:text-[#1E1B18]'
                }`}
                title="List View (Default)"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tile')}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'tile'
                    ? 'bg-[#E06D53] text-white shadow-xs'
                    : 'text-[#706658] hover:text-[#1E1B18]'
                }`}
                title="Tile / Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Tile</span>
              </button>
            </div>

            {/* Store Location Filter */}
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-neutral-500" />
              <select
                value={selectedStoreFilter}
                onChange={(e) => setSelectedStoreFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] shadow-2xs font-medium"
              >
                <option value="all">All Store Branches ({stores.length})</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
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
                  ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#706658] hover:text-[#1E1B18] border-[#E8E0D2] hover:border-[#D9CFBF]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedStatusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EBE3D5] text-[#5A5043]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Content View */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-16 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-[#1E1B18] font-serif font-bold text-lg">No orders found</h3>
          <p className="text-[#706658] text-xs max-w-md mx-auto">
            No orders match the selected status filter or search keywords. New incoming orders will appear here automatically.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW (DEFAULT) */
        <div className="bg-white border border-[#E8E0D2] rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1E1B18]">
              <thead className="bg-[#F5EFE6] text-[#5A5043] uppercase text-[10px] tracking-wider border-b border-[#E8E0D2]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Order # & Store</th>
                  <th className="py-3.5 px-4 font-bold">Customer & Mode</th>
                  <th className="py-3.5 px-4 font-bold">Items & Details</th>
                  <th className="py-3.5 px-4 font-bold">Total & Payment</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE3D5]">
                {filteredOrders.map((order) => {
                  const hasAllergy = !!order.customerDetails.allergyNotice;
                  const hasNotes = !!order.customerDetails.deliveryNotes;
                  const totalItemsCount = order.items.reduce((s, i) => s + i.quantity, 0);

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FAF7F2] transition-colors">
                      
                      {/* Order # & Store */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-[#1E1B18]">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[#8C8275] text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(order.createdAt)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#E06D53] font-semibold">
                            {order.store?.name || 'Central Kitchen'}
                          </div>
                          <div className="text-[10px] text-[#706658]">
                            Target: {order.estimatedDeliveryTime}
                          </div>
                        </div>
                      </td>

                      {/* Customer & Mode */}
                      <td className="py-4 px-4 align-top space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            order.customerDetails.orderMode === 'delivery' 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {order.customerDetails.orderMode === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                          </span>
                          <span className="font-bold text-[#1E1B18]">{order.customerDetails.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px]">
                          <a 
                            href={`tel:${order.customerDetails.phone}`} 
                            className="text-[#5A5043] hover:text-[#1E1B18] inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#E8E0D2]"
                          >
                            <Phone className="w-3 h-3 text-[#E06D53]" />
                            {order.customerDetails.phone}
                          </a>
                        </div>

                        {order.customerDetails.orderMode === 'delivery' && (
                          <div className="text-[#706658] text-[11px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#8C8275] shrink-0" />
                            <span className="line-clamp-1">{order.customerDetails.address}, {order.customerDetails.suburb}</span>
                          </div>
                        )}

                        {hasAllergy && (
                          <div className="text-[10px] text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Allergy: {order.customerDetails.allergyNotice}</span>
                          </div>
                        )}

                        {hasNotes && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md italic line-clamp-1">
                            Notes: "{order.customerDetails.deliveryNotes}"
                          </div>
                        )}
                      </td>

                      {/* Items & Customizations */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5 max-w-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275]">
                            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                          </span>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-xs">
                                <div className="font-semibold text-[#1E1B18] flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded bg-[#E06D53]/15 text-[#E06D53] text-[10px] font-bold flex items-center justify-center">
                                    {item.quantity}x
                                  </span>
                                  <span>{item.menuItem.name}</span>
                                </div>
                                {item.customization && (
                                  <div className="text-[10px] text-[#706658] pl-5.5 space-x-1">
                                    {item.customization.size && <span>• Size: {item.customization.size}</span>}
                                    {item.customization.spiceLevel && <span className="text-orange-700 font-medium">• Spice: {item.customization.spiceLevel}</span>}
                                    {item.customization.crust && <span>• Crust: {item.customization.crust}</span>}
                                    {item.customization.tiffinMealChoice && <span>• {item.customization.tiffinMealChoice}</span>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          <div className="font-mono text-sm font-bold text-emerald-700">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-[#706658] font-medium">
                            {order.customerDetails.paymentGatewayDetails?.gateway || order.customerDetails.paymentMethod}
                          </div>
                          <div className="text-[9px] font-mono text-[#8C8275]">
                            Ref: {order.customerDetails.paymentGatewayDetails?.receiptRef || 'Direct'}
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 align-top text-center">
                        <div className="inline-block">
                          {getStatusBadge(order.status)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          {/* Status Transition Button */}
                          {order.status === 'received' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onCancelOrder(order.orderId)}
                                className="py-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[11px] font-semibold border border-rose-200 transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => onUpdateOrderStatus(order.orderId, 'kitchen')}
                                className="py-1.5 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                              >
                                <ChefHat className="w-3.5 h-3.5" />
                                <span>Prep</span>
                              </button>
                            </div>
                          )}

                          {order.status === 'kitchen' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.orderId, 'packed')}
                              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Mark Ready</span>
                            </button>
                          )}

                          {order.status === 'packed' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.orderId, 'on_the_way')}
                              className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{order.customerDetails.orderMode === 'delivery' ? 'Dispatch' : 'Pickup Ready'}</span>
                            </button>
                          )}

                          {order.status === 'on_the_way' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.orderId, 'delivered')}
                              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete</span>
                            </button>
                          )}

                          {order.status === 'delivered' && (
                            <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Done
                            </span>
                          )}

                          {order.status === 'cancelled' && (
                            <span className="text-rose-700 text-[11px] font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                              <Ban className="w-3 h-3" />
                              Cancelled
                            </span>
                          )}

                          {/* Docket Button */}
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="py-1 px-2.5 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl text-[11px] font-semibold flex items-center gap-1 border border-[#D9CFBF] transition-all cursor-pointer shadow-2xs"
                          >
                            <Printer className="w-3 h-3 text-[#706658]" />
                            <span>Docket</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TILE / GRID VIEW */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const hasAllergy = !!order.customerDetails.allergyNotice;
            const hasNotes = !!order.customerDetails.deliveryNotes;

            return (
              <div 
                key={order.orderId}
                className="bg-white border border-[#E8E0D2] hover:border-[#D4C8B5] rounded-3xl p-5 shadow-xs hover:shadow-md space-y-4 transition-all relative overflow-hidden"
              >
                {/* Header with Order # and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-extrabold text-[#1E1B18]">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        order.customerDetails.orderMode === 'delivery' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {order.customerDetails.orderMode === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                      </span>
                      <span className="text-[#8C8275] text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(order.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-[#706658] mt-1 flex items-center gap-2">
                      <span className="text-[#E06D53] font-semibold">{order.store?.name || 'Central Kitchen'}</span>
                      <span>•</span>
                      <span>Target: {order.estimatedDeliveryTime}</span>
                    </div>
                  </div>

                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Banner */}
                <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#E8E0D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#1E1B18] flex items-center gap-2">
                      <span>{order.customerDetails.name}</span>
                      <a 
                        href={`tel:${order.customerDetails.phone}`} 
                        className="text-[#5A5043] hover:text-[#1E1B18] inline-flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded-lg border border-[#E8E0D2]"
                      >
                        <Phone className="w-3 h-3 text-[#E06D53]" />
                        {order.customerDetails.phone}
                      </a>
                    </div>
                    {order.customerDetails.orderMode === 'delivery' && (
                      <div className="text-[#706658] text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8C8275] shrink-0" />
                        <span>{order.customerDetails.address}, {order.customerDetails.suburb}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right sm:border-l sm:border-[#E8E0D2] sm:pl-3 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[10px] uppercase font-bold text-[#8C8275]">Total NZD</span>
                    <span className="font-mono text-sm font-bold text-emerald-600">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Allergy / Delivery Alert if exists */}
                {hasAllergy && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">ALLERGY WARNING: </span>
                      <span>{order.customerDetails.allergyNotice}</span>
                    </div>
                  </div>
                )}

                {hasNotes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-[11px] text-amber-800">
                    <span className="font-bold text-amber-900">Special Notes: </span>
                    <span>{order.customerDetails.deliveryNotes}</span>
                  </div>
                )}

                {/* Items Summary */}
                <div className="space-y-2 pt-1 border-t border-[#EBE3D5]">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#706658]">
                    Order Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-[#FAF7F2] rounded-xl p-2.5 border border-[#E8E0D2] flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="font-semibold text-[#1E1B18] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#E06D53]/15 text-[#E06D53] text-[11px] font-bold flex items-center justify-center">
                              {item.quantity}x
                            </span>
                            <span>{item.menuItem.name}</span>
                          </div>

                          {/* Customization specifics */}
                          {item.customization && (
                            <div className="text-[11px] text-[#706658] pl-7 space-y-0.5">
                              {item.customization.size && (
                                <div>Size: <span className="text-[#1E1B18] font-medium">{item.customization.size}</span></div>
                              )}
                              {item.customization.crust && (
                                <div>Crust: <span className="text-[#1E1B18] font-medium">{item.customization.crust}</span></div>
                              )}
                              {item.customization.spiceLevel && (
                                <div>Spice: <span className="text-orange-600 font-bold">{item.customization.spiceLevel}</span></div>
                              )}
                              {item.customization.tiffinMealChoice && (
                                <div>Tiffin Curries: <span className="text-[#1E1B18] font-medium">{item.customization.tiffinMealChoice}</span></div>
                              )}
                              {item.customization.specialInstructions && (
                                <div className="text-amber-800 italic">"{item.customization.specialInstructions}"</div>
                              )}
                            </div>
                          )}
                        </div>

                        <span className="font-mono text-[#3D372E] font-semibold text-xs">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Gateway badge */}
                <div className="flex items-center justify-between text-[11px] text-[#706658] bg-[#F5EFE6] px-3 py-2 rounded-xl border border-[#E8E0D2]">
                  <span>Payment: <strong className="text-[#1E1B18]">{order.customerDetails.paymentGatewayDetails?.gateway || order.customerDetails.paymentMethod}</strong></span>
                  <span className="font-mono text-[10px] text-[#8C8275]">Ref: {order.customerDetails.paymentGatewayDetails?.receiptRef || 'Direct'}</span>
                </div>

                {/* Action Controls & Stepper */}
                <div className="pt-2 border-t border-[#EBE3D5] flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingOrder(order)}
                    className="py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#D9CFBF] transition-all cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#706658]" />
                    <span>Kitchen Docket</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {order.status === 'received' && (
                      <>
                        <button
                          onClick={() => onCancelOrder(order.orderId)}
                          className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all cursor-pointer"
                        >
                          Reject / Cancel
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.orderId, 'kitchen')}
                          className="py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>Start Kitchen Prep</span>
                        </button>
                      </>
                    )}

                    {order.status === 'kitchen' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'packed')}
                        className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Mark Packed & Ready</span>
                      </button>
                    )}

                    {order.status === 'packed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'on_the_way')}
                        className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.customerDetails.orderMode === 'delivery' ? 'Dispatch with Driver' : 'Customer Ready for Pickup'}</span>
                      </button>
                    )}

                    {order.status === 'on_the_way' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.orderId, 'delivered')}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Order Completed</span>
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <span className="text-emerald-700 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                        Order Completed
                      </span>
                    )}

                    {order.status === 'cancelled' && (
                      <span className="text-rose-700 text-xs font-bold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
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
              <p className="text-[11px] text-neutral-600">{inspectingOrder.store?.name || 'Central Kitchen'}</p>
              <p className="text-[10px] text-neutral-500">{inspectingOrder.store?.address || ''}</p>
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
