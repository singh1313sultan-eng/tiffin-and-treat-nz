import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Check, 
  ShoppingBag, 
  Flame, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { MenuItem, PizzaSize, PizzaCrust, SpiceLevel, CartItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';

interface HalfAndHalfBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const HalfAndHalfBuilderModal: React.FC<HalfAndHalfBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const eligiblePizzas = MENU_ITEMS.filter(item => item.category === 'pizzas');

  const [leftPizza, setLeftPizza] = useState<MenuItem>(eligiblePizzas[0] || MENU_ITEMS[0]);
  const [rightPizza, setRightPizza] = useState<MenuItem>(eligiblePizzas[1] || MENU_ITEMS[1]);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('Large 12"');
  const [selectedCrust, setSelectedCrust] = useState<PizzaCrust>('Hand Tossed Classic');
  const [leftSpice, setLeftSpice] = useState<SpiceLevel>('Medium');
  const [rightSpice, setRightSpice] = useState<SpiceLevel>('Kiwi Hot');
  const [quantity, setQuantity] = useState<number>(1);

  // Price is max of both halves + size difference + crust
  const basePrice = Math.max(leftPizza.price, rightPizza.price);
  let sizeDelta = selectedSize === 'Jumbo 15"' ? 6.00 : 0;
  let crustDelta = 0;
  if (selectedCrust.includes('Stuffed Crust')) crustDelta = 4.50;
  if (selectedCrust.includes('Gluten-Free')) crustDelta = 4.00;
  if (selectedCrust.includes('Garlic Butter')) crustDelta = 2.50;

  const unitPrice = basePrice + sizeDelta + crustDelta;
  const totalPrice = unitPrice * quantity;

  const handleAddHalfAndHalf = () => {
    // Create a virtual menu item for representation
    const halfItem: MenuItem = {
      id: `half-and-half-${leftPizza.id}-${rightPizza.id}`,
      name: `Half & Half Pizza: ${leftPizza.name} + ${rightPizza.name}`,
      category: 'pizzas',
      description: `Left: ${leftPizza.name} (${leftSpice}) | Right: ${rightPizza.name} (${rightSpice})`,
      price: unitPrice,
      image: leftPizza.image,
      dietary: ['halal', 'chef-special'],
      customizable: true
    };

    const cartItem: CartItem = {
      cartItemId: `half-half-${Date.now()}`,
      menuItem: halfItem,
      customization: {
        size: selectedSize,
        crust: selectedCrust,
        halfHalf: {
          isHalfHalf: true,
          leftName: `${leftPizza.name} (${leftSpice})`,
          rightName: `${rightPizza.name} (${rightSpice})`
        }
      },
      unitPrice,
      quantity,
      totalPrice
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EBE3D5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
                Half & Half Pizza Studio
              </h2>
              <p className="text-xs text-[#706658]">
                Craft two distinct gourmet recipes on a single artisanal crust
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E2D8C9] flex items-center justify-center text-[#706658] hover:text-[#1E1B18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Builder Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Visual Dual-Half Preview */}
          <div className="bg-[#FAF7F2] border border-[#E8E0D2] rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            
            {/* Left Half Showcase */}
            <div className="flex-1 w-full bg-white p-3.5 rounded-xl border border-[#E2D8C9] shadow-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#E06D53] bg-[#FAF0ED] px-2 py-0.5 rounded-md inline-block mb-1.5">
                Side A (Left 50%)
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src={leftPizza.image} 
                  alt={leftPizza.name} 
                  className="w-14 h-14 rounded-lg object-cover border border-[#E8E0D2]" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-bold text-sm text-[#1E1B18] truncate">
                    {leftPizza.name}
                  </div>
                  <div className="text-[11px] text-[#706658] flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-[#E06D53]" />
                    <span>Spice: {leftSpice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="font-serif font-bold text-xl text-[#A89D8E] shrink-0">
              &
            </div>

            {/* Right Half Showcase */}
            <div className="flex-1 w-full bg-white p-3.5 rounded-xl border border-[#E2D8C9] shadow-xs">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                Side B (Right 50%)
              </div>
              <div className="flex items-center gap-3">
                <img 
                  src={rightPizza.image} 
                  alt={rightPizza.name} 
                  className="w-14 h-14 rounded-lg object-cover border border-[#E8E0D2]" 
                />
                <div className="flex-1 min-w-0">
                  <div className="font-serif font-bold text-sm text-[#1E1B18] truncate">
                    {rightPizza.name}
                  </div>
                  <div className="text-[11px] text-[#706658] flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-[#2563EB]" />
                    <span>Spice: {rightSpice}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 1. Select Left Flavor */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
              1. Choose Left Half Flavor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {eligiblePizzas.map((p) => {
                const isSelected = leftPizza.id === p.id;
                return (
                  <div
                    key={`left-${p.id}`}
                    onClick={() => setLeftPizza(p)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#E06D53] bg-[#FAF0ED] ring-1 ring-[#E06D53]'
                        : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1E1B18] truncate">{p.name}</div>
                        <div className="text-[10px] text-[#8C8275] truncate">{p.tagline}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#E06D53] shrink-0 ml-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Select Right Flavor */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
              2. Choose Right Half Flavor
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {eligiblePizzas.map((p) => {
                const isSelected = rightPizza.id === p.id;
                return (
                  <div
                    key={`right-${p.id}`}
                    onClick={() => setRightPizza(p)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]'
                        : 'border-[#E8E0D2] bg-white hover:border-[#D9CFBF]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1E1B18] truncate">{p.name}</div>
                        <div className="text-[10px] text-[#8C8275] truncate">{p.tagline}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#2563EB] shrink-0 ml-1" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Size & Crust */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block mb-1.5">
                Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Large 12"', 'Jumbo 15"'] as PizzaSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#E06D53] bg-[#FAF0ED] text-[#E06D53]'
                        : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                    }`}
                  >
                    {s} {s === 'Jumbo 15"' ? '(+$6.00)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block mb-1.5">
                Crust
              </label>
              <select
                value={selectedCrust}
                onChange={(e) => setSelectedCrust(e.target.value as PizzaCrust)}
                className="w-full p-2.5 bg-white border border-[#E2D8C9] rounded-xl text-xs font-medium text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
              >
                <option value="Hand Tossed Classic">Hand Tossed Classic</option>
                <option value="Thin & Crispy">Thin & Crispy</option>
                <option value="Cheese-Burst Stuffed Crust (+NZD $4.50)">Cheese-Burst Stuffed (+NZD $4.50)</option>
                <option value="Gluten-Free Base (+NZD $4.00)">Gluten-Free Base (+NZD $4.00)</option>
                <option value="Garlic Butter Infused Crust (+NZD $2.50)">Garlic Butter Infused (+NZD $2.50)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E8E0D2] bg-[#FAF7F2] flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-2xl border border-[#E2D8C9]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] flex items-center justify-center text-[#1E1B18]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-sm text-[#1E1B18] w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE1] flex items-center justify-center text-[#1E1B18]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            id="half-half-add-to-cart-btn"
            onClick={handleAddHalfAndHalf}
            className="flex-1 py-3.5 px-5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add Half & Half Pizza</span>
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
