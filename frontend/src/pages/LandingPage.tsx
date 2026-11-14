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
    <div className="bg-[#0f1626] text-[#f4f6fa] min-h-screen">
      {/* 1. Scroll-Driven 3D Miniature Night-City Hero */}
      <NorvaHero
        onExploreClick={() => navigate('/discovery')}
        onRequestClick={() => navigate('/report')}
      />

      {/* 2. Transition Bridge & Live Radar Intelligence Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission & Real Data Proof */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e293b]/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3fd8ff] animate-ping" />
              <span className="font-mono">{currentCity}</span>
              <span className="text-slate-500">•</span>
              <span>Active Radar Across {availableCities.length || 42} Cities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f4f6fa] leading-tight">
              Real-Time Community Radar.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3fd8ff] via-teal-400 to-[#c6ff2e]">
                Verified Ground Resolution.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[rgba(244,246,250,0.72)] leading-relaxed font-normal max-w-2xl">
              NeedRadar turns unmet civic distress signals into verified spatial intelligence, matching residents with vetted NGO crews, municipal coordination desks, and rapid response networks.
            </p>

            {/* Platform Action Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/report"
                className="px-6 py-3 bg-[#c6ff2e] hover:bg-[#b4f020] text-[#0f1626] rounded-full font-bold text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>Report a Need</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/discovery"
                className="px-6 py-3 bg-[#2a3245] hover:bg-[#343e56] text-[#f4f6fa] rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5"
              >
                <MapPin className="w-4 h-4 text-[#3fd8ff]" />
                <span>Explore Live Radar</span>
              </Link>

              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="px-5 py-3 bg-[#1e293b] hover:bg-[#27354d] text-rose-300 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 border border-rose-500/30 hover:-translate-y-0.5"
              >
                <LifeBuoy className="w-4 h-4 text-rose-400" />
                <span>Civic Helplines & Support</span>
              </button>
            </div>

            {/* Verified Database Ledger Proof */}
            {overview && (
              <div className="pt-4 border-t border-[rgba(255,255,255,0.12)] flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[rgba(244,246,250,0.72)] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3fd8ff]"></span>
                  <strong className="text-[#f4f6fa] font-bold">{overview.total_reports}</strong> Valid Reports
                </div>
                <div className="hidden sm:inline text-slate-600">•</div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#3fd8ff]" />
                  <strong className="text-[#f4f6fa] font-bold">{overview.distinct_supporters}</strong> Active Supporters
                </div>
                <div className="hidden sm:inline text-slate-600">•</div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c6ff2e]" />
                  <strong className="text-[#c6ff2e] font-bold">{overview.resolution_rate_percent}%</strong> Verified Resolutions
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 3D Live Map & 3D Water Flow Simulation */}
          <div className="lg:col-span-5">
            <TiltCard maxTilt={6} scale={1.01} className="rounded-3xl shadow-2xl border border-[rgba(255,255,255,0.15)] overflow-hidden bg-[#182238]">
              <div className="px-4 py-3 flex items-center justify-between text-xs text-[rgba(244,246,250,0.72)] border-b border-[rgba(255,255,255,0.12)] bg-[#11192b]">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHeroViewMode('map')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                      heroViewMode === 'map'
                        ? 'bg-[#3fd8ff]/20 text-[#3fd8ff] border border-[#3fd8ff]/40'
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
                        ? 'bg-[#c6ff2e]/20 text-[#c6ff2e] border border-[#c6ff2e]/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Waves className="w-3 h-3 text-[#c6ff2e]" />
                    <span>3D Water Flow</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setAiCopilotOpen(true)}
                  className="text-[#3fd8ff] hover:text-cyan-200 flex items-center gap-1 text-[11px] font-bold bg-[#3fd8ff]/10 px-2.5 py-1 rounded-lg border border-[#3fd8ff]/30 transition-colors"
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
                      <div className="px-3 py-1.5 rounded-xl bg-[#0f1626]/90 backdrop-blur-md border border-[rgba(255,255,255,0.2)] text-white text-[11px] font-bold flex items-center gap-2 shadow-lg">
                        <Radar className="w-3.5 h-3.5 text-[#3fd8ff] animate-spin-slow" />
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
      <section className="relative z-10 py-6 border-t border-[rgba(255,255,255,0.08)]">
        <CivicWorkflow3D onSimulateClick={() => setAiCopilotOpen(true)} />
      </section>

      {/* 4. Live Citizen Action & Volunteer Resource Network (VolunteerRadar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CommunityActionTicker variant="hero" />
      </section>

      {/* 5. Pan-India Multi-City 3D Explorer Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3fd8ff]">
              <Compass className="w-3.5 h-3.5" />
              <span>National Coverage Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f6fa] tracking-tight mt-1">
              Active Municipalities Across 42 Major Indian Cities
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(244,246,250,0.72)] mt-1">
              Select any city across 28 states & union territories to sync live ward telemetry, coordinates, and verified emergency helplines.
            </p>
          </div>

          <div className="text-xs font-mono text-[rgba(244,246,250,0.72)] bg-[#182238] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)]">
            Active: <span className="font-bold text-[#c6ff2e]">{currentCity}</span> ({cityData.state})
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
                    ? 'bg-[#1e293b] border-[#3fd8ff] shadow-lg ring-2 ring-[#3fd8ff]/30'
                    : 'bg-[#182238]/80 hover:bg-[#1e293b] border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center font-bold text-xs shadow-xs`}
                  >
                    {config.code}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#3fd8ff] animate-ping" />
                  )}
                </div>

                <div className="font-extrabold text-xs text-[#f4f6fa] truncate">{c.name}</div>
                <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {c.state.split(' ')[0]}
                </div>
                {c.landmark && (
                  <div className="text-[9px] text-cyan-300 truncate mt-1">
                    {c.landmark.split('&')[0]}
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* 6. 4-Step Resolution Lifecycle (3D Tilt Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3fd8ff]">
            The Verified Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f6fa] tracking-tight mt-1">
            How NeedRadar Drives Real Resolution
          </h2>
          <p className="text-xs sm:text-sm text-[rgba(244,246,250,0.72)] mt-1">
            An audited civic coordination framework backed by deterministic workflows and zero fake metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TiltCard className="bg-[#182238] p-6 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a3245] text-[#3fd8ff] border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-[#f4f6fa]">1. Residents Report Needs</h3>
            <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">
              Citizens submit structured requests for tutoring, healthcare access, road repairs, or basic supplies with locality pins.
            </p>
          </TiltCard>

          <TiltCard className="bg-[#182238] p-6 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a3245] text-[#3fd8ff] border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-[#f4f6fa]">2. Pattern & Demand Clustering</h3>
            <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">
              Deterministic scoring evaluates report density, age, and supporters to compute transparent civic demand indices.
            </p>
          </TiltCard>

          <TiltCard className="bg-[#182238] p-6 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a3245] text-[#3fd8ff] border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-[#f4f6fa]">3. Verified Provider Matching</h3>
            <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">
              Audited NGOs and service organisations receive matched opportunities and submit assistance proposals with timelines.
            </p>
          </TiltCard>

          <TiltCard className="bg-[#182238] p-6 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a3245] text-[#3fd8ff] border border-cyan-500/30 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-[#f4f6fa]">4. Resident Verification</h3>
            <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">
              Providers cannot self-certify completion. Outcomes are confirmed by the resident or moderator before marking resolved.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* 7. Six Core Community Domains (3D Interactive Cards) */}
      <section className="bg-[#11192b] py-16 border-y border-[rgba(255,255,255,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f4f6fa] tracking-tight">
              Six Core Community Domains
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(244,246,250,0.72)] mt-1">
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
                accent: 'text-indigo-400 bg-indigo-950/60 border-indigo-700/50',
              },
              {
                id: 'healthcare',
                title: 'Healthcare & Blood Coordination',
                desc: 'Citizen blood donation coordination, medical camp dispatch, and primary health clinic referrals.',
                icon: Heart,
                accent: 'text-rose-400 bg-rose-950/60 border-rose-700/50',
              },
              {
                id: 'supplies',
                title: 'Essential Supplies & Food Aid',
                desc: 'Dry ration kits, meal delivery for elderly, and non-perishable basic supplies for vulnerable families.',
                icon: Package,
                accent: 'text-amber-400 bg-amber-950/60 border-amber-700/50',
              },
              {
                id: 'infrastructure',
                title: 'Public Infrastructure',
                desc: 'Pothole clusters, broken pedestrian footpaths, waterlogging, and missing street lighting.',
                icon: Building2,
                accent: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50',
              },
              {
                id: 'repairs',
                title: 'Repairs & Local Services',
                desc: 'Community wheelchair ramps, park handrails, basic plumbing, and community tool libraries.',
                icon: Wrench,
                accent: 'text-blue-400 bg-blue-950/60 border-blue-700/50',
              },
              {
                id: 'shelter',
                title: 'Shelter & Basic Necessities',
                desc: 'Transitional shelter referrals for displaced families and emergency winter blankets.',
                icon: Home,
                accent: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <TiltCard
                  key={cat.id}
                  maxTilt={8}
                  scale={1.02}
                  onClick={() => navigate(`/discovery?category=${cat.id}`)}
                  className="bg-[#182238] p-5 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-sm hover:shadow-cyan-500/10 cursor-pointer transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${cat.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-[#f4f6fa] group-hover:text-[#3fd8ff] transition-colors text-sm">
                        {cat.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#3fd8ff] transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">{cat.desc}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Trust & Transparency Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#182238] text-white rounded-3xl p-8 sm:p-12 border border-[rgba(255,255,255,0.15)] space-y-8 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3fd8ff] block mb-1">
              Civic Trust Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#f4f6fa]">
              Engineered for Privacy, Accuracy, and Verified Action
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(244,246,250,0.72)] mt-2 leading-relaxed">
              Unlike generic social forums, NeedRadar does not display fabricated impact numbers, expose sensitive home addresses, or allow unverified actors to claim ownership of human needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[rgba(255,255,255,0.1)] text-xs">
            <div className="space-y-2">
              <Shield className="w-6 h-6 text-[#3fd8ff]" />
              <h4 className="font-bold text-[#f4f6fa] text-sm">Sensitive Pin Obfuscation</h4>
              <p className="text-[rgba(244,246,250,0.72)] leading-relaxed">
                Individual medical or shelter requests automatically jitter coordinates by ~300 meters, shielding domestic safety.
              </p>
            </div>

            <div className="space-y-2">
              <Sparkles className="w-6 h-6 text-[#c6ff2e]" />
              <h4 className="font-bold text-[#f4f6fa] text-sm">AI Explains, Never Invents</h4>
              <p className="text-[rgba(244,246,250,0.72)] leading-relaxed">
                Deterministic algorithms calculate demand scores. AI models assist in categorization and duplicate explanation without generating fake evidence.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#3fd8ff]" />
              <h4 className="font-bold text-[#f4f6fa] text-sm">Audited Resolution Ledger</h4>
              <p className="text-[rgba(244,246,250,0.72)] leading-relaxed">
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
