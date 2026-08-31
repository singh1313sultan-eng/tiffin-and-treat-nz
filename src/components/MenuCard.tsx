import React from 'react';
import { 
  Plus, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Leaf, 
  Wheat, 
  Layers, 
  SlidersHorizontal,
  Users
} from 'lucide-react';
import { MenuItem, DietaryType } from '../types';

interface MenuCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onCustomize,
  onQuickAdd
}) => {
  const getDietaryBadge = (dietary: DietaryType) => {
    switch (dietary) {
      case 'halal':
        return (
          <span key="halal" className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            <ShieldCheck className="w-3 h-3" /> Halal
          </span>
        );
      case 'veg':
        return (
          <span key="veg" className="inline-flex items-center gap-1 text-[10px] font-bold text-green-800 bg-green-100/80 px-2 py-0.5 rounded-md">
            <Leaf className="w-3 h-3" /> Veg
          </span>
        );
      case 'vegan':
        return (
          <span key="vegan" className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 bg-emerald-200/70 px-2 py-0.5 rounded-md">
            <Leaf className="w-3 h-3" /> Vegan
          </span>
        );
      case 'gf':
        return (
          <span key="gf" className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
            <Wheat className="w-3 h-3" /> GF
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      id={`menu-card-${item.id}`}
      className="bg-white rounded-2xl border border-[#E8E0D2] overflow-hidden shadow-sm hover:shadow-md hover:border-[#D4C4AF] transition-all flex flex-col group h-full"
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            item.isSoldOut ? 'grayscale contrast-75' : ''
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Sold Out Banner */}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-1.5 bg-rose-600/90 text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-xl border border-white/20">
              Sold Out Today
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#E06D53] px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Chef's Pick
            </span>
          )}
          {item.isPopular && !item.isChefSpecial && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1E1B18] bg-amber-300 px-2.5 py-1 rounded-full shadow-sm">
              <Flame className="w-3 h-3 text-red-600" /> Bestseller
            </span>
          )}
        </div>

        {/* Spice indicator on image if spicy */}
        {item.defaultSpice && item.defaultSpice !== 'Mild' && (
          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-400" />
            <span>{item.defaultSpice}</span>
          </div>
        )}

        {/* Serves / Calories pill */}
        <div className="absolute bottom-2.5 left-2.5 text-white/90 text-[11px] font-medium flex items-center gap-2">
          {item.serves && (
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              <Users className="w-3 h-3" /> {item.serves}
            </span>
          )}
          {item.calories && (
            <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md hidden sm:inline-block">
              {item.calories}
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          
          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1">
            {item.dietary.map((d) => getDietaryBadge(d))}
          </div>

          {/* Title & Tagline */}
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#1E1B18] group-hover:text-[#E06D53] transition-colors leading-snug">
              {item.name}
            </h3>
            {item.tagline && (
              <p className="text-xs text-[#8C8275] font-medium mt-0.5 line-clamp-1">
                {item.tagline}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-[#5A5043] leading-relaxed line-clamp-2">
            {item.description}
          </p>

          {/* Included Tiers for Tiffins */}
          {item.includedTiers && item.includedTiers.length > 0 && (
            <div className="pt-2 border-t border-[#F2ECE1]">
              <div className="text-[11px] font-bold text-[#7A7063] uppercase tracking-wider mb-1">
                Includes In Dabba:
              </div>
              <ul className="text-[11px] text-[#4A4237] space-y-0.5">
                {item.includedTiers.slice(0, 3).map((tier, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E06D53]"></span>
                    <span className="truncate">{tier}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Footer: Price & Action Buttons */}
        <div className="pt-4 mt-3 border-t border-[#F0E8DC] flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase text-[#8C8275] tracking-wider">
              Price
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-[#8C8275]">NZD</span>
              <span className="font-mono font-bold text-lg text-[#1E1B18]">
                ${item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {item.isSoldOut ? (
              <span className="py-2 px-3.5 bg-neutral-200 text-neutral-500 font-bold text-xs rounded-xl cursor-not-allowed select-none">
                Sold Out
              </span>
            ) : item.customizable ? (
              <button
                id={`customize-btn-${item.id}`}
                onClick={() => onCustomize(item)}
                className="py-2 px-3.5 bg-[#FAF0ED] hover:bg-[#E06D53] text-[#C95338] hover:text-white font-bold text-xs rounded-xl border border-[#F0D5CD] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            ) : (
              <button
                id={`quick-add-btn-${item.id}`}
                onClick={() => onQuickAdd(item)}
                className="py-2 px-3.5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
