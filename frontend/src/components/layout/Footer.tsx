import React from 'react';
import { Radar, Shield, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b101c] text-[rgba(244,246,250,0.72)] border-t border-[rgba(255,255,255,0.1)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-[#f4f6fa] font-bold text-lg">
              <div className="p-1.5 rounded-xl bg-[#182238] border border-cyan-500/30 text-[#3fd8ff]">
                <Radar className="w-5 h-5" />
              </div>
              <span>Need<span className="text-[#3fd8ff]">Radar</span></span>
            </div>
            <p className="text-xs text-[rgba(244,246,250,0.72)] leading-relaxed">
              AI-powered civic intelligence turning unmet community needs into actionable insights, connecting residents with verified providers and verifying resolutions.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#3fd8ff] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3fd8ff] animate-pulse"></span>
              Live City: Bengaluru (Urban & Rural)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[#f4f6fa] uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-[rgba(244,246,250,0.72)]">
              <li><Link to="/discovery" className="hover:text-[#3fd8ff] transition-colors">Community Discovery Map</Link></li>
              <li><Link to="/analytics" className="hover:text-[#3fd8ff] transition-colors">Demand Intelligence Hub</Link></li>
              <li><Link to="/report" className="hover:text-[#3fd8ff] transition-colors">Submit Community Report</Link></li>
              <li><Link to="/provider" className="hover:text-[#3fd8ff] transition-colors">Provider Verification Portal</Link></li>
            </ul>
          </div>

          {/* Commitments */}
          <div>
            <h4 className="text-xs font-semibold text-[#f4f6fa] uppercase tracking-wider mb-3">Our Commitments</h4>
            <ul className="space-y-2.5 text-xs text-[rgba(244,246,250,0.72)]">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#3fd8ff] flex-shrink-0" />
                <span>Zero Fake Statistics Policy</span>
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-[#3fd8ff] flex-shrink-0" />
                <span>Sensitive Location Privacy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c6ff2e] flex-shrink-0" />
                <span>Audited Resolution Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-[#3fd8ff] flex-shrink-0" />
                <span>NGO & Volunteer Inclusion</span>
              </li>
            </ul>
          </div>

          {/* Direct Emergency Access */}
          <div>
            <h4 className="text-xs font-semibold text-[#f4f6fa] uppercase tracking-wider mb-3">Verified Helplines</h4>
            <p className="text-xs text-[rgba(244,246,250,0.72)] mb-3 leading-relaxed">
              Immediate direct emergency coordination lines active 24/7 across all municipal regions.
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-slate-400">Police & Integrated:</span>
                <span className="font-bold text-[#c6ff2e]">112</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-slate-400">Ambulance Service:</span>
                <span className="font-bold text-rose-400">108</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#182238] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-slate-400">Disaster Management:</span>
                <span className="font-bold text-[#3fd8ff]">1077</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NeedRadar. AI-driven civic intelligence & community coordination platform.</p>
          <div className="flex gap-4">
            <Link to="/support" className="hover:text-slate-300 transition">Civic Helplines</Link>
            <span>•</span>
            <span className="text-slate-600">Encrypted AES-GCM Coordinates</span>
            <span>•</span>
            <span className="text-[#3fd8ff]">89 Cities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
