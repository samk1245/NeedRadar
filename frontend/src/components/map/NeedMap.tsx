import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { NeedMapItem, NeedCategory } from '../../types';
import { MapPin, ShieldAlert, Users, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NeedMapProps {
  items: NeedMapItem[];
  selectedItem?: NeedMapItem | null;
  onSelectItem?: (item: NeedMapItem | null) => void;
  center?: [number, number]; // [lon, lat]
  zoom?: number;
}

const CATEGORY_COLORS: Record<NeedCategory, string> = {
  education: '#3b82f6', // Blue
  healthcare: '#ef4444', // Red
  supplies: '#f59e0b', // Amber
  infrastructure: '#64748b', // Slate
  repairs: '#8b5cf6', // Violet
  shelter: '#10b981', // Emerald
};

export const NeedMap: React.FC<NeedMapProps> = ({
  items,
  selectedItem,
  onSelectItem,
  center = [77.6245, 12.9352], // Bengaluru default [lon, lat]
  zoom = 12,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize MapLibre GL with OpenStreetMap Standard Raster Tiles
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: center,
      zoom: zoom,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update markers when items change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    items.forEach((item) => {
      const color = CATEGORY_COLORS[item.category] || '#0d9488';

      // Create custom DOM element for marker
      const el = document.createElement('div');
      el.className = 'custom-map-marker group cursor-pointer transition-transform hover:scale-125';
      el.innerHTML = `
        <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 9999px; display: flex; items-center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); border: 2px solid white;">
          <svg style="width: 14px; height: 14px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
      `;

      el.addEventListener('click', () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([item.longitude, item.latitude])
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [items, onSelectItem]);

  // Pan to selected item
  useEffect(() => {
    if (selectedItem && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedItem.longitude, selectedItem.latitude],
        zoom: 14,
        speed: 1.2,
      });
    }
  }, [selectedItem]);

  // Pan to center when city changes
  useEffect(() => {
    if (center && mapRef.current && !selectedItem) {
      mapRef.current.flyTo({
        center: center,
        zoom: zoom,
        speed: 1.0,
      });
    }
  }, [center, zoom]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
      <div ref={mapContainer} className="w-full h-full min-h-[480px]" />

      {/* Selected Marker Detail Card Overlay */}
      {selectedItem && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-slate-200 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[selectedItem.category] }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {selectedItem.category}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-700">
                  {selectedItem.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {selectedItem.title}
              </h4>
            </div>
            <button
              onClick={() => onSelectItem && onSelectItem(null)}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
              aria-label="Close card"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800 truncate">{selectedItem.locality}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedItem.supporters_count} supporters</span>
            </div>
            <div className="col-span-2 flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
              <span className="text-slate-500">Unmet Demand Index:</span>
              <span className="font-bold text-teal-700 font-mono">
                {selectedItem.unmet_demand_score.toFixed(1)} / 100
              </span>
            </div>
          </div>

          {selectedItem.is_location_approximate && (
            <p className="text-[10px] text-amber-700 mt-2 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 flex-shrink-0" />
              Approximate location displayed to protect privacy.
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => navigate(`/needs/${selectedItem.id}`)}
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Full Details & Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Map Category Legend */}
      <div className="hidden sm:flex absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-sm border border-slate-200 text-xs gap-3 z-10">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] capitalize text-slate-700">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
