import React from 'react';
import {
  ShieldCheck,
  Building2,
  Heart,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

interface NgoLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  registrationNumber?: string;
  isVerified?: boolean;
}

export const NgoLogo: React.FC<NgoLogoProps> = ({
  name,
  size = 'md',
  registrationNumber,
  isVerified = true,
}) => {
  // Generate consistent vibrant gradient based on name hash
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const gradients = [
      'from-teal-600 to-emerald-700',
      'from-blue-600 to-indigo-700',
      'from-indigo-600 to-purple-700',
      'from-sky-600 to-teal-700',
      'from-emerald-600 to-cyan-700',
      'from-cyan-600 to-blue-700',
    ];
    return gradients[Math.abs(hash) % gradients.length];
  };

  const getInitials = (str: string) => {
    const parts = str.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const gradient = getGradient(name);
  const initials = getInitials(name);

  if (size === 'sm') {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="truncate">
          <span className="font-semibold text-xs text-slate-900 block truncate">{name}</span>
          {isVerified && (
            <span className="text-[10px] text-teal-600 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Verified NGO</span>
            </span>
          )}
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-start gap-3.5">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-extrabold text-lg shadow-md flex-shrink-0 ring-4 ring-slate-100`}
        >
          {initials}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900">{name}</h3>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <ShieldCheck className="w-3 h-3 text-teal-600" />
                <span>Verified Partner</span>
              </span>
            )}
          </div>
          {registrationNumber && (
            <p className="text-xs text-slate-500 font-mono">
              Reg: {registrationNumber} • 80G Certified
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0`}
      >
        {initials}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-slate-900">{name}</span>
          {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />}
        </div>
        {registrationNumber && (
          <span className="text-[10px] text-slate-400 font-mono block">
            {registrationNumber}
          </span>
        )}
      </div>
    </div>
  );
};
