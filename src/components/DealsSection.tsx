import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Users, 
  Check, 
  Plus, 
  Percent, 
  Copy, 
  CheckCheck
} from 'lucide-react';
import { ComboDeal, CartItem, MenuItem } from '../types';
import { COMBO_DEALS, PROMO_COUPONS } from '../data/mockData';

interface DealsSectionProps {
  onAddComboToCart: (deal: ComboDeal) => void;
  onApplyCouponCode: (code: string) => void;
  appliedCoupon?: string;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  onAddComboToCart,
  onApplyCouponCode,
  appliedCoupon
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyCouponCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="deals-section" className="py-12 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] border-y border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#C95338] bg-[#FAF0ED] px-3 py-1 rounded-full border border-[#F0D5CD]">
              <Flame className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>Special Combos & Super Deals</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1E1B18] mt-2">
              Value Meal Bundles & Office Specials
            </h2>
            <p className="text-xs sm:text-sm text-[#706658] mt-1 max-w-xl">
              Curated combinations of tiffins, artisanal pizzas, sides, and sweet treats crafted to give you the ultimate feast at unbeatable value.
            </p>
          </div>

          {/* Active Promo Coupon Cards */}
          <div className="flex flex-wrap gap-2">
            {PROMO_COUPONS.map((coupon) => {
              const isApplied = appliedCoupon === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className={`p-2.5 px-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isApplied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-white border-[#E2D8C9] text-[#2E2923]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Percent className="w-3 h-3 text-[#E06D53]" />
                      <span className="font-mono bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E0D2]">
                        {coupon.code}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#706658] mt-0.5">{coupon.description}</div>
                  </div>

                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8E0D2] text-[#1E1B18] transition-colors cursor-pointer text-xs font-semibold"
                    title="Apply code"
                  >
                    {copiedCode === coupon.code || isApplied ? (
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#706658]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMBO_DEALS.map((deal) => (
            <div
              key={deal.id}
              id={`deal-card-${deal.id}`}
              className="bg-white rounded-3xl border border-[#E8E0D2] overflow-hidden shadow-sm hover:shadow-lg hover:border-[#D9CFBF] transition-all flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-100">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-[#E06D53] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
                  {deal.badge}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{deal.serves}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-lg leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    {deal.tagline}
                  </p>
                </div>
              </div>

              {/* Items List Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#7A7063]">
                    What's Included:
                  </div>
                  <ul className="space-y-1.5">
                    {deal.itemsIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#3D372E]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-[#8C8275] pt-1 leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#8C8275]">Combo Price</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-[#8C8275]">NZD</span>
                      <span className="font-mono font-bold text-xl text-[#1E1B18]">
                        ${deal.price.toFixed(2)}
                      </span>
                      <span className="font-mono text-xs text-neutral-400 line-through">
                        ${deal.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`add-combo-btn-${deal.id}`}
                    onClick={() => onAddComboToCart(deal)}
                    className="py-2.5 px-4 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Deal</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
