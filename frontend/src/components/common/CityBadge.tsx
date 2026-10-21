import React from 'react';
import {
  Building2,
  Landmark,
  Compass,
  MapPin,
  Waves,
  Sun,
  Shield,
  Sparkles,
  TreePine,
  Factory
} from 'lucide-react';

interface CityBadgeProps {
  cityName: string;
  size?: 'sm' | 'md' | 'lg';
  showLandmark?: boolean;
}

export const CITY_CONFIGS: Record<
  string,
  {
    code: string;
    state: string;
    landmark: string;
    gradient: string;
    badgeBg: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  Bengaluru: {
    code: 'BLR',
    state: 'Karnataka',
    landmark: 'Vidhana Soudha & Silicon Valley',
    gradient: 'from-emerald-500 to-teal-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Landmark,
    accentColor: '#10B981',
  },
  Delhi: {
    code: 'DEL',
    state: 'National Capital Territory',
    landmark: 'India Gate & Central Vista',
    gradient: 'from-amber-500 to-red-600',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: Landmark,
    accentColor: '#F59E0B',
  },
  Mumbai: {
    code: 'BOM',
    state: 'Maharashtra',
    landmark: 'Gateway of India & Marine Drive',
    gradient: 'from-blue-600 to-cyan-500',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    icon: Waves,
    accentColor: '#2563EB',
  },
  Lucknow: {
    code: 'LKO',
    state: 'Uttar Pradesh',
    landmark: 'Rumi Darwaza & Hazratganj',
    gradient: 'from-purple-600 to-indigo-600',
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: Landmark,
    accentColor: '#9333EA',
  },
  Prayagraj: {
    code: 'PRG',
    state: 'Uttar Pradesh',
    landmark: 'Triveni Sangam & Anand Bhavan',
    gradient: 'from-cyan-600 to-teal-600',
    badgeBg: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    icon: Waves,
    accentColor: '#06B6D4',
  },
  Kanpur: {
    code: 'KNP',
    state: 'Uttar Pradesh',
    landmark: 'JK Temple & Industrial Hub',
    gradient: 'from-slate-700 to-zinc-800',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    icon: Factory,
    accentColor: '#475569',
  },
  Varanasi: {
    code: 'VNS',
    state: 'Uttar Pradesh',
    landmark: 'Kashi Vishwanath & Dashashwamedh',
    gradient: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
    icon: Sparkles,
    accentColor: '#EA580C',
  },
  Hyderabad: {
    code: 'HYD',
    state: 'Telangana',
    landmark: 'Charminar & Cyberabad',
    gradient: 'from-teal-600 to-indigo-700',
    badgeBg: 'bg-teal-50 text-teal-900 border-teal-200',
    icon: Landmark,
    accentColor: '#0D9488',
  },
  Chennai: {
    code: 'MAA',
    state: 'Tamil Nadu',
    landmark: 'Marina Beach & Ripon Building',
    gradient: 'from-sky-600 to-blue-700',
    badgeBg: 'bg-sky-50 text-sky-900 border-sky-200',
    icon: Waves,
    accentColor: '#0284C7',
  },
  Kolkata: {
    code: 'CCU',
    state: 'West Bengal',
    landmark: 'Howrah Bridge & Victoria Memorial',
    gradient: 'from-rose-600 to-pink-600',
    badgeBg: 'bg-rose-50 text-rose-900 border-rose-200',
    icon: Landmark,
    accentColor: '#E11D48',
  },
  Pune: {
    code: 'PNQ',
    state: 'Maharashtra',
    landmark: 'Shaniwar Wada & Knowledge Hub',
    gradient: 'from-violet-600 to-purple-700',
    badgeBg: 'bg-violet-50 text-violet-900 border-violet-200',
    icon: Landmark,
    accentColor: '#7C3AED',
  },
  Ahmedabad: {
    code: 'AMD',
    state: 'Gujarat',
    landmark: 'Sabarmati Ashram & Atal Bridge',
    gradient: 'from-orange-500 to-amber-600',
    badgeBg: 'bg-orange-50 text-orange-900 border-orange-200',
    icon: Sun,
    accentColor: '#F97316',
  },
  Jaipur: {
    code: 'JAI',
    state: 'Rajasthan',
    landmark: 'Hawa Mahal & Amer Fort',
    gradient: 'from-pink-600 to-rose-600',
    badgeBg: 'bg-pink-50 text-pink-900 border-pink-200',
    icon: Landmark,
    accentColor: '#DB2777',
  },
  Chandigarh: {
    code: 'IXC',
    state: 'Punjab & Haryana',
    landmark: 'Rock Garden & Planned Grid',
    gradient: 'from-emerald-600 to-green-700',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    icon: TreePine,
    accentColor: '#059669',
  },
};

export const CityBadge: React.FC<CityBadgeProps> = ({
  cityName,
  size = 'md',
  showLandmark = false,
}) => {
  const config = CITY_CONFIGS[cityName] || {
    code: cityName.slice(0, 3).toUpperCase(),
    state: 'India',
    landmark: 'Municipal Ward',
    gradient: 'from-teal-600 to-emerald-600',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: Building2,
    accentColor: '#0D9488',
  };

  const Icon = config.icon;

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${config.badgeBg}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: config.accentColor }}
        />
        <span>{cityName}</span>
        <span className="text-[9px] font-mono opacity-60">[{config.code}]</span>
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center shadow-md font-bold text-sm tracking-wider`}
        >
          {config.code}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900">{cityName}</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {config.state}
            </span>
          </div>
          {showLandmark && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-teal-600" />
              <span>{config.landmark}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border bg-white shadow-xs">
      <div
        className={`w-6 h-6 rounded-md bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center font-bold text-[10px]`}
      >
        {config.code}
      </div>
      <div className="text-left">
        <div className="text-xs font-bold text-slate-900">{cityName}</div>
        {showLandmark && (
          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
            {config.landmark}
          </div>
        )}
      </div>
    </div>
  );
};
