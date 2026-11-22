import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  Phone,
  Building2,
  Sparkles,
  Command,
  ArrowRight,
  Compass,
  Check,
  Clock
} from 'lucide-react';
import { useCity } from '../../context/CityContext';
import { CITY_CONFIGS } from './CityBadge';

interface CityCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGIONS: { id: string; label: string }[] = [
  { id: 'all', label: 'All 104+ Cities' },
  { id: 'north', label: 'North India' },
  { id: 'south', label: 'South India' },
  { id: 'west', label: 'West India' },
  { id: 'east', label: 'East & Central' },
  { id: 'northeast', label: 'North-East' },
  { id: 'ut', label: 'Union Territories' },
];

export const CityCommandPalette: React.FC<CityCommandPaletteProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentCity, setCity, availableCities } = useCity();
  const [query, setQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedRegion('all');
    }
  }, [isOpen]);

  // Global keydown handler for Escape & Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Classification helper for region tabs
  const getRegionForState = (state: string): string => {
    const s = state.toLowerCase();
    if (s.includes('kashmir') || s.includes('delhi') || s.includes('uttar pradesh') || s.includes('punjab') || s.includes('haryana') || s.includes('himachal') || s.includes('uttarakhand') || s.includes('rajasthan')) {
      return 'north';
    }
    if (s.includes('karnataka') || s.includes('tamil nadu') || s.includes('kerala') || s.includes('andhra') || s.includes('telangana')) {
      return 'south';
    }
    if (s.includes('maharashtra') || s.includes('gujarat') || s.includes('goa')) {
      return 'west';
    }
    if (s.includes('assam') || s.includes('meghalaya') || s.includes('sikkim') || s.includes('mizoram') || s.includes('nagaland') || s.includes('arunachal') || s.includes('tripura') || s.includes('manipur')) {
      return 'northeast';
    }
    if (s.includes('territory') || s.includes('ut') || s.includes('dnh') || s.includes('lakshadweep') || s.includes('puducherry') || s.includes('chandigarh') || s.includes('andaman') || s.includes('ladakh') || s.includes('diu')) {
      return 'ut';
    }
    return 'east'; // West bengal, odisha, bihar, jharkhand, chhattisgarh, madhya pradesh
  };

  const filteredCities = useMemo(() => {
    return availableCities.filter((c) => {
      // Region filter
      if (selectedRegion !== 'all') {
        const r = getRegionForState(c.state);
        if (r !== selectedRegion) return false;
      }
      // Text search
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        (c.landmark && c.landmark.toLowerCase().includes(q)) ||
        (c.code && c.code.toLowerCase().includes(q))
      );
    });
  }, [availableCities, query, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-teal-600 absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 104+ cities across all 28 states & 8 UTs (e.g. Gangtok, Mysuru, Delhi, Kerala)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-xs"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-3.5 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                ESC
              </span>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cities Results Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
          <div className="flex items-center justify-between pb-2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span>
              Showing {filteredCities.length} of {availableCities.length} Cities
            </span>
            <span>Click to switch instant radar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
            {filteredCities.map((city) => {
              const isSelected = currentCity.toLowerCase() === city.name.toLowerCase();
              const config = CITY_CONFIGS[city.name] || {
                code: city.code || city.name.slice(0, 3).toUpperCase(),
                gradient: 'from-teal-600 to-emerald-600',
              };

              return (
                <button
                  key={city.name}
                  onClick={() => {
                    setCity(city.name);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between gap-3 group cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-1 ring-teal-500/30'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${config.gradient} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {city.code || city.name.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 truncate">
                          {city.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {city.state}
                      </div>
                      {city.landmark && (
                        <div className="text-[10px] text-teal-700/80 truncate mt-1 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span>{city.landmark}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {city.helpline && (
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {city.helpline.split('/')[0].trim()}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all mt-2 ml-auto" />
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              No cities matched &ldquo;{query}&rdquo;. Try searching for another city or state.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-mono flex items-center justify-between px-5">
          <span>NeedRadar Pan-India Multi-City Gateway • 104 Cities</span>
          <span className="hidden sm:inline">Use <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
