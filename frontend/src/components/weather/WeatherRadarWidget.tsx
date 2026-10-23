import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudRain,
  Wind,
  CloudFog,
  CloudLightning,
  Cloud,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Droplets,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useCity } from '../../context/CityContext';
import { TiltCard } from '../common/TiltCard';

export interface WeatherData {
  city: string;
  temperature_c: number;
  condition: string;
  humidity: number;
  wind_speed_kmh: number;
  aqi: number;
  aqi_category: string;
  advisory_level: string;
  civic_impact_alert: string;
  weather_vulnerable_categories: string[];
  is_live_satellite: boolean;
  updated_at: string;
}

interface WeatherRadarWidgetProps {
  onFilterWeatherNeeds?: () => void;
  compactOnly?: boolean;
}

export const WeatherRadarWidget: React.FC<WeatherRadarWidgetProps> = ({
  onFilterWeatherNeeds,
  compactOnly = false,
}) => {
  const { currentCity } = useCity();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await api.get<WeatherData>(`/weather?city=${encodeURIComponent(currentCity)}`);
        if (isMounted) setWeather(data);
      } catch (err) {
        console.warn('Weather fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  if (!weather && loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-400 text-xs animate-pulse">
        <Sun className="w-3.5 h-3.5 animate-spin-slow" />
        <span>Syncing Climate...</span>
      </div>
    );
  }

  if (!weather) return null;

  // Weather Icon Matcher
  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className="w-3.5 h-3.5 text-blue-500 animate-bounce" />;
    }
    if (c.includes('thunder')) {
      return <CloudLightning className="w-3.5 h-3.5 text-amber-500" />;
    }
    if (c.includes('fog') || c.includes('haze') || c.includes('mist')) {
      return <CloudFog className="w-3.5 h-3.5 text-slate-500" />;
    }
    if (c.includes('cloud')) {
      return <Cloud className="w-3.5 h-3.5 text-sky-500" />;
    }
    return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  };

  // AQI Color Scheme
  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Good' };
    if (aqi <= 100) return { bg: 'bg-teal-50 text-teal-800 border-teal-200', text: 'Satisfactory' };
    if (aqi <= 200) return { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Moderate' };
    if (aqi <= 300) return { bg: 'bg-orange-50 text-orange-900 border-orange-200', text: 'Poor' };
    return { bg: 'bg-red-50 text-red-900 border-red-200', text: 'Severe Smog' };
  };

  const aqiBadge = getAqiColor(weather.aqi);

  return (
    <>
      {/* Clickable 3D Weather Pill in Navbar / Top Bar */}
      <button
        onClick={() => setModalOpen(true)}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95"
        title="View live civic weather & environmental alerts"
      >
        <div className="flex items-center gap-1.5">
          {getWeatherIcon(weather.condition)}
          <span className="font-bold text-slate-900 font-mono">
            {weather.temperature_c}°C
          </span>
        </div>

        <span className="hidden sm:inline text-slate-300">•</span>

        <span className={`hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-bold border ${aqiBadge.bg}`}>
          AQI {weather.aqi}
        </span>

        {weather.advisory_level === 'warning' && (
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        )}
      </button>

      {/* Expandable 3D Weather & Environmental Advisory Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden glass-panel-3d">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
                  {getWeatherIcon(weather.condition)}
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {weather.city} Civic Climate Radar
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {weather.is_live_satellite ? 'Live Open-Meteo Satellite Feed' : 'Real-Time Civic Climate Sensor'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Primary Stat Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold block">
                      Current Atmosphere
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-4xl font-extrabold font-mono">{weather.temperature_c}°C</span>
                      <span className="text-slate-300 text-xs font-semibold">{weather.condition}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Air Quality Index
                    </span>
                    <span className={`inline-block mt-1 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${aqiBadge.bg}`}>
                      AQI {weather.aqi} • {weather.aqi_category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/80 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>Humidity: <strong>{weather.humidity}%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                    <span>Wind Speed: <strong>{weather.wind_speed_kmh} km/h</strong></span>
                  </div>
                </div>
              </div>

              {/* Civic Impact Advisory Box */}
              <div className={`p-4 rounded-2xl border ${
                weather.advisory_level === 'warning'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : weather.advisory_level === 'advisory'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-teal-50 border-teal-200 text-teal-950'
              } space-y-2`}>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-teal-700 flex-shrink-0" />
                  <h4 className="font-extrabold text-xs">Civic Community Advisory</h4>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {weather.civic_impact_alert}
                </p>
              </div>

              {/* Weather-Responsive Action Link */}
              {onFilterWeatherNeeds && (
                <button
                  onClick={() => {
                    setModalOpen(false);
                    onFilterWeatherNeeds();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Filter Weather-Vulnerable Community Needs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
