import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  MessageSquare,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Heart,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { NeedRead } from '../types';

export const ResidentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myNeeds, setMyNeeds] = useState<NeedRead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const data = await api.get<NeedRead[]>('/needs?my_needs=true');
        setMyNeeds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign in to access your dashboard</h2>
        <p className="text-xs text-slate-500">Track and manage your submitted community needs in Bengaluru.</p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const openNeeds = myNeeds.filter((n) => !['resolved', 'closed', 'rejected'].includes(n.status));
  const needsWithResponses = myNeeds.filter((n) => (n.responses_count || 0) > 0);
  const resolvedNeeds = myNeeds.filter((n) => n.status === 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 block mb-1">
            Resident Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking your submitted civic requests and community responses in {user.city}.
          </p>
        </div>

        <Link
          to="/report"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report a Community Need</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">My Active Requests</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
            {openNeeds.length}
          </span>
          <span className="text-[11px] text-teal-600 font-medium mt-1 block">Live on community radar</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Needs With Provider Offers</span>
          <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
            {needsWithResponses.length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">From verified local NGOs</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Confirmed Resolved</span>
          <span className="text-3xl font-extrabold text-teal-700 mt-1 block">
            {resolvedNeeds.length}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Verified community outcomes</span>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Community Requests</h2>
          <Link
            to="/discovery"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Explore all city requests</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="h-40 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-500">
            Loading your reports...
          </div>
        ) : myNeeds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Needs Reported Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you or your neighbourhood are facing challenges in tutoring, healthcare access, roads, or supplies, create your first report.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm mt-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Your First Need
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myNeeds.map((need) => (
              <div
                key={need.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="capitalize font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {need.category}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-600 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                      {need.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {need.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{need.locality}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{need.supporters_count} supporters</span>
                  </div>
                  <Link
                    to={`/needs/${need.id}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors"
                  >
                    View Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
