import React, { useState, useMemo } from 'react';
import { 
  PlacedOrder, 
  StoreLocation 
} from '../../types';
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  PieChart, 
  Download, 
  Calendar, 
  CreditCard, 
  Store, 
  Building2, 
  Percent, 
  ArrowUpRight, 
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface AdminFinancialsProps {
  orders: PlacedOrder[];
  stores: StoreLocation[];
}

export const AdminFinancials: React.FC<AdminFinancialsProps> = ({
  orders,
  stores
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Filter completed/active valid revenue orders
  const validOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'cancelled');
  }, [orders]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalGross = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalSubtotal = validOrders.reduce((sum, o) => sum + o.subtotal, 0);
    const totalDeliveryFees = validOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
    const totalTips = validOrders.reduce((sum, o) => sum + o.tip, 0);
    const totalDiscounts = validOrders.reduce((sum, o) => sum + o.discount, 0);
    
    // NZ IRD standard 15% GST: In NZ, GST is 3/23 (approx 13.043%) of GST-inclusive price or 15% added to net price
    const gstCollected = totalGross * (3 / 23);
    const netRevenueExGst = totalGross - gstCollected;

    const orderCount = validOrders.length;
    const aov = orderCount > 0 ? (totalGross / orderCount) : 0;

    return {
      totalGross,
      totalSubtotal,
      totalDeliveryFees,
      totalTips,
      totalDiscounts,
      gstCollected,
      netRevenueExGst,
      orderCount,
      aov
    };
  }, [validOrders]);

  // Breakdown by Payment Gateway Method
  const paymentBreakdown = useMemo(() => {
    const gateways: Record<string, { count: number; total: number; label: string; icon: string }> = {
      online_eftpos: { count: 0, total: 0, label: 'Online EFTPOS NZ (ANZ/ASB/BNZ)', icon: '🏦' },
      windcave_card: { count: 0, total: 0, label: 'Windcave DPS Cards', icon: '💳' },
      poli_nz: { count: 0, total: 0, label: 'POLi Internet Banking', icon: '⚡' },
      afterpay_nz: { count: 0, total: 0, label: 'Afterpay NZ (4x Installments)', icon: '🛍️' },
      apple_google_pay: { count: 0, total: 0, label: 'Apple Pay / Google Pay', icon: '📱' },
      cash_eftpos_delivery: { count: 0, total: 0, label: 'Cash / Mobile EFTPOS at door', icon: '💵' },
      zip_nz: { count: 0, total: 0, label: 'Zip NZ (PartPay)', icon: '✨' },
    };

    validOrders.forEach(order => {
      const method = order.customerDetails.paymentMethod as string;
      if (gateways[method]) {
        gateways[method].count += 1;
        gateways[method].total += order.totalAmount;
      } else {
        // Fallback
        if (!gateways.windcave_card) {
          gateways.windcave_card = { count: 0, total: 0, label: 'Other Gateways', icon: '💳' };
        }
        gateways.windcave_card.count += 1;
        gateways.windcave_card.total += order.totalAmount;
      }
    });

    return Object.entries(gateways)
      .map(([key, data]) => ({
        key,
        ...data,
        percent: metrics.totalGross > 0 ? ((data.total / metrics.totalGross) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [validOrders, metrics.totalGross]);

  // Breakdown by Store Location
  const storeBreakdown = useMemo(() => {
    return stores.map(store => {
      const storeOrders = validOrders.filter(o => o.store.id === store.id);
      const total = storeOrders.reduce((s, o) => s + o.totalAmount, 0);
      const count = storeOrders.length;
      const percent = metrics.totalGross > 0 ? ((total / metrics.totalGross) * 100) : 0;
      return {
        store,
        count,
        total,
        percent
      };
    }).sort((a, b) => b.total - a.total);
  }, [stores, validOrders, metrics.totalGross]);

  // Top Selling Items by Revenue
  const topItems = useMemo(() => {
    const itemMap: Record<string, { name: string; category: string; quantity: number; revenue: number }> = {};

    validOrders.forEach(o => {
      o.items.forEach(item => {
        const id = item.menuItem.id;
        if (!itemMap[id]) {
          itemMap[id] = {
            name: item.menuItem.name,
            category: item.menuItem.category,
            quantity: 0,
            revenue: 0
          };
        }
        itemMap[id].quantity += item.quantity;
        itemMap[id].revenue += item.totalPrice;
      });
    });

    return Object.values(itemMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [validOrders]);

  const handleExportCSV = () => {
    let csv = 'Order Number,Date,Store,Customer,Phone,Order Mode,Payment Method,Subtotal (NZD),Discount,Delivery Fee,Tip,GST (15%),Total (NZD),Status\n';
    
    validOrders.forEach(o => {
      csv += `"${o.orderNumber}","${new Date(o.createdAt).toLocaleString()}","${o.store.name}","${o.customerDetails.name}","${o.customerDetails.phone}","${o.customerDetails.orderMode}","${o.customerDetails.paymentGatewayDetails?.gateway || o.customerDetails.paymentMethod}",${o.subtotal.toFixed(2)},${o.discount.toFixed(2)},${o.deliveryFee.toFixed(2)},${o.tip.toFixed(2)},${o.gstAmount.toFixed(2)},${o.totalAmount.toFixed(2)},"${o.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TiffinTreat_NZ_Financial_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Export Action */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-serif font-bold text-lg flex items-center gap-2">
            <span>Financial Accountability & GST Statement</span>
            <span className="text-[10px] uppercase font-bold bg-[#E06D53]/20 text-[#E06D53] border border-[#E06D53]/30 px-2 py-0.5 rounded-full">
              NZD ($)
            </span>
          </h3>
          <p className="text-xs text-neutral-400">
            Real-time accounting ledger including New Zealand 15% Goods & Services Tax (GST No: 124-889-102).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#181614] rounded-2xl p-1 border border-neutral-800 text-xs">
            {(['today', 'week', 'month', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                  timeRange === t 
                    ? 'bg-[#E06D53] text-white shadow-md' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'today' ? 'Today' : t === 'week' ? '7 Days' : t === 'month' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 bg-white text-black hover:bg-neutral-200 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main KPI Revenue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Revenue */}
        <div className="bg-gradient-to-br from-[#24211D] to-[#2e2924] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Gross Sales (Incl. GST)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-white">
            ${metrics.totalGross.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metrics.orderCount} completed transactions</span>
          </div>
        </div>

        {/* NZ 15% GST Breakdown */}
        <div className="bg-gradient-to-br from-[#24211D] to-[#2e2924] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">NZ GST (15% Included)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-amber-400">
            ${metrics.gstCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">
            IRD Tax Provision (3/23 of Gross)
          </div>
        </div>

        {/* Net Sales ex-GST */}
        <div className="bg-gradient-to-br from-[#24211D] to-[#2e2924] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Net Sales (Excl. GST)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-blue-400">
            ${metrics.netRevenueExGst.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">
            Business core net revenue
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-gradient-to-br from-[#24211D] to-[#2e2924] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-xl bg-[#E06D53]/20 text-[#E06D53] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#E06D53]">
            ${metrics.aov.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">
            Avg basket size across stores
          </div>
        </div>

      </div>

      {/* Secondary Financial Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-semibold">Delivery Fees Collected</div>
            <div className="font-mono text-xl font-bold text-white mt-0.5">
              ${metrics.totalDeliveryFees.toFixed(2)}
            </div>
          </div>
          <div className="text-xs text-neutral-500 font-mono">Courier offset</div>
        </div>

        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-semibold">Staff Tips (100% to Team)</div>
            <div className="font-mono text-xl font-bold text-amber-400 mt-0.5">
              ${metrics.totalTips.toFixed(2)}
            </div>
          </div>
          <div className="text-xs text-neutral-500 font-mono">Kitchen pool</div>
        </div>

        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-400 font-semibold">Promotional Discounts</div>
            <div className="font-mono text-xl font-bold text-rose-400 mt-0.5">
              -${metrics.totalDiscounts.toFixed(2)}
            </div>
          </div>
          <div className="text-xs text-neutral-500 font-mono">Coupons redeemed</div>
        </div>
      </div>

      {/* Detailed Two-Column Breakdown: Gateways vs Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NZ Payment Gateways Distribution */}
        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#E06D53]" />
              <span>NZ Payment Gateways & Banking</span>
            </h4>
            <span className="text-xs text-neutral-400">{paymentBreakdown.length} Methods Active</span>
          </div>

          <div className="space-y-3.5">
            {paymentBreakdown.map((gw) => (
              <div key={gw.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <span>{gw.icon}</span>
                    <span>{gw.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 text-[11px]">{gw.count} orders</span>
                    <span className="font-mono font-bold text-white">${gw.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#181614] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#E06D53] to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(gw.percent, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Location Breakdown */}
        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-[#E06D53]" />
              <span>Revenue by Store Branch</span>
            </h4>
            <span className="text-xs text-neutral-400">{stores.length} Hubs</span>
          </div>

          <div className="space-y-3.5">
            {storeBreakdown.map((sb) => (
              <div key={sb.store.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <span>{sb.store.name}</span>
                    <span className="text-[10px] text-neutral-400">({sb.store.suburb})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400 text-[11px]">{sb.count} orders</span>
                    <span className="font-mono font-bold text-white">${sb.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-[#181614] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(sb.percent, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Performing Dishes */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Top 5 Revenue Generating Dishes</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topItems.map((item, idx) => (
            <div key={idx} className="bg-[#181614] rounded-2xl p-3 border border-neutral-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-[#E06D53] tracking-wider">
                Rank #{idx + 1}
              </div>
              <div className="font-bold text-white text-xs line-clamp-1">
                {item.name}
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-800">
                <span className="text-neutral-400">{item.quantity} sold</span>
                <span className="font-mono font-bold text-emerald-400">${item.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
