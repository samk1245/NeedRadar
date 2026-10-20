import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Download,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import {
  AnalyticsOverview,
  CategoryDistributionItem,
  LocalityDemandItem,
  WeeklyTrendItem,
  EmergingTrendItem,
  ServiceGapInsight
} from '../types';

const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#64748b', '#8b5cf6', '#10b981'];

export const AnalyticsPage: React.FC = () => {
  const { currentCity } = useCity();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [categories, setCategories] = useState<CategoryDistributionItem[]>([]);
  const [localities, setLocalities] = useState<LocalityDemandItem[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrendItem[]>([]);
  const [serviceGaps, setServiceGaps] = useState<ServiceGapInsight[]>([]);
  const [trending, setTrending] = useState<EmergingTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [ov, cats, locs, weekly, gaps, trend] = await Promise.all([
        api.get<AnalyticsOverview>(`/analytics/overview?city=${encodeURIComponent(currentCity)}`),
        api.get<CategoryDistributionItem[]>(`/analytics/categories?city=${encodeURIComponent(currentCity)}`),
        api.get<LocalityDemandItem[]>(`/analytics/localities?city=${encodeURIComponent(currentCity)}`),
        api.get<WeeklyTrendItem[]>(`/analytics/weekly?city=${encodeURIComponent(currentCity)}`),
        api.get<ServiceGapInsight[]>(`/analytics/service-gaps?city=${encodeURIComponent(currentCity)}`),
        api.get<EmergingTrendItem[]>(`/discovery/trending?city=${encodeURIComponent(currentCity)}`),
      ]);

      setOverview(ov);
      setCategories(cats);
      setLocalities(locs);
      setWeeklyTrends(weekly);
      setServiceGaps(gaps);
      setTrending(trend);
    } catch (err) {
      console.error('Analytics load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [currentCity]);

  const handleExportCSV = () => {
    window.open(`http://localhost:8000/api/v1/analytics/export-csv?city=${encodeURIComponent(currentCity)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 font-medium">Computing demand intelligence models from live database...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 block mb-1">
            Civic Intelligence & Pattern Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Demand Intelligence & Service-Gap Analytics</span>
            <span className="text-xs px-2.5 py-1 rounded font-bold font-mono bg-teal-50 text-teal-800 border border-teal-200">
              {currentCity}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deterministic metrics, trend detection, and verifiable service gap statements across {currentCity}.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Data (CSV)</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Total Valid Reports</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{overview.total_reports}</span>
            <span className="text-[10px] text-teal-600 font-medium mt-0.5 block">Excluding rejected</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Unresolved</span>
            <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">{overview.unresolved_reports}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Active community demand</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Distinct Supporters</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{overview.distinct_supporters}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Unique endorsements</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Provider Offers</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{overview.confirmed_provider_responses}</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Verified NGO responses</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Resolution Rate</span>
            <span className="text-2xl font-bold font-mono text-teal-700 mt-1 block">{overview.resolution_rate_percent}%</span>
            <span className="text-[10px] text-teal-600 font-medium mt-0.5 block">Audited outcomes</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Median Response</span>
            <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{overview.median_time_to_response_hours}h</span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Time to first offer</span>
          </div>
        </div>
      )}

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Trends Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Community Activity Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">New Reports vs Resolutions vs Provider Responses</p>
            </div>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Line type="monotone" dataKey="new_reports" name="New Reports" stroke="#0d9488" strokeWidth={2.5} />
                <Line type="monotone" dataKey="resolved_reports" name="Resolved" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="provider_responses" name="Provider Offers" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Demand Volume by Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Total count and unresolved volume</p>
            </div>
            <BarChart3 className="w-4 h-4 text-teal-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" name="Total Reports" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unresolved_count" name="Unresolved" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Gap Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Verifiable Service-Gap Insights</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly records-backed: synthesised when reports surge while verified provider responses remain under 60%.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {serviceGaps.length} Actionable Gap(s)
          </span>
        </div>

        {serviceGaps.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No critical service gaps detected with insufficient provider coverage.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceGaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                    {gap.locality} • {gap.category}
                  </span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded uppercase">
                    Confidence: {gap.confidence}
                  </span>
                </div>

                <p className="text-slate-800 font-medium leading-relaxed">{gap.statement}</p>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                  <span className="font-semibold text-slate-700 block">Recommended Action:</span>
                  <p className="text-slate-600">{gap.recommended_action}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                  <span>Demand Score: {gap.unmet_demand_score.toFixed(1)}/100</span>
                  <span>Observation: {gap.observation_period}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emerging Trends Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Emerging Geographic Demand Patterns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {trending.slice(0, 4).map((trend, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{trend.locality}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    trend.trend_direction === 'surging'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {trend.trend_direction}
                </span>
              </div>
              <p className="text-slate-500 capitalize">{trend.category}</p>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-lg font-bold font-mono text-slate-800">
                  {trend.percent_change > 0 ? `+${trend.percent_change}%` : `${trend.percent_change}%`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {trend.current_count} recent / {trend.baseline_count} prior
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
