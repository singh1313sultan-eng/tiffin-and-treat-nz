import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  CreditCard, 
  Zap, 
  CheckCircle, 
  Lock, 
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { NZPaymentGatewayMethod, NZBankOption } from '../types';
import { NZ_BANKS } from './NZPaymentGatewaySelector';

interface NZGatewayProcessorModalProps {
  isOpen: boolean;
  gatewayMethod: NZPaymentGatewayMethod;
  selectedBankId: string;
  totalAmount: number;
  mobileNumber: string;
  customerName: string;
  orderNumber: string;
  onSuccess: (details: { gateway: string; bankName?: string; authCode: string; receiptRef: string }) => void;
  onCancel: () => void;
}

export const NZGatewayProcessorModal: React.FC<NZGatewayProcessorModalProps> = ({
  isOpen,
  gatewayMethod,
  selectedBankId,
  totalAmount,
  mobileNumber,
  customerName,
  orderNumber,
  onSuccess,
  onCancel
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'initiating' | 'awaiting_auth' | 'authorized'>('initiating');
  const [countdown, setCountdown] = useState(60);

  const selectedBank = NZ_BANKS.find(b => b.id === selectedBankId) || NZ_BANKS[0];

  useEffect(() => {
    // Stage 1: Handshake with NZ Gateway
    const timer1 = setTimeout(() => {
      setStep('awaiting_auth');
    }, 1200);

    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => {
    if (step === 'awaiting_auth' && countdown > 0) {
      const interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, countdown]);

  const handleManualApprove = () => {
    setStep('authorized');
    const randomAuth = `NZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomReceipt = `REC-NZD-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      onSuccess({
        gateway: gatewayMethod === 'online_eftpos' 
          ? 'Online EFTPOS NZ (Worldline/Paymark)' 
          : gatewayMethod === 'poli_nz' 
          ? 'POLi Internet Banking NZ'
          : gatewayMethod === 'windcave_card'
          ? 'Windcave (DPS) NZ Gateway'
          : gatewayMethod === 'afterpay_nz'
          ? 'Afterpay New Zealand'
          : 'Apple / Google Pay NZ',
        bankName: selectedBank.name,
        authCode: randomAuth,
        receiptRef: randomReceipt
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#E8E0D2] overflow-hidden">
        
        {/* Gateway Brand Header */}
        <div className="p-4 bg-[#1E1B18] text-white flex items-center justify-between border-b border-[#332E27]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
              NZ
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide uppercase text-emerald-400">
                {gatewayMethod === 'online_eftpos' && 'Worldline • Online EFTPOS NZ'}
                {gatewayMethod === 'poli_nz' && 'POLi Payments NZ'}
                {gatewayMethod === 'windcave_card' && 'Windcave (DPS) Payment Gateway'}
                {gatewayMethod === 'afterpay_nz' && 'Afterpay NZ Gateway'}
                {gatewayMethod === 'apple_google_pay' && 'Apple Pay / Google Pay NZ'}
                {gatewayMethod === 'cash_eftpos_delivery' && 'NZ EFTPOS / Cash Payment'}
              </div>
              <div className="text-[11px] text-[#A89F91]">
                Order {orderNumber} • Merchant: Tiffin & Treat NZ
              </div>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-[#2E2822] text-[#A89F91] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body based on Gateway */}
        <div className="p-6 space-y-6">

          {/* 1. ONLINE EFTPOS FLOW */}
          {gatewayMethod === 'online_eftpos' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: selectedBank.color }}
                >
                  {selectedBank.logoText}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-emerald-950">
                    {selectedBank.name} App Notification
                  </div>
                  <div className="text-xs text-emerald-800">
                    Pushed to mobile: <span className="font-mono font-bold">{mobileNumber || '021 884 9231'}</span>
                  </div>
                </div>
              </div>

              {step === 'initiating' && (
                <div className="text-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-[#1E1B18]">
                    Connecting to {selectedBank.shortName} API Gateway...
                  </p>
                </div>
              )}

              {step === 'awaiting_auth' && (
                <div className="space-y-4">
                  {/* Push notification preview */}
                  <div className="p-3 bg-[#FAF7F2] border border-[#E2D8C9] rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#706658]">
                      <span className="flex items-center gap-1 font-bold text-emerald-800">
                        <Smartphone className="w-3.5 h-3.5" /> {selectedBank.shortName} Mobile Banking
                      </span>
                      <span>Now</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1E1B18]">
                      "Approve payment request of <strong>NZD ${totalAmount.toFixed(2)}</strong> from Tiffin & Treat Ponsonby?"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#706658] px-1">
                    <span>Awaiting your biometric approval in app...</span>
                    <span className="font-mono font-bold text-emerald-700">{countdown}s</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualApprove}
                    className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Simulate Approve in {selectedBank.shortName} App</span>
                  </button>
                </div>
              )}

              {step === 'authorized' && (
                <div className="text-center py-6 space-y-2 text-emerald-800 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-950">
                    Payment Authorized via Online EFTPOS!
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Funds verified instantly via {selectedBank.name}. Completing order...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. POLI NZ FLOW */}
          {gatewayMethod === 'poli_nz' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: selectedBank.color }}
                  >
                    {selectedBank.logoText}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-blue-950">{selectedBank.name}</div>
                    <div className="text-[10px] text-blue-800">POLi Secure NZ Session #94812</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#706658]">Amount</div>
                  <div className="font-mono font-bold text-xs text-blue-950">NZD ${totalAmount.toFixed(2)}</div>
                </div>
              </div>

              {step === 'initiating' && (
                <div className="text-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-[#1E1B18]">
                    Establishing SSL Handshake with {selectedBank.shortName}...
                  </p>
                </div>
              )}

              {step === 'awaiting_auth' && (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAF7F2] border border-[#E2D8C9] rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#706658]">
                      <span>Account</span>
                      <span className="font-mono font-bold text-[#1E1B18]">12-3011-008472-00 (Cheque)</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#706658]">
                      <span>Particulars</span>
                      <span className="font-mono text-[#1E1B18]">{orderNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#706658]">
                      <span>Reference</span>
                      <span className="font-mono text-[#1E1B18]">TiffinTreat</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualApprove}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Authorize Transfer of NZD ${totalAmount.toFixed(2)}</span>
                  </button>
                </div>
              )}

              {step === 'authorized' && (
                <div className="text-center py-6 space-y-2 text-blue-900 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-blue-950">
                    POLi Bank Transfer Successful!
                  </h3>
                  <p className="text-xs text-blue-800">
                    Direct payment cleared from {selectedBank.shortName}.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3. WINDCAVE (DPS) FLOW */}
          {gatewayMethod === 'windcave_card' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FAF7F2] border border-[#E2D8C9] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#E06D53]" />
                  <div>
                    <div className="font-bold text-xs text-[#1E1B18]">Windcave Host 3DS2 Check</div>
                    <div className="text-[10px] text-[#706658]">Auckland Datacenter (PCI-DSS)</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-[#E06D53]">
                  NZD ${totalAmount.toFixed(2)}
                </span>
              </div>

              {step === 'initiating' && (
                <div className="text-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#E06D53] animate-spin mx-auto" />
                  <p className="text-xs font-bold text-[#1E1B18]">
                    Verifying card security token with Windcave DPS...
                  </p>
                </div>
              )}

              {step === 'awaiting_auth' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Card passed 3D-Secure 2.0 verification with zero surcharge.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualApprove}
                    className="w-full py-3.5 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Charge NZD ${totalAmount.toFixed(2)}</span>
                  </button>
                </div>
              )}

              {step === 'authorized' && (
                <div className="text-center py-6 space-y-2 text-emerald-800 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-emerald-950">
                    Card Processed via Windcave!
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Settlement reference generated.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. AFTERPAY NZ FLOW */}
          {gatewayMethod === 'afterpay_nz' && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between">
                <span className="font-bold text-xs bg-[#B2FCE4] px-2 py-0.5 rounded text-black">
                  afterpay ↗
                </span>
                <span className="text-xs font-bold text-teal-950">
                  4 x NZD ${(totalAmount / 4).toFixed(2)}
                </span>
              </div>

              {step === 'awaiting_auth' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#5A5043]">
                    Your first installment of <strong>NZD ${(totalAmount / 4).toFixed(2)}</strong> is due today. The remaining 3 installments will be debited automatically every 2 weeks.
                  </p>

                  <button
                    type="button"
                    onClick={handleManualApprove}
                    className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve First NZD ${(totalAmount / 4).toFixed(2)} Installment</span>
                  </button>
                </div>
              )}

              {step === 'authorized' && (
                <div className="text-center py-6 space-y-2 text-teal-900 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-base text-teal-950">
                    Afterpay Plan Confirmed!
                  </h3>
                </div>
              )}
            </div>
          )}

          {/* 5. APPLE PAY & GOOGLE PAY */}
          {gatewayMethod === 'apple_google_pay' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-xs text-[#706658] mb-3">
                  Use Touch ID / Face ID or device passcode to confirm <strong>NZD ${totalAmount.toFixed(2)}</strong>
                </p>
                <button
                  type="button"
                  onClick={handleManualApprove}
                  className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span> Pay with Touch ID / Face ID</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-[#EBE3D5] flex items-center justify-center gap-1.5 text-[11px] text-[#706658]">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted via New Zealand Payments Alliance & PCI DSS</span>
          </div>

        </div>

      </div>
    </div>
  );
};
