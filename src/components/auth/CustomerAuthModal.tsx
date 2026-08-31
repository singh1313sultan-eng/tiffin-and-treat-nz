import React, { useState } from 'react';
import { 
  CustomerRecord, 
  DietaryType 
} from '../../types';
import { NZ_SUBURBS_LIST } from '../../data/mockData';
import { 
  apiLoginCustomer, 
  apiRegisterCustomer,
  ApiErrorResponse 
} from '../../services/apiClient';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Heart,
  Tag,
  AlertTriangle,
  UserPlus,
  Loader2
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  customers: CustomerRecord[];
  onLogin: (customer: CustomerRecord) => void;
  onRegister: (newCustomer: CustomerRecord) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  customers,
  onLogin,
  onRegister
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Form States
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regApartment, setRegApartment] = useState('');
  const [regSuburb, setRegSuburb] = useState('Ponsonby');
  const [regCity, setRegCity] = useState('Auckland');
  const [regPostcode, setRegPostcode] = useState('1011');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDietary, setRegDietary] = useState<DietaryType[]>(['halal']);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorCode(null);
    setIsSubmitting(true);

    try {
      const res = await apiLoginCustomer(loginEmailOrPhone, loginPassword);
      onLogin(res.user);
      onClose();
    } catch (err: any) {
      setErrorCode(err.code || 'AUTH_ERROR');
      setErrorMsg(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setErrorCode(null);

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your passwords.');
      setErrorCode('PASSWORD_MISMATCH');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRegisterCustomer({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword || 'password123',
        primaryAddress: regAddress,
        apartmentUnit: regApartment,
        suburb: regSuburb,
        city: regCity,
        postcode: regPostcode,
        dietaryPreferences: regDietary
      });

      onRegister(res.user);
      onClose();
    } catch (err: any) {
      setErrorCode(err.code || 'REGISTRATION_ERROR');
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchToRegisterWithEmail = () => {
    if (loginEmailOrPhone.includes('@')) {
      setRegEmail(loginEmailOrPhone);
    } else if (loginEmailOrPhone.trim().length >= 3) {
      setRegPhone(loginEmailOrPhone);
    }
    setErrorMsg(null);
    setErrorCode(null);
    setMode('register');
  };

  const toggleDietaryPref = (d: DietaryType) => {
    setRegDietary(prev => 
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#1E1B18] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E0D2] p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header with Switcher */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-2xl text-[#1E1B18]">
              {mode === 'login' ? 'Welcome Back!' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-[#706658]">
              {mode === 'login' 
                ? 'Sign in to access saved NZ addresses, loyalty perks, and past orders.' 
                : 'Sign up in 30 seconds for quick 1-click checkout and saved delivery addresses.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-[#EBE3D5] p-1 text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1E1B18] shadow-md'
                : 'text-[#706658] hover:text-[#1E1B18]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-[#E06D53] text-white shadow-md'
                : 'text-[#706658] hover:text-[#1E1B18]'
            }`}
          >
            New Customer Register
          </button>
        </div>

        {/* Explicit User Not Found / Error Banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 text-xs border border-rose-200 shadow-sm space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{errorMsg}</div>
            </div>
            {errorCode === 'USER_NOT_FOUND' && (
              <div className="pt-1 pl-6">
                <button
                  type="button"
                  onClick={switchToRegisterWithEmail}
                  className="py-1 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register This Account Now</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- LOGIN FORM ---------------- */}
        {mode === 'login' && (
          <div className="space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between leading-tight min-h-[16px]">
                  <label className="block font-bold text-[#3D372E] text-xs leading-tight">
                    Email Address or NZ Mobile Number
                  </label>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. sarah.jenkins@gmail.com or 021 884 9231"
                    value={loginEmailOrPhone}
                    onChange={(e) => {
                      setLoginEmailOrPhone(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between leading-tight min-h-[16px]">
                  <label className="block font-bold text-[#3D372E] text-xs leading-tight">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setErrorMsg('A password reset link will be sent to your email.')}
                    className="text-[11px] text-[#E06D53] hover:underline leading-tight cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53] shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5C5346]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#E06D53] rounded"
                  />
                  <span>Remember me on this browser</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#E06D53] hover:bg-[#D45E44] disabled:opacity-70 text-white font-bold rounded-2xl shadow-lg shadow-[#E06D53]/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to My Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>
        )}

        {/* ---------------- REGISTER FORM ---------------- */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jessica Taylor"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">NZ Mobile Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    placeholder="021 884 9231"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-[#3D372E]">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="jessica.taylor@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                />
              </div>
            </div>

            {/* Delivery Address & Suburb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">Street Address *</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 182 Ponsonby Road"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full bg-white border border-[#D9CFBF] rounded-xl pl-10 pr-4 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">Suburb *</label>
                <select
                  value={regSuburb}
                  onChange={(e) => setRegSuburb(e.target.value)}
                  className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                >
                  {NZ_SUBURBS_LIST.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">Create Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#3D372E]">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full bg-white border border-[#D9CFBF] rounded-xl px-3 py-2 text-xs text-[#1E1B18] focus:outline-none focus:border-[#E06D53]"
                />
              </div>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-[#3D372E]">My Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'halal', label: '100% Halal' },
                  { id: 'veg', label: 'Vegetarian' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'gf', label: 'Gluten-Free' },
                  { id: 'nut-free', label: 'Nut-Free' }
                ].map(d => {
                  const isSel = regDietary.includes(d.id as DietaryType);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDietaryPref(d.id as DietaryType)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSel 
                          ? 'bg-[#E06D53] text-white border-[#E06D53]' 
                          : 'bg-white text-[#706658] border-[#D9CFBF] hover:border-[#B4A48F]'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E06D53] hover:bg-[#D45E44] text-white font-bold rounded-2xl shadow-lg shadow-[#E06D53]/25 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Create Customer Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
