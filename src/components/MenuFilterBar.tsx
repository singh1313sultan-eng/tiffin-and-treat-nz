import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils, 
  Pizza, 
  Layers, 
  Coffee, 
  CakeSlice, 
  CalendarCheck, 
  Check, 
  ShieldCheck, 
  Leaf, 
  Wheat,
  X
} from 'lucide-react';
import { ProductCategory, DietaryType } from '../types';

interface MenuFilterBarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  selectedDietary: DietaryType[];
  onToggleDietary: (dietary: DietaryType) => void;
  onClearDietary: () => void;
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

const DIETARY_FILTERS: { type: DietaryType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'halal', label: '100% Halal', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { type: 'veg', label: 'Vegetarian', icon: <Leaf className="w-3.5 h-3.5" />, color: 'text-green-700 bg-green-50 border-green-200' },
  { type: 'vegan', label: 'Vegan', icon: <Leaf className="w-3.5 h-3.5" />, color: 'text-emerald-800 bg-emerald-100/60 border-emerald-300' },
  { type: 'gf', label: 'Gluten-Free', icon: <Wheat className="w-3.5 h-3.5" />, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { type: 'chef-special', label: "Chef's Special", icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-[#C95338] bg-[#FAF0ED] border-[#F0D5CD]' },
  { type: 'spicy', label: 'Spicy Fire', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-red-700 bg-red-50 border-red-200' },
];

export const MenuFilterBar: React.FC<MenuFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedDietary,
  onToggleDietary,
  onClearDietary,
  itemCount
}) => {
  return (
    <div id="menu-filter-bar" className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md py-3.5 border-b border-[#E8E0D2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Categories Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
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

        {/* Dietary Filters & Counter Row */}
        <div className="flex items-center justify-between gap-4 pt-1 flex-wrap">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#8C8275] uppercase tracking-wider text-[11px]">
              Dietary:
            </span>
            {DIETARY_FILTERS.map((filter) => {
              const isSelected = selectedDietary.includes(filter.type);
              return (
                <button
                  key={filter.type}
                  id={`dietary-filter-${filter.type}`}
                  onClick={() => onToggleDietary(filter.type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? `${filter.color} ring-2 ring-neutral-800/10 shadow-xs`
                      : 'bg-white text-[#706658] border-[#E8E0D2] hover:border-[#D9CFBF]'
                  }`}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}

            {selectedDietary.length > 0 && (
              <button
                onClick={onClearDietary}
                className="text-xs font-medium text-[#E06D53] hover:underline flex items-center gap-1 ml-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          <div className="text-xs text-[#7A7063] font-medium hidden sm:block">
            Showing <strong className="text-[#1E1B18] font-bold">{itemCount}</strong> delicious dishes
          </div>

        </div>

      </div>
    </div>
  );
};
