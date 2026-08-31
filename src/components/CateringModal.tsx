import React, { useState } from 'react';
import { 
  X, 
  UtensilsCrossed, 
  Users, 
  Calendar, 
  Building2, 
  Check, 
  Phone, 
  Mail, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CateringModal: React.FC<CateringModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [eventType, setEventType] = useState('Corporate Office Lunch');
  const [headCount, setHeadCount] = useState(25);
  const [packageTier, setPackageTier] = useState<'Standard' | 'Executive' | 'Royal'>('Executive');
  const [date, setDate] = useState('2026-09-15');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Price estimate
  const tierPrice = packageTier === 'Standard' ? 17.50 : packageTier === 'Executive' ? 24.50 : 34.00;
  const estimatedTotal = headCount * tierPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#EBE3D5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0ED] text-[#E06D53] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
                Corporate & Event Catering
              </h2>
              <p className="text-xs text-[#706658]">
                Individual hot lunch tiffins, pizza party banquets & buffet spreads
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#1E1B18]">
                Catering Quote Request Received!
              </h3>
              <p className="text-xs text-[#706658] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{contactName || 'Valued Customer'}</strong>. Our head chef and catering coordinator from Tiffin & Treat will contact you at <strong>{contactPhone || contactEmail || 'your phone'}</strong> within 2 business hours with an itemized proposal.
              </p>
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D2] max-w-sm mx-auto text-xs text-[#5A5043]">
                Estimated Quote: <strong>NZD ${estimatedTotal.toFixed(2)}</strong> for {headCount} guests.
              </div>
              <button
                onClick={onClose}
                className="py-2.5 px-6 bg-[#E06D53] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close & Return to Menu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
                  Event / Occasion Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Corporate Office Lunch', 'Party / Birthday Feast', 'Wedding / Large Function'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventType(type)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        eventType === type
                          ? 'border-[#E06D53] bg-[#FAF0ED] text-[#E06D53]'
                          : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count & Package Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block mb-1.5">
                    Estimated Guests: <span className="text-[#E06D53] font-mono font-bold text-sm">{headCount} People</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    step={5}
                    value={headCount}
                    onChange={(e) => setHeadCount(Number(e.target.value))}
                    className="w-full accent-[#E06D53]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8C8275] mt-1">
                    <span>10 pax</span>
                    <span>100 pax</span>
                    <span>250+ pax</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4237] block mb-1.5">
                    Select Catering Tier
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Standard', 'Executive', 'Royal'] as const).map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setPackageTier(tier)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          packageTier === tier
                            ? 'border-[#E06D53] bg-[#FAF0ED] text-[#E06D53] font-bold'
                            : 'border-[#E8E0D2] bg-white text-[#5A5043]'
                        }`}
                      >
                        <div className="text-xs">{tier}</div>
                        <div className="text-[10px] text-[#8C8275] mt-0.5">
                          {tier === 'Standard' ? '$17.50/p' : tier === 'Executive' ? '$24.50/p' : '$34.00/p'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimated Quote Card */}
              <div className="p-4 bg-[#FAF0ED] border border-[#F0D5CD] rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#C95338]">Estimated Package Cost</div>
                  <div className="font-serif font-bold text-xl text-[#1E1B18]">
                    NZD ${estimatedTotal.toFixed(2)} <span className="text-xs font-sans font-normal text-[#706658]">({headCount} guests)</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#5A5043]">
                  <div>✓ Individual thermal packaging</div>
                  <div>✓ 100% Halal & Veg choices</div>
                </div>
              </div>

              {/* Contact info inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#5A5043] block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Fonterra / Spark NZ / Private"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-[#1E1B18]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A5043] block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-[#1E1B18]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A5043] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="021 123 4567"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-[#1E1B18]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A5043] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.co.nz"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-[#1E1B18]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Request Custom Catering Proposal
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
