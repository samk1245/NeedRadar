import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Users,
  Calendar,
  Shield,
  Heart,
  Share2,
  Flag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Send,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Info,
  Phone,
  PhoneCall,
  Mail,
  MessageCircle,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NeedRead, ProviderResponse, ResolutionProposal, NeedStatus } from '../types';
import { CityBadge } from '../components/common/CityBadge';
import { NgoLogo } from '../components/common/NgoLogo';
import { TiltCard } from '../components/common/TiltCard';
import { SupportEnquiryModal } from '../components/support/SupportEnquiryModal';

export const NeedDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [need, setNeed] = useState<NeedRead | null>(null);
  const [responses, setResponses] = useState<ProviderResponse[]>([]);
  const [proposals, setProposals] = useState<ResolutionProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [supporting, setSupporting] = useState(false);
  const [following, setFollowing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Resolution verification review modal/state
  const [reviewingProposalId, setReviewingProposalId] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewingLoading, setReviewingLoading] = useState(false);

  // Report abuse state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('unsafe_content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const fetchNeedData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.get<NeedRead>(`/needs/${id}`);
      setNeed(data);

      // Fetch responses and resolution proposals
      const [resps, props] = await Promise.all([
        api.get<ProviderResponse[]>(`/needs/${id}/responses`),
        api.get<ResolutionProposal[]>(`/needs/${id}/resolution-proposals`),
      ]);
      setResponses(resps);
      setProposals(props);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not load community report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeedData();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSupportToggle = async () => {
    if (!user) {
      showToast('Please sign in to support this community need.');
      return;
    }
    if (!need) return;

    setSupporting(true);
    try {
      if (need.has_supported) {
        await api.delete(`/needs/${need.id}/support`);
        setNeed({
          ...need,
          has_supported: false,
          supporters_count: Math.max(0, need.supporters_count - 1),
        });
        showToast('Support removed.');
      } else {
        await api.post(`/needs/${need.id}/support`);
        setNeed({
          ...need,
          has_supported: true,
          supporters_count: need.supporters_count + 1,
        });
        showToast('Thank you for supporting this community need!');
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to update support.');
    } finally {
      setSupporting(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      showToast('Please sign in to follow updates.');
      return;
    }
    if (!need) return;

    setFollowing(true);
    try {
      if (need.has_followed) {
        await api.delete(`/needs/${need.id}/follow`);
        setNeed({ ...need, has_followed: false });
        showToast('Unfollowed updates.');
      } else {
        await api.post(`/needs/${need.id}/follow`);
        setNeed({ ...need, has_followed: true });
        showToast('Now following updates for this need.');
      }
    } catch (err: any) {
      showToast(err.message || 'Unable to follow.');
    } finally {
      setFollowing(false);
    }
  };

  const handleConfirmResolution = async (proposalId: string, status: 'confirmed' | 'rejected') => {
    setReviewingLoading(true);
    try {
      await api.post(`/providers/proposals/${proposalId}/review`, {
        status,
        feedback: reviewFeedback || undefined,
      });
      showToast(
        status === 'confirmed'
          ? 'Resolution verified! Need marked as Resolved.'
          : 'Proposal rejected. Returned to assistance in progress.'
      );
      setReviewingProposalId(null);
      fetchNeedData();
    } catch (err: any) {
      showToast(err.message || 'Failed to review resolution.');
    } finally {
      setReviewingLoading(false);
    }
  };

  const handleSubmitAbuseReport = async () => {
    if (!need || !user) return;
    try {
      await api.post('/moderation/reports', {
        need_id: need.id,
        reason: reportReason,
        details: reportDetails,
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setReportSubmitted(false);
        setReportModalOpen(false);
      }, 2000);
    } catch (err: any) {
      showToast(err.message || 'Could not submit report.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500 font-medium">Loading community report details...</span>
      </div>
    );
  }

  if (errorMsg || !need) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Report Unavailable</h2>
        <p className="text-xs text-slate-500 mt-1">{errorMsg || 'This community report could not be found.'}</p>
        <Link
          to="/discovery"
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Discovery Map
        </Link>
      </div>
    );
  }

  const isResidentCreator = user?.id === need.creator_id;
  const isModeratorOrAdmin = user?.role === 'moderator' || user?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Info className="w-4 h-4 text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/discovery" className="hover:text-slate-900">
          Discovery Map
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="capitalize">{need.category}</span>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{need.locality}</span>
      </div>

      {/* Main Report Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content, Responses, Proposals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* Category, Status, Urgency Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                {need.category}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                {need.status.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold capitalize bg-amber-50 text-amber-800 border border-amber-200">
                {need.urgency} Urgency
              </span>
              {need.is_demo && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200">
                  Demo Data
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight mb-4">
              {need.title}
            </h1>

            {/* Approximate Location Notice */}
            {need.is_location_approximate && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 flex-shrink-0 text-amber-700" />
                <span>
                  <strong>Privacy Protected:</strong> Approximate geographic coordinates are displayed to protect sensitive resident privacy.
                </span>
              </div>
            )}

            <div className="text-sm text-slate-700 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-100 pt-4">
              {need.description}
            </div>

            {/* Metadata Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[11px]">Locality</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {need.locality}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reported By</span>
                <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                  {need.creator_name || 'Community Resident'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Timeframe</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {need.desired_timeframe}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Affected Count</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  ~{need.affected_count} people
                </span>
              </div>
            </div>
          </div>

          {/* Resolution Proposals Section */}
          {proposals.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Resolution Proposals & Verification</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {proposals.length} proposal(s)
                </span>
              </div>

              <div className="space-y-4">
                {proposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-sm">
                        {prop.organisation_name || 'Verified Provider'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                          prop.status === 'confirmed'
                            ? 'bg-teal-600 text-white'
                            : prop.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{prop.summary}</p>
                    {prop.evidence_notes && (
                      <p className="text-[11px] text-slate-500 bg-white/70 p-2 rounded border border-slate-200">
                        <strong>Evidence:</strong> {prop.evidence_notes}
                      </p>
                    )}

                    {/* Resident / Moderator Review Actions */}
                    {prop.status === 'proposed' && (isResidentCreator || isModeratorOrAdmin) && (
                      <div className="pt-2 border-t border-teal-200 flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={reviewFeedback}
                          onChange={(e) => setReviewFeedback(e.target.value)}
                          placeholder="Optional feedback / outcome confirmation notes..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            disabled={reviewingLoading}
                            onClick={() => handleConfirmResolution(prop.id, 'confirmed')}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs whitespace-nowrap shadow-sm"
                          >
                            ✓ Confirm Outcome
                          </button>
                          <button
                            disabled={reviewingLoading}
                            onClick={() => handleConfirmResolution(prop.id, 'rejected')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs whitespace-nowrap"
                          >
                            Request Clarification
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provider Responses Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Verified Provider & NGO Responses</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {responses.length} response(s)
              </span>
            </div>

            {responses.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Awaiting Provider Response</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verified NGOs and social service providers are notified based on category and proximity.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {resp.organisation_name || 'Verified Organisation'}
                        </span>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          Verified Partner
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(resp.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed">{resp.message}</p>

                    {resp.proposed_assistance && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <p className="text-slate-700 font-medium">
                          <strong>Proposed Assistance:</strong> {resp.proposed_assistance}
                        </p>
                        {resp.eligibility_requirements && (
                          <p className="text-slate-500 text-[11px]">
                            <strong>Eligibility:</strong> {resp.eligibility_requirements}
                          </p>
                        )}
                        <p className="text-slate-500 text-[11px]">
                          <strong>Response Time:</strong> {resp.estimated_timeline}
                        </p>
                      </div>
                    )}

                    <div className="p-2.5 rounded bg-teal-50/60 border border-teal-100 text-teal-950 text-[11px]">
                      <strong>Contact Instructions:</strong> {resp.contact_instructions}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Actions, Support, Demand Index, Safety */}
        <div className="space-y-5">
          {/* Direct Action & Verified Contact Hub */}
          <TiltCard maxTilt={8} scale={1.01} className="bg-white rounded-2xl border border-teal-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  Action & Contact Hub
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
                  Verified Contact Channels
                </h3>
              </div>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href={`tel:${responses[0]?.contact_instructions?.match(/\+?[0-9\s-]{8,}/)?.[0] || '112'}`}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold flex items-center justify-between transition-colors border border-teal-200"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>Call Coordinator / Helpline</span>
                </div>
                <span className="text-[10px] text-teal-700 font-mono">Instant Dial</span>
              </a>

              <a
                href={`https://wa.me/919876543210?text=Hello%20NeedRadar%20Team,%20I%20am%20inquiring%20about%20Need%20ID%20${need.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold flex items-center justify-between transition-colors border border-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp Direct Response</span>
                </div>
                <ExternalLink className="w-3 h-3 text-emerald-600" />
              </a>

              <button
                onClick={() => setSupportModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-3.5 h-3.5 text-teal-400" />
                  <span>Submit Inquiry / Grievance</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400">Desk Ticket</span>
              </button>
            </div>
          </TiltCard>

          {/* Community Support Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">
                Community Momentum
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {need.supporters_count}
                </span>
                <span className="text-xs font-medium text-slate-500">verified supporters</span>
              </div>
            </div>

            {/* Support Action Button */}
            <button
              disabled={supporting}
              onClick={handleSupportToggle}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                need.has_supported
                  ? 'bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${need.has_supported ? 'fill-teal-600 text-teal-600' : 'text-white'}`}
              />
              <span>{need.has_supported ? 'Supported (Click to Remove)' : 'Support This Need'}</span>
            </button>

            {/* Follow Action */}
            <button
              disabled={following}
              onClick={handleFollowToggle}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{need.has_followed ? '✓ Following Updates' : '+ Follow for Updates'}</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-normal">
              Supporting strengthens the unmet demand signal, prioritising this need on civic provider dashboards.
            </p>
          </div>

          {/* Unmet Demand Scorecard */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
              Civic Demand Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-white">
                {need.unmet_demand_score.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Derived from valid report age, affected radius, confirmed supporters count, and absence of verified provider responses.
            </p>
          </div>

          {/* Report Abuse Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-xs text-slate-400 hover:text-red-600 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Flag className="w-3 h-3" />
              <span>Report inappropriate or sensitive content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Abuse Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-2">Flag Content for Moderation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Help preserve community safety. Moderation teams audit all reported items.
            </p>

            {reportSubmitted ? (
              <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs text-center">
                ✓ Report submitted to moderation queue. Thank you.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    <option value="sensitive_personal_data">Sensitive Personal Data / Identity Leak</option>
                    <option value="unsafe_content">Unsafe or Misleading Information</option>
                    <option value="spam_or_fraud">Spam or Commercial Solicitation</option>
                    <option value="duplicate">Direct Duplicate Request</option>
                    <option value="other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional context for the moderator..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAbuseReport}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Flag
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Support Enquiry Modal */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        defaultNeedId={need.id}
      />
    </div>
  );
};
