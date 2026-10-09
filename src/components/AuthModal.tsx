import React, { useState } from 'react';
import { User } from '../types';
import { DEFAULT_USERS } from '../lib/storage';
import { X, Eye, EyeOff, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onShowToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (user: User) => {
    onLoginSuccess(user);
    onShowToast(`Signed in as ${user.name}`);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (tab === 'register' && !email.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }

    // Simulated instantaneous local authentication
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.trim().toLowerCase(),
      name: username.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@blogify.io`,
      role: 'Contributing Author',
      bio: 'Author and reader on Blogify.',
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(newUser);
    onShowToast(`Welcome, ${newUser.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1e1e24] border border-white/10 shadow-2xl p-6 sm:p-8 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="font-editorial text-2xl font-bold tracking-tight text-white">
            {tab === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {tab === 'signin'
              ? 'Sign in to access your workshop and publish stories'
              : 'Join a community of curious minds and writers'}
          </p>
        </div>

        {/* 1-Click Fast Demo Login Strip */}
        <div className="mb-6 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Instant Demo Switcher (1-Click)</span>
          </p>
          <div className="space-y-1.5">
            {DEFAULT_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoLogin(u)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-colors cursor-pointer text-xs group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center justify-center">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-stone-200 group-hover:text-emerald-300 transition-colors">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-stone-400 block">{u.role}</span>
                  </div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold transition-colors cursor-pointer text-center ${
              tab === 'signin' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 pb-2.5 text-xs font-semibold transition-colors cursor-pointer text-center ${
              tab === 'register' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Register
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. minhaj"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-stone-100 text-xs placeholder:text-stone-400 focus:outline-none focus:border-emerald-400"
              required
            />
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-stone-100 text-xs placeholder:text-stone-400 focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-stone-100 text-xs placeholder:text-stone-400 focus:outline-none focus:border-emerald-400 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {tab === 'signin' ? 'Sign In to Workshop' : 'Create Account'}
          </button>
        </form>

        <p className="text-[11px] text-center text-stone-400 mt-5">
          By continuing, you enjoy instantaneous local data persistence with zero latency.
        </p>

      </div>
    </div>
  );
};
