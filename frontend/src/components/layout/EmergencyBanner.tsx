import React, { useState } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-900 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
            Safety Notice
          </span>
          <span className="text-amber-900/90">
            NeedRadar is a community intelligence and coordination platform, <strong>not an emergency dispatch service</strong>.
          </span>
          <div className="inline-flex items-center gap-3 text-xs font-medium text-amber-950 ml-1">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-800" />
              National Emergency: <strong>112</strong>
            </span>
            <span>•</span>
            <span>Ambulance: <strong>108</strong></span>
            <span>•</span>
            <span>Disaster Relief: <strong>1077</strong></span>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 hover:text-amber-950 p-1 rounded transition-colors"
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
