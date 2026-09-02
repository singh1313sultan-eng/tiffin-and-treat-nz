import React, { useState, useMemo } from 'react';
import { 
  PlacedOrder, 
  StoreLocation,
  PaymentMode 
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
  Smartphone,
  Coins,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Search,
  Printer,
  Filter,
  Check
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
  const [paymentModeFilter, setPaymentModeFilter] = useState<'all' | 'Cash' | 'Card' | 'Credit'>('all');
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<'all' | 'paid' | 'due' | 'excess'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Time range filtering
  const timeFilteredOrders = useMemo(() => {
    const valid = orders.filter(o => o.status !== 'cancelled');
    if (timeRange === 'all') return valid;

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const daysMap = {
      today: 1,
      week: 7,
      month: 30
    };
    const maxAgeMs = (daysMap[timeRange] || 365) * oneDay;

    return valid.filter(o => {
      const orderTime = new Date(o.createdAt).getTime();
      return (now - orderTime) <= maxAgeMs;
    });
  }, [orders, timeRange]);

  // 2. Aggregate Metrics (Billing Totals, Collections & Due)
  const metrics = useMemo(() => {
    let totalGross = 0;
    let totalSubtotal = 0;
    let totalDeliveryFees = 0;
    let totalTips = 0;
    let totalDiscounts = 0;
    let totalActualPaid = 0;
    let totalOutstandingDue = 0;
    let totalExcessChange = 0;

    timeFilteredOrders.forEach(o => {
      const gross = Number(o.totalAmount) || 0;
      totalGross += gross;
      totalSubtotal += Number(o.subtotal) || 0;
      totalDeliveryFees += Number(o.deliveryFee) || 0;
      totalTips += Number(o.tip) || 0;
      totalDiscounts += Number(o.discount) || 0;

      const paid = o.amountPaid != null ? Number(o.amountPaid) : gross;
      totalActualPaid += paid;

      const diff = Number((gross - paid).toFixed(2));
      if (diff > 0) {
        totalOutstandingDue += diff;
      } else if (diff < 0) {
        totalExcessChange += Math.abs(diff);
      }
    });

    // NZ IRD standard 15% GST: In NZ, GST is 3/23 (approx 13.043%) of GST-inclusive price
    const gstCollected = totalGross * (3 / 23);
    const netRevenueExGst = totalGross - gstCollected;
    const orderCount = timeFilteredOrders.length;
    const aov = orderCount > 0 ? (totalGross / orderCount) : 0;

    return {
      totalGross,
      totalSubtotal,
      totalDeliveryFees,
      totalTips,
      totalDiscounts,
      totalActualPaid,
      totalOutstandingDue,
      totalExcessChange,
      gstCollected,
      netRevenueExGst,
      orderCount,
      aov
    };
  }, [timeFilteredOrders]);

  // 3. Billing Data Bifurcation by Payment Mode (Cash, Card, Credit)
  const modeBifurcation = useMemo(() => {
    const summary = {
      Cash: { count: 0, totalBilled: 0, totalPaid: 0, totalDue: 0, totalChange: 0 },
      Card: { count: 0, totalBilled: 0, totalPaid: 0, totalDue: 0, totalChange: 0 },
      Credit: { count: 0, totalBilled: 0, totalPaid: 0, totalDue: 0, totalChange: 0 }
    };

    timeFilteredOrders.forEach(order => {
      const gross = Number(order.totalAmount) || 0;
      const paid = order.amountPaid != null ? Number(order.amountPaid) : gross;
      const rawMode = order.paymentMode || (order.customerDetails?.paymentMethod?.includes('cash') ? 'Cash' : 'Card');
      const mode: 'Cash' | 'Card' | 'Credit' = rawMode === 'Cash' ? 'Cash' : (rawMode === 'Credit' ? 'Credit' : 'Card');

      summary[mode].count += 1;
      summary[mode].totalBilled += gross;
      summary[mode].totalPaid += paid;

      const diff = Number((gross - paid).toFixed(2));
      if (diff > 0) summary[mode].totalDue += diff;
      if (diff < 0) summary[mode].totalChange += Math.abs(diff);
    });

    const totalCollected = metrics.totalActualPaid || 1;
    return {
      Cash: {
        ...summary.Cash,
        percentOfCollected: (summary.Cash.totalPaid / totalCollected) * 100
      },
      Card: {
        ...summary.Card,
        percentOfCollected: (summary.Card.totalPaid / totalCollected) * 100
      },
      Credit: {
        ...summary.Credit,
        percentOfCollected: (summary.Credit.totalPaid / totalCollected) * 100
      }
    };
  }, [timeFilteredOrders, metrics.totalActualPaid]);

  // 4. Delivery vs Pickup Bifurcation
  const orderTypeBifurcation = useMemo(() => {
    let deliveryCount = 0;
    let deliveryTotal = 0;
    let pickupCount = 0;
    let pickupTotal = 0;

    timeFilteredOrders.forEach(o => {
      const gross = Number(o.totalAmount) || 0;
      if (o.customerDetails?.orderMode === 'delivery') {
        deliveryCount++;
        deliveryTotal += gross;
      } else {
        pickupCount++;
        pickupTotal += gross;
      }
    });

    return {
      delivery: { count: deliveryCount, total: deliveryTotal },
      pickup: { count: pickupCount, total: pickupTotal }
    };
  }, [timeFilteredOrders]);

  // 5. Sales Report Ledger Filtering
  const filteredReportOrders = useMemo(() => {
    return timeFilteredOrders.filter(order => {
      const gross = Number(order.totalAmount) || 0;
      const paid = order.amountPaid != null ? Number(order.amountPaid) : gross;
      const diff = Number((gross - paid).toFixed(2));
      const mode = order.paymentMode || (order.customerDetails?.paymentMethod?.includes('cash') ? 'Cash' : 'Card');

      // Payment Mode Filter
      if (paymentModeFilter !== 'all' && mode !== paymentModeFilter) {
        return false;
      }

      // Settlement Status Filter
      if (settlementStatusFilter === 'paid' && diff !== 0) return false;
      if (settlementStatusFilter === 'due' && diff <= 0) return false;
      if (settlementStatusFilter === 'excess' && diff >= 0) return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = (order.orderNumber || '').toLowerCase().includes(q);
        const matchesCust = (order.customerDetails?.name || '').toLowerCase().includes(q);
        const matchesPhone = (order.customerDetails?.phone || '').toLowerCase().includes(q);
        const matchesStore = (order.store?.name || '').toLowerCase().includes(q);
        if (!matchesNum && !matchesCust && !matchesPhone && !matchesStore) return false;
      }

      return true;
    });
  }, [timeFilteredOrders, paymentModeFilter, settlementStatusFilter, searchQuery]);

  // Running totals of the currently filtered sales report
  const reportTotals = useMemo(() => {
    let billed = 0;
    let paid = 0;
    let due = 0;
    let gst = 0;

    filteredReportOrders.forEach(o => {
      const g = Number(o.totalAmount) || 0;
      const p = o.amountPaid != null ? Number(o.amountPaid) : g;
      const diff = Number((g - p).toFixed(2));

      billed += g;
      paid += p;
      if (diff > 0) due += diff;
      gst += Number(o.gstAmount) || 0;
    });

    return { billed, paid, due, gst };
  }, [filteredReportOrders]);

  // CSV Export for Accountant / Filing
  const handleExportCSV = () => {
    let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel
    csv += 'Order Number,Date,Store,Customer Name,Phone,Order Mode,Total Billed (NZD),Actual Paid (NZD),Payment Mode,Difference / Due (NZD),Settlement Status,NZ GST (15%)\n';
    
    filteredReportOrders.forEach(o => {
      const gross = Number(o.totalAmount) || 0;
      const paid = o.amountPaid != null ? Number(o.amountPaid) : gross;
      const diff = Number((gross - paid).toFixed(2));
      const mode = o.paymentMode || (o.customerDetails?.paymentMethod?.includes('cash') ? 'Cash' : 'Card');
      const statusLabel = diff === 0 ? 'Fully Settled' : (diff > 0 ? `Due $${diff.toFixed(2)}` : `Change $${Math.abs(diff).toFixed(2)}`);

      csv += `"${o.orderNumber}","${new Date(o.createdAt).toLocaleString()}","${o.store?.name || 'Central Kitchen'}","${o.customerDetails?.name}","${o.customerDetails?.phone}","${o.customerDetails?.orderMode || 'delivery'}",${gross.toFixed(2)},${paid.toFixed(2)},"${mode}",${diff.toFixed(2)},"${statusLabel}",${(Number(o.gstAmount) || 0).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TiffinTreat_NZ_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Export Action */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[#1E1B18] font-serif font-bold text-lg flex items-center gap-2">
            <span>Billing Data Bifurcation & Sales Report</span>
            <span className="text-[10px] uppercase font-bold bg-[#FAF0ED] text-[#E06D53] border border-[#F0D5CD] px-2.5 py-0.5 rounded-full">
              NZD ($)
            </span>
          </h3>
          <p className="text-xs text-[#706658] mt-0.5">
            Cash, Card & Credit reconciliation ledger with New Zealand 15% Goods & Services Tax (GST No: 124-889-102).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#FAF7F2] rounded-2xl p-1 border border-[#E8E0D2] text-xs">
            {(['today', 'week', 'month', 'all'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                  timeRange === t 
                    ? 'bg-[#E06D53] text-white shadow-sm' 
                    : 'text-[#706658] hover:text-[#1E1B18]'
                }`}
              >
                {t === 'today' ? 'Today' : t === 'week' ? '7 Days' : t === 'month' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="py-2.5 px-3.5 bg-white text-[#706658] hover:text-[#1E1B18] hover:bg-[#FAF7F2] border border-[#E8E0D2] rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 bg-[#FAF0ED] text-[#E06D53] hover:bg-[#E06D53] hover:text-white border border-[#F0D5CD] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main KPI Revenue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Invoiced */}
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#706658] text-xs">
            <span className="font-semibold uppercase tracking-wider">Gross Billed / Invoiced</span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center border border-neutral-200">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#1E1B18]">
            ${metrics.totalGross.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#706658] flex items-center gap-1 font-semibold">
            <span>{metrics.orderCount} total orders processed</span>
          </div>
        </div>

        {/* Actual Cashflow Collected */}
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#706658] text-xs">
            <span className="font-semibold uppercase tracking-wider">Actual Cash Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-emerald-700">
            ${metrics.totalActualPaid.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            Realized cashflow in hand & bank
          </div>
        </div>

        {/* Total Outstanding Due (Credit/Khata) */}
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#706658] text-xs">
            <span className="font-semibold uppercase tracking-wider">Customer Due / Credit</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-amber-800">
            ${metrics.totalOutstandingDue.toFixed(2)}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            Unpaid balance on customer accounts
          </div>
        </div>

        {/* NZ 15% GST Breakdown */}
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#706658] text-xs">
            <span className="font-semibold uppercase tracking-wider">NZ GST (15% Included)</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-3xl font-extrabold text-blue-800">
            ${metrics.gstCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#706658]">
            IRD Tax Provision (3/23 of Gross)
          </div>
        </div>

      </div>

      {/* SECTION: Billing Data Bifurcation by Payment Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-[#1E1B18] flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#E06D53]" />
            <span>Billing Data Bifurcation (Cash, Card & Credit Breakdown)</span>
          </h4>
          <span className="text-xs text-[#706658]">
            Reconciled across {metrics.orderCount} transactions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Cash Bifurcation */}
          <div className="bg-white border border-emerald-200 rounded-3xl p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#1E1B18]">Cash Billing</h5>
                  <span className="text-[11px] text-[#706658]">Drivers & Counter Register</span>
                </div>
              </div>
              <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {modeBifurcation.Cash.count} Orders
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-xs text-[#706658]">Total Cash Collected:</div>
              <div className="font-mono text-2xl font-black text-emerald-800">
                ${modeBifurcation.Cash.totalPaid.toFixed(2)}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-100 text-xs text-[#5C5346] space-y-1">
              <div className="flex justify-between">
                <span>Invoiced Value:</span>
                <span className="font-mono font-semibold">${modeBifurcation.Cash.totalBilled.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Share of Cashflow:</span>
                <span className="font-mono font-semibold text-emerald-700">{modeBifurcation.Cash.percentOfCollected.toFixed(1)}%</span>
              </div>
              {modeBifurcation.Cash.totalChange > 0 && (
                <div className="flex justify-between text-blue-700 font-semibold">
                  <span>Change Handed Over:</span>
                  <span className="font-mono">${modeBifurcation.Cash.totalChange.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Bifurcation */}
          <div className="bg-white border border-blue-200 rounded-3xl p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#1E1B18]">Card Billing</h5>
                  <span className="text-[11px] text-[#706658]">EFTPOS, Debit & Credit</span>
                </div>
              </div>
              <span className="font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                {modeBifurcation.Card.count} Orders
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-xs text-[#706658]">Total Card Collected:</div>
              <div className="font-mono text-2xl font-black text-blue-800">
                ${modeBifurcation.Card.totalPaid.toFixed(2)}
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100 text-xs text-[#5C5346] space-y-1">
              <div className="flex justify-between">
                <span>Invoiced Value:</span>
                <span className="font-mono font-semibold">${modeBifurcation.Card.totalBilled.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Share of Cashflow:</span>
                <span className="font-mono font-semibold text-blue-700">{modeBifurcation.Card.percentOfCollected.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Settlement:</span>
                <span>Direct Bank / Gateway</span>
              </div>
            </div>
          </div>

          {/* Credit Bifurcation */}
          <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#1E1B18]">Credit Billing (Khata)</h5>
                  <span className="text-[11px] text-[#706658]">Customer Account / Pay Later</span>
                </div>
              </div>
              <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                {modeBifurcation.Credit.count} Orders
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="text-xs text-[#706658]">Outstanding Due Balance:</div>
              <div className="font-mono text-2xl font-black text-amber-900">
                ${modeBifurcation.Credit.totalDue.toFixed(2)}
              </div>
            </div>

            <div className="pt-2 border-t border-amber-100 text-xs text-[#5C5346] space-y-1">
              <div className="flex justify-between">
                <span>Invoiced on Credit:</span>
                <span className="font-mono font-semibold">${modeBifurcation.Credit.totalBilled.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Upfront Partial Paid:</span>
                <span className="font-mono font-semibold text-emerald-700">${modeBifurcation.Credit.totalPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-900 font-bold">
                <span>Remaining Due:</span>
                <span className="font-mono">${modeBifurcation.Credit.totalDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION: Sales Report Table & Ledger */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-[#EBE3D5] pb-4">
          <div>
            <h4 className="font-serif font-bold text-base text-[#1E1B18] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#E06D53]" />
              <span>Sales Ledger & Audit Trail</span>
            </h4>
            <p className="text-xs text-[#706658]">
              Showing {filteredReportOrders.length} of {timeFilteredOrders.length} orders
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order #, customer..."
                className="pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53] w-44"
              />
            </div>

            {/* Payment Mode Filter */}
            <div className="flex items-center bg-[#FAF7F2] rounded-xl p-0.5 border border-[#E2D8C9] text-xs">
              {(['all', 'Cash', 'Card', 'Credit'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPaymentModeFilter(mode)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    paymentModeFilter === mode
                      ? 'bg-[#E06D53] text-white shadow-2xs'
                      : 'text-[#706658] hover:text-[#1E1B18]'
                  }`}
                >
                  {mode === 'all' ? 'All Modes' : mode}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={settlementStatusFilter}
              onChange={(e) => setSettlementStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] focus:outline-none cursor-pointer"
            >
              <option value="all">All Settlement Statuses</option>
              <option value="paid">Fully Paid ($0 balance)</option>
              <option value="due">Customer Due / Unpaid</option>
              <option value="excess">Excess / Change Returned</option>
            </select>

          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E1B18]">
            <thead className="bg-[#F5EFE6] text-[#5A5043] uppercase text-[10px] tracking-wider border-b border-[#E8E0D2]">
              <tr>
                <th className="py-3 px-3 font-bold">Date & Time</th>
                <th className="py-3 px-3 font-bold">Order # & Store</th>
                <th className="py-3 px-3 font-bold">Customer & Mode</th>
                <th className="py-3 px-3 font-bold text-right">Total Invoiced</th>
                <th className="py-3 px-3 font-bold text-right">Actual Money Paid</th>
                <th className="py-3 px-3 font-bold text-center">Payment Mode</th>
                <th className="py-3 px-3 font-bold text-center">Difference / Due Status</th>
                <th className="py-3 px-3 font-bold text-right">15% GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D5]">
              {filteredReportOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[#706658]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReportOrders.map((order) => {
                  const gross = Number(order.totalAmount) || 0;
                  const paid = order.amountPaid != null ? Number(order.amountPaid) : gross;
                  const diff = Number((gross - paid).toFixed(2));
                  const mode = order.paymentMode || (order.customerDetails?.paymentMethod?.includes('cash') ? 'Cash' : 'Card');

                  return (
                    <tr key={order.orderId} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px] text-[#706658] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-[#1E1B18]">#{order.orderNumber}</span>
                        <div className="text-[10px] text-[#E06D53] font-semibold">{order.store?.name || 'Central Kitchen'}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1E1B18]">{order.customerDetails?.name}</div>
                        <div className="text-[10px] text-[#706658] flex items-center gap-1">
                          <span>{order.customerDetails?.orderMode === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}</span>
                          <span>•</span>
                          <span>{order.customerDetails?.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-[#1E1B18]">
                        ${gross.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                        ${paid.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          mode === 'Cash' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : (mode === 'Credit' 
                                ? 'bg-amber-50 text-amber-900 border border-amber-300' 
                                : 'bg-blue-50 text-blue-800 border border-blue-200')
                        }`}>
                          {mode === 'Cash' ? '💵 Cash' : (mode === 'Credit' ? '📋 Credit' : '💳 Card')}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {diff === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Paid in Full</span>
                          </span>
                        ) : diff > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-700" />
                            <span>Due: ${diff.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            <span>Change: ${Math.abs(diff).toFixed(2)}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-[11px] text-[#706658]">
                        ${(Number(order.gstAmount) || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer: Running Totals */}
            {filteredReportOrders.length > 0 && (
              <tfoot className="bg-[#FAF7F2] font-bold text-xs border-t-2 border-[#D9CFBF]">
                <tr>
                  <td colSpan={3} className="py-3.5 px-3 uppercase tracking-wider text-[#5A5043]">
                    Filtered Total ({filteredReportOrders.length} orders):
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-sm text-[#1E1B18]">
                    ${reportTotals.billed.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-sm text-emerald-800">
                    ${reportTotals.paid.toFixed(2)}
                  </td>
                  <td colSpan={1} />
                  <td className="py-3.5 px-3 text-center font-mono text-xs text-amber-900">
                    {reportTotals.due > 0 ? `Total Due: $${reportTotals.due.toFixed(2)}` : '$0.00 Due'}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-xs text-[#706658]">
                    ${reportTotals.gst.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

      </div>

    </div>
  );
};
