import React from 'react';
import {
  MapPin,
  Activity,
  ShieldCheck,
  Radio,
  Zap,
  CheckCircle2,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const CinematicKineticRibbon: React.FC = () => {
  const track1 = [
    { label: '89 CITIES IN ACTIVE RADAR TELEMETRY', icon: Radio, highlight: 'PAN-INDIA' },
    { label: 'NATIONAL DISASTER & CIVIC HELPLINE 112 INTEGRATED', icon: PhoneCall, highlight: 'EMERGENCY' },
    { label: 'SUB-15MS PARALLEL TRIAGE PIPELINE', icon: Zap, highlight: 'REAL-TIME' },
    { label: '300M RESIDENT PRIVACY OBFUSCATION', icon: ShieldCheck, highlight: 'SECURITY' },
    { label: 'DUAL-SIGNATURE FIELD RESOLUTION AUDIT', icon: CheckCircle2, highlight: 'VERIFIED' },
    { label: 'OGC GEOJSON OPEN CIVIC DATA EXPORT', icon: Activity, highlight: 'STANDARDS' }
  ];

  const track2 = [
    { city: 'Bengaluru', status: 'Clean Water Relief Dispatched', time: '3m ago', count: '50 Cans' },
    { city: 'Lucknow', status: 'Medical Oxygen Cylinders Verified', time: '8m ago', count: '12 Units' },
    { city: 'Mumbai', status: 'Pothole Hazard Escalation to BMC', time: '14m ago', count: 'Sector 4' },
    { city: 'Pune', status: 'Weekend Math Mentorship Camp Confirmed', time: '19m ago', count: '35 Students' },
    { city: 'Chennai', status: 'Storm Drain Desilting Field Report', time: '24m ago', count: 'Zone 5' },
    { city: 'Kolkata', status: 'Night Shelter Bedding Delivered', time: '31m ago', count: '20 Cots' }
  ];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-slate-950 text-slate-100 select-none border-y border-slate-800/80">
      {/* Edge Blur Vignette Masks */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-20 pointer-events-none" />

      {/* TRACK 1: Continuous High-Velocity Telemetry Sliding Left */}
      <div className="flex overflow-hidden group contain-paint">
        <div className="flex shrink-0 animate-marquee items-center gap-6 group-hover:[animation-play-state:paused] will-change-transform transform-gpu">
          {[...track1, ...track1].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono tracking-wider shadow-sm transition hover:border-cyan-500/50"
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white font-semibold">{item.label}</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-800/60">
                  {item.highlight}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRACK 2: Live Ground Action Sliding Right */}
      <div className="flex overflow-hidden group mt-4 contain-paint">
        <div
          className="flex shrink-0 items-center gap-6 group-hover:[animation-play-state:paused] will-change-transform transform-gpu"
          style={{
            animation: 'marquee 34s linear infinite reverse'
          }}
        >
          {[...track2, ...track2].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/60 border border-slate-800/70 text-xs font-mono shadow-sm transition hover:border-teal-500/40"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{item.city}</span>
              </div>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">{item.status}</span>
              <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                {item.count}
              </span>
              <span className="text-[10px] text-slate-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
