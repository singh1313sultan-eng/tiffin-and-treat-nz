import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Flame, 
  Check, 
  MessageSquare,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { 
  MenuItem, 
  CartItem, 
  SpiceLevel, 
  CartCustomization 
} from '../types';
import { TOPPING_OPTIONS } from '../data/mockData';

interface ItemCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (cartItem: CartItem) => void;
}

const SPICE_LEVELS: { level: SpiceLevel; label: string; iconColor: string; desc: string }[] = [
  { level: 'Mild', label: 'Mild', iconColor: 'text-green-500', desc: 'Gentle aromatic spices, subtle flavor' },
  { level: 'Medium', label: 'Medium', iconColor: 'text-amber-500', desc: 'Authentic balanced Punjabi flavor' },
  { level: 'Kiwi Hot', label: 'Kiwi Hot', iconColor: 'text-orange-500', desc: 'Pleasantly fiery desi kick' },
  { level: 'Indian Fire 🔥', label: 'Desi Fire 🔥', iconColor: 'text-red-600', desc: 'Real traditional heat' }
];

const TIFFIN_CURRY_OPTIONS = [
  'Daily Regular Curry of the Day',
  'Royal Sahi Paneer',
  'Spiced Paneer Burji',
  'Roasted Baingan Bharta',
  'Punjabi Kadhi Pakora',
  'Black Chana Masala',
  'Yellow Daal Tadka'
];

const TIFFIN_BREAD_OPTIONS = [
  '4x Hot Handmade Butter Rotis',
  '4x Wholewheat Phulkas (Light Butter)',
  'Steamed Fragrant Basmati Rice'
];

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart
}) => {
  if (!isOpen || !item) return null;

  const isTiffin = item.category === 'tiffins';
  const hasSpiceOption = !['drinks', 'tiffin_extras'].includes(item.category);

  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>(item.defaultSpice || 'Medium');
  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [selectedCurry, setSelectedCurry] = useState<string>(TIFFIN_CURRY_OPTIONS[0]);
  const [selectedBread, setSelectedBread] = useState<string>(TIFFIN_BREAD_OPTIONS[0]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate Unit Price
  let currentUnitPrice = item.price;
  const addonsSum = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  currentUnitPrice += addonsSum;

  const totalPrice = currentUnitPrice * quantity;

  const handleToggleTopping = (topping: { name: string; price: number }) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAdd = () => {
    const customization: CartCustomization = {
      spiceLevel: hasSpiceOption ? selectedSpice : undefined,
      selectedToppings: selectedToppings.length > 0 ? selectedToppings : undefined,
      specialInstructions: specialInstructions.trim() || undefined
    };

    if (isTiffin) {
      customization.tiffinMealChoice = `${selectedCurry} with ${selectedBread}`;
    }

    const cartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      customization,
      unitPrice: currentUnitPrice,
      quantity,
      totalPrice
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Modal Header with Food Visual */}
        <div className="relative h-44 sm:h-52 w-full bg-[#1E1B18] shrink-0 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E06D53] text-white">
                {item.category.replace('_', ' ').toUpperCase()}
              </span>
              {item.calories && (
                <span className="text-xs text-white/70">
                  {item.calories}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              {item.name}
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TIFFIN CUSTOMIZATIONS */}
          {isTiffin && (
            <>
              {/* Curry Choice */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  1. Select Curry / Main
                </label>
                <div className="space-y-2">
                  {TIFFIN_CURRY_OPTIONS.map((curry) => {
                    const isSelected = selectedCurry === curry;
                    return (
                      <div
                        key={curry}
                        onClick={() => setSelectedCurry(curry)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#E06D53] bg-[#FAF0ED]'
                            : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#E06D53] bg-[#E06D53]' : 'border-neutral-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-[#1E1B18]">{curry}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bread Choice */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  2. Select Breads or Rice
                </label>
                <div className="space-y-2">
                  {TIFFIN_BREAD_OPTIONS.map((bread) => {
                    const isSelected = selectedBread === bread;
                    return (
                      <div
                        key={bread}
                        onClick={() => setSelectedBread(bread)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#E06D53] bg-[#FAF0ED]'
                            : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#E06D53] bg-[#E06D53]' : 'border-neutral-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-[#1E1B18]">{bread}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* SPICE LEVEL SELECTOR (For foods with spices) */}
          {hasSpiceOption && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#E06D53]" />
                  <span>Select Desired Spice Level</span>
                </label>
                <span className="text-xs font-bold text-[#E06D53]">{selectedSpice}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SPICE_LEVELS.map((s) => {
                  const isSelected = selectedSpice === s.level;
                  return (
                    <button
                      key={s.level}
                      type="button"
                      onClick={() => setSelectedSpice(s.level)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#E06D53] bg-[#FAF0ED] text-[#E06D53] font-bold shadow-xs'
                          : 'border-[#E8E0D2] bg-white text-[#5A5043] hover:border-[#D9CFBF]'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-[#8C8275] mt-0.5 line-clamp-1">{s.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXTRA ADD-ONS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                Popular Add-ons & Extra Dips
              </label>
              <span className="text-[11px] text-[#8C8275]">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPPING_OPTIONS.map((top) => {
                const isChecked = selectedToppings.some(t => t.name === top.name);
                return (
                  <div
                    key={top.id}
                    onClick={() => handleToggleTopping({ name: top.name, price: top.price })}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'border-[#E06D53] bg-[#FAF0ED]'
                        : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1E1B18]">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-[#E06D53] border-[#E06D53] text-white' : 'border-neutral-300'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{top.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#706658] shrink-0 ml-1">
                      +${top.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SPECIAL INSTRUCTIONS */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#8C8275]" />
              <span>Special Kitchen Instructions</span>
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra crispy paratha, less oil, pack pickle separately, etc."
              className="w-full bg-[#FAF7F2] border border-[#E0D7C8] rounded-xl p-3 text-xs sm:text-sm text-[#1E1B18] placeholder-[#9C9284] focus:outline-none focus:border-[#E06D53] resize-none"
            />
          </div>

        </div>

        {/* Modal Footer (Quantity & Add to Cart) */}
        <div className="p-4 sm:p-5 border-t border-[#E8E0D2] bg-[#FAF7F2] flex items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#D9CFBF] bg-white rounded-2xl p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#5A5043] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-mono font-bold text-sm text-[#1E1B18]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#5A5043] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Order</span>
            </div>
            <span className="font-mono text-base font-extrabold tracking-tight">
              NZD ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
