import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Crosshair,
  ShieldAlert,
  Sparkles,
  MapPin,
  Maximize2,
  Layers,
  Activity,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { NeedMapItem } from '../../types';
import { useCity } from '../../context/CityContext';

interface SonarRadarHUDProps {
  needs?: NeedMapItem[];
  onSelectNeed?: (need: NeedMapItem) => void;
  className?: string;
  compact?: boolean;
}

export const SonarRadarHUD: React.FC<SonarRadarHUDProps> = ({
  needs = [],
  onSelectNeed,
  className = '',
  compact = false,
}) => {
  const { currentCity, cityData } = useCity();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [scanMode, setScanMode] = useState<'360' | 'sector'>('360');
  const [activeBlip, setActiveBlip] = useState<NeedMapItem | null>(null);
  const [scanAngle, setScanAngle] = useState(0);
  const [detectedCount, setDetectedCount] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPingTimeRef = useRef<number>(0);

  // Initialize Web Audio API safely on user gesture
  const triggerSonarPing = (freq = 880) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const now = audioCtxRef.current.currentTime;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Continuous radar angle sweep animation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setScanAngle((prev) => {
        const next = (prev + delta * 90) % 360; // 90 deg/sec
        return next;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Compute blips relative to city center
  const centerLat = cityData.lat || 12.9716;
  const centerLon = cityData.lon || 77.5946;

  const blips = needs.slice(0, 16).map((n, idx) => {
    // Relative coordinates scaled to 0-100% inside radar circle (radius 45%)
    const dLat = (n.latitude - centerLat) * 35;
    const dLon = (n.longitude - centerLon) * 35;
    const dist = Math.min(Math.sqrt(dLat * dLat + dLon * dLon), 42);
    const angleRad = Math.atan2(dLat, dLon);
    const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;

    const x = 50 + dist * Math.cos(angleRad);
    const y = 50 - dist * Math.sin(angleRad);

    const isCritical = n.urgency === 'critical';
    const isHigh = n.urgency === 'high';

    return {
      need: n,
      x,
      y,
      angleDeg,
      distKm: (dist * 0.6).toFixed(1),
      isCritical,
      isHigh,
      idx
    };
  });

  // Trigger audio ping when sweep passes near an active blip
  useEffect(() => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastPingTimeRef.current < 400) return;

    for (const b of blips) {
      const diff = Math.abs(b.angleDeg - scanAngle);
      if (diff < 6 || diff > 354) {
        lastPingTimeRef.current = now;
        triggerSonarPing(b.isCritical ? 1175 : b.isHigh ? 880 : 660);
        break;
      }
    }
  }, [scanAngle, soundEnabled, blips]);

  const sizeClass = compact ? 'w-64 h-64' : 'w-72 h-72 sm:w-80 sm:h-80';

  return (
    <div
      className={`relative rounded-3xl bg-slate-950 border border-teal-500/30 p-5 shadow-2xl text-slate-100 overflow-hidden ${className}`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400">
            <Crosshair className="w-4 h-4 animate-spin-slow" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-teal-300 font-display">
                SONAR RADAR HUD
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-teal-900/60 border border-teal-500/30 text-teal-300">
                {currentCity}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              SWEEP: {scanAngle.toFixed(0)}° • RANGE: 25 KM • BLIPS: {blips.length}
            </p>
          </div>
        </div>

        {/* Audio Toggle & Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) triggerSonarPing(880);
            }}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 transition-all ${
              soundEnabled
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm shadow-teal-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Sonar Sound' : 'Enable Harmonic Sonar Ping'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span className="text-[10px] hidden sm:inline">PING ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">PING OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Radar Scope Circle */}
      <div className="relative mx-auto flex items-center justify-center py-2">
        <div
          className={`relative rounded-full border border-teal-500/40 bg-radial-gradient from-teal-950/40 to-slate-950 shadow-inner overflow-hidden ${sizeClass}`}
          style={{
            background:
              'radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, rgba(15, 23, 42, 0.95) 75%)',
          }}
        >
          {/* Concentric Distance Rings */}
          <div className="absolute inset-4 rounded-full border border-teal-500/20 pointer-events-none" />
          <div className="absolute inset-12 rounded-full border border-teal-500/20 pointer-events-none" />
          <div className="absolute inset-20 rounded-full border border-teal-500/20 pointer-events-none" />
          <div className="absolute inset-28 rounded-full border border-teal-500/30 border-dashed pointer-events-none" />

          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-teal-500/25 pointer-events-none" />
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-teal-500/25 pointer-events-none" />

          {/* Distance Labels */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-teal-400/60 pointer-events-none">
            25KM
          </span>
          <span className="absolute top-14 left-1/2 -translate-x-1/2 text-[8px] font-mono text-teal-400/40 pointer-events-none">
            15KM
          </span>
          <span className="absolute top-22 left-1/2 -translate-x-1/2 text-[8px] font-mono text-teal-400/40 pointer-events-none">
            5KM
          </span>

          {/* Rotating Sweep Beam */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `rotate(${scanAngle}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            <div
              className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
              style={{
                background:
                  'conic-gradient(from 180deg at 0% 100%, rgba(20, 184, 166, 0.45) 0deg, rgba(20, 184, 166, 0.1) 45deg, transparent 75deg)',
              }}
            />
            {/* Bright leading ray */}
            <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-gradient-to-t from-teal-300 via-teal-400 to-transparent shadow-[0_0_10px_#2dd4bf]" />
          </div>

          {/* Active Needs Blips */}
          {blips.map((b) => {
            const isSelected = activeBlip?.id === b.need.id;
            return (
              <button
                key={b.need.id}
                onClick={() => {
                  setActiveBlip(b.need);
                  if (onSelectNeed) onSelectNeed(b.need);
                  triggerSonarPing(b.isCritical ? 1200 : 900);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-transform hover:scale-150"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
                title={`${b.need.title} (${b.need.locality})`}
              >
                {/* Ping wave */}
                <span
                  className={`absolute -inset-1.5 rounded-full animate-ping opacity-60 ${
                    b.isCritical ? 'bg-rose-500' : b.isHigh ? 'bg-amber-400' : 'bg-teal-400'
                  }`}
                />
                {/* Core Blip dot */}
                <span
                  className={`relative block w-2.5 h-2.5 rounded-full shadow-md transition-all ${
                    isSelected
                      ? 'ring-2 ring-white scale-125 bg-white'
                      : b.isCritical
                      ? 'bg-rose-500 shadow-rose-500/50'
                      : b.isHigh
                      ? 'bg-amber-400 shadow-amber-400/50'
                      : 'bg-teal-400 shadow-teal-400/50'
                  }`}
                />
              </button>
            );
          })}

          {/* Center Origin Mark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-400/80 border-2 border-white shadow-[0_0_8px_#2dd4bf] pointer-events-none" />
        </div>
      </div>

      {/* Selected Blip Preview Card */}
      {activeBlip ? (
        <div className="mt-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {activeBlip.locality}, {activeBlip.city}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded uppercase font-mono ${
                activeBlip.urgency === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              }`}
            >
              {activeBlip.urgency}
            </span>
          </div>
          <div className="font-bold text-white truncate text-xs">{activeBlip.title}</div>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[10px] text-slate-300">
            <span>Score: <strong className="text-teal-300 font-mono">{activeBlip.unmet_demand_score.toFixed(1)}</strong></span>
            <span>Supporters: <strong className="text-white font-mono">{activeBlip.supporters_count}</strong></span>
            {onSelectNeed && (
              <button
                onClick={() => onSelectNeed(activeBlip)}
                className="text-teal-300 hover:text-white underline font-semibold cursor-pointer"
              >
                Inspect Need →
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 text-center text-[10px] text-slate-400 font-mono">
          Click any glowing radar blip to inspect live community demand
        </div>
      )}
    </div>
  );
};
