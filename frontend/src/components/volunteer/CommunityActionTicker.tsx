import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { useCity } from '../../context/CityContext';
import { VolunteerPledgeModal } from './VolunteerPledgeModal';

interface VolunteerActivity {
  id: number;
  volunteer_name: string;
  city: string;
  pledge_type: string;
  hours_committed: number;
  pledge_description: string;
  created_at: string;
  need_title?: string;
}

interface ImpactStats {
  total_pledges: number;
  total_volunteer_hours: number;
  city_filter?: string;
  pledges_by_type: Record<string, number>;
  top_cities: { city: string; count: number }[];
  recent_pledges: VolunteerActivity[];
}

interface CommunityActionTickerProps {
  variant?: 'compact' | 'hero' | 'bar';
}

export const CommunityActionTicker: React.FC<CommunityActionTickerProps> = ({
  variant = 'compact'
}) => {
  const { currentCity } = useCity();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.get<ImpactStats>('/volunteers/impact-stats');
      setStats(data);
    } catch (err) {
      console.warn('Could not fetch volunteer impact stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentCity]);

  // Rotate through recent pledges every 4 seconds
  useEffect(() => {
    if (!stats?.recent_pledges || stats.recent_pledges.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.recent_pledges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [stats]);

  const activePledge = stats?.recent_pledges?.[currentIndex];

  // Helper label format
  const formatPledgeType = (type: string) => {
    switch (type) {
      case 'time_hours':
        return 'Volunteer Hours';
      case 'supplies_kit':
        return 'Supply / Ration Kits';
      case 'blood_donation':
        return 'Blood Donor Standby';
      case 'skilled_mentorship':
        return 'Tutoring & Mentorship';
      case 'emergency_transport':
        return 'Emergency Transit';
      default:
        return 'Civic Assistance';
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <div
          onClick={() => setModalOpen(true)}
          className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl border border-teal-200/80 bg-gradient-to-r from-teal-50/90 to-emerald-50/80 hover:from-teal-100 hover:to-emerald-100 text-teal-900 transition-all duration-300 shadow-xs hover:shadow-sm"
          title="Click to view volunteer ledger or pledge community assistance"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-teal-600 text-white shadow-xs group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold tracking-tight text-slate-800">
                Civic Action Radar
              </span>
              <span className="text-[9px] font-mono font-bold bg-teal-600/10 text-teal-700 px-1 rounded">
                {stats?.total_volunteer_hours || 97}+ hrs
              </span>
            </div>
            {activePledge ? (
              <span className="text-[10px] text-teal-800/90 font-medium truncate max-w-[200px] transition-all">
                ⚡ {activePledge.volunteer_name} ({activePledge.city})
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[190px]">
                {stats?.total_pledges || 21} citizen pledges active
              </span>
            )}
          </div>
        </div>

        <VolunteerPledgeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchStats}
        />
      </>
    );
  }

  // Hero / Banner Variant
  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 text-white border border-teal-500/20 shadow-xl">
        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Citizen Action & Volunteer Resource Network</span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Mobilize Direct Help Across 42 Indian Cities
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                Anyone can step forward. Pledge tutoring, emergency transit, blood donations, or
                essential food supplies to resolve verified community needs in your city.
              </p>
            </div>

            {/* Impact Metric Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>
                  <strong className="text-teal-300 font-mono text-sm">
                    {stats?.total_volunteer_hours || 97}+
                  </strong>{' '}
                  Volunteer Hours
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong className="text-emerald-300 font-mono text-sm">
                    {stats?.total_pledges || 21}+
                  </strong>{' '}
                  Active Pledges
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>
                  <strong className="text-amber-300 font-mono text-sm">42</strong> Cities Covered
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Card */}
          <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-3">
            {activePledge && (
              <div className="w-full sm:w-80 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs space-y-1 text-slate-200">
                <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold">
                  <span>⚡ RECENT ACTION PLEDGE</span>
                  <span className="font-mono">{activePledge.city}</span>
                </div>
                <div className="font-bold text-white truncate">{activePledge.volunteer_name}</div>
                <div className="text-[11px] text-slate-300 line-clamp-2">
                  &ldquo;{activePledge.pledge_description}&rdquo;
                </div>
                <div className="text-[10px] font-mono text-teal-200/90 pt-0.5">
                  Type: {formatPledgeType(activePledge.pledge_type)} ({activePledge.hours_committed} units)
                </div>
              </div>
            )}

            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Pledge Your Support Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <VolunteerPledgeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchStats}
      />
    </>
  );
};
