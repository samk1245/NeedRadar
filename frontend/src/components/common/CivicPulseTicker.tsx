import React, { useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { useCity } from '../../context/CityContext';

interface PulseItem {
  id: string;
  city: string;
  category: string;
  text: string;
  timeAgo: string;
  isUrgent?: boolean;
}

const PULSE_ITEMS: PulseItem[] = [
  {
    id: 'p-1',
    city: 'Gangtok',
    category: 'Healthcare',
    text: 'Mobile high-altitude health checkup post active with 6 volunteer nurses',
    timeAgo: '4m ago',
    isUrgent: false
  },
  {
    id: 'p-2',
    city: 'Aizawl',
    category: 'Supplies',
    text: '45 emergency ration kits distributed across Durtlang hill wards',
    timeAgo: '12m ago',
    isUrgent: false
  },
  {
    id: 'p-3',
    city: 'Delhi',
    category: 'Urgent',
    text: 'O-Negative emergency blood donation call answered by 3 verified donors',
    timeAgo: '18m ago',
    isUrgent: true
  },
  {
    id: 'p-4',
    city: 'Bengaluru',
    category: 'Education',
    text: '14 underprivileged students matched with weekend STEM tutors at HSR center',
    timeAgo: '24m ago',
    isUrgent: false
  },
  {
    id: 'p-5',
    city: 'Rishikesh',
    category: 'Clean Water',
    text: 'Community water filtration booth commissioned near Triveni Ghat',
    timeAgo: '32m ago',
    isUrgent: false
  },
  {
    id: 'p-6',
    city: 'Kochi',
    category: 'Infrastructure',
    text: 'Municipal coastal culvert desilting completed with 12 college volunteers',
    timeAgo: '41m ago',
    isUrgent: false
  },
  {
    id: 'p-7',
    city: 'Jhansi',
    category: 'Supplies',
    text: 'Winter insulated blanket drive reaches 85 unhoused transit workers',
    timeAgo: '55m ago',
    isUrgent: false
  }
];

export interface CivicPulseTickerProps {
  className?: string;
  onSelectCity?: (city: string) => void;
}

export const CivicPulseTicker: React.FC<CivicPulseTickerProps> = ({
  className = '',
  onSelectCity,
}) => {
  const { currentCity } = useCity();
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={`relative w-full bg-slate-900 border-y border-teal-500/30 text-white overflow-hidden py-2 shadow-inner ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-white/10 z-10 bg-slate-900">
          <div className="relative flex items-center justify-center w-5 h-5 rounded-md bg-teal-500/20 text-teal-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-300 absolute" />
          </div>
          <span className="text-[11px] font-black tracking-wider text-teal-300 font-display uppercase hidden sm:inline">
            CIVIC PULSE
          </span>
          <span className="text-[9px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-700/50 px-1.5 py-0.2 rounded">
            104 CITIES LIVE
          </span>
        </div>

        {/* Marquee ticker stream */}
        <div
          className="relative flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex items-center gap-8 whitespace-nowrap text-xs font-medium text-slate-300 ${
              isPaused ? '' : 'animate-marquee'
            }`}
          >
            {PULSE_ITEMS.concat(PULSE_ITEMS).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectCity?.(item.city)}
                className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
                  onSelectCity ? 'cursor-pointer hover:bg-teal-900/30' : ''
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-500/30">
                  {item.city}
                </span>
                {item.isUrgent ? (
                  <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950/80 px-1 py-0.2 rounded border border-rose-500/40 uppercase">
                    ALERT
                  </span>
                ) : null}
                <span className="text-slate-200 text-xs">{item.text}</span>
                <span className="text-[10px] font-mono text-slate-400">({item.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Play/Pause Button */}
        <div className="shrink-0 z-10 pl-2 bg-slate-900 border-l border-white/10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};
