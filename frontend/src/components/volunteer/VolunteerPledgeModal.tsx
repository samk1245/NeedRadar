import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  Clock,
  Package,
  Droplet,
  GraduationCap,
  Car,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { useCity } from '../../context/CityContext';

interface VolunteerPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  needId?: string;
  needTitle?: string;
  defaultCity?: string;
  onSuccess?: () => void;
}

type PledgeType =
  | 'time_hours'
  | 'supplies_kit'
  | 'blood_donation'
  | 'skilled_mentorship'
  | 'emergency_transport';

const PLEDGE_OPTIONS: {
  id: PledgeType;
  label: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
}[] = [
  {
    id: 'time_hours',
    label: 'Volunteer Time',
    unit: 'Hours',
    icon: Clock,
    color: 'from-teal-500 to-emerald-600',
    badge: 'bg-teal-50 text-teal-800 border-teal-200'
  },
  {
    id: 'supplies_kit',
    label: 'Supplies & Kits',
    unit: 'Kits / Units',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'blood_donation',
    label: 'Blood Donation',
    unit: 'Units / On-Call',
    icon: Droplet,
    color: 'from-rose-500 to-red-600',
    badge: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    id: 'skilled_mentorship',
    label: 'Skilled Tutoring',
    unit: 'Sessions / Hours',
    icon: GraduationCap,
    color: 'from-indigo-500 to-purple-600',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'emergency_transport',
    label: 'Emergency Transit',
    unit: 'Trips / Hours',
    icon: Car,
    color: 'from-blue-500 to-cyan-600',
    badge: 'bg-blue-50 text-blue-800 border-blue-200'
  }
];

export const VolunteerPledgeModal: React.FC<VolunteerPledgeModalProps> = ({
  isOpen,
  onClose,
  needId,
  needTitle,
  defaultCity,
  onSuccess
}) => {
  const { currentCity } = useCity();
  const city = defaultCity || currentCity;

  const [pledgeType, setPledgeType] = useState<PledgeType>('time_hours');
  const [hours, setHours] = useState<number>(4);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [availability, setAvailability] = useState('Weekends & Evenings');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const selectedOption = PLEDGE_OPTIONS.find((o) => o.id === pledgeType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setError('Please fill in all contact and pledge details.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/volunteers/pledge', {
        need_id: needId || null,
        volunteer_name: name.trim(),
        volunteer_email: email.trim(),
        volunteer_phone: phone.trim(),
        city: city,
        pledge_type: pledgeType,
        hours_committed: hours,
        pledge_description: description.trim(),
        availability: availability
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to record volunteer pledge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header with 3D gradient bar */}
        <div className="relative bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 p-6 text-white overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner text-teal-200">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">Citizen Volunteer Pledge</h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-400/20 border border-teal-300/30 text-teal-100">
                    {city}
                  </span>
                </div>
                <p className="text-xs text-teal-100/90 mt-0.5">
                  Direct civic mobilization • Connect with verified needs
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {needTitle && (
            <div className="mt-3.5 bg-black/20 rounded-xl px-3 py-2 border border-white/10 text-xs">
              <span className="text-teal-200 font-semibold">Pledging for: </span>
              <span className="text-white/90 truncate">{needTitle}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pledge Recorded Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Thank you, <strong className="text-slate-800">{name}</strong>. Your commitment of{' '}
                <strong className="text-emerald-700">
                  {hours} {selectedOption.unit}
                </strong>{' '}
                ({selectedOption.label}) has been added to {city}&apos;s Live Civic Action Ledger.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-1.5 text-slate-600 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Volunteer:</span>
                <span className="font-semibold text-slate-800">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Pledge Type:</span>
                <span className="font-semibold text-slate-800">{selectedOption.label}</span>
              </div>
              <div className="flex justify-between">
                <span>City:</span>
                <span className="font-semibold text-slate-800">{city}</span>
              </div>
              <div className="flex justify-between">
                <span>Availability:</span>
                <span className="font-semibold text-slate-800">{availability}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition-all hover:scale-105"
              >
                Done / Back to Radar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Step 1: Choose Action Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select How You Want to Contribute
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PLEDGE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = pledgeType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPledgeType(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-sm ring-1 ring-teal-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${opt.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Commitment Amount Slider */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Commitment Level:</span>
                <span className="font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md font-mono">
                  {hours} {selectedOption.unit}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 unit / quick support</span>
                <span>20 units</span>
                <span>40 units / sustained partner</span>
              </div>
            </div>

            {/* Step 3: Contact Info */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                2. Volunteer Contact Coordinates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile / WhatsApp (+91 ...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="Weekends Only">Weekends Only</option>
                    <option value="Weekdays & Evenings">Weekdays & Evenings</option>
                    <option value="Flexible / As Needed">Flexible / As Needed</option>
                    <option value="Emergency 24x7 On-Call">Emergency 24x7 On-Call</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Pledge Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. What skills, tools, or items can you bring?
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Free weekend high school math tutoring, or providing 10 dry ration kits, or available with my van for logistics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                Your privacy is protected. Contact details are only shared with verified organizers.
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-102 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Pledge...</span>
                  </>
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4" />
                    <span>Confirm Citizen Pledge</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
