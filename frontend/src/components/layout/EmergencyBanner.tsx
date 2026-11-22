import React, { useState } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('needradar_emergency_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('needradar_emergency_dismissed', 'true');
    } catch {}
  };

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/95 border-b border-amber-200/90 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-amber-900 transition-all z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 font-semibold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded text-[10px] sm:text-xs uppercase tracking-wide border border-amber-300 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-800" />
            Safety Notice
          </span>
          <span className="text-amber-900/90 font-medium truncate sm:overflow-visible sm:whitespace-normal">
            NeedRadar is a coordination platform, <strong>not emergency dispatch</strong>.
          </span>
          <div className="hidden md:inline-flex items-center gap-2 text-[11px] font-semibold text-amber-950 shrink-0">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-800" />
              Emergency: <strong>112</strong>
            </span>
            <span>•</span>
            <span>Ambulance: <strong>108</strong></span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100/60 transition-colors shrink-0 cursor-pointer"
          title="Dismiss advisory"
          aria-label="Dismiss advisory"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};
