import React from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Coins, 
  Zap, 
  CheckCircle2, 
  Shield, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { NZPaymentGatewayMethod, NZBankOption } from '../types';

export const NZ_BANKS: NZBankOption[] = [
  { id: 'anz', name: 'ANZ Bank New Zealand', shortName: 'ANZ', color: '#004165', logoText: 'ANZ', supportsOnlineEftpos: true, supportsPoli: true },
  { id: 'asb', name: 'ASB Bank', shortName: 'ASB', color: '#FFB800', logoText: 'ASB', supportsOnlineEftpos: true, supportsPoli: true },
  { id: 'bnz', name: 'Bank of New Zealand', shortName: 'BNZ', color: '#002C6C', logoText: 'BNZ', supportsOnlineEftpos: true, supportsPoli: true },
  { id: 'kiwibank', name: 'Kiwibank NZ', shortName: 'Kiwibank', color: '#6BB72E', logoText: 'Kiwi', supportsOnlineEftpos: true, supportsPoli: true },
  { id: 'westpac', name: 'Westpac New Zealand', shortName: 'Westpac', color: '#DA1710', logoText: 'Westpac', supportsOnlineEftpos: false, supportsPoli: true },
  { id: 'cooperative', name: 'The Co-operative Bank', shortName: 'Co-op', color: '#006E52', logoText: 'Co-op', supportsOnlineEftpos: true, supportsPoli: true },
  { id: 'tsb', name: 'TSB Bank NZ', shortName: 'TSB', color: '#002D62', logoText: 'TSB', supportsOnlineEftpos: false, supportsPoli: true },
];

interface NZPaymentGatewaySelectorProps {
  selectedMethod: NZPaymentGatewayMethod;
  onSelectMethod: (method: NZPaymentGatewayMethod) => void;
  selectedBank: string;
  onSelectBank: (bankId: string) => void;
  totalAmount: number;
  mobileNumber: string;
  onMobileChange: (val: string) => void;
  cardNumber: string;
  onCardNumberChange: (val: string) => void;
  cardExpiry: string;
  onCardExpiryChange: (val: string) => void;
  cardCvc: string;
  onCardCvcChange: (val: string) => void;
  orderMode: 'delivery' | 'pickup';
}

