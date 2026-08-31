import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils, 
  Pizza, 
  Layers, 
  Coffee, 
  CakeSlice, 
  CalendarCheck
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
  { id: 'tiffins', label: 'Tiffins & Thalis', icon: <Layers className="w-4 h-4 text-[#E06D53]" />, badge: 'Popular' },
  { id: 'pizzas', label: 'Artisanal Pizzas', icon: <Pizza className="w-4 h-4 text-amber-600" /> },
  { id: 'deals', label: 'Combos & Deals', icon: <Flame className="w-4 h-4 text-red-500" />, badge: 'Save $' },
  { id: 'starters', label: 'Street Eats & Sides', icon: <Sparkles className="w-4 h-4 text-orange-500" /> },
  { id: 'biryani', label: 'Biryani Bowls', icon: <Utensils className="w-4 h-4 text-amber-700" /> },
  { id: 'desserts', label: 'Sweet Treats', icon: <CakeSlice className="w-4 h-4 text-pink-500" /> },
  { id: 'drinks', label: 'Lassis & Drinks', icon: <Coffee className="w-4 h-4 text-teal-600" /> },
  { id: 'subscription', label: 'Weekly Meal Pass', icon: <CalendarCheck className="w-4 h-4 text-purple-600" /> }
];

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  itemCount
}) => {
  return (
    <div id="menu-filter-bar" className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3.5 border-b border-[#E8E0D2] shadow-xs">
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
