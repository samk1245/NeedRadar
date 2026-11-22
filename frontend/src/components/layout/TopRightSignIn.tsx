import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Building2,
  LayoutDashboard,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopRightSignIn: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email.trim(), password);
      setDropdownOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string, roleName: string) => {
    setLoading(true);
    setErrorMsg(null);
    setDemoNotice(`Logging in as ${roleName}...`);
    try {
      await login(demoEmail, demoPass);
      setDropdownOpen(false);
      setDemoNotice(null);
    } catch (err: any) {
      setErrorMsg(`Demo login failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {user ? (
        /* Signed-in User Pill */
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs hover:border-teal-400 transition-all cursor-pointer"
            title={`Signed in as ${user.full_name} (${user.role})`}
          >
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
              {user.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-slate-900 leading-tight max-w-[110px] truncate">
                {user.full_name}
              </span>
              <span className="block text-[10px] font-mono text-teal-600 uppercase font-semibold">
                {user.role}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 ml-0.5">▼</span>
          </button>

          {/* User Menu Dropdown */}
          {dropdownOpen && (
            <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-18 sm:top-auto sm:mt-2 w-auto sm:w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                <p className="font-bold text-slate-900">{user.full_name}</p>
                <p className="text-slate-500 text-[11px] font-mono truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                  <span>Resident Dashboard</span>
                </Link>

                {user.role === 'provider' && (
                  <Link
                    to="/provider"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Provider Portal</span>
                  </Link>
                )}

                {(user.role === 'moderator' || user.role === 'admin') && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Moderation Console</span>
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Not Logged In - Dedicated Top-Right Sign In Option */
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Main Top-Right Sign In Button */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xs hover:shadow-slate-900/20 transition-all active:scale-95 cursor-pointer border border-slate-800 shrink-0"
            title="Sign In to NeedRadar"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="text-xs">Sign In</span>
            <span className="text-[9px] text-slate-400 ml-0.5">▾</span>
          </button>

          {/* Quick Join Link */}
          <Link
            to="/register"
            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shrink-0"
          >
            Join
          </Link>

          {/* Quick Sign-In Flyout Dropdown */}
          {dropdownOpen && (
            <div className="fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-18 sm:top-auto sm:mt-2 w-auto sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Sign In to NeedRadar</h4>
                    <p className="text-[10px] text-slate-500">Access community radar & services</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-lg">
                  {errorMsg}
                </div>
              )}

              {demoNotice && (
                <div className="mt-2.5 p-2 bg-teal-50 border border-teal-200 text-teal-800 text-[11px] rounded-lg flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>{demoNotice}</span>
                </div>
              )}

              {/* Fast Form */}
              <form onSubmit={handleFormLogin} className="mt-3 space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="resident@needradar.org"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1.5 focus:ring-teal-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1.5 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Fast Demonstration Logins */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Instant Demo Accounts
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('resident@needradar.org', 'ResidentPass123!', 'Resident')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-colors cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 text-[11px] block group-hover:text-teal-700">Resident</span>
                    <span className="text-[9px] text-slate-400 font-mono">Pooja</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('provider@needradar.org', 'ProviderPass123!', 'NGO Partner')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-colors cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 text-[11px] block group-hover:text-teal-700">NGO</span>
                    <span className="text-[9px] text-slate-400 font-mono">Vidya</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('mod@needradar.org', 'ModPass123!', 'Moderator')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-left transition-colors cursor-pointer group"
                  >
                    <span className="font-bold text-slate-800 text-[11px] block group-hover:text-teal-700">Admin</span>
                    <span className="text-[9px] text-slate-400 font-mono">Karthik</span>
                  </button>
                </div>
              </div>

              {/* Dedicated link to full page */}
              <div className="mt-3 pt-2 text-center border-t border-slate-100 text-[11px] text-slate-500">
                <span>Need a full screen? </span>
                <Link
                  to="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="font-bold text-teal-600 hover:underline"
                >
                  Go to Sign In Page
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
