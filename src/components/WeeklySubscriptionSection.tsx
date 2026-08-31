import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Check, 
  Sparkles, 
  Clock, 
  Utensils, 
  ShieldCheck, 
  ArrowRight,
  Truck,
  RotateCcw
} from 'lucide-react';
import { WeeklySubscriptionPlan, CartItem, MenuItem } from '../types';
import { WEEKLY_SUBSCRIPTION_PLANS } from '../data/mockData';

interface WeeklySubscriptionSectionProps {
  onSelectPlan: (plan: WeeklySubscriptionPlan, preferences: { dietary: string; timeSlot: string; startDay: string }) => void;
}

export const WeeklySubscriptionSection: React.FC<WeeklySubscriptionSectionProps> = ({
  onSelectPlan
}) => {
  const [selectedPlanModal, setSelectedPlanModal] = useState<WeeklySubscriptionPlan | null>(null);
  const [dietaryPref, setDietaryPref] = useState('Standard (Mixed Curries & Halal)');
  const [timeSlot, setTimeSlot] = useState('Office Lunch (11:45 AM – 1:00 PM)');
  const [startDay, setStartDay] = useState('Next Monday');

  const handleOpenSubscribe = (plan: WeeklySubscriptionPlan) => {
    setSelectedPlanModal(plan);
  };

  const handleConfirmSubscription = () => {
    if (!selectedPlanModal) return;
    onSelectPlan(selectedPlanModal, {
      dietary: dietaryPref,
      timeSlot,
      startDay
    });
    setSelectedPlanModal(null);
  };

  return (
    <section id="subscription-section" className="py-14 bg-[#FAF7F2] border-b border-[#EBE3D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#854D0E] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#FDE68A]">
            <CalendarCheck className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Weekly Tiffin Meal Pass</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#1E1B18]">
            Never Worry About Weekday Cooking Again
          </h2>
          <p className="text-xs sm:text-sm text-[#706658]">
            Freshly prepared homestyle multi-tier dabba meals delivered hot to your office desk or home every day across Auckland & Christchurch.
          </p>
        </div>

        {/* Benefits ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-3 bg-white rounded-xl border border-[#E8E0D2] flex items-center gap-2.5 text-xs font-semibold text-[#3D372E]">
            <RotateCcw className="w-4 h-4 text-[#E06D53] shrink-0" />
            <span>Pause or Skip Anytime</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8E0D2] flex items-center gap-2.5 text-xs font-semibold text-[#3D372E]">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free Office Delivery</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8E0D2] flex items-center gap-2.5 text-xs font-semibold text-[#3D372E]">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>100% Halal & Pure Veg</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E8E0D2] flex items-center gap-2.5 text-xs font-semibold text-[#3D372E]">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Daily Rotated Menu</span>
          </div>
        </div>

        {/* Plans Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WEEKLY_SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className="bg-white rounded-3xl border border-[#E8E0D2] p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#E06D53] transition-all relative group"
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 bg-[#E06D53] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1E1B18]">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-[#706658] mt-1 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price block */}
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2]">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-extrabold text-3xl text-[#1E1B18]">
                      ${plan.pricePerMeal.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#706658] font-medium">/ meal delivered</span>
                  </div>
                  <div className="text-[11px] text-[#8C8275] font-mono mt-0.5">
                    NZD ${plan.weeklyTotal.toFixed(2)} billed weekly ({plan.mealsPerWeek} meals)
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 text-xs text-[#3D372E]">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-[#F2ECE1]">
                <button
                  id={`subscribe-btn-${plan.id}`}
                  onClick={() => handleOpenSubscribe(plan)}
                  className="w-full py-3 px-4 bg-[#1E1B18] group-hover:bg-[#E06D53] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select & Customise Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Subscription Customization Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E8E0D2] space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E06D53] tracking-wider">
                  Weekly Plan Customisation
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1E1B18]">
                  {selectedPlanModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-[#8C8275] hover:text-[#1E1B18]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#4A4237] block mb-1">
                  1. Choose Dietary Preference:
                </label>
                <select
                  value={dietaryPref}
                  onChange={(e) => setDietaryPref(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18]"
                >
                  <option value="Standard (Mixed Curries & 100% Halal Meat)">Standard (Chef's Mix with 100% Halal Chicken/Lamb & Veg)</option>
                  <option value="100% Pure Vegetarian (Paneer & Vegetables)">100% Pure Vegetarian (Paneer & Veggies)</option>
                  <option value="100% Vegan & Dairy-Free">100% Vegan & Dairy-Free</option>
                  <option value="Low Carb & High Protein Thali">Low Carb & High Protein</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#4A4237] block mb-1">
                  2. Delivery Time Window:
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18]"
                >
                  <option value="Office Lunch (11:45 AM – 1:00 PM)">Office Lunch Window (11:45 AM – 1:00 PM)</option>
                  <option value="Evening Dinner (6:00 PM – 7:30 PM)">Evening Dinner Window (6:00 PM – 7:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#4A4237] block mb-1">
                  3. First Delivery Start Day:
                </label>
                <select
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18]"
                >
                  <option value="Starting Tomorrow">Starting Tomorrow</option>
                  <option value="Next Monday">Starting Next Monday</option>
                  <option value="Custom Date">Custom Date (specify in notes)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
              Weekly total: <strong>NZD ${selectedPlanModal.weeklyTotal.toFixed(2)}</strong>. You can pause or cancel anytime with 24 hours notice.
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="w-1/3 py-3 rounded-xl border border-[#E2D8C9] text-xs font-bold text-[#5A5043]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscription}
                className="w-2/3 py-3 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Add Meal Pass to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
