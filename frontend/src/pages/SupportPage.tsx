import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  ShieldCheck,
  Send,
  AlertTriangle,
  HelpCircle,
  Building2,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { CityBadge } from '../components/common/CityBadge';
import { SupportEnquiryModal } from '../components/support/SupportEnquiryModal';
import { TiltCard } from '../components/common/TiltCard';

export const SupportPage: React.FC = () => {
  const { currentCity, cityData, availableCities, setCity } = useCity();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 3D Hero Header */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>Civic Support & Rapid Escalation Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need Help or Have a Civic Grievance in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              {currentCity}?
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            NeedRadar connects residents directly with municipal coordination desks, verified NGOs, and emergency helplines. Submit an enquiry or dispatch rapid intervention.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg hover:shadow-teal-500/25 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Civic Enquiry / Ticket</span>
            </button>
          </div>
        </div>

        {/* 3D background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      </div>

      {/* City Helplines 3D Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentCity} Verified Emergency & Municipal Helplines
            </h2>
            <p className="text-xs text-slate-500">
              Direct click-to-dial numbers for municipal authorities and crisis support
            </p>
          </div>
          <CityBadge cityName={currentCity} size="md" showLandmark={true} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TiltCard className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                  Municipal Authority
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  {cityData.municipal_authority || `${currentCity} Municipal Corporation`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Grievances, waterlogging, streetlights</p>
                <a
                  href={`tel:${cityData.helpline || '1533'}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {cityData.helpline || '1533'}</span>
                </a>
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </TiltCard>

          <TiltCard className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                  National Emergency
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  Unified Police, Fire & Disaster
                </h3>
                <p className="text-xs text-slate-500 mt-1">Immediate life threat dispatch</p>
                <a
                  href="tel:112"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 112 (Toll Free)</span>
                </a>
              </div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </TiltCard>

          <TiltCard className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Ambulance & Trauma
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                  National Health Ambulance
                </h3>
                <p className="text-xs text-slate-500 mt-1">Patient transit & critical care</p>
                <a
                  href="tel:108"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call 108 (24x7)</span>
                </a>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Switch City Quick Grid */}
      <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Switch City to View Local Helplines & Wards
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {availableCities.map((c) => (
            <button
              key={c.name}
              onClick={() => setCity(c.name)}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                c.name.toLowerCase() === currentCity.toLowerCase()
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <div className="font-bold">{c.name}</div>
              <div className="text-[10px] opacity-75">{c.state.split(' ')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <SupportEnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
