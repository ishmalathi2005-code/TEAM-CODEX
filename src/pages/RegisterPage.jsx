import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Calculate Password Strength Score
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 30;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;

    if (score < 40) return { score, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score < 75) return { score, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptTerms) {
      errors.acceptTerms = 'You must accept the terms & privacy policy.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join CODEX AI Simulator to train your technical interview skills"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-slide-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: null }));
              }}
              placeholder="Sarah Connor"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all ${
                validationErrors.name ? 'border-rose-500/60' : ''
              }`}
            />
          </div>
          {validationErrors.name && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.name}</span>
            </p>
          )}
        </div>

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
                if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="sarah@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all ${
                validationErrors.email ? 'border-rose-500/60' : ''
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
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: null }));
              }}
              placeholder="Minimum 6 characters"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all ${
                validationErrors.password ? 'border-rose-500/60' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          {password && (
            <div className="pt-1 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Strength:</span>
                <span className={`font-semibold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all duration-300`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            </div>
          )}

          {validationErrors.password && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all ${
                validationErrors.confirmPassword ? 'border-rose-500/60' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start space-x-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (validationErrors.acceptTerms) setValidationErrors(prev => ({ ...prev, acceptTerms: null }));
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-normal">
              I agree to the Terms of Service & Privacy Policy
            </span>
          </label>
          {validationErrors.acceptTerms && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{validationErrors.acceptTerms}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating CODEX Account...</span>
            </>
          ) : (
            <>
              <span>Create Free Account</span>
              <UserPlus className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {/* Link to Login */}
        <p className="text-center text-xs text-slate-400 pt-2">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
