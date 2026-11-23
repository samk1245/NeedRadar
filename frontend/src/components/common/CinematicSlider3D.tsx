import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Compass,
  CheckCircle2,
  Database,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ElementType;
  accent: string;
  bgGlow: string;
  link: string;
}

export const CinematicSlider3D: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  const slides: Slide[] = [
    {
      id: 'geospatial',
      tag: '01 / GEOSPATIAL INTELLIGENCE',
      badge: 'Pan-India 144 Cities',
      title: 'Real-Time Spatial Radar Telemetry',
      subtitle: 'Monitoring Unmet Community Needs Across All 28 States & 8 UTs',
      description: 'Autonomous micro-locality clustering pinpoints critical supply gaps, broken municipal water mains, and emergency medical calls with high-precision geographic resolution.',
      metric: '144',
      metricLabel: 'Cities In Active Telemetry',
      icon: Compass,
      accent: 'from-sky-400 to-cyan-500',
      bgGlow: 'rgba(14, 165, 233, 0.12)',
      link: '/discovery'
    },
    {
      id: 'dispatch',
      tag: '02 / RESOURCE STREAMING',
      badge: 'Sub-15ms Parallel Triage',
      title: 'Hydraulic Civic Dispatch Pipeline',
      subtitle: 'Streaming Citizen Signals Directly into Verified Local Volunteer Hubs',
      description: 'High-throughput concurrency engine processes citizen requests in parallel, auto-generating multi-item fulfillment manifests and routing them directly to verified NGOs.',
      metric: '408+',
      metricLabel: 'Verified Crises Resolved',
      icon: Activity,
      accent: 'from-teal-400 to-emerald-500',
      bgGlow: 'rgba(20, 184, 166, 0.12)',
      link: '/discovery'
    },
    {
      id: 'privacy',
      tag: '03 / TRUST ARCHITECTURE',
      badge: '300m Privacy Obfuscation',
      title: 'Zero-Address Vulnerability Protection',
      subtitle: 'Protecting Domestic Safety While Mobilizing Ground Relief',
      description: 'Unlike commercial social platforms that leak domestic addresses, NeedRadar automatically applies deterministic spatial jitter to individual distress calls, safeguarding human safety.',
      metric: '100%',
      metricLabel: 'Private & Obfuscated',
      icon: Shield,
      accent: 'from-indigo-400 to-blue-500',
      bgGlow: 'rgba(99, 102, 241, 0.12)',
      link: '/discovery'
    },
    {
      id: 'ledger',
      tag: '04 / VERIFIED ACTION',
      badge: 'Multi-Signature Ground Ledger',
      title: 'Audited Civic Resolution Tracking',
      subtitle: 'No Need Is Marked Resolved Without Field Confirmation',
      description: 'Every medical camp, water tanker delivery, and road restoration requires ground volunteer confirmation or community resident sign-off, eliminating phantom statistics.',
      metric: '94.2%',
      metricLabel: 'Audited Resolution Rate',
      icon: CheckCircle2,
      accent: 'from-emerald-400 to-teal-500',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      link: '/analytics'
    },
    {
      id: 'open-data',
      tag: '05 / OPEN CIVIC DATA',
      badge: 'OGC GeoJSON Standard',
      title: 'Open Data Exchange for Public Policy',
      subtitle: 'Direct GeoJSON Feeds for Urban Planners & Municipal Disaster Teams',
      description: 'One-click standardized GeoJSON export transforms grassroots citizen requests into actionable geospatial layers ready for GIS, QGIS, and municipal command centers.',
      metric: '1-Click',
      metricLabel: 'GeoJSON Open Export',
      icon: Database,
      accent: 'from-cyan-400 to-sky-600',
      bgGlow: 'rgba(6, 182, 212, 0.12)',
      link: '/discovery'
    }
  ];

  // Smooth auto-slide (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden py-8 select-none contain-paint"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Tag & Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6 text-xs font-mono">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-slate-400 tracking-wider truncate hidden sm:inline">CIVIC_RADAR // PERSPECTIVE SHOWCASE</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold truncate">{slides[activeIndex].tag}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 mr-2 font-mono">
              {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition active:scale-95 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rock-Solid Card Stage (Zero Layout Shift, Fixed Stable Bounds) */}
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-800/90 bg-slate-950/90 shadow-2xl overflow-hidden min-h-[460px] sm:min-h-[420px] flex flex-col justify-between">
          {/* Subtle Hairline Gradient on Top */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Smooth Hardware-Accelerated Sliding Track */}
          <div className="overflow-hidden w-full flex-1">
            <div
              className="flex w-full will-change-transform transform-gpu"
              style={{
                transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
                transition: 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {slides.map((slide, idx) => {
                const SlideIcon = slide.icon;
                const isCurrent = activeIndex === idx;

                return (
                  <div
                    key={slide.id}
                    className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                    style={{
                      opacity: isCurrent ? 1 : 0.45,
                      transition: 'opacity 400ms ease-out',
                    }}
                  >
                    {/* Left Content */}
                    <div className="lg:col-span-8 space-y-5 text-left">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-cyan-300 shadow-sm">
                        <SlideIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{slide.badge}</span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                          {slide.title}
                        </h3>
                        <p className="text-sm sm:text-base font-medium text-slate-300">
                          {slide.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                        {slide.description}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link
                          to={slide.link}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-extrabold tracking-wide hover:bg-slate-100 transition shadow-lg active:scale-95 group"
                        >
                          <span>Explore Live Telemetry</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Direct Citizen Impact</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Metric Card */}
                    <div className="lg:col-span-4 flex flex-col justify-center">
                      <div className="relative rounded-2xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr ${slide.accent} p-2.5 text-slate-950 flex items-center justify-center shadow-lg`}>
                          <SlideIcon className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                            {slide.metric}
                          </div>
                          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                            {slide.metricLabel}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>VERIFIED GROUND SIGNATURE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Sliding Timeline Bar */}
          <div className="mt-8 pt-5 border-t border-slate-800/60 flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIndex(idx)}
                className="flex-1 py-1.5 group relative cursor-pointer"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    activeIndex === idx
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-400 shadow-md shadow-cyan-500/40'
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
