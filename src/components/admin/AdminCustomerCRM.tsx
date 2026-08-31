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
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        const matchesPhone = c.phone.toLowerCase().includes(q);
        const matchesSuburb = c.suburb.toLowerCase().includes(q);
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
        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 shadow-xl">
          <div className="text-xs text-neutral-400 font-semibold uppercase">Total Customers</div>
          <div className="font-mono text-2xl font-bold text-white mt-1">{crmStats.totalCount}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Active profiles</div>
        </div>

        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 shadow-xl">
          <div className="text-xs text-amber-400 font-semibold uppercase">VIP Loyal Patrons</div>
          <div className="font-mono text-2xl font-bold text-amber-400 mt-1">{crmStats.vipCount}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">High-frequency foodies</div>
        </div>

        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 shadow-xl">
          <div className="text-xs text-emerald-400 font-semibold uppercase">Combined LTV</div>
          <div className="font-mono text-2xl font-bold text-emerald-400 mt-1">
            NZD ${crmStats.totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Customer lifetime sales</div>
        </div>

        <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-4 shadow-xl">
          <div className="text-xs text-[#E06D53] font-semibold uppercase">Avg Spend / Patron</div>
          <div className="font-mono text-2xl font-bold text-[#E06D53] mt-1">
            NZD ${crmStats.avgSpend}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Lifetime value per customer</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search customer by name, phone (021...), email or suburb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181614] border border-neutral-700 text-white rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E06D53]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterVIP}
              onChange={(e) => setFilterVIP(e.target.value as any)}
              className="bg-[#181614] border border-neutral-700 text-white rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53]"
            >
              <option value="all">All Customer Types</option>
              <option value="vip">VIP Customers Only</option>
              <option value="regular">Standard Customers</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#181614] border border-neutral-700 text-white rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53]"
            >
              <option value="spend">Sort by Lifetime Spend ($)</option>
              <option value="orders">Sort by Order Count</option>
              <option value="recent">Sort by Most Recent</option>
            </select>
          </div>

        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#24211D] border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#181614] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
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
            <tbody className="divide-y divide-neutral-800">
              {filteredCustomers.map((c) => (
                <tr 
                  key={c.id}
                  className="hover:bg-[#2b2723] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.isVIP && (
                            <span className="text-amber-400" title="VIP Loyal Patron">★</span>
                          )}
                        </div>
                        {c.notes && (
                          <div className="text-[11px] text-neutral-400 line-clamp-1 italic">
                            "{c.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 space-y-1">
                    <div className="text-white flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#E06D53]" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="text-neutral-400 text-[11px] flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{c.suburb}</div>
                    <div className="text-neutral-400 text-[11px]">{c.city}</div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#181614] border border-neutral-700 text-white font-mono">
                      {c.totalOrders}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-mono text-sm font-bold text-emerald-400">
                      ${c.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Avg ${(c.totalSpent / c.totalOrders).toFixed(2)}/order
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggleVIP(c.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1 mx-auto ${
                        c.isVIP
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${c.isVIP ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{c.isVIP ? 'VIP Patron' : 'Standard'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenDetail(c)}
                      className="py-1.5 px-3 bg-[#181614] hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 border border-neutral-700 transition-all cursor-pointer ml-auto"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#24211D] border border-neutral-700 text-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                    <span>{selectedCustomer.name}</span>
                    {selectedCustomer.isVIP && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ★ VIP Patron
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Customer ID: <span className="font-mono">{selectedCustomer.id}</span> • Member since {selectedCustomer.firstOrderDate}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact & Actions Pill */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="bg-[#181614] hover:bg-neutral-800 rounded-2xl p-3 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E06D53]" />
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Call Phone</div>
                  <div className="font-bold">{selectedCustomer.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${selectedCustomer.email}`}
                className="bg-[#181614] hover:bg-neutral-800 rounded-2xl p-3 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E06D53]" />
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Send Email</div>
                  <div className="font-bold truncate">{selectedCustomer.email}</div>
                </div>
              </a>

              <div className="bg-[#181614] rounded-2xl p-3 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">Address</div>
                  <div className="font-bold truncate">{selectedCustomer.primaryAddress}</div>
                </div>
              </div>
            </div>

            {/* Lifetime Spend Breakdown */}
            <div className="grid grid-cols-3 gap-3 bg-[#181614] rounded-2xl p-4 border border-neutral-800 text-center">
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Total Spent</div>
                <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="border-x border-neutral-800">
                <div className="text-[10px] uppercase font-bold text-neutral-400">Total Orders</div>
                <div className="font-mono text-xl font-bold text-white mt-0.5">
                  {selectedCustomer.totalOrders}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">Avg / Order</div>
                <div className="font-mono text-xl font-bold text-[#E06D53] mt-0.5">
                  ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Favorite Dishes */}
            {selectedCustomer.favoriteItems && selectedCustomer.favoriteItems.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Favorite Dishes Ordered</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.favoriteItems.map((fav, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#181614] text-white border border-neutral-800">
                      {fav}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="space-y-2 bg-[#181614] rounded-2xl p-4 border border-neutral-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-300">Staff Notes & Preferences</span>
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
                    className="text-emerald-400 hover:underline font-bold text-[11px]"
                  >
                    Save Notes
                  </button>
                )}
              </div>

              {!editingNotes ? (
                <p className="text-xs text-neutral-400 italic">
                  {selectedCustomer.notes || 'No staff notes recorded for this customer yet.'}
                </p>
              ) : (
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full bg-[#24211D] border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#E06D53]"
                  placeholder="e.g. Likes extra chutney, severe dairy allergy, corporate billing..."
                />
              )}
            </div>

            {/* Recent Orders Timeline */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Recent Orders by {selectedCustomer.name}
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getCustomerOrders(selectedCustomer).length === 0 ? (
                  <div className="text-neutral-500 text-xs text-center py-4">
                    Historical offline orders synced from database.
                  </div>
                ) : (
                  getCustomerOrders(selectedCustomer).map((order) => (
                    <div 
                      key={order.orderId}
                      className="bg-[#181614] rounded-xl p-3 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>#{order.orderNumber}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-emerald-400">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
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
