import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  GitMerge,
  FileText,
  AlertTriangle,
  Building,
  RefreshCw,
  Search,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Organisation, NeedRead } from '../types';

export const AdminConsole: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'queue' | 'orgs' | 'merge' | 'audit'>('queue');
  const [loading, setLoading] = useState(true);

  // Moderation Queue data
  const [pendingReports, setPendingReports] = useState<any[]>([]);
  const [pendingOrgs, setPendingOrgs] = useState<Organisation[]>([]);
  const [flaggedNeeds, setFlaggedNeeds] = useState<NeedRead[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Duplicate merge form
  const [primaryId, setPrimaryId] = useState('');
  const [duplicateId, setDuplicateId] = useState('');
  const [mergeReason, setMergeReason] = useState('Identified duplicate request in same ward');
  const [merging, setMerging] = useState(false);

  // Status notes modal
  const [actionReason, setActionReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const queueData: any = await api.get('/moderation/queue');
      setPendingReports(queueData.pending_abuse_reports || []);
      setPendingOrgs(queueData.pending_organisations || []);
      setFlaggedNeeds(queueData.flagged_needs || []);

      const logs: any = await api.get('/moderation/audit-logs?limit=30');
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'moderator' || user.role === 'admin')) {
      fetchQueue();
    }
  }, [user]);

  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Privileged Access Required</h2>
        <p className="text-xs text-slate-500">
          This administrative console is restricted to authenticated moderators and platform administrators.
        </p>
      </div>
    );
  }

  const handleNeedReview = async (needId: string, action: 'approve' | 'reject' | 'hide') => {
    try {
      await api.post(`/moderation/needs/${needId}/review?action=${action}&reason=Administrative+review`);
      showToast(`Need ${action}ed successfully.`);
      fetchQueue();
    } catch (err: any) {
      showToast(err.message || 'Action failed.');
    }
  };

  const handleVerifyOrg = async (orgId: string, status: 'verified' | 'rejected') => {
    try {
      await api.post(`/moderation/organisations/${orgId}/verification`, {
        status,
        notes: 'Verification approved by moderator review.',
      });
      showToast(`Organisation marked as ${status}.`);
      fetchQueue();
    } catch (err: any) {
      showToast(err.message || 'Action failed.');
    }
  };

  const handleMergeDuplicates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryId || !duplicateId) return;
    setMerging(true);
    try {
      const res: any = await api.post('/moderation/merge-duplicates', {
        primary_need_id: primaryId.trim(),
        duplicate_need_id: duplicateId.trim(),
        reason: mergeReason,
      });
      showToast(res.message || 'Successfully merged records!');
      setPrimaryId('');
      setDuplicateId('');
      fetchQueue();
    } catch (err: any) {
      showToast(err.message || 'Failed to merge duplicates.');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 block mb-1">
            Governance & Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Moderation & Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enforce community safety guidelines, audit content flags, verify provider credentials, and merge duplicates.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'queue' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report Flags ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orgs')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'orgs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Provider Verification ({pendingOrgs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('merge')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'merge' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>Duplicate Merge Tool</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Privileged Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: REPORT FLAGS */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {pendingReports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Zero Content Flags Pending</h3>
              <p className="text-xs text-slate-500 mt-1">All user abuse reports have been reviewed and resolved.</p>
            </div>
          ) : (
            pendingReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase font-mono text-[10px]">
                      {report.reason.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">Target Need ID: {report.need_id}</span>
                  </div>
                  <p className="text-slate-700 font-medium">{report.details || 'No additional text provided.'}</p>
                  <span className="text-slate-400 text-[11px] block">
                    Reported on: {new Date(report.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNeedReview(report.need_id, 'hide')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-xs"
                  >
                    Hide Need
                  </button>
                  <button
                    onClick={() => handleNeedReview(report.need_id, 'approve')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs"
                  >
                    Dismiss Flag
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PROVIDER VERIFICATION */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          {pendingOrgs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Verification Queue Empty</h3>
              <p className="text-xs text-slate-500 mt-1">No pending NGO or provider applications awaiting audit.</p>
            </div>
          ) : (
            pendingOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{org.name}</h3>
                    <span className="uppercase text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                      {org.org_type}
                    </span>
                  </div>
                  <p className="text-slate-600 max-w-2xl">{org.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                    <span>Reg #: {org.registration_number || 'N/A'}</span>
                    <span>Contact: {org.contact_email}</span>
                    <span>Service Area: {org.service_area}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleVerifyOrg(org.id, 'verified')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Verify</span>
                  </button>
                  <button
                    onClick={() => handleVerifyOrg(org.id, 'rejected')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium text-xs border border-red-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: DUPLICATE MERGE TOOL */}
      {activeTab === 'merge' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Merge Duplicate Community Needs</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Consolidates duplicate community requests into a single primary canonical record. Unique supporters are transferred automatically, and the duplicate is marked Closed with an audit trail.
            </p>
          </div>

          <form onSubmit={handleMergeDuplicates} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Need ID (Kept Active) *
              </label>
              <input
                type="text"
                required
                value={primaryId}
                onChange={(e) => setPrimaryId(e.target.value)}
                placeholder="UUID of canonical primary report"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duplicate Need ID (To Be Merged & Closed) *
              </label>
              <input
                type="text"
                required
                value={duplicateId}
                onChange={(e) => setDuplicateId(e.target.value)}
                placeholder="UUID of duplicate report"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Merge *</label>
              <input
                type="text"
                required
                value={mergeReason}
                onChange={(e) => setMergeReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={merging}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-2"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>{merging ? 'Merging Records...' : 'Execute Duplicate Merge'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Audit & State Transition Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Immutable record of all privileged administrative events.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Resource</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3 text-slate-500 font-mono whitespace-nowrap text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 font-semibold text-slate-800">
                      {log.user_email || 'System'}
                      <span className="block text-[10px] text-slate-400 font-normal">Role: {log.user_role}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-mono text-[11px]">
                      {log.resource_type}:{log.resource_id ? log.resource_id.slice(0, 8) : 'all'}
                    </td>
                    <td className="px-6 py-3 text-slate-600 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
