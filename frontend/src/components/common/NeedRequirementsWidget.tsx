import React, { useState } from 'react';
import {
  Package,
  Users,
  Car,
  Droplet,
  GraduationCap,
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';

export interface WorkingRequirementItem {
  id: string;
  title: string;
  category: string; // supplies, volunteers, logistics, funding
  required_quantity: number;
  pledged_quantity: number;
  unit: string;
  urgency?: string;
  is_fulfilled?: boolean;
}

interface NeedRequirementsWidgetProps {
  needId: string;
  needTitle?: string;
  city?: string;
  requirements?: WorkingRequirementItem[];
  onRequirementUpdated?: (updatedReqs: WorkingRequirementItem[]) => void;
  compact?: boolean;
}

export const NeedRequirementsWidget: React.FC<NeedRequirementsWidgetProps> = ({
  needId,
  needTitle = 'Community Need',
  city = 'Local Ward',
  requirements: initialReqs = [],
  onRequirementUpdated,
  compact = false,
}) => {
  // If no requirements passed, use sensible defaults based on standard need requirements
  const [requirements, setRequirements] = useState<WorkingRequirementItem[]>(() => {
    if (initialReqs && initialReqs.length > 0) return initialReqs;
    return [
      {
        id: 'req-1',
        title: 'Emergency Relief & Ration Packs',
        category: 'supplies',
        required_quantity: 40,
        pledged_quantity: 28,
        unit: 'packs',
        urgency: 'high',
        is_fulfilled: false
      },
      {
        id: 'req-2',
        title: 'On-Ground Volunteer Dispatchers',
        category: 'volunteers',
        required_quantity: 4,
        pledged_quantity: 3,
        unit: 'volunteers',
        urgency: 'medium',
        is_fulfilled: false
      },
      {
        id: 'req-3',
        title: 'Utility Transit Vehicle / Van',
        category: 'logistics',
        required_quantity: 1,
        pledged_quantity: 1,
        unit: 'vehicle',
        urgency: 'medium',
        is_fulfilled: true
      }
    ];
  });

  const [activeModalReq, setActiveModalReq] = useState<WorkingRequirementItem | null>(null);
  const [pledgeQty, setPledgeQty] = useState(1);
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const totalRequired = requirements.reduce((acc, r) => acc + r.required_quantity, 0);
  const totalPledged = requirements.reduce((acc, r) => acc + Math.min(r.pledged_quantity, r.required_quantity), 0);
  const fulfillmentPct = totalRequired > 0 ? Math.round((totalPledged / totalRequired) * 100) : 100;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'volunteers':
        return Users;
      case 'logistics':
        return Car;
      case 'healthcare':
      case 'blood':
        return Droplet;
      case 'education':
        return GraduationCap;
      default:
        return Package;
    }
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalReq) return;
    setSubmitting(true);

    try {
      // Call backend API if possible, else update optimistically
      try {
        await api.post(`/needs/${needId}/fulfill-requirement`, {
          requirement_id: activeModalReq.id,
          quantity: pledgeQty,
          volunteer_name: volunteerName.trim() || 'Citizen Supporter',
          volunteer_email: volunteerEmail.trim() || 'supporter@needradar.org',
          volunteer_phone: volunteerPhone.trim() || '+91 9876543210',
          notes: `Pledged ${pledgeQty} ${activeModalReq.unit} of ${activeModalReq.title}`
        });
      } catch {
        // Fallback to volunteer pledge
        await api.post('/volunteers/pledge', {
          need_id: needId,
          volunteer_name: volunteerName.trim() || 'Citizen Volunteer',
          volunteer_email: volunteerEmail.trim() || 'supporter@needradar.org',
          volunteer_phone: volunteerPhone.trim() || '+91 9876543210',
          city: city,
          pledge_type: activeModalReq.category === 'volunteers' ? 'time_hours' : 'supplies_kit',
          hours_committed: pledgeQty,
          pledge_description: `Direct fulfillment of ${pledgeQty} ${activeModalReq.unit} for "${activeModalReq.title}"`,
          availability: 'Flexible'
        });
      }

      // Optimistically update local requirements
      const updated = requirements.map((r) => {
        if (r.id === activeModalReq.id) {
          const newPledged = r.pledged_quantity + pledgeQty;
          return {
            ...r,
            pledged_quantity: newPledged,
            is_fulfilled: newPledged >= r.required_quantity
          };
        }
        return r;
      });

      setRequirements(updated);
      if (onRequirementUpdated) onRequirementUpdated(updated);

      setSuccessToast(`Thank you! Pledged ${pledgeQty} ${activeModalReq.unit} to ${activeModalReq.title}.`);
      setActiveModalReq(null);
      setPledgeQty(1);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Could not record pledge. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
          <span className="flex items-center gap-1 text-slate-800 font-bold">
            <Package className="w-3.5 h-3.5 text-teal-600" />
            Working Requirements
          </span>
          <span className="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
            {fulfillmentPct}% Fulfilled
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${fulfillmentPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {requirements.slice(0, 3).map((r) => {
            const isDone = r.is_fulfilled || r.pledged_quantity >= r.required_quantity;
            return (
              <span
                key={r.id}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                  isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-75'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {r.title} ({r.pledged_quantity}/{r.required_quantity} {r.unit})
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-white via-teal-50/20 to-white p-5 shadow-sm space-y-4">
      {/* Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 font-display">
              Working Requirements & Resource Ledger
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {requirements.length} item(s) listed
            </span>
          </div>
          <h4 className="text-sm font-black text-slate-900 mt-1">
            Exact Items & Volunteer Skills Needed
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of resources needed to resolve this report. Anyone can pledge directly.
          </p>
        </div>

        {/* Big percentage metric */}
        <div className="text-right shrink-0">
          <div className="text-xl sm:text-2xl font-black text-teal-700 font-display">
            {fulfillmentPct}%
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            {totalPledged}/{totalRequired} Units
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700 shadow-sm"
          style={{ width: `${fulfillmentPct}%` }}
        />
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5 pt-1">
        {requirements.map((req) => {
          const Icon = getCategoryIcon(req.category);
          const isFulfilled = req.is_fulfilled || req.pledged_quantity >= req.required_quantity;
          const remaining = Math.max(0, req.required_quantity - req.pledged_quantity);
          const itemPct = Math.min(100, Math.round((req.pledged_quantity / req.required_quantity) * 100));

          return (
            <div
              key={req.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isFulfilled
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                  : 'bg-white border-slate-200 hover:border-teal-300 shadow-xs'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isFulfilled
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                      {req.title}
                    </span>
                    {req.urgency === 'critical' && !isFulfilled && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200 font-bold uppercase">
                        Critical
                      </span>
                    )}
                    {isFulfilled && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Fulfilled
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>
                      Goal: <strong className="text-slate-800 font-mono">{req.required_quantity} {req.unit}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Pledged: <strong className="text-teal-700 font-mono">{req.pledged_quantity} {req.unit}</strong> ({itemPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {!isFulfilled ? (
                  <button
                    onClick={() => {
                      setActiveModalReq(req);
                      setPledgeQty(1);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-sm flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pledge {remaining > 0 ? `(${remaining} left)` : ''}</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Complete
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Pledging specific requirement */}
      {activeModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-teal-200" />
                  <h3 className="font-bold text-base">Fulfill Working Requirement</h3>
                </div>
                <button
                  onClick={() => setActiveModalReq(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-teal-100 mt-1">
                Pledging specifically towards: <strong>{activeModalReq.title}</strong>
              </p>
            </div>

            <form onSubmit={handlePledgeSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity You Can Commit ({activeModalReq.unit})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max={Math.max(10, activeModalReq.required_quantity)}
                    value={pledgeQty}
                    onChange={(e) => setPledgeQty(Number(e.target.value))}
                    className="flex-1 accent-teal-600 cursor-pointer"
                  />
                  <span className="w-16 text-center py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-mono font-bold text-xs">
                    {pledgeQty} {activeModalReq.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 ..."
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalReq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Confirming...' : 'Confirm Item Pledge'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
