import React, { useState, useMemo } from 'react';
import { 
  MenuItem, 
  ProductCategory, 
  DietaryType, 
  SpiceLevel 
} from '../../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Flame, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  Tag, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface AdminMenuManagerProps {
  menuItems: MenuItem[];
  onAddItem: (newItem: MenuItem) => void;
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleSoldOut: (itemId: string, isSoldOut: boolean) => void;
  onQuickUpdatePrice: (itemId: string, newPrice: number) => void;
}

const ALL_DIETARY: { id: DietaryType; label: string }[] = [
  { id: 'veg', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'halal', label: '100% Halal' },
  { id: 'gf', label: 'Gluten-Free' },
  { id: 'nut-free', label: 'Nut-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'spicy', label: 'Spicy' },
  { id: 'chef-special', label: "Chef's Signature" }
];

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'tiffins', label: 'Tiffin Boxes' },
  { id: 'pizzas', label: 'Gourmet Pizzas' },
  { id: 'starters', label: 'Sides & Bites' },
  { id: 'biryani', label: 'Dum Biryanis' },
  { id: 'desserts', label: 'Desserts & Sweets' },
  { id: 'drinks', label: 'Beverages & Lassis' },
];

export const AdminMenuManager: React.FC<AdminMenuManagerProps> = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleSoldOut,
  onQuickUpdatePrice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'sold_out'>('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Quick Inline Price Editing State
  const [inlinePriceEditId, setInlinePriceEditId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<string>('');

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formCategory, setFormCategory] = useState<'tiffins' | 'pizzas' | 'starters' | 'biryani' | 'desserts' | 'drinks'>('tiffins');
  const [formPrice, setFormPrice] = useState('18.90');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80');
  const [formDietary, setFormDietary] = useState<DietaryType[]>(['halal']);
  const [formCalories, setFormCalories] = useState('580 kcal');
  const [formServes, setFormServes] = useState('1 person');
  const [formIsChefSpecial, setFormIsChefSpecial] = useState(false);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formSupportsHalfHalf, setFormSupportsHalfHalf] = useState(false);

  // Filtered menu list
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'in_stock' && item.isSoldOut) return false;
      if (stockFilter === 'sold_out' && !item.isSoldOut) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTag = item.tagline?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, stockFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = menuItems.length;
    const soldOut = menuItems.filter(i => i.isSoldOut).length;
    const inStock = total - soldOut;
    const avgPrice = total > 0 ? (menuItems.reduce((s, i) => s + i.price, 0) / total).toFixed(2) : '0.00';
    return { total, soldOut, inStock, avgPrice };
  }, [menuItems]);

  const openAddModal = () => {
    setFormName('');
    setFormTagline('');
    setFormCategory('tiffins');
    setFormPrice('18.90');
    setFormOriginalPrice('');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80');
    setFormDietary(['halal']);
    setFormCalories('580 kcal');
    setFormServes('1 person');
    setFormIsChefSpecial(false);
    setFormIsPopular(false);
    setFormSupportsHalfHalf(false);
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormTagline(item.tagline || '');
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormOriginalPrice(item.originalPrice ? item.originalPrice.toString() : '');
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormDietary(item.dietary || []);
    setFormCalories(item.calories || '550 kcal');
    setFormServes(item.serves || '1 person');
    setFormIsChefSpecial(!!item.isChefSpecial);
    setFormIsPopular(!!item.isPopular);
    setFormSupportsHalfHalf(!!item.supportsHalfHalf);
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice) || 15.00;
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : undefined;

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: formName.trim() || editingItem.name,
        tagline: formTagline.trim() || undefined,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        description: formDescription.trim() || editingItem.description,
        image: formImage.trim() || editingItem.image,
        dietary: formDietary,
        calories: formCalories.trim() || undefined,
        serves: formServes.trim() || undefined,
        isChefSpecial: formIsChefSpecial,
        isPopular: formIsPopular,
        supportsHalfHalf: formSupportsHalfHalf
      };
      onUpdateItem(updated);
    } else {
      const newItem: MenuItem = {
        id: `dish-${Date.now()}`,
        name: formName.trim() || 'New Delicious Dish',
        tagline: formTagline.trim() || undefined,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        description: formDescription.trim() || 'Freshly made with authentic herbs and ingredients.',
        image: formImage.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        dietary: formDietary,
        calories: formCalories.trim() || undefined,
        serves: formServes.trim() || '1 person',
        isChefSpecial: formIsChefSpecial,
        isPopular: formIsPopular,
        supportsHalfHalf: formSupportsHalfHalf,
        customizable: formCategory === 'pizzas' || formCategory === 'tiffins'
      };
      onAddItem(newItem);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleFormDietary = (d: DietaryType) => {
    setFormDietary(prev => 
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const handleSaveInlinePrice = (itemId: string) => {
    const val = parseFloat(inlinePriceValue);
    if (!isNaN(val) && val > 0) {
      onQuickUpdatePrice(itemId, val);
    }
    setInlinePriceEditId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-[#706658] font-semibold uppercase">Total Dishes</div>
          <div className="font-mono text-2xl font-bold text-[#1E1B18] mt-1">{stats.total}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Across all categories</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-emerald-700 font-semibold uppercase">Available / In Stock</div>
          <div className="font-mono text-2xl font-bold text-emerald-600 mt-1">{stats.inStock}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Ready for online order</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-rose-700 font-semibold uppercase">Sold Out Dishes</div>
          <div className="font-mono text-2xl font-bold text-rose-600 mt-1">{stats.soldOut}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Hidden / Disabled in menu</div>
        </div>

        <div className="bg-white border border-[#E8E0D2] rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-[#E06D53] font-semibold uppercase">Avg Menu Price</div>
          <div className="font-mono text-2xl font-bold text-[#E06D53] mt-1">NZD ${stats.avgPrice}</div>
          <div className="text-[11px] text-[#A89E91] mt-0.5">Per item average</div>
        </div>
      </div>

      {/* Action Bar with Search, Category Filter, and Add Dish Button */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search dish by title, ingredients or dietary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] placeholder-[#8C8275] shadow-2xs"
            />
          </div>

          {/* Stock Filter Dropdown */}
          <div className="flex items-center gap-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-[#FAF7F2] border border-[#D9CFBF] text-[#1E1B18] rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#E06D53] shadow-2xs font-medium"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in_stock">In Stock Only</option>
              <option value="sold_out">Sold Out Only</option>
            </select>

            {/* Add New Dish Action */}
            <button
              onClick={openAddModal}
              className="py-2.5 px-4 bg-[#E06D53] hover:bg-[#D45E44] text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#E06D53]/20 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#706658] hover:text-[#1E1B18] border-[#E8E0D2] hover:border-[#D9CFBF]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Table / Cards */}
      <div className="bg-white border border-[#E8E0D2] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E1B18]">
            <thead className="bg-[#F5EFE6] text-[#5A5043] uppercase text-[10px] tracking-wider border-b border-[#E8E0D2]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Dish & Description</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Price (NZD)</th>
                <th className="py-3.5 px-4 font-bold text-center">Stock / Sold Out</th>
                <th className="py-3.5 px-4 font-bold">Dietary & Badges</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D5]">
              {filteredItems.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-[#FAF7F2] transition-colors ${
                    item.isSoldOut ? 'bg-[#FAF7F2]/60 opacity-80' : ''
                  }`}
                >
                  {/* Dish Info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-[#E8E0D2] shrink-0"
                      />
                      <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1E1B18] text-sm">{item.name}</span>
                          {item.isChefSpecial && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#FAF0ED] text-[#E06D53] border border-[#F0D5CD]">
                              CHEF
                            </span>
                          )}
                          {item.isPopular && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                              HOT
                            </span>
                          )}
                        </div>
                        {item.tagline && (
                          <div className="text-[11px] text-[#E06D53] italic">{item.tagline}</div>
                        )}
                        <p className="text-[11px] text-[#706658] line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="capitalize px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-[#FAF7F2] text-[#5A5043] border border-[#E8E0D2]">
                      {item.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    {inlinePriceEditId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#706658] font-bold">$</span>
                        <input
                          type="number"
                          step="0.10"
                          value={inlinePriceValue}
                          onChange={(e) => setInlinePriceValue(e.target.value)}
                          className="w-20 bg-white border border-[#E06D53] text-[#1E1B18] px-2 py-1 rounded-lg text-xs font-mono font-bold focus:outline-none shadow-2xs"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInlinePrice(item.id);
                            if (e.key === 'Escape') setInlinePriceEditId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveInlinePrice(item.id)}
                          className="p-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setInlinePriceEditId(null)}
                          className="p-1 bg-neutral-200 hover:bg-neutral-300 text-[#1E1B18] rounded-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          setInlinePriceEditId(item.id);
                          setInlinePriceValue(item.price.toString());
                        }}
                        className="font-mono text-sm font-bold text-[#1E1B18] hover:text-[#E06D53] cursor-pointer flex items-center gap-1.5 group"
                        title="Click to quickly edit price"
                      >
                        <span>${item.price.toFixed(2)}</span>
                        <Edit3 className="w-3 h-3 text-[#A89E91] group-hover:text-[#E06D53] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    {item.originalPrice && (
                      <div className="text-[10px] text-[#A89E91] line-through">
                        ${item.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </td>

                  {/* Sold Out Toggle */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggleSoldOut(item.id, !item.isSoldOut)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                        item.isSoldOut
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.isSoldOut ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                      <span>{item.isSoldOut ? 'Sold Out' : 'In Stock'}</span>
                    </button>
                  </td>

                  {/* Dietary Badges */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.dietary.map(d => (
                        <span key={d} className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#FAF7F2] text-[#706658] border border-[#E8E0D2]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 bg-[#FAF7F2] hover:bg-white text-[#5A5043] hover:text-[#1E1B18] rounded-xl border border-[#E8E0D2] transition-all cursor-pointer shadow-2xs"
                        title="Edit Dish Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingItemId(item.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-all cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E8E0D2] text-[#1E1B18] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-[#E8E0D2] pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1E1B18]">
                  {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
                </h3>
                <p className="text-xs text-[#706658]">
                  Update pricing, dietary specifications, imagery, and description.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#3D372E] font-bold">Dish Title *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kashmiri Rogan Josh Tiffin"
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#3D372E] font-bold">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  >
                    <option value="tiffins">Tiffin Boxes</option>
                    <option value="pizzas">Gourmet Pizzas</option>
                    <option value="starters">Sides & Starters</option>
                    <option value="biryani">Dum Biryanis</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Beverages & Lassis</option>
                  </select>
                </div>
              </div>

              {/* Tagline & Serves */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#3D372E] font-bold">Tagline / Short Hook</label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="e.g. Slow-Cooked Tender Lamb with Saffron"
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[#3D372E] font-bold">Calories</label>
                    <input
                      type="text"
                      value={formCalories}
                      onChange={(e) => setFormCalories(e.target.value)}
                      placeholder="e.g. 620 kcal"
                      className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[#3D372E] font-bold">Serves</label>
                    <input
                      type="text"
                      value={formServes}
                      onChange={(e) => setFormServes(e.target.value)}
                      placeholder="e.g. 1-2 people"
                      className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[#3D372E] font-bold">Selling Price (NZD $) *</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] font-mono font-bold focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#3D372E] font-bold">Original Price (NZD $) for Strikethrough</label>
                  <input
                    type="number"
                    step="0.10"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="Optional original price"
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] font-mono focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[#3D372E] font-bold">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe ingredients, marinades, and serving inclusions..."
                  className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                />
              </div>

              {/* Image URL with preview */}
              <div className="space-y-1">
                <label className="text-[#3D372E] font-bold">Photo Image URL</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="flex-1 bg-white border border-[#D9CFBF] rounded-xl px-3.5 py-2.5 text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-2xs"
                  />
                  {formImage && (
                    <img 
                      src={formImage} 
                      alt="Preview" 
                      className="w-10 h-10 rounded-xl object-cover border border-[#E8E0D2] shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Dietary Tags */}
              <div className="space-y-2">
                <label className="text-[#3D372E] font-bold">Dietary Tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_DIETARY.map(d => {
                    const isSelected = formDietary.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => handleToggleFormDietary(d.id)}
                        className={`px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E06D53] text-white border-[#E06D53]'
                            : 'bg-white text-[#706658] border-[#D9CFBF] hover:border-[#B8AB99]'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Badges & Flags */}
              <div className="pt-2 flex flex-wrap gap-4 border-t border-[#E8E0D2]">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E1B18]">
                  <input
                    type="checkbox"
                    checked={formIsChefSpecial}
                    onChange={(e) => setFormIsChefSpecial(e.target.checked)}
                    className="w-4 h-4 accent-[#E06D53] rounded"
                  />
                  <span>Chef's Special Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E1B18]">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="w-4 h-4 accent-[#E06D53] rounded"
                  />
                  <span>Popular / Best Seller</span>
                </label>

                {formCategory === 'pizzas' && (
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1E1B18]">
                    <input
                      type="checkbox"
                      checked={formSupportsHalfHalf}
                      onChange={(e) => setFormSupportsHalfHalf(e.target.checked)}
                      className="w-4 h-4 accent-[#E06D53] rounded"
                    />
                    <span>Available in Half & Half Studio</span>
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E8E0D2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-5 bg-[#EBE3D5] hover:bg-[#DDD2C0] text-[#1E1B18] font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold rounded-xl shadow-md shadow-[#E06D53]/20 cursor-pointer"
                >
                  {editingItem ? 'Save Dish Changes' : 'Publish Dish to Menu'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#E8E0D2] text-[#1E1B18] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E1B18]">Remove Dish from Menu?</h3>
            <p className="text-xs text-[#706658]">
              Are you sure you want to delete this dish? This will immediately remove it from all storefront categories.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingItemId(null)}
                className="flex-1 py-2.5 bg-[#EBE3D5] hover:bg-[#DDD2C0] text-[#1E1B18] font-bold rounded-xl cursor-pointer"
              >
                Keep Dish
              </button>
              <button
                onClick={() => {
                  onDeleteItem(deletingItemId);
                  setDeletingItemId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