export const NZPaymentGatewaySelector: React.FC<NZPaymentGatewaySelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  selectedBank,
  onSelectBank,
  totalAmount,
  mobileNumber,
  onMobileChange,
  cardNumber,
  onCardNumberChange,
  cardExpiry,
  onCardExpiryChange,
  cardCvc,
  onCardCvcChange,
  orderMode
}) => {
  const installment4x = (totalAmount / 4).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
            NZ
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A4237]">
            New Zealand Payment Gateways
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#706658]">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>NZ Banking Standard Encrypted</span>
        </div>
      </div>

      {/* Gateway Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        
        {/* 1. Online EFTPOS (NZ Paymark) */}
        <button
          type="button"
          onClick={() => onSelectMethod('online_eftpos')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'online_eftpos'
              ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-600/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-800 text-white font-bold text-[10px] tracking-wide">
                ONLINE EFTPOS
              </span>
            </div>
            {selectedMethod === 'online_eftpos' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">NZ Bank App Approval</div>
            <div className="text-[10px] text-[#706658] mt-0.5">ANZ, ASB, BNZ, Kiwibank</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[10px] font-semibold text-emerald-800">
            <span>Zero Surcharges</span>
            <span className="text-[9px] bg-emerald-200/80 px-1 rounded">Instant</span>
          </div>
        </button>

        {/* 2. Windcave (DPS) Card Gateway */}
        <button
          type="button"
          onClick={() => onSelectMethod('windcave_card')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'windcave_card'
              ? 'border-[#E06D53] bg-[#FAF0ED] shadow-sm ring-2 ring-[#E06D53]/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <CreditCard className="w-4 h-4 text-[#E06D53]" />
              <span className="font-bold text-[11px] text-[#1E1B18]">Windcave NZ</span>
            </div>
            {selectedMethod === 'windcave_card' && (
              <CheckCircle2 className="w-4 h-4 text-[#E06D53] shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">Credit & Debit Card</div>
            <div className="text-[10px] text-[#706658] mt-0.5">Visa, Mastercard, AMEX</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#E8E0D2] text-[10px] text-[#8C8275] flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" />
            <span>DPS 3D-Secure 2.0</span>
          </div>
        </button>

        {/* 3. POLi Internet Banking NZ */}
        <button
          type="button"
          onClick={() => onSelectMethod('poli_nz')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'poli_nz'
              ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-600/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-1.5 py-0.5 rounded-md bg-blue-800 text-white font-bold text-[10px] tracking-wider">
              POLi NZ
            </span>
            {selectedMethod === 'poli_nz' && (
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">Direct Bank Pay</div>
            <div className="text-[10px] text-[#706658] mt-0.5">7 NZ Major Banks</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-blue-100 text-[10px] text-blue-800 font-medium">
            <span>Instant Receipt</span>
          </div>
        </button>

        {/* 4. Afterpay NZ / Buy Now Pay Later */}
        <button
          type="button"
          onClick={() => onSelectMethod('afterpay_nz')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'afterpay_nz'
              ? 'border-teal-600 bg-teal-50/70 shadow-sm ring-2 ring-teal-600/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-1.5 py-0.5 rounded-md bg-[#B2FCE4] text-[#000000] font-bold text-[10px] tracking-tight">
              afterpay ↗
            </span>
            {selectedMethod === 'afterpay_nz' && (
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">Pay in 4 NZD</div>
            <div className="text-[10px] text-[#706658] mt-0.5">4 x NZD ${installment4x}</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-teal-100 text-[10px] text-teal-800 font-medium">
            <span>0% Interest NZ</span>
          </div>
        </button>

        {/* 5. Apple / Google Pay */}
        <button
          type="button"
          onClick={() => onSelectMethod('apple_google_pay')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'apple_google_pay'
              ? 'border-gray-800 bg-gray-50 shadow-sm ring-2 ring-gray-800/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-xs text-[#1E1B18]"> Pay / G Pay</div>
            {selectedMethod === 'apple_google_pay' && (
              <CheckCircle2 className="w-4 h-4 text-gray-800 shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">1-Touch Pay</div>
            <div className="text-[10px] text-[#706658] mt-0.5">Biometric instant checkout</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-gray-200 text-[10px] text-gray-700 font-medium">
            <span>Fast & Tokenized</span>
          </div>
        </button>

        {/* 6. Cash / EFTPOS at door */}
        <button
          type="button"
          onClick={() => onSelectMethod('cash_eftpos_delivery')}
          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
            selectedMethod === 'cash_eftpos_delivery'
              ? 'border-amber-700 bg-amber-50/70 shadow-sm ring-2 ring-amber-700/30'
              : 'border-[#E8E0D2] bg-white hover:border-[#D1C7B7]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-4 h-4 text-amber-700" />
            {selectedMethod === 'cash_eftpos_delivery' && (
              <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-[#1E1B18]">
              {orderMode === 'delivery' ? 'EFTPOS / Cash on Delivery' : 'Pay at Counter'}
            </div>
            <div className="text-[10px] text-[#706658] mt-0.5">Mobile terminal with driver</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-amber-200 text-[10px] text-amber-800 font-medium">
            <span>Cash / NZ Debit Card</span>
          </div>
        </button>

      </div>

      {/* Selected Gateway Detailed Configuration Panels */}
      
      {/* 1. ONLINE EFTPOS Configuration Panel */}
      {selectedMethod === 'online_eftpos' && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-800" />
              <div>
                <div className="font-serif font-bold text-sm text-emerald-950">
                  Online EFTPOS (Worldline / Paymark NZ)
                </div>
                <div className="text-[11px] text-emerald-800">
                  No card numbers required. Approve directly in your NZ banking mobile app.
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
              Official NZ Rail
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-950 mb-1.5">
              Select Your New Zealand Bank:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NZ_BANKS.filter(b => b.supportsOnlineEftpos).map(bank => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => onSelectBank(bank.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    selectedBank === bank.id
                      ? 'border-emerald-700 bg-white shadow-md ring-2 ring-emerald-600/40 text-emerald-950 font-bold'
                      : 'border-emerald-200 bg-emerald-100/40 hover:bg-white text-emerald-900'
                  }`}
                >
                  <span 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.logoText.slice(0, 3)}
                  </span>
                  <span className="text-xs font-semibold">{bank.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-emerald-950 mb-1">
              Your NZ Mobile Number Linked to Bank App:
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="e.g. 021 884 9231 or 027 123 4567"
                value={mobileNumber}
                onChange={(e) => onMobileChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <p className="text-[10px] text-emerald-800 mt-1">
              Upon placing order, an authorization prompt will ping your {NZ_BANKS.find(b => b.id === selectedBank)?.shortName || 'NZ Bank'} app.
            </p>
          </div>
        </div>
      )}

      {/* 2. WINDCAVE (DPS) Configuration Panel */}
      {selectedMethod === 'windcave_card' && (
        <div className="p-4 bg-[#FAF7F2] border border-[#E2D8C9] rounded-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#E06D53]" />
              <div>
                <div className="font-serif font-bold text-sm text-[#1E1B18]">
                  Windcave Hosted Card Payment Gateway
                </div>
                <div className="text-[11px] text-[#706658]">
                  Level 1 PCI-DSS certified gateway hosted in Auckland, New Zealand
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold bg-[#E8E0D2] px-1.5 py-0.5 rounded text-[#4A4237]">VISA</span>
              <span className="text-[9px] font-bold bg-[#E8E0D2] px-1.5 py-0.5 rounded text-[#4A4237]">MC</span>
              <span className="text-[9px] font-bold bg-[#E8E0D2] px-1.5 py-0.5 rounded text-[#4A4237]">AMEX</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#706658] mb-1">Card Number</label>
            <input
              type="text"
              placeholder="4532 •••• •••• 8841"
              value={cardNumber}
              onChange={(e) => onCardNumberChange(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#E2D8C9] rounded-xl text-xs font-mono text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#706658] mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                placeholder="08/28"
                value={cardExpiry}
                onChange={(e) => onCardExpiryChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E2D8C9] rounded-xl text-xs font-mono text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#706658] mb-1">CVC / CVV (3 or 4 digits)</label>
              <input
                type="password"
                placeholder="382"
                maxLength={4}
                value={cardCvc}
                onChange={(e) => onCardCvcChange(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#E2D8C9] rounded-xl text-xs font-mono text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
              />
            </div>
          </div>

          <div className="p-2.5 bg-white rounded-xl border border-[#EBE3D5] flex items-center justify-between text-[11px] text-[#706658]">
            <span>Cardholder Currency</span>
            <span className="font-bold text-[#1E1B18]">NZD (New Zealand Dollars - No FX Fees)</span>
          </div>
        </div>
      )}

      {/* 3. POLI NZ Configuration Panel */}
      {selectedMethod === 'poli_nz' && (
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-800" />
              <div>
                <div className="font-serif font-bold text-sm text-blue-950">
                  POLi Internet Banking New Zealand
                </div>
                <div className="text-[11px] text-blue-800">
                  Log into your NZ online banking securely without credit cards
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-blue-950 mb-1.5">
              Select Your NZ Bank:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NZ_BANKS.filter(b => b.supportsPoli).map(bank => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => onSelectBank(bank.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    selectedBank === bank.id
                      ? 'border-blue-700 bg-white shadow-md ring-2 ring-blue-600/40 text-blue-950 font-bold'
                      : 'border-blue-200 bg-blue-100/40 hover:bg-white text-blue-900'
                  }`}
                >
                  <span 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.logoText.slice(0, 3)}
                  </span>
                  <span className="text-xs font-semibold">{bank.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-blue-900 bg-blue-100/60 p-2.5 rounded-xl border border-blue-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-700 shrink-0" />
            <span>You will be securely routed to your bank's encrypted login gateway with instant reference confirmation.</span>
          </div>
        </div>
      )}

      {/* 4. AFTERPAY NZ Configuration Panel */}
      {selectedMethod === 'afterpay_nz' && (
        <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-800" />
              <div>
                <div className="font-serif font-bold text-sm text-teal-950">
                  Afterpay New Zealand (4x Fortnightly Payments)
                </div>
                <div className="text-[11px] text-teal-800">
                  Enjoy your artisanal tiffin & treats today, spread payments over 6 weeks.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-xl border border-teal-200">
              <div className="text-[10px] text-teal-800 font-bold">1. Today</div>
              <div className="font-mono font-bold text-[#1E1B18] mt-0.5">${installment4x}</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-teal-200">
              <div className="text-[10px] text-teal-800 font-bold">2. In 2 Weeks</div>
              <div className="font-mono font-bold text-[#1E1B18] mt-0.5">${installment4x}</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-teal-200">
              <div className="text-[10px] text-teal-800 font-bold">3. In 4 Weeks</div>
              <div className="font-mono font-bold text-[#1E1B18] mt-0.5">${installment4x}</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-teal-200">
              <div className="text-[10px] text-teal-800 font-bold">4. In 6 Weeks</div>
              <div className="font-mono font-bold text-[#1E1B18] mt-0.5">${installment4x}</div>
            </div>
          </div>

          <div className="text-[11px] text-teal-900 flex items-center justify-between">
            <span>Total Payable: <strong className="font-mono">NZD ${totalAmount.toFixed(2)}</strong></span>
            <span className="text-teal-700 font-semibold">No interest or added fees</span>
          </div>
        </div>
      )}

      {/* 5. APPLE PAY & GOOGLE PAY Panel */}
      {selectedMethod === 'apple_google_pay' && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2 text-center animate-in fade-in duration-200">
          <div className="font-serif font-bold text-sm text-[#1E1B18]">
            Biometric Device Checkout
          </div>
          <p className="text-xs text-[#706658]">
            Touch ID, Face ID or Google Wallet with any linked New Zealand debit/credit card.
          </p>
        </div>
      )}

      {/* 6. CASH / EFTPOS ON DELIVERY Panel */}
      {selectedMethod === 'cash_eftpos_delivery' && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
          <div className="font-serif font-bold text-sm text-amber-950 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-700" />
            <span>
              {orderMode === 'delivery' ? 'Pay upon Courier Arrival' : 'Pay at Counter upon Pickup'}
            </span>
          </div>
          <p className="text-xs text-amber-900">
            {orderMode === 'delivery'
              ? 'Our driver carries a mobile NZ EFTPOS terminal accepting all New Zealand debit & credit cards, plus exact cash changes.'
              : 'Pay by cash or swipe your EFTPOS / credit card at the register when you collect your warm order.'}
          </p>
        </div>
      )}

    </div>
  );
};
