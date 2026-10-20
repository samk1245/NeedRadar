import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Users,
  Send,
  PlusCircle,
  FileCheck,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Organisation, NeedRead, NeedCategory } from '../types';

export const ProviderPortal: React.FC = () => {
  const { user } = useAuth();

  const [org, setOrg] = useState<Organisation | null>(null);
  const [opportunities, setOpportunities] = useState<NeedRead[]>([]);
  const [loading, setLoading] = useState(true);

  // Registration form state for new providers
  const [registering, setRegistering] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgType, setOrgType] = useState('ngo');
  const [regNumber, setRegNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [serviceArea, setServiceArea] = useState('Koramangala, HSR Layout, Indiranagar');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['education', 'supplies']);
  const [operatingHours, setOperatingHours] = useState('Mon-Sat, 9am - 6pm');
  const [regError, setRegError] = useState<string | null>(null);

  // Response modal state
  const [respondingNeed, setRespondingNeed] = useState<NeedRead | null>(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [proposedAssistance, setProposedAssistance] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [timeline, setTimeline] = useState('1-3 business days');
  const [contactInstructions, setContactInstructions] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Propose Resolution modal state
  const [resolvingNeed, setResolvingNeed] = useState<NeedRead | null>(null);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolutionEvidence, setResolutionEvidence] = useState('');
  const [submittingResolution, setSubmittingResolution] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const myOrg = await api.get<Organisation | null>('/providers/organisations/me');
      setOrg(myOrg);

      const opps = await api.get<NeedRead[]>('/providers/opportunities');
      setOpportunities(opps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  const handleRegisterOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    try {
      const created = await api.post<Organisation>('/providers/organisations', {
        name: orgName,
        description: orgDesc,
        org_type: orgType,
        registration_number: regNumber || undefined,
        contact_email: contactEmail || user?.email,
        contact_phone: contactPhone || undefined,
        city: 'Bengaluru',
        service_area: serviceArea,
        operating_hours: operatingHours,
        categories: selectedCategories,
      });
      setOrg(created);
      setRegistering(false);
      showToast('Organisation profile created! Awaiting moderator verification.');
      fetchProviderData();
    } catch (err: any) {
      setRegError(err.message || 'Could not register organisation.');
    }
  };

  const handleSubmitResponse = async () => {
    if (!respondingNeed) return;
    setSubmittingResponse(true);
    try {
      await api.post(`/needs/${respondingNeed.id}/responses`, {
        message: responseMsg,
        proposed_assistance: proposedAssistance,
        eligibility_requirements: eligibility,
        estimated_timeline: timeline,
        contact_instructions: contactInstructions,
      });
      showToast('Response successfully delivered to community request!');
      setRespondingNeed(null);
      fetchProviderData();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit response.');
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleSubmitResolutionProposal = async () => {
    if (!resolvingNeed) return;
    setSubmittingResolution(true);
    try {
      await api.post(`/needs/${resolvingNeed.id}/resolution-proposals`, {
        summary: resolutionSummary,
        evidence_notes: resolutionEvidence,
      });
      showToast('Resolution proposal submitted. Resident will review outcome.');
      setResolvingNeed(null);
      fetchProviderData();
    } catch (err: any) {
      showToast(err.message || 'Failed to propose resolution.');
    } finally {
      setSubmittingResolution(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Provider & NGO Portal</h2>
        <p className="text-xs text-slate-500">
          Sign in or create an account to verify your organisation and respond to local community requests.
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 block mb-1">
            Service Provider & NGO Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Connecting Verified Capacity with Verified Demand
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Respond to matching community needs, coordinate assistance, and propose audited resolutions.
          </p>
        </div>

        {!org && !registering && (
          <button
            onClick={() => setRegistering(true)}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start md:self-auto"
          >
            + Register Your Organisation
          </button>
        )}
      </div>

      {/* Registration Form if not yet registered */}
      {registering && (
        <div className="bg-white rounded-2xl border border-teal-200 p-6 sm:p-8 shadow-md animate-in fade-in">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Register Organisation or Verified Provider</h2>
          <p className="text-xs text-slate-500 mb-6">
            Complete your profile for moderation verification before submitting official community responses.
          </p>

          {regError && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">
              {regError}
            </div>
          )}

          <form onSubmit={handleRegisterOrg} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organisation Name *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Bangalore Vidya Trust"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organisation Type *</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="ngo">Registered Non-Profit / Trust</option>
                  <option value="community_group">Community Group / Resident Assoc.</option>
                  <option value="service_provider">Verified Local Service Co-Op</option>
                  <option value="volunteer_network">Citizen Volunteer Network</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Mission *</label>
              <textarea
                rows={3}
                required
                value={orgDesc}
                onChange={(e) => setOrgDesc(e.target.value)}
                placeholder="Explain your programs, field capacity, and areas of service..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reg. Number / Darpan ID</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. NGO-KA-2022-1234"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="official@ngo.org"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Area *</label>
                <input
                  type="text"
                  required
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="e.g. Koramangala, Indiranagar"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Submit for Verification
              </button>
              <button
                type="button"
                onClick={() => setRegistering(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Organisation Status Card if already registered */}
      {org && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900">{org.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                    org.verification_status === 'verified'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : org.verification_status === 'rejected'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Status: {org.verification_status}
                </span>
              </div>
              <p className="text-xs text-slate-600">{org.description}</p>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              <span>Coverage: {org.service_area}</span>
            </div>
          </div>

          {org.verification_status !== 'verified' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0 text-amber-700" />
              <span>
                Your organisation profile is currently <strong>{org.verification_status}</strong>. Moderation reviews registered credentials before enabling community-wide assistance dispatch.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Matching Opportunities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Incoming Community Opportunities ({opportunities.length})
          </h2>
          <span className="text-xs text-slate-500">Ranked by unmet demand index</span>
        </div>

        {loading ? (
          <div className="h-40 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-500">
            Loading matching community opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No pending community requests match your service categories right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((need) => (
              <div
                key={need.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="capitalize font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {need.category}
                    </span>
                    <span className="font-mono text-teal-700 font-bold text-xs">
                      Index: {need.unmet_demand_score.toFixed(0)}/100
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {need.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{need.locality}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2">{need.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  <span className="text-slate-500">{need.supporters_count} supporters</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={org?.verification_status !== 'verified'}
                      onClick={() => setRespondingNeed(need)}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-md font-semibold text-xs transition-colors"
                      title={org?.verification_status !== 'verified' ? 'Requires verified status' : ''}
                    >
                      Offer Help
                    </button>
                    <button
                      disabled={org?.verification_status !== 'verified'}
                      onClick={() => setResolvingNeed(need)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-md font-semibold text-xs transition-colors"
                      title="Propose resolution outcome"
                    >
                      Propose Resolution
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Help Response Modal */}
      {respondingNeed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Submit Response to Request</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-1 font-medium">{respondingNeed.title}</p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Response Message *</label>
                <textarea
                  rows={3}
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  placeholder="Acknowledge the need and introduce your assistance offer..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Assistance Specifics</label>
                <input
                  type="text"
                  value={proposedAssistance}
                  onChange={(e) => setProposedAssistance(e.target.value)}
                  placeholder="e.g. 10 study kits + weekend coaching center access"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Response Timeline</label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. 24-48 hours"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g. Government school students"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Instructions *</label>
                <input
                  type="text"
                  value={contactInstructions}
                  onChange={(e) => setContactInstructions(e.target.value)}
                  placeholder="e.g. Call trust helpline or visit our HSR Sector 2 office."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRespondingNeed(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submittingResponse || !responseMsg.trim() || !contactInstructions.trim()}
                  onClick={handleSubmitResponse}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submittingResponse ? 'Sending...' : 'Deliver Assistance Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Propose Resolution Modal */}
      {resolvingNeed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Propose Verified Resolution</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-1 font-medium">{resolvingNeed.title}</p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Summary *</label>
                <textarea
                  rows={3}
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="Detail the services or goods delivered, dates completed, and outcomes achieved..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Evidence / Proof Notes</label>
                <input
                  type="text"
                  value={resolutionEvidence}
                  onChange={(e) => setResolutionEvidence(e.target.value)}
                  placeholder="e.g. Receipt voucher #88219 signed by school principal"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                The reporting resident will be prompted to confirm this resolution. If verified, the platform records this in the official civic resolution ledger.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingNeed(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submittingResolution || !resolutionSummary.trim()}
                  onClick={handleSubmitResolutionProposal}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submittingResolution ? 'Submitting...' : 'Submit Resolution Proposal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
