import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radar,
  MapPin,
  CheckCircle2,
  Shield,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  LifeBuoy,
  BookOpen,
  Heart,
  Package,
  Wrench,
  Home,
  Building2,
  Brain,
  Waves
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import { NeedMapItem, AnalyticsOverview } from '../types';
import { NeedMap } from '../components/map/NeedMap';
import { TiltCard } from '../components/common/TiltCard';
import { CITY_CONFIGS } from '../components/common/CityBadge';
import { SupportEnquiryModal } from '../components/support/SupportEnquiryModal';
import { CommunityActionTicker } from '../components/volunteer/CommunityActionTicker';
import { WaterFlow3D } from '../components/common/WaterFlow3D';
import { CivicWorkflow3D } from '../components/common/CivicWorkflow3D';
import { AICopilotModal } from '../components/ai/AICopilotModal';
import { NorvaHero } from '../components/hero/NorvaHero';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, setCity, cityData, availableCities } = useCity();
  const [mapItems, setMapItems] = useState<NeedMapItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [aiCopilotOpen, setAiCopilotOpen] = useState(false);
  const [heroViewMode, setHeroViewMode] = useState<'map' | 'water'>('map');

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
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* 1. Scroll-Driven 3D Miniature City Hero (Daylight Theme & Smooth Dampened Glide) */}
      <NorvaHero
        onExploreClick={() => navigate('/discovery')}
        onRequestClick={() => navigate('/report')}
      />

      {/* 2. Transition Bridge & Live Radar Intelligence Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & Real Data Proof */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
              <span className="font-mono">{currentCity}</span>
              <span className="text-slate-300">•</span>
              <span>Active Radar Across {availableCities.length || 42} Cities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Real-Time Community Radar.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                Verified Ground Resolution.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              NeedRadar turns unmet civic distress signals into verified spatial intelligence, matching residents with vetted NGO crews, municipal coordination desks, and rapid response networks.
            </p>

            {/* Platform Action Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/report"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-500/25 transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Report a Need</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/discovery"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-slate-200 shadow-xs hover:-translate-y-0.5 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Explore Live Radar</span>
              </Link>

              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-rose-200 hover:-translate-y-0.5 active:scale-95"
              >
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                <span>Civic Helplines & Support</span>
              </button>
            </div>

            {/* Verified Database Ledger Proof */}
            {overview && (
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <strong className="text-slate-900 font-bold">{overview.total_reports}</strong> Valid Reports
                </div>
                <div className="hidden sm:inline text-slate-300">•</div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <strong className="text-slate-900 font-bold">{overview.distinct_supporters}</strong> Active Supporters
                </div>
                <div className="hidden sm:inline text-slate-300">•</div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <strong className="text-emerald-700 font-bold">{overview.resolution_rate_percent}%</strong> Verified Resolutions
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 3D Live Map & 3D Water Flow Simulation */}
          <div className="lg:col-span-5">
            <TiltCard maxTilt={6} scale={1.01} className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden bg-slate-900">
              <div className="px-4 py-3 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHeroViewMode('map')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                      heroViewMode === 'map'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Radar Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroViewMode('water')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                      heroViewMode === 'water'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Waves className="w-3 h-3 text-cyan-400" />
                    <span>3D Water Flow</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setAiCopilotOpen(true)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-bold bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50 transition-colors"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>50-100 User AI</span>
                </button>
              </div>

              <div className="h-84 sm:h-96 rounded-b-2xl overflow-hidden relative">
                {heroViewMode === 'map' ? (
                  <>
                    <NeedMap
                      items={mapItems.slice(0, 30)}
                      center={cityData ? [cityData.lon, cityData.lat] : undefined}
                      zoom={cityData?.zoom ? cityData.zoom - 1 : 11}
                    />

                    {/* Floating City Landmark Badge */}
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] font-bold flex items-center gap-2 shadow-lg">
                        <Radar className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
                        <span>{cityData.landmark || currentCity}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <WaterFlow3D className="w-full h-full" showControls={true} />
                )}
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 3. 3D Civic Action Workflow Pipeline */}
      <section className="relative z-10 py-6 border-t border-slate-200">
        <CivicWorkflow3D onSimulateClick={() => setAiCopilotOpen(true)} />
      </section>

      {/* 4. Live Citizen Action & Volunteer Resource Network (VolunteerRadar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityActionTicker variant="hero" />
      </section>

      {/* 5. Pan-India Multi-City 3D Explorer Grid (Daylight Card Styling) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700">
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>National Coverage Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Active Municipalities Across 42 Major Indian Cities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any city across 28 states & union territories to sync live ward telemetry, coordinates, and verified emergency helplines.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            Active: <span className="font-bold text-teal-700">{currentCity}</span> ({cityData.state})
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {availableCities.map((c) => {
            const isSelected = currentCity.toLowerCase() === c.name.toLowerCase();
            const config = CITY_CONFIGS[c.name] || {
              code: c.name.slice(0, 3).toUpperCase(),
              gradient: 'from-slate-700 to-slate-900',
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
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-xs hover:border-teal-300'
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
                  <div className="text-[9px] text-teal-700 truncate mt-1">
                    {c.landmark.split('&')[0]}
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 6. 4-Step Resolution Lifecycle (Daylight 3D Tilt Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            The Verified Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            How NeedRadar Drives Real Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            An audited civic coordination framework backed by deterministic workflows and zero fake metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Residents Report Needs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit structured requests for tutoring, healthcare access, road repairs, or basic supplies with locality pins.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Pattern & Demand Clustering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic scoring evaluates report density, age, and supporters to compute transparent civic demand indices.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Verified Provider Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audited NGOs and service organisations receive matched opportunities and submit assistance proposals with timelines.
            </p>
          </TiltCard>

          <TiltCard className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Resident Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providers cannot self-certify completion. Outcomes are confirmed by the resident or moderator before marking resolved.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* 7. Six Core Community Domains (Daylight Clean Cards) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Six Core Community Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active civic categories monitored in {currentCity} and nationwide.
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
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition-all space-y-3 group"
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

      {/* 8. Trust & Transparency Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Civic Trust Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
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
              <Sparkles className="w-6 h-6 text-emerald-400" />
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

      {/* Modals */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      <AICopilotModal
        isOpen={aiCopilotOpen}
        onClose={() => setAiCopilotOpen(false)}
        onSelectNeed={(id) => navigate(`/needs/${id}`)}
      />
    </div>
  );
};
