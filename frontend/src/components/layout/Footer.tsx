import React from 'react';
import { Radar, Shield, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="p-1.5 rounded bg-teal-500/20 text-teal-400">
                <Radar className="w-5 h-5" />
              </div>
              NeedRadar
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered civic intelligence turning unmet community needs into actionable insights, connecting residents with verified providers and verifying resolutions.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              Live City: Bengaluru (Urban & Rural)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/discovery" className="hover:text-white transition-colors">Community Discovery Map</Link></li>
              <li><Link to="/analytics" className="hover:text-white transition-colors">Demand Intelligence Hub</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Submit Community Report</Link></li>
              <li><Link to="/provider" className="hover:text-white transition-colors">Provider Verification Portal</Link></li>
            </ul>
          </div>

          {/* Commitments */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Our Commitments</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Zero Fake Statistics Policy</span>
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Sensitive Location Privacy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Audited Resolution Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>NGO & Volunteer Inclusion</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Responsible Use */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Responsible Civic Use</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              NeedRadar coordinates social support and municipal civic demands. In immediate danger or life-threatening medical situations, dial official helplines immediately.
            </p>
            <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span className="font-semibold text-amber-400">Emergency Helplines:</span>
              <div className="grid grid-cols-2 gap-1 mt-1 font-mono text-[11px]">
                <span>National: 112</span>
                <span>Ambulance: 108</span>
                <span>Women Helpline: 1091</span>
                <span>Childline: 1098</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NeedRadar Platform. Open data for civic resilience.</p>
          <div className="flex items-center gap-6">
            <span>City Config: BBMP / Bengaluru</span>
            <span>WCAG 2.2 AA Aimed</span>
            <span>PostGIS / Spatial Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
