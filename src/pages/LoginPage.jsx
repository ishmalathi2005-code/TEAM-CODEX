import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isLoading } = useAuth();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Local Validation Errors
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form client-side
  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  // Demo Login Helper for rapid testing
  const handleQuickDemoFill = () => {
    setEmail('alex@codex.ai');
    setPassword('password123');
    setValidationErrors({});
    clearError();
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your AI coding interview session"
    >
      {/* Global API Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-rose-200">Authentication Failed</span>
            <span>{error}</span>
          </div>
          <button 
            type="button" 
            onClick={clearError}
            className="text-rose-400 hover:text-rose-200 text-xs underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({ ...prev, email: null }));
                }
              }}
              placeholder="name@company.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-slate-100 placeholder-slate-500 text-sm transition-all ${
                validationErrors.email ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''
              }`}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <a 
              href="#forgot-password" 
              onClick={(e) => { e.preventDefault(); alert("Password reset link requested for " + (email || "your account")); }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors(prev => ({ ...prev, password: null }));
                }
              }}
              placeholder="••••••••••••"
              className={`w-full pl-10 pr-11 py-3 rounded-xl glass-input text-slate-100 placeholder-slate-500 text-sm transition-all ${
                validationErrors.password ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40 focus:ring-offset-slate-950 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              Remember session on this device
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isSubmitting || isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {/* Quick Demo Credentials Helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-xs font-mono transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fill Demo Credentials (alex@codex.ai)</span>
          </button>
        </div>

        {/* Link to Register */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have a CODEX account?{' '}
          <Link 
            to="/register" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors underline underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
