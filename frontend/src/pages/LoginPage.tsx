import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill demo helper
  const fillDemo = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-teal-400 shadow-md mb-3">
          <Radar className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to NeedRadar
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Access your community requests, provider responses, and demand radar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-slate-200 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.org"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-2 text-center">
              Quick Demonstration Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemo('resident@needradar.org', 'ResidentPass123!')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left"
              >
                <strong className="block text-slate-900">Resident</strong>
                <span className="text-slate-500 font-mono text-[10px]">Pooja Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('provider@needradar.org', 'ProviderPass123!')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left"
              >
                <strong className="block text-slate-900">NGO Partner</strong>
                <span className="text-slate-500 font-mono text-[10px]">Vidya Trust</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('mod@needradar.org', 'ModPass123!')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left"
              >
                <strong className="block text-slate-900">Moderator</strong>
                <span className="text-slate-500 font-mono text-[10px]">Karthik Nair</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin@needradar.org', 'AdminPass123!')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left"
              >
                <strong className="block text-slate-900">Administrator</strong>
                <span className="text-slate-500 font-mono text-[10px]">Radha Raman</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-teal-600 hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
