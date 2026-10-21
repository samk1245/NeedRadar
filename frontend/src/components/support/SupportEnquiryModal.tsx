import React, { useState, useEffect } from 'react';
import {
  X,
  LifeBuoy,
  PhoneCall,
  ShieldCheck,
  Send,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Phone,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { useCity } from '../../context/CityContext';
import { CityBadge } from '../common/CityBadge';

interface SupportEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNeedId?: string;
}

export const SupportEnquiryModal: React.FC<SupportEnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultNeedId,
}) => {
  const { currentCity, cityData, availableCities } = useCity();
  const [activeTab, setActiveTab] = useState<'form' | 'helplines' | 'faq'>('form');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [locality, setLocality] = useState('');
  const [category, setCategory] = useState('need_resolution');
  const [urgency, setUrgency] = useState('medium');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    ticket_id: string;
    assigned_desk: string;
    message: string;
    emergency_contact: string;
  } | null>(null);

  // Helplines state
  const [helplines, setHelplines] = useState<any>(null);

  // FAQ accordion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    setSelectedCity(currentCity);
  }, [currentCity]);

  useEffect(() => {
    if (isOpen) {
      api
        .get(`/enquiries/helplines?city=${encodeURIComponent(selectedCity)}`)
        .then((data) => setHelplines(data))
        .catch(() => {
          setHelplines({
            city: selectedCity,
            municipal_authority: cityData.municipal_authority || 'Municipal Corporation',
            municipal_helpline: cityData.helpline || '1533 / 112',
            national_emergency: '112',
            ambulance: '108',
            police: '112',
            women_safety: '1091',
            childline: '1098',
            disaster_management: '1078',
            blood_coordination: '104 (eRaktKosh)',
          });
        });
    }
  }, [isOpen, selectedCity, cityData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone,
        city: selectedCity,
        locality,
        category,
        urgency,
        subject,
        message,
        reference_need_id: defaultNeedId || null,
      };
      const res: any = await api.post('/enquiries', payload);
      setConfirmedTicket(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit enquiry. Please check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does NeedRadar verify reported community needs?',
      a: 'Reports pass through a multi-point verification process including duplicate detection algorithms, proximity verification by local supporters, and review by verified community moderators before matching with registered NGOs.',
    },
    {
      q: 'How can our NGO or welfare organization get verified?',
      a: 'Organizations can apply through the Provider Portal with their NGO Darpan, 80G, or Society Registration certificate. Municipal verification is conducted within 48-72 hours.',
    },
    {
      q: 'Why are coordinates approximate for some individual needs?',
      a: 'To safeguard resident privacy and domestic security, sensitive requests (such as emergency domestic assistance or medical care) automatically introduce a ~300m randomized jitter to the coordinates displayed on the map.',
    },
    {
      q: 'Is NeedRadar an official government emergency dispatch?',
      a: 'No. NeedRadar is a community unmet needs intelligence platform. For immediate life-threatening emergencies, residents must contact 112 (National Emergency) or 108 (Ambulance).',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden glass-panel-3d">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shadow-inner">
              <LifeBuoy className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Civic Support & Enquiry Desk</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-900/80 text-teal-300 border border-teal-700/50">
                  24/7 Action Desk
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Resolution assistance, NGO partnerships & emergency helpline coordination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/80 px-6 pt-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Enquiry</span>
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'helplines'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
            <span>Emergency Helplines</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & FAQs</span>
          </button>
        </div>

        {/* Tab 1: Form */}
        {activeTab === 'form' && (
          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {confirmedTicket ? (
              <div className="p-6 bg-teal-50 border border-teal-200 rounded-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider block">
                    Enquiry Registered
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    Ticket ID: <span className="font-mono text-teal-700">{confirmedTicket.ticket_id}</span>
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                    {confirmedTicket.message}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-teal-100 text-xs text-left grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Unit</span>
                    <span className="font-bold text-slate-800">{confirmedTicket.assigned_desk}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Municipal Helpline</span>
                    <span className="font-bold text-teal-700">{confirmedTicket.emergency_contact}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConfirmedTicket(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    For immediate medical or life-threatening crisis, dial <strong>112</strong> or <strong>108</strong> immediately.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City *</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                    >
                      {availableCities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Locality / Ward</label>
                    <input
                      type="text"
                      placeholder="e.g. Gomti Nagar / Koramangala"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Enquiry Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                    >
                      <option value="need_resolution">Need Resolution Query</option>
                      <option value="emergency_escalation">Emergency Escalation</option>
                      <option value="ngo_partnership">Verified NGO Onboarding</option>
                      <option value="grievance">Citizen Grievance</option>
                      <option value="false_report">Report Inaccurate / False Data</option>
                      <option value="volunteer">Volunteer Network Coordination</option>
                      <option value="general">General Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Urgency Level</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="low">Low (Standard response 48h)</option>
                      <option value="medium">Medium (24h response)</option>
                      <option value="high">High (Priority 6h)</option>
                      <option value="critical">Critical (Immediate dispatch)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subject / Need Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly state your query or grievance..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific details, landmark, and relevant history so coordinators can act..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Civic Ticket'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Helplines */}
        {activeTab === 'helplines' && (
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <CityBadge cityName={selectedCity} size="md" showLandmark={true} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 font-semibold bg-white"
              >
                {availableCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href={`tel:${helplines?.municipal_helpline || '1533'}`}
                className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                    Municipal Corporation
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">
                    {helplines?.municipal_authority || `${selectedCity} Nagar Nigam`}
                  </h4>
                  <p className="text-teal-700 font-mono font-bold mt-1 text-sm">
                    {helplines?.municipal_helpline || '080-22660000'}
                  </p>
                </div>
                <Phone className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:112"
                className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                    National Emergency
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">Unified Emergency (Police / Fire)</h4>
                  <p className="text-red-700 font-mono font-extrabold mt-1 text-sm">112</p>
                </div>
                <Phone className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:108"
                className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Medical Ambulance
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">National Emergency Medical Service</h4>
                  <p className="text-amber-700 font-mono font-extrabold mt-1 text-sm">108</p>
                </div>
                <Phone className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:1091"
                className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                    Women Safety
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">Women in Distress Helpline</h4>
                  <p className="text-purple-700 font-mono font-extrabold mt-1 text-sm">1091</p>
                </div>
                <Phone className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:1098"
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                    Childline
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">Emergency Child Welfare Service</h4>
                  <p className="text-blue-700 font-mono font-extrabold mt-1 text-sm">1098</p>
                </div>
                <Phone className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:104"
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Blood Bank Directory
                  </span>
                  <h4 className="font-extrabold text-slate-900 mt-0.5">eRaktKosh National Portal</h4>
                  <p className="text-rose-700 font-mono font-extrabold mt-1 text-sm">104</p>
                </div>
                <Phone className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        )}

        {/* Tab 3: FAQ */}
        {activeTab === 'faq' && (
          <div className="p-6 max-h-[75vh] overflow-y-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left p-3.5 text-xs font-bold text-slate-900 bg-slate-50/80 hover:bg-slate-100/70 flex items-center justify-between transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="p-3.5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
