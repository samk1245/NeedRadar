import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Radar,
  MapPin,
  BarChart3,
  Building2,
  Bell,
  PlusCircle,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  LifeBuoy,
  PhoneCall,
  Brain,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useCity } from '../../context/CityContext';
import { SupportEnquiryModal } from '../support/SupportEnquiryModal';
import { AICopilotModal } from '../ai/AICopilotModal';
import { CITY_CONFIGS } from '../common/CityBadge';
import { CommunityActionTicker } from '../volunteer/CommunityActionTicker';
import { CityCommandPalette } from '../common/CityCommandPalette';
import { TopRightSignIn } from './TopRightSignIn';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { currentCity, setCity, availableCities, cityData } = useCity();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const currentCityConfig = CITY_CONFIGS[currentCity] || {
    code: currentCity.slice(0, 3).toUpperCase(),
    gradient: 'from-teal-600 to-emerald-600',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-xs transition-all w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo & City Selector */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0 min-w-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-teal-400 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-teal-500/20 shrink-0">
                <Radar className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-teal-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-500 rounded-full ring-2 ring-white"></span>
              </div>
              <div className="hidden xs:block">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  Need<span className="text-teal-600">Radar</span>
                </span>
              </div>
            </Link>

            {/* City Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-xl border border-slate-200 transition-all duration-200 shadow-xs active:scale-95"
                title="Change active city"
              >
                <div
                  className={`w-5 h-5 rounded-md bg-gradient-to-tr ${currentCityConfig.gradient} text-white flex items-center justify-center font-bold text-[9px] shrink-0`}
                >
                  {currentCityConfig.code}
                </div>
                <span className="max-w-[75px] sm:max-w-[120px] md:max-w-none truncate">{currentCity}</span>
                <span className="text-[9px] text-slate-400">▼</span>
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                  <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Select Active City ({availableCities.length})</span>
                    <span className="text-teal-600 font-mono">{availableCities.length} Cities</span>
                  </div>
                  {availableCities.map((c) => {
                    const cfg = CITY_CONFIGS[c.name] || {
                      code: c.name.slice(0, 3).toUpperCase(),
                      gradient: 'from-slate-600 to-slate-800',
                    };
                    const isSelected = currentCity.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={c.name}
                        onClick={() => {
                          setCity(c.name);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isSelected ? 'font-bold text-teal-800 bg-teal-50 border-l-4 border-teal-600' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-6 h-6 rounded-md bg-gradient-to-tr ${cfg.gradient} text-white flex items-center justify-center font-bold text-[10px] shadow-xs`}
                          >
                            {cfg.code}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{c.name}</div>
                            {c.landmark && (
                              <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                                {c.landmark}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {c.state.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Civic Action & Volunteer Ticker */}
            <div className="hidden sm:block">
              <CommunityActionTicker variant="compact" />
            </div>

            {/* Quick 144-City Command Palette Button */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs hover:border-teal-400 transition-all cursor-pointer"
              title={`Search ${availableCities.length || 144}+ cities across all 28 states & 8 UTs (Ctrl+K)`}
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span className="font-mono text-[11px] text-slate-500">{availableCities.length || 144} Cities</span>
              <kbd className="px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              to="/discovery"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/discovery')
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Discovery Map
            </Link>

            <Link
              to="/analytics"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/analytics')
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
              Demand Intelligence
            </Link>

            <Link
              to="/provider"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/provider')
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              NGOs & Partners
            </Link>

            <Link
              to="/support"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive('/support')
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-rose-500" />
              <span>Civic Support</span>
            </Link>

            {user && (user.role === 'moderator' || user.role === 'admin') && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'bg-slate-100 text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Moderation
              </Link>
            )}
          </nav>

          {/* Action Controls & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setAiCopilotOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-50 hover:bg-cyan-100/80 text-cyan-900 border border-cyan-200 transition-all shadow-xs active:scale-95 group shrink-0"
              title="Open 50-100 User AI Intelligence Dispatcher"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-600 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">AI Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
            </button>

            <button
              type="button"
              onClick={() => setSupportModalOpen(true)}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all shadow-xs active:scale-95 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span>Helpline 112</span>
            </button>

            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm hover:shadow-teal-600/20 transition-all hover:-translate-y-0.5 active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Need</span>
            </Link>

            {/* Dedicated Top-Right Sign In / User Profile Section */}
            <div className="shrink-0">
              <TopRightSignIn />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation Drawer"
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 text-sm font-semibold shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-sm active:scale-98 transition-transform"
            >
              <PlusCircle className="w-4 h-4" />
              Report a Community Need
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAiCopilotOpen(true);
              }}
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-600" />
                <span>AI Intelligence Copilot</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-200 text-cyan-800 text-[10px] font-mono">LIVE</span>
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <Link
                to="/discovery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                Discovery Map
              </Link>
              <Link
                to="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Demand Intelligence
              </Link>
              <Link
                to="/provider"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                <Building2 className="w-4 h-4 text-teal-600" />
                Providers & NGOs
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-slate-50 text-slate-700"
              >
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                Civic Support & Helplines
              </Link>
            </div>
            {!user ? (
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Join NeedRadar
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3 py-1 text-xs">
                <span className="font-bold text-slate-800">{user.full_name}</span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-rose-600 font-bold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        )}
      </header>

      {/* Floating Civic Support Button at bottom right */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => setSupportModalOpen(true)}
          className="group relative flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 rounded-2xl bg-slate-900 text-white shadow-2xl hover:shadow-teal-500/25 border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Civic Enquiry & Support (Helpline 112)"
        >
          <div className="relative">
            <LifeBuoy className="w-5 h-5 text-teal-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs font-bold tracking-tight">Civic Enquiry & Support</span>
        </button>
      </div>

      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      <AICopilotModal
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        onSelectNeed={(id) => navigate(`/needs/${id}`)}
      />

      <CityCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};
