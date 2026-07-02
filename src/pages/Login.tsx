import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Phone, KeyRound, Building2, Briefcase, ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { trackEvent } from '../utils/analytics';

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  partner: 'Partner',
  senior_associate: 'Senior Associate',
  junior_associate: 'Junior Associate',
  client: 'Lawyer',
  // Fallbacks for standard legacy roles
  'Super Admin': 'Super Admin',
  'Admin': 'Admin',
  'Lawyer': 'Lawyer',
  'Viewer': 'Viewer',
  'Standard': 'Standard'
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

interface LoginProps {
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [portalSelection, setPortalSelection] = useState<'admin' | 'client' | null>(null);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isLogin, setIsLogin] = useState(true);
  
  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Initialize Recaptcha (invisible) for Phone Auth
  useEffect(() => {
    if (portalSelection && authMethod === 'phone' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [authMethod, portalSelection]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Set Session Persistence
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistenceType);

      if (isLogin) {
        if (portalSelection === 'admin') {
          // Trigger Simulated 2FA instead of logging in immediately
          setShow2FA(true);
          setLoading(false);
          return;
        }

        // Standard Login
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful! Welcome back.');
        trackEvent('Login Success', { method: 'email', portal: portalSelection });
        
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        
        // Register user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile
        await updateProfile(user, { displayName: name });

        let assignedRole = 'Standard';
        if (portalSelection === 'client') {
          assignedRole = 'Lawyer';
        } else if (portalSelection === 'admin') {
          // Check if this is the first user
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const isFirstUser = usersSnapshot.empty;
          assignedRole = isFirstUser ? 'Super Admin' : 'Admin';
        }

        // Save to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          role: assignedRole,
          createdAt: new Date().toISOString(),
          status: 'Active'
        });

        // Send Email Verification
        await sendEmailVerification(user);
        toast.success('Account created! Please check your email to verify.');
        trackEvent('Sign Up Success', { method: 'email', portal: portalSelection });
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || 'Authentication failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please click "Sign in" below instead.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }
      toast.error(errorMessage);
      trackEvent('Auth Error', { code: err.code, method: 'email' });
    } finally {
      if (!show2FA) setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode !== '123456') {
      toast.error('Invalid 2FA code. Hint: Use 123456');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Admin login successful!');
      trackEvent('Login Success', { method: 'email', portal: 'admin', twoFactor: true });
    } catch (err: any) {
      toast.error('Session expired or invalid credentials. Please try again.');
      setShow2FA(false);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      trackEvent('Password Reset Requested', { portal: portalSelection });
    } catch (err: any) {
      toast.error('Failed to send reset email. Ensure the email is correct.');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return setError("Please enter a phone number.");
    
    setError('');
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Ensure phone number includes country code (e.g. +1).');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !otp) return;

    setError('');
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        let assignedRole = 'Standard';
        if (portalSelection === 'client') {
          assignedRole = 'Lawyer';
        } else if (portalSelection === 'admin') {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const isFirstUser = usersSnapshot.empty;
          assignedRole = isFirstUser ? 'Super Admin' : 'Admin';
        }
        
        await setDoc(doc(db, 'users', user.uid), {
          name: 'Phone User',
          email: user.phoneNumber, // fallback for email column in table
          role: assignedRole,
          createdAt: new Date().toISOString(),
          status: 'Active'
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!portalSelection ? (
            <motion.div
              key="portal-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {onBack && (
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-6"
                >
                  <ArrowLeft size={14} />
                  Back to Home
                </button>
              )}
              <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                  <Shield size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">LexAI Platform</h1>
                <p className="text-sm text-slate-400 mt-1 text-center">
                  Select your login portal to continue
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setPortalSelection('admin')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all group"
                >
                  <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-indigo-500 transition-colors">
                    <Building2 size={24} className="text-slate-300 group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold">Admin Portal</h3>
                    <p className="text-xs text-slate-400">For internal staff and administrators</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </button>

                <button
                  onClick={() => setPortalSelection('client')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-emerald-500 transition-colors">
                    <Briefcase size={24} className="text-slate-300 group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold">Client Portal</h3>
                    <p className="text-xs text-slate-400">For external clients and lawyers</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => { setPortalSelection(null); setError(''); setConfirmationResult(null); }}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft size={14} />
                Back to portals
              </button>

              <div className="flex flex-col items-center mb-6">
                <div className={`p-3 rounded-2xl shadow-lg mb-4 bg-gradient-to-br ${portalSelection === 'admin' ? 'from-blue-500 to-indigo-600' : 'from-emerald-500 to-teal-600'}`}>
                  {portalSelection === 'admin' ? <Building2 size={32} className="text-white" /> : <Briefcase size={32} className="text-white" />}
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {portalSelection === 'admin' ? 'Admin Login' : 'Client Portal'}
                </h1>
                <p className="text-sm text-slate-400 mt-1 text-center">
                  {isLogin ? 'Sign in to access your secure workspace' : 'Create an account to join the workspace'}
                </p>
              </div>

              {/* Auth Method Toggle */}
              <div className="flex p-1 bg-slate-950/50 rounded-xl mb-6">
                <button
                  onClick={() => { setAuthMethod('email'); setError(''); setConfirmationResult(null); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    authMethod === 'email' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail size={16} />
                  Email
                </button>
                <button
                  onClick={() => { setAuthMethod('phone'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    authMethod === 'phone' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone size={16} />
                  Phone
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-rose-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
                </motion.div>
              )}

              {authMethod === 'email' ? (
                show2FA ? (
                  <form onSubmit={handleVerify2FA} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Two-Factor Authentication</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <KeyRound size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          value={twoFactorCode}
                          onChange={(e) => setTwoFactorCode(e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center tracking-widest text-lg"
                          placeholder="123456"
                          maxLength={6}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 pl-1 text-center">Enter the 6-digit code from your authenticator app</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || twoFactorCode.length < 6}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                    </button>
                    
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => { setShow2FA(false); setTwoFactorCode(''); }}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock size={16} />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    {isLogin && (
                      <div className="flex justify-end pt-1">
                        <button 
                          type="button" 
                          onClick={handleForgotPassword}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex items-center gap-2 pt-1 pb-1">
                      <button 
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-slate-600'}`}
                      >
                        {rememberMe && <CheckSquare size={12} className="text-white" />}
                      </button>
                      <label className="text-xs text-slate-400 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                        Remember me for 30 days
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                      portalSelection === 'admin' 
                        ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20' 
                        : 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                    }`}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
                )
              ) : (
                <>
                  {!confirmationResult ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="+1 234 567 8900"
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 pl-1">Include your country code (e.g. +1 for US)</p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || !phoneNumber}
                        className={`w-full bg-gradient-to-r text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 ${
                          portalSelection === 'admin' 
                            ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20' 
                            : 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                        }`}
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send OTP via SMS'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Verification Code</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                            <KeyRound size={16} />
                          </div>
                          <input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-center tracking-widest text-lg"
                            placeholder="123456"
                            maxLength={6}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 pl-1 text-center">Enter the 6-digit code sent to {phoneNumber}</p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className={`w-full bg-gradient-to-r text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 ${
                          portalSelection === 'admin' 
                            ? 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20' 
                            : 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                        }`}
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                      </button>
                      
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => { setConfirmationResult(null); setOtp(''); }}
                          className="text-xs text-slate-400 hover:text-white transition-colors"
                        >
                          Use a different phone number
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {authMethod === 'email' && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
