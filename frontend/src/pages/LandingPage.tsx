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
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import { NeedMapItem, AnalyticsOverview } from '../types';
import { NeedMap } from '../components/map/NeedMap';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCity, cityData } = useCity();
  const [mapItems, setMapItems] = useState<NeedMapItem[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
                <span>{currentCity} Civic Intelligence Radar Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                See What Your Community Needs.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  Help Make It Happen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                NeedRadar turns unmet local needs into actionable insights, connecting communities with the people and verified organisations that can help.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/report"
                  className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Report a Need</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/discovery"
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>Explore Community Needs</span>
                </Link>
              </div>

              {/* Real Database Proof Banner */}
              {overview && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-mono">
                  <div>
                    <strong className="text-slate-900 font-bold">{overview.total_reports}</strong> Valid Reports
                  </div>
                  <div>•</div>
                  <div>
                    <strong className="text-slate-900 font-bold">{overview.distinct_supporters}</strong> Supporters
                  </div>
                  <div>•</div>
                  <div>
                    <strong className="text-teal-700 font-bold">{overview.resolution_rate_percent}%</strong> Resolution Rate
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Map Mini Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 p-2 rounded-2xl shadow-2xl border border-slate-800">
                <div className="px-3 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                    <span>Live Radar: {currentCity} Wards</span>
                  </div>
                  <Link to="/discovery" className="text-teal-400 hover:underline text-[11px]">
                    Open Full Map →
                  </Link>
                </div>
                <div className="h-80 rounded-xl overflow-hidden">
                  <NeedMap
                    items={mapItems.slice(0, 30)}
                    center={cityData ? [cityData.lon, cityData.lat] : undefined}
                    zoom={cityData?.zoom ? cityData.zoom - 1 : 11}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How NeedRadar Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">The Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How NeedRadar Drives Real Resolution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            An end-to-end civic coordination framework backed by verified workflows and zero fake metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Residents Report Needs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit structured requests for tutoring, healthcare access, road repairs, or basic supplies with locality pins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Pattern & Demand Clustering</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic scoring evaluates report density, age, and supporters to compute transparent civic demand indices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Verified Provider Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Audited NGOs and service organisations receive matched opportunities and submit assistance proposals with timelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Resident Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Providers cannot self-certify completion. Outcomes are confirmed by the resident or moderator before marking resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Six Core Community Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Initial categories deployed across Bengaluru wards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 'education',
                title: 'Education & Tutoring',
                desc: 'Remedial coaching, textbook drives, and student assistance for underprivileged municipal cohorts.',
              },
              {
                id: 'healthcare',
                title: 'Healthcare & Blood Coordination',
                desc: 'Citizen blood donation coordination, medical camp dispatch, and primary health clinic referrals.',
              },
              {
                id: 'supplies',
                title: 'Essential Supplies & Food Aid',
                desc: 'Dry ration kits, meal delivery for elderly, and non-perishable basic supplies for vulnerable families.',
              },
              {
                id: 'infrastructure',
                title: 'Public Infrastructure',
                desc: 'Pothole clusters, broken pedestrian footpaths, waterlogging, and missing street lighting.',
              },
              {
                id: 'repairs',
                title: 'Repairs & Local Services',
                desc: 'Community wheelchair ramps, park handrails, basic plumbing, and community tool libraries.',
              },
              {
                id: 'shelter',
                title: 'Shelter & Basic Necessities',
                desc: 'Transitional shelter referrals for displaced families and emergency winter blankets.',
              },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/discovery?category=${cat.id}`)}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-sm">
                    {cat.title}
                  </h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency & Privacy Commitments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 block mb-1">
              Civic Trust Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Engineered for Privacy, Accuracy, and Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Unlike generic social forums, NeedRadar does not display fabricated impact numbers, expose sensitive home addresses, or allow unverified actors to claim ownership of human needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-xs">
            <div className="space-y-2">
              <Shield className="w-5 h-5 text-teal-400" />
              <h4 className="font-bold text-white text-sm">Sensitive Pin Obfuscation</h4>
              <p className="text-slate-400 leading-relaxed">
                Individual medical or shelter requests automatically jitter coordinates by ~300 meters, shielding domestic safety.
              </p>
            </div>

            <div className="space-y-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h4 className="font-bold text-white text-sm">AI Explains, Never Invents</h4>
              <p className="text-slate-400 leading-relaxed">
                Deterministic algorithms calculate demand scores. AI models assist in categorization and duplicate explanation without generating fake evidence.
              </p>
            </div>

            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <h4 className="font-bold text-white text-sm">Audited Resolution Ledger</h4>
              <p className="text-slate-400 leading-relaxed">
                A provider cannot mark a problem resolved alone. Resolution proposals require resident confirmation or moderator verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
