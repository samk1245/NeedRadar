import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radar,
  MapPin,
  BarChart3,
  Building2,
  CheckCircle2,
  Shield,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  HeartHandshake,
  Clock,
  Eye,
  AlertCircle,
  PhoneCall,
  LifeBuoy,
  BookOpen,
  Heart,
  Package,
  Wrench,
  Home,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import { NeedMapItem, AnalyticsOverview } from '../types';
import { NeedMap } from '../components/map/NeedMap';
import { TiltCard } from '../components/common/TiltCard';
import { CityBadge, CITY_CONFIGS } from '../components/common/CityBadge';
import { SupportEnquiryModal } from '../components/support/SupportEnquiryModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, setCity, cityData, availableCities } = useCity();
  const [mapItems, setMapItems] = useState<NeedMapItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [items, ov] = await Promise.all([
          api.get<NeedMapItem[]>(`/discovery/map?city=${encodeURIComponent(currentCity)}`),
          api.get<AnalyticsOverview>(`/analytics/overview?city=${encodeURIComponent(currentCity)}`),
        ]);
        setMapItems(items);
        setOverview(ov);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, [currentCity]);

  return (
    <div className="space-y-16 pb-20">
      {/* 3D Holographic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/70 border-b border-slate-200/80 pt-14 pb-20">
        {/* Subtle 3D background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <span className="font-mono">{currentCity}</span>
                <span className="text-slate-300">•</span>
                <span>Active Civic Radar Across 14 Cities</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                See What Your City Needs.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600">
                  Help Make It Happen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                NeedRadar turns unmet local community needs into actionable civic intelligence, connecting residents directly with verified NGOs, municipal desks, and emergency helplines.
              </p>

              {/* CTAs with 3D Depth */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/report"
                  className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Report a Need</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/discovery"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-xs hover:shadow-sm active:scale-95"
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Explore Live Radar</span>
                </Link>

                <button
                  onClick={() => setSupportModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-rose-200 active:scale-95"
                >
                  <LifeBuoy className="w-4 h-4 text-rose-600" />
                  <span>Civic Helplines & Support</span>
                </button>
              </div>

              {/* Real Database Proof Banner */}
              {overview && (
                <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <strong className="text-slate-900 font-bold">{overview.total_reports}</strong> Valid Reports
                  </div>
                  <div className="hidden sm:inline text-slate-300">•</div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <strong className="text-slate-900 font-bold">{overview.distinct_supporters}</strong> Supporters
                  </div>
                  <div className="hidden sm:inline text-slate-300">•</div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <strong className="text-emerald-700 font-bold">{overview.resolution_rate_percent}%</strong> Verified Resolutions
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: 3D Live Map Container */}
            <div className="lg:col-span-5">
              <TiltCard maxTilt={6} scale={1.01} className="rounded-3xl shadow-2xl border border-slate-800 overflow-hidden bg-slate-900">
                <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 bg-slate-950">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
                    <span className="font-bold text-white">Live Radar: {currentCity}</span>
                  </div>
                  <Link
                    to="/discovery"
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px] font-bold"
                  >
                    <span>Full Screen</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="h-84 sm:h-96 rounded-b-2xl overflow-hidden relative">
                  <NeedMap
                    items={mapItems.slice(0, 30)}
                    center={cityData ? [cityData.lon, cityData.lat] : undefined}
                    zoom={cityData?.zoom ? cityData.zoom - 1 : 11}
                  />

                  {/* 3D Floating City Badge in corner */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg">
                      <Radar className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
                      <span>{cityData.landmark || currentCity}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-City 3D Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>National Coverage Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Active Wards Across 14 Major Indian Cities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Click any metropolitan city to switch real-time civic radar, localities, and verified NGO partners.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Active: <span className="font-bold text-teal-700">{currentCity}</span> ({cityData.state})
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {availableCities.map((c) => {
            const isSelected = currentCity.toLowerCase() === c.name.toLowerCase();
            const config = CITY_CONFIGS[c.name] || {
              code: c.name.slice(0, 3).toUpperCase(),
              gradient: 'from-slate-600 to-slate-800',
            };
            return (
              <TiltCard
                key={c.name}
                maxTilt={12}
                scale={1.03}
                onClick={() => setCity(c.name)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
                  >
                    {config.code}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                  )}
                </div>

                <div className="font-extrabold text-xs text-slate-900 truncate">{c.name}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {c.state.split(' ')[0]}
                </div>
                {c.landmark && (
                  <div className="text-[9px] text-teal-700/80 truncate mt-1">
                    {c.landmark.split('&')[0]}
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 4-Step Resolution Lifecycle (3D Tilt Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            The Verified Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How NeedRadar Drives Real Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            An audited civic coordination framework backed by verified workflows and zero fake metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm shadow-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Residents Report Needs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit structured requests for tutoring, healthcare access, road repairs, or basic supplies with locality pins.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm shadow-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Pattern & Demand Clustering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic scoring evaluates report density, age, and supporters to compute transparent civic demand indices.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm shadow-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Verified Provider Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audited NGOs and service organisations receive matched opportunities and submit assistance proposals with timelines.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm shadow-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Resident Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providers cannot self-certify completion. Outcomes are confirmed by the resident or moderator before marking resolved.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* Six Core Community Domains (3D Interactive Cards) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Six Core Community Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active categories monitored in {currentCity} and nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'education',
                title: 'Education & Tutoring',
                desc: 'Remedial coaching, textbook drives, and student assistance for underprivileged municipal cohorts.',
                icon: BookOpen,
                accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
              },
              {
                id: 'healthcare',
                title: 'Healthcare & Blood Coordination',
                desc: 'Citizen blood donation coordination, medical camp dispatch, and primary health clinic referrals.',
                icon: Heart,
                accent: 'text-rose-600 bg-rose-50 border-rose-200',
              },
              {
                id: 'supplies',
                title: 'Essential Supplies & Food Aid',
                desc: 'Dry ration kits, meal delivery for elderly, and non-perishable basic supplies for vulnerable families.',
                icon: Package,
                accent: 'text-amber-600 bg-amber-50 border-amber-200',
              },
              {
                id: 'infrastructure',
                title: 'Public Infrastructure',
                desc: 'Pothole clusters, broken pedestrian footpaths, waterlogging, and missing street lighting.',
                icon: Building2,
                accent: 'text-teal-600 bg-teal-50 border-teal-200',
              },
              {
                id: 'repairs',
                title: 'Repairs & Local Services',
                desc: 'Community wheelchair ramps, park handrails, basic plumbing, and community tool libraries.',
                icon: Wrench,
                accent: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                id: 'shelter',
                title: 'Shelter & Basic Necessities',
                desc: 'Transitional shelter referrals for displaced families and emergency winter blankets.',
                icon: Home,
                accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <TiltCard
                  key={cat.id}
                  maxTilt={8}
                  scale={1.02}
                  onClick={() => navigate(`/discovery?category=${cat.id}`)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${cat.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-sm">
                        {cat.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Civic Trust Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Engineered for Privacy, Accuracy, and Verified Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Unlike generic social forums, NeedRadar does not display fabricated impact numbers, expose sensitive home addresses, or allow unverified actors to claim ownership of human needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs">
            <div className="space-y-2">
              <Shield className="w-6 h-6 text-teal-400" />
              <h4 className="font-bold text-white text-sm">Sensitive Pin Obfuscation</h4>
              <p className="text-slate-400 leading-relaxed">
                Individual medical or shelter requests automatically jitter coordinates by ~300 meters, shielding domestic safety.
              </p>
            </div>

            <div className="space-y-2">
              <Sparkles className="w-6 h-6 text-teal-400" />
              <h4 className="font-bold text-white text-sm">AI Explains, Never Invents</h4>
              <p className="text-slate-400 leading-relaxed">
                Deterministic algorithms calculate demand scores. AI models assist in categorization and duplicate explanation without generating fake evidence.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-6 h-6 text-teal-400" />
              <h4 className="font-bold text-white text-sm">Audited Resolution Ledger</h4>
              <p className="text-slate-400 leading-relaxed">
                A provider cannot mark a problem resolved alone. Resolution proposals require resident confirmation or moderator verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
};
