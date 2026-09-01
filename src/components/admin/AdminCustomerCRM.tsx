import React, { useState, useMemo } from 'react';
import { 
  CustomerRecord, 
  PlacedOrder 
} from '../../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Heart, 
  X, 
  ChevronRight, 
  ExternalLink,
  Plus,
  Edit2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface AdminCustomerCRMProps {
  customers: CustomerRecord[];
  orders: PlacedOrder[];
  onToggleVIP: (customerId: string) => void;
  onUpdateCustomerNotes: (customerId: string, notes: string) => void;
}

export const AdminCustomerCRM: React.FC<AdminCustomerCRMProps> = ({
  customers,
  orders,
  onToggleVIP,
  onUpdateCustomerNotes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVIP, setFilterVIP] = useState<'all' | 'vip' | 'regular'>('all');
  const [sortBy, setSortBy] = useState<'spend' | 'orders' | 'recent'>('spend');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');

  // Filter and Sort Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (filterVIP === 'vip' && !c.isVIP) return false;
      if (filterVIP === 'regular' && c.isVIP) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (c.name || '').toLowerCase().includes(q);
        const matchesEmail = (c.email || '').toLowerCase().includes(q);
        const matchesPhone = (c.phone || '').toLowerCase().includes(q);
        const matchesSuburb = (c.suburb || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesSuburb) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'spend') return b.totalSpent - a.totalSpent;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
    });
  }, [customers, filterVIP, searchQuery, sortBy]);

  // Total CRM Metrics
  const crmStats = useMemo(() => {
    const totalCount = customers.length;
    const vipCount = customers.filter(c => c.isVIP).length;
    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const avgSpend = totalCount > 0 ? (totalRevenue / totalCount).toFixed(2) : '0.00';
    return { totalCount, vipCount, totalRevenue, avgSpend };
  }, [customers]);

  const getCustomerOrders = (customer: CustomerRecord) => {
    return orders.filter(o => 
      o.customerDetails.email.toLowerCase() === customer.email.toLowerCase() ||
      o.customerDetails.phone === customer.phone
    );
  };

  const handleOpenDetail = (c: CustomerRecord) => {
    setSelectedCustomer(c);
    setNotesText(c.notes || '');
    setEditingNotes(false);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      onUpdateCustomerNotes(selectedCustomer.id, notesText);
      setSelectedCustomer(prev => prev ? { ...prev, notes: notesText } : null);
      setEditingNotes(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top CRM Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-[#706658] font-semibold uppercase">Total Customers</div>
          <div className="font-mono text-2xl font-bold text-[#1E1B18] mt-1">{crmStats.totalCount}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Active profiles</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-amber-700 font-semibold uppercase">VIP Loyal Patrons</div>
          <div className="font-mono text-2xl font-bold text-amber-800 mt-1">{crmStats.vipCount}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">High-frequency foodies</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-emerald-700 font-semibold uppercase">Combined LTV</div>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-1">
            NZD ${crmStats.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Customer lifetime sales</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-[#E06D53] font-semibold uppercase">Avg Spend / Patron</div>
          <div className="font-mono text-2xl font-bold text-[#E06D53] mt-1">
            NZD ${crmStats.avgSpend}
          </div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Lifetime value per customer</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search customer by name, phone (021...), email or suburb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] placeholder-[#8C8275] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterVIP}
              onChange={(e) => setFilterVIP(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] shadow-2xs font-medium"
            >
              <option value="all">All Customer Types</option>
              <option value="vip">VIP Customers Only</option>
              <option value="regular">Standard Customers</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] shadow-2xs font-medium"
            >
              <option value="spend">Sort by Lifetime Spend ($)</option>
              <option value="orders">Sort by Order Count</option>
              <option value="recent">Sort by Most Recent</option>
            </select>
          </div>

        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E1B18]">
            <thead className="bg-[#F5EFE6] text-[#5A5043] uppercase text-[10px] tracking-wider border-b border-[#E8E0D2]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Customer Profile</th>
                <th className="py-3.5 px-4 font-bold">Contact</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold text-center">Orders</th>
                <th className="py-3.5 px-4 font-bold">Lifetime Spend (NZD)</th>
                <th className="py-3.5 px-4 font-bold text-center">VIP Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Profile View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D5]">
              {filteredCustomers.map((c) => (
                <tr 
                  key={c.id}
                  className="hover:bg-[#FAF7F2] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-[#E06D53]/20">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1E1B18] text-sm flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isVIP && (
                            <span className="text-amber-500 font-bold" title="VIP Loyal Patron">★</span>
                          )}
                        </div>
                        {c.notes && (
                          <div className="text-[11px] text-[#706658] line-clamp-1 italic">
                            "{c.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 space-y-1">
                    <div className="text-[#1E1B18] flex items-center gap-1.5 font-medium">
                      <Phone className="w-3 h-3 text-[#E06D53]" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="text-[#706658] text-[11px] flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#8C8275]" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-[#1E1B18] font-medium">{c.suburb}</div>
                    <div className="text-[#706658] text-[11px]">{c.city}</div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-[#E8E0D2] text-[#1E1B18] font-mono">
                      {c.totalOrders}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono text-sm font-bold text-emerald-700">
                      ${c.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#8C8275]">
                      Avg ${(c.totalSpent / c.totalOrders).toFixed(2)}/order
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggleVIP(c.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 mx-auto ${
                        c.isVIP
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-[#FAF7F2] text-[#706658] border-[#D9CFBF] hover:text-[#1E1B18]'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${c.isVIP ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{c.isVIP ? 'VIP Patron' : 'Standard'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(c)}
                      className="py-1.5 px-3 bg-white hover:bg-[#FAF7F2] text-[#5A5043] hover:text-[#1E1B18] rounded-xl text-xs font-semibold flex items-center gap-1 border border-[#D9CFBF] transition-all cursor-pointer ml-auto shadow-2xs"
                    >
                      <span>History</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E8E0D2] text-[#1E1B18] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-[#E8E0D2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold flex items-center justify-center text-lg shadow-md shadow-[#E06D53]/20">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1E1B18] flex items-center gap-2">
                    <span>{selectedCustomer.name}</span>
                    {selectedCustomer.isVIP && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        ★ VIP Patron
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-[#706658] mt-0.5">
                    Customer ID: <span className="font-mono font-semibold">{selectedCustomer.id}</span> • Member since {selectedCustomer.firstOrderDate}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact & Actions Pill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="bg-white hover:bg-[#FAF7F2] rounded-2xl p-3 border border-[#E8E0D2] flex items-center gap-2.5 text-xs text-[#1E1B18] transition-colors shadow-2xs"
              >
                <Phone className="w-4 h-4 text-[#E06D53]" />
                <div>
                  <div className="text-[10px] text-[#8C8275] uppercase font-bold">Call Phone</div>
                  <div className="font-bold">{selectedCustomer.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${selectedCustomer.email}`}
                className="bg-white hover:bg-[#FAF7F2] rounded-2xl p-3 border border-[#E8E0D2] flex items-center gap-2.5 text-xs text-[#1E1B18] transition-colors shadow-2xs"
              >
                <Mail className="w-4 h-4 text-[#E06D53]" />
                <div>
                  <div className="text-[10px] text-[#8C8275] uppercase font-bold">Send Email</div>
                  <div className="font-bold truncate">{selectedCustomer.email}</div>
                </div>
              </a>

              <div className="bg-white rounded-2xl p-3 border border-[#E8E0D2] flex items-center gap-2.5 text-xs text-[#1E1B18] shadow-2xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-[10px] text-[#8C8275] uppercase font-bold">Address</div>
                  <div className="font-bold truncate">{selectedCustomer.primaryAddress}</div>
                </div>
              </div>
            </div>

            {/* Lifetime Spend Breakdown */}
            <div className="grid grid-cols-3 gap-3 bg-white rounded-2xl p-4 border border-[#E8E0D2] text-center shadow-2xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#706658]">Total Spent</div>
                <div className="font-mono text-xl font-bold text-emerald-700 mt-0.5">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="border-x border-[#E8E0D2]">
                <div className="text-[10px] uppercase font-bold text-[#706658]">Total Orders</div>
                <div className="font-mono text-xl font-bold text-[#1E1B18] mt-0.5">
                  {selectedCustomer.totalOrders}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#706658]">Avg / Order</div>
                <div className="font-mono text-xl font-bold text-[#E06D53] mt-0.5">
                  ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Favorite Dishes */}
            {selectedCustomer.favoriteItems && selectedCustomer.favoriteItems.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#706658] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Favorite Dishes Ordered</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.favoriteItems.map((fav, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-white text-[#1E1B18] border border-[#E8E0D2]">
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="space-y-2 bg-white rounded-2xl p-4 border border-[#E8E0D2] shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#3D372E]">Staff Notes & Preferences</span>
                {!editingNotes ? (
                  <button
                    onClick={() => setEditingNotes(true)}
                    className="text-[#E06D53] hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Notes</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    className="text-emerald-700 hover:underline font-bold text-[11px]"
                  >
                    Save Notes
                  </button>
                )}
              </div>

              {!editingNotes ? (
                <p className="text-xs text-[#706658] italic">
                  {selectedCustomer.notes || 'No staff notes recorded for this customer yet.'}
                </p>
              ) : (
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D9CFBF] rounded-xl p-2.5 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                  placeholder="e.g. Likes extra chutney, severe dairy allergy, corporate billing..."
                />
              )}
            </div>

            {/* Recent Orders Timeline */}
            <div className="space-y-3 pt-2 border-t border-[#E8E0D2]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#706658]">
                Recent Orders by {selectedCustomer.name}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getCustomerOrders(selectedCustomer).length === 0 ? (
                  <div className="text-[#8C8275] text-xs text-center py-4">
                    Historical offline orders synced from database.
                  </div>
                ) : (
                  getCustomerOrders(selectedCustomer).map((order) => (
                    <div 
                      key={order.orderId}
                      className="bg-white rounded-xl p-3 border border-[#E8E0D2] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#1E1B18] flex items-center gap-2">
                          <span>#{order.orderNumber}</span>
                          <span className="text-[10px] text-[#706658] font-normal">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#706658]">
                          {order.items?.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ') || 'Order'}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-700">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-[#706658]">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
