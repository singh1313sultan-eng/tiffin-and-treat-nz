import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  Check, 
  Search, 
  Truck, 
  Store as StoreIcon, 
  Info,
  Navigation
} from 'lucide-react';
import { OrderMode, StoreLocation } from '../types';
import { STORE_LOCATIONS, NZ_SUBURBS_LIST } from '../data/mockData';

interface OrderTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: OrderMode;
  onSelectMode: (mode: OrderMode) => void;
  selectedStore: StoreLocation;
  onSelectStore: (store: StoreLocation) => void;
  deliveryAddress: string;
  onSelectDeliveryAddress: (address: string) => void;
}

export const OrderTypeSelectorModal: React.FC<OrderTypeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  selectedStore,
  onSelectStore,
  deliveryAddress,
  onSelectDeliveryAddress
}) => {
  const [activeTab, setActiveTab] = useState<OrderMode>(currentMode);
  const [addressQuery, setAddressQuery] = useState(deliveryAddress || '');
  const [selectedSuburb, setSelectedSuburb] = useState(deliveryAddress || 'Auckland CBD');
  const [storeSearchQuery, setStoreSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredStores = STORE_LOCATIONS.filter(store => 
    store.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
    store.suburb.toLowerCase().includes(storeSearchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(storeSearchQuery.toLowerCase())
  );

  const handleApplyDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (addressQuery.trim()) {
      onSelectDeliveryAddress(addressQuery.trim());
    } else {
      onSelectDeliveryAddress(selectedSuburb);
    }
    onSelectMode('delivery');
    onClose();
  };

  const handleSelectStorePickup = (store: StoreLocation) => {
    onSelectStore(store);
    onSelectMode('pickup');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#EBE3D5] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
              Choose Your Order Method
            </h2>
            <p className="text-xs text-[#706658] mt-0.5">
              Select delivery to your door or click & collect from our stores
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E2D8C9] flex items-center justify-center text-[#706658] hover:text-[#1E1B18] hover:bg-[#F2ECE1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="grid grid-cols-2 gap-3 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8E0D2]">
            <button
              id="modal-tab-delivery"
              onClick={() => setActiveTab('delivery')}
              className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'delivery'
                  ? 'bg-white text-[#1E1B18] shadow-sm border border-[#E2D8C9]'
                  : 'text-[#706658] hover:text-[#1E1B18]'
              }`}
            >
              <Truck className={`w-4 h-4 ${activeTab === 'delivery' ? 'text-[#E06D53]' : 'text-neutral-400'}`} />
              <span>Doorstep Delivery</span>
            </button>
            <button
              id="modal-tab-pickup"
              onClick={() => setActiveTab('pickup')}
              className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'pickup'
                  ? 'bg-white text-[#1E1B18] shadow-sm border border-[#E2D8C9]'
                  : 'text-[#706658] hover:text-[#1E1B18]'
              }`}
            >
              <StoreIcon className={`w-4 h-4 ${activeTab === 'pickup' ? 'text-[#2563EB]' : 'text-neutral-400'}`} />
              <span>Store Pickup (Click & Collect)</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 pt-2 overflow-y-auto flex-1">
          {activeTab === 'delivery' ? (
            <div className="space-y-5">
              <form onSubmit={handleApplyDelivery} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5A5043] mb-1.5">
                    Delivery Address or Suburb in NZ
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#E06D53] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="modal-delivery-address-input"
                      type="text"
                      placeholder="e.g. 142 Ponsonby Rd, Ponsonby, Auckland"
                      value={addressQuery}
                      onChange={(e) => setAddressQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-sm text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Popular Suburbs Quick Chips */}
                <div>
                  <label className="block text-xs font-semibold text-[#7A7063] mb-2">
                    Popular Delivery Areas:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {NZ_SUBURBS_LIST.slice(0, 10).map((suburb) => (
                      <button
                        key={suburb}
                        type="button"
                        onClick={() => {
                          setAddressQuery(suburb);
                          setSelectedSuburb(suburb);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                          addressQuery.includes(suburb) || selectedSuburb === suburb
                            ? 'bg-[#E06D53] text-white border-[#E06D53]'
                            : 'bg-[#FAF7F2] text-[#5A5043] border-[#E8E0D2] hover:border-[#D9CFBF]'
                        }`}
                      >
                        {suburb}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Fast Thermal Delivery:</strong> We pack every order in heat-retaining thermal dabbas to guarantee piping-hot delivery. Standard delivery fee is NZD $4.99 (Free over $60).
                  </div>
                </div>

                <button
                  type="submit"
                  id="modal-confirm-delivery-btn"
                  className="w-full py-3.5 px-4 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Start Delivery Order</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Store search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C8275] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search store by city or suburb..."
                  value={storeSearchQuery}
                  onChange={(e) => setStoreSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Stores list */}
              <div className="space-y-3">
                {filteredStores.map((store) => {
                  const isSelected = selectedStore.id === store.id && currentMode === 'pickup';
                  return (
                    <div
                      key={store.id}
                      onClick={() => handleSelectStorePickup(store)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50/40 ring-2 ring-[#2563EB]/20'
                          : 'border-[#E8E0D2] bg-white hover:border-[#2563EB]/60 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E1B18]">
                              {store.name}
                            </h3>
                            {store.isOpen ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Open Now
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                                Closed
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-[#5A5043] mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#8C8275] shrink-0" />
                            {store.address}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#706658]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              Ready in <strong>{store.pickupTime}</strong>
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-neutral-500" />
                              <span>{store.phone}{store.secondaryPhone ? ` / ${store.secondaryPhone}` : ''}</span>
                            </span>
                          </div>
                        </div>

                        <div className="ml-3 shrink-0">
                          {isSelected ? (
                            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-4 h-4" />
                            </div>
                          ) : (
                            <button className="px-3 py-1.5 text-xs font-bold text-[#2563EB] bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100">
                              Select
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
