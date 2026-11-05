import React, { useState } from 'react';
import { Radio, Brain, Network, CheckCircle2, ArrowRight, Play, Sparkles, ShieldCheck } from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  headline: string;
  description: string;
  telemetry: string;
}

export const CivicWorkflow3D: React.FC<{ onSimulateClick?: () => void }> = ({ onSimulateClick }) => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const stages: Stage[] = [
    {
      id: 1,
      title: '1. Distress Ingestion',
      badge: 'Citizen Signal',
      icon: Radio,
      color: 'from-sky-500 to-blue-600',
      glow: 'shadow-sky-500/30',
      headline: 'Real-Time Geo-Tagged Need Reports',
      description: 'Residents submit localized civic gaps (clean water, medical aid, school tutoring, road hazards) with privacy obfuscation and multi-item requirements.',
      telemetry: '89 Cities Covered • Sub-Second Geocoding'
    },
    {
      id: 2,
      title: '2. AI Concurrent Triage',
      badge: '50-100 User Engine',
      icon: Brain,
      color: 'from-cyan-400 to-teal-500',
      glow: 'shadow-cyan-500/30',
      headline: 'Parallel AI Urgency & Clustering',
      description: 'Processes 50-100 concurrent queries simultaneously. Auto-detects urgency, generates fulfillment checklists, and tags required skills in ~12ms.',
      telemetry: '96.8% Accuracy • Non-Blocking Async Queue'
    },
    {
      id: 3,
      title: '3. Hydraulic Water Dispatch',
      badge: 'Hydraulic Routing',
      icon: Network,
      color: 'from-indigo-500 to-cyan-500',
      glow: 'shadow-indigo-500/30',
      headline: 'Streaming into Volunteer Networks',
      description: 'Needs flow like living water streams directly to verified local NGOs, nearby citizens, and volunteer groups ready to pledge specific quantities.',
      telemetry: 'Over 80+ Localized Partner Networks'
    },
    {
      id: 4,
      title: '4. Ground Resolution',
      badge: 'Verified Impact',
      icon: CheckCircle2,
      color: 'from-emerald-400 to-teal-600',
      glow: 'shadow-emerald-500/30',
      headline: 'Transparent Fulfillment & Proof',
      description: 'Pledges are fulfilled item-by-item, verified on ground by municipal community leads, and permanently recorded in public demand intelligence.',
      telemetry: '100% Traceable Community Action'
    }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    let current = 1;
    const interval = setInterval(() => {
      current++;
      if (current > 4) {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveStage(4);
        if (onSimulateClick) onSimulateClick();
      } else {
        setActiveStage(current);
      }
    }, 900);
  };

  return (
    <section className="relative py-16 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* 3D Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Interactive 3D Civic Workflow</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-400">50-100 User AI Compatible</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          How Community Needs Flow to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
            Ground Resolution
          </span>
        </h2>
        <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
          From the instant a citizen signals a crisis, our 50-100 node AI engine clusters, triages, and channels resources like a seamless fluid stream.
        </p>
      </div>

      {/* 3D Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`relative cursor-pointer transition-all duration-300 rounded-2xl p-6 border backdrop-blur-xl group ${
                isActive
                  ? `bg-slate-900/90 border-cyan-400/80 shadow-2xl ${stage.glow} -translate-y-2 scale-[1.02]`
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Dynamic Water Wave Line on Top */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 rounded-t-2xl shadow-sm" />
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stage.badge}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`} />
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stage.color} text-white shadow-lg mb-5 group-hover:rotate-6 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{stage.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {stage.description}
              </p>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300/80 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="truncate">{stage.telemetry}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Spotlight Card */}
      {stages[activeStage - 1] && (
        <div className="mt-10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                <span>Phase {stages[activeStage - 1].id} Live Inspection</span>
                <span>•</span>
                <span className="text-slate-400">{stages[activeStage - 1].badge}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {stages[activeStage - 1].headline}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {stages[activeStage - 1].description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>{isSimulating ? 'Simulating 50-100 Users...' : 'Simulate 50-100 Users Stream'}</span>
              </button>

              <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-3 py-2.5 rounded-xl border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI Concurrency: Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
