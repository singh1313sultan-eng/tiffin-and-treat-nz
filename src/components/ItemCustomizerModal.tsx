import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Flame, 
  Check, 
  Sparkles, 
  ShoppingBag, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { 
  MenuItem, 
  PizzaSize, 
  PizzaCrust, 
  SpiceLevel, 
  CartCustomization, 
  CartItem 
} from '../types';
import { TOPPING_OPTIONS } from '../data/mockData';

interface ItemCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (cartItem: CartItem) => void;
}

const PIZZA_SIZES: { size: PizzaSize; label: string; priceDelta: number; desc: string }[] = [
  { size: 'Regular 10"', label: 'Regular 10"', priceDelta: 0, desc: '6 Slices • 1 - 2 People' },
  { size: 'Large 12"', label: 'Large 12"', priceDelta: 5.00, desc: '8 Slices • 2 - 3 People' },
  { size: 'Jumbo 15"', label: 'Jumbo 15"', priceDelta: 10.00, desc: '12 Slices • 3 - 4 People' }
];

const PIZZA_CRUSTS: { crust: PizzaCrust; label: string; priceDelta: number }[] = [
  { crust: 'Hand Tossed Classic', label: 'Hand Tossed Classic Crust', priceDelta: 0 },
  { crust: 'Thin & Crispy', label: 'Italian Thin & Crispy', priceDelta: 0 },
  { crust: 'Cheese-Burst Stuffed Crust (+NZD $4.50)', label: 'Cheese-Burst Stuffed Crust', priceDelta: 4.50 },
  { crust: 'Gluten-Free Base (+NZD $4.00)', label: 'Gluten-Free Cauliflower & Rice Base', priceDelta: 4.00 },
  { crust: 'Garlic Butter Infused Crust (+NZD $2.50)', label: 'Garlic Butter Infused Crust', priceDelta: 2.50 }
];

const SPICE_LEVELS: { level: SpiceLevel; label: string; iconColor: string; desc: string }[] = [
  { level: 'Mild', label: 'Mild', iconColor: 'text-green-500', desc: 'Gentle aromatic spices, kids friendly' },
  { level: 'Medium', label: 'Medium', iconColor: 'text-amber-500', desc: 'Authentic balanced NZ flavor' },
  { level: 'Kiwi Hot', label: 'Kiwi Hot', iconColor: 'text-orange-500', desc: 'Pleasantly fiery kick' },
  { level: 'Indian Fire 🔥', label: 'Desi Fire 🔥', iconColor: 'text-red-600', desc: 'Real traditional heat for daredevils' }
];

const TIFFIN_CURRY_OPTIONS = [
  'Royal Shahi Paneer Makhani (Vegetarian)',
  'Smoked Butter Chicken (100% Halal)',
  'Tandoori Chicken Tikka Masala (100% Halal)',
  'Amritsari Chana & Spinach Masala (Vegan)',
  'Slow-cooked 18hr Dal Makhani (Vegetarian)',
  'Canterbury Lamb Rogan Josh (+NZD $3.50)'
];

