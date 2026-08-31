import React, { useState } from 'react';
import { 
  AdminUser, 
  StoreLocation 
} from '../../types';
import { apiAdminLogin } from '../../services/apiClient';
import { 
  ChefHat, 
  Lock, 
  ShieldCheck, 
  Key, 
  X, 
  ArrowRight, 
  Store, 
  User, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreLocation[];
  onAdminLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  stores,
  onAdminLoginSuccess
}) => {
  if (!isOpen) return null;

  const [emailOrId, setEmailOrId] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedRole, setSelectedRole] = useState<'Store General Manager' | 'Head Chef & Kitchen Lead' | 'Dispatch Supervisor'>('Store General Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsAuthenticating(true);

    try {
      const res = await apiAdminLogin(emailOrId, passwordOrPin, selectedRole, selectedBranch);
      onAdminLoginSuccess(res.adminUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your staff credentials.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1C1A17] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-700 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E06D53] to-amber-600 flex items-center justify-center text-white shadow-lg">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold uppercase tracking-wider border border-neutral-700">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Restricted Staff Portal</span>
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-white mt-1">
                Store Manager & Kitchen Login
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Alert Note */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          
          {/* Branch Station */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-bold">Select Branch Location</label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#141210] border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E06D53]"
              >
                <option value="all">All NZ Hubs (Central Admin & Financials)</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.suburb})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Role selector */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-bold">Staff Role Authorization</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full bg-[#141210] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E06D53]"
            >
              <option value="Store General Manager">👑 Store General Manager (Full Access)</option>
              <option value="Head Chef & Kitchen Lead">👨‍🍳 Head Chef & Kitchen Lead (KDS & Menu)</option>
              <option value="Dispatch Supervisor">🛵 Dispatch & Delivery Lead (Orders & Drivers)</option>
            </select>
          </div>

          {/* Email / Badge ID / Login ID */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-bold">Staff Login ID / Mobile / Email</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="e.g. 9876777416 or manager@tiffintreat.co.nz"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                className="w-full bg-[#141210] border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#E06D53]"
              />
            </div>
          </div>

          {/* Manager PIN / Password */}
          <div className="space-y-1">
            <label className="text-neutral-300 font-bold">Password / Security PIN</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password (e.g. orbit)"
                value={passwordOrPin}
                onChange={(e) => setPasswordOrPin(e.target.value)}
                className="w-full bg-[#141210] border border-neutral-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#E06D53]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3 bg-[#E06D53] hover:bg-[#D45E44] disabled:opacity-70 text-white font-bold rounded-2xl shadow-lg shadow-[#E06D53]/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Staff Authorization...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Open Manager Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
