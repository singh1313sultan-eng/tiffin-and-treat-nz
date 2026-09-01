import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils, 
  Layers, 
  Coffee, 
  Sandwich,
  Soup,
  Plus
} from 'lucide-react';
import { ProductCategory } from '../types';

interface MenuFilterBarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  itemCount: number;
}

interface CategoryConfig {
  id: ProductCategory;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All Items', icon: <Utensils className="w-4 h-4" /> },
  { id: 'paratha', label: 'Paratha', icon: <Flame className="w-4 h-4 text-[#E06D53]" />, badge: 'Fresh' },
  { id: 'chat', label: 'Chat & Snacks', icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
  { id: 'rolls', label: 'Rolls', icon: <Flame className="w-4 h-4 text-orange-500" /> },
  { id: 'kulcha', label: 'Kulcha', icon: <Layers className="w-4 h-4 text-[#E06D53]" />, badge: 'Special' },
  { id: 'burgers', label: 'Burgers & Sandwiches', icon: <Sandwich className="w-4 h-4 text-amber-700" /> },
  { id: 'maggi', label: 'Maggi, Tea & Cha-Churi', icon: <Soup className="w-4 h-4 text-emerald-600" /> },
  { id: 'fries', label: 'Fries', icon: <Flame className="w-4 h-4 text-yellow-600" /> },
  { id: 'rice', label: 'Rice', icon: <Utensils className="w-4 h-4 text-neutral-600" /> },
  { id: 'drinks', label: 'Beverages', icon: <Coffee className="w-4 h-4 text-teal-600" /> },
  { id: 'tiffins', label: 'Tiffin (Meals)', icon: <Layers className="w-4 h-4 text-[#E06D53]" />, badge: 'Popular' },
  { id: 'tiffin_extras', label: 'Tiffin Extras', icon: <Plus className="w-4 h-4 text-[#706658]" /> },
  { id: 'deals', label: 'Combos', icon: <Flame className="w-4 h-4 text-red-500" />, badge: '$20 Combo' }
];

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  itemCount
}) => {
  const [headerHeight, setHeaderHeight] = React.useState<number>(112);

  React.useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = document.getElementById('main-header');
      if (headerEl) {
        setHeaderHeight(headerEl.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    let ro: ResizeObserver | null = null;
    const headerEl = document.getElementById('main-header');
    if (headerEl && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        updateHeaderHeight();
      });
      ro.observe(headerEl);
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div 
      id="menu-filter-bar" 
      style={{ top: `${headerHeight}px` }}
      className="sticky z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3 sm:py-3.5 border-b border-[#E8E0D2] shadow-sm transition-[top] duration-150"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Categories Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E1B18] text-white shadow-sm ring-2 ring-[#1E1B18]/10'
                    : 'bg-white text-[#5A5043] border border-[#E8E0D2] hover:border-[#D9CFBF] hover:bg-[#F7F2EA]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-semibold ${
                    isActive ? 'bg-[#E06D53] text-white' : 'bg-[#FAF0ED] text-[#E06D53]'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dish counter */}
        <div className="text-xs text-[#7A7063] font-medium hidden lg:block shrink-0 pl-2">
          Showing <strong className="text-[#1E1B18] font-bold">{itemCount}</strong> dishes
        </div>

      </div>
    </div>
  );
};