const TIFFIN_BREAD_OPTIONS = [
  '3x Handmade Butter Rotis',
  '4x Wholewheat Phulkas (No Butter)',
  '2x Fresh Garlic & Herb Naans (+NZD $2.00)',
  '3x Gluten-Free Methi Theplas (+NZD $2.50)',
  'Extra Fragrant Jeera Rice instead of Bread'
];

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart
}) => {
  if (!isOpen || !item) return null;

  const isPizza = item.category === 'pizzas';
  const isTiffin = item.category === 'tiffins';

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('Large 12"');
  const [selectedCrust, setSelectedCrust] = useState<PizzaCrust>('Hand Tossed Classic');
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>(item.defaultSpice || 'Medium');
  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [selectedCurry, setSelectedCurry] = useState<string>(TIFFIN_CURRY_OPTIONS[0]);
  const [selectedBread, setSelectedBread] = useState<string>(TIFFIN_BREAD_OPTIONS[0]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Calculate Unit Price
  let currentUnitPrice = item.price;

  if (isPizza) {
    const sizeObj = PIZZA_SIZES.find(s => s.size === selectedSize);
    if (sizeObj) currentUnitPrice += sizeObj.priceDelta;

    const crustObj = PIZZA_CRUSTS.find(c => c.crust === selectedCrust);
    if (crustObj) currentUnitPrice += crustObj.priceDelta;

    const toppingsSum = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    currentUnitPrice += toppingsSum;
  } else if (isTiffin) {
    if (selectedCurry.includes('Lamb Rogan Josh')) {
      currentUnitPrice += 3.50;
    }
    if (selectedBread.includes('Garlic & Herb Naans')) {
      currentUnitPrice += 2.00;
    } else if (selectedBread.includes('Gluten-Free')) {
      currentUnitPrice += 2.50;
    }
  }

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
      spiceLevel: selectedSpice,
      specialInstructions: specialInstructions.trim() || undefined
    };

    if (isPizza) {
      customization.size = selectedSize;
      customization.crust = selectedCrust;
      customization.selectedToppings = selectedToppings;
    } else if (isTiffin) {
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
        
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E06D53] bg-white px-2 py-0.5 rounded-full">
                {item.category.toUpperCase()}
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Halal Verified
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* PIZZA CUSTOMIZATIONS */}
          {isPizza && (
            <>
              {/* 1. Size selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                    1. Choose Pizza Size
                  </label>
                  <span className="text-[11px] text-[#E06D53] font-semibold">Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PIZZA_SIZES.map((s) => {
                    const isSelected = selectedSize === s.size;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setSelectedSize(s.size)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#E06D53] bg-[#FAF0ED] ring-2 ring-[#E06D53]/20'
                            : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-[#1E1B18]">{s.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#E06D53]" />}
                        </div>
                        <div className="text-[11px] text-[#706658] mt-0.5">{s.desc}</div>
                        <div className="text-xs font-mono font-bold text-[#E06D53] mt-1">
                          {s.priceDelta === 0 ? 'Standard' : `+NZD $${s.priceDelta.toFixed(2)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Crust selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                    2. Select Gourmet Crust
                  </label>
                  <span className="text-[11px] text-[#E06D53] font-semibold">Required</span>
                </div>

                <div className="space-y-2">
                  {PIZZA_CRUSTS.map((c) => {
                    const isSelected = selectedCrust === c.crust;
                    return (
                      <div
                        key={c.crust}
                        onClick={() => setSelectedCrust(c.crust)}
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
                          <span className="text-xs sm:text-sm font-semibold text-[#1E1B18]">
                            {c.label}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#706658]">
                          {c.priceDelta === 0 ? 'Included' : `+NZD $${c.priceDelta.toFixed(2)}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* TIFFIN CUSTOMIZATIONS */}
          {isTiffin && (
            <>
              {/* Curry Choice */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  1. Select Signature Curry / Main
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
                  2. Select Artisanal Breads or Rice
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

          {/* SPICE LEVEL SELECTOR (Universal) */}
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

          {/* EXTRA TOPPINGS (For Pizza) */}
          {isPizza && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  Extra Toppings & Gourmet Sauces
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
          )}

          {/* SPECIAL INSTRUCTIONS */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#8C8275]" />
              <span>Special Kitchen Instructions</span>
            </label>
            <textarea
              id="customizer-special-instructions"
              placeholder="e.g. Less oil, extra well done base, no coriander garnish, allergic to peanuts..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              className="w-full p-3 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs text-[#1E1B18] placeholder-[#9E9486] focus:outline-none focus:border-[#E06D53]"
            />
          </div>

        </div>

        {/* Footer: Quantity and Add to Cart */}
        <div className="p-4 sm:p-5 border-t border-[#E8E0D2] bg-[#FAF7F2] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-[#E2D8C9] shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] disabled:opacity-40 flex items-center justify-center text-[#1E1B18] transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-sm text-[#1E1B18] w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] flex items-center justify-center text-[#1E1B18] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="customizer-add-to-cart-btn"
            onClick={handleAdd}
            className="flex-1 py-3.5 px-5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm rounded-2xl shadow-md shadow-[#E06D53]/25 transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Order</span>
            </span>
            <span className="font-mono font-bold">
              NZD ${totalPrice.toFixed(2)}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
