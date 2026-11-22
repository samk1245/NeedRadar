import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Map as MapIcon,
  List as ListIcon,
  MapPin,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  LifeBuoy,
  HeartHandshake,
  Waves,
  Download,
  Brain,
  Radar
} from 'lucide-react';
import { api } from '../services/api';
import { useCity } from '../context/CityContext';
import { NeedMapItem, NeedRead, NeedCategory, NeedStatus } from '../types';
import { NeedMap } from '../components/map/NeedMap';
import { TiltCard } from '../components/common/TiltCard';
import { CityBadge } from '../components/common/CityBadge';
import { SupportEnquiryModal } from '../components/support/SupportEnquiryModal';
import { WaterFlow3D } from '../components/common/WaterFlow3D';
import { SonarRadarHUD } from '../components/common/SonarRadarHUD';

const CATEGORIES: { id: NeedCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'supplies', label: 'Supplies & Food' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'repairs', label: 'Repairs' },
  { id: 'shelter', label: 'Shelter' },
];

export const DiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentCity, cityData } = useCity();
  const [viewMode, setViewMode] = useState<'map' | 'sonar' | 'water' | 'list'>('map');
  const [exporting, setExporting] = useState(false);

  const [items, setItems] = useState<NeedMapItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NeedMapItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [localityFilter, setLocalityFilter] = useState<string>('');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [urgentFilterActive, setUrgentFilterActive] = useState(false);

  const handleExportGeoJSON = async () => {
    setExporting(true);
    try {
      const geojson = await api.get<any>(`/discovery/export?city=${encodeURIComponent(currentCity)}&format=geojson`);
      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NeedRadar-${currentCity.replace(/\s+/g, '_')}-OpenCivicData.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('GeoJSON export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const fetchMarkers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('city', currentCity);
      if (category !== 'all') params.append('category', category);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (localityFilter) params.append('locality', localityFilter);

      const data = await api.get<NeedMapItem[]>(`/discovery/map?${params.toString()}`);
      setItems(data);
      if (data.length > 0) {
        setSelectedItem(data[0]);
      } else {
        setSelectedItem(null);
      }
    } catch (err: any) {
      setError(err.message || 'Could not load community needs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLocalityFilter('');
  }, [currentCity]);

  useEffect(() => {
    fetchMarkers();
  }, [currentCity, category, statusFilter, localityFilter]);

  // Client-side search & urgency filtering
  const filteredItems = items.filter((item) => {
    if (urgentFilterActive) {
      if (item.urgency !== 'high' && item.urgency !== 'critical') {
        return false;
      }
    }
    if (!searchQuery) return true;
    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locality.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CityBadge cityName={currentCity} size="lg" showLandmark={true} />
        </div>

        {/* View Toggle & Support Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setUrgentFilterActive(!urgentFilterActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border ${
              urgentFilterActive
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{urgentFilterActive ? 'High Priority Active' : 'Filter Critical / Urgent'}</span>
          </button>

          <button
            onClick={() => setSupportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-teal-600" />
            <span>Civic Support</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => setViewMode('sonar')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'sonar'
                  ? 'bg-slate-900 text-teal-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-teal-400" />
              <span>Sonar Radar</span>
            </button>
            <button
              onClick={() => setViewMode('water')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'water'
                  ? 'bg-slate-900 text-cyan-300 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-cyan-500" />
              <span>3D Fluid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Accessible List</span>
            </button>
          </div>

          <button
            onClick={handleExportGeoJSON}
            disabled={exporting}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
            title="Download verified civic data in open GeoJSON standard"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{exporting ? 'Exporting...' : 'Export GeoJSON'}</span>
          </button>

          <Link
            to="/report"
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            + Report Need
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords or locality (e.g. tutoring, Koramangala, road)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Locality Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={localityFilter}
              onChange={(e) => setLocalityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All {currentCity} Localities</option>
              {cityData?.localities.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Active Statuses</option>
              <option value="published">Published / Open</option>
              <option value="matched">Matched with Provider</option>
              <option value="resolution_proposed">Resolution Proposed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setUrgentFilterActive(!urgentFilterActive)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              urgentFilterActive
                ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{urgentFilterActive ? 'High Urgency Filter: On' : 'Urgent Only'}</span>
          </button>

          <span className="text-slate-300">|</span>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setSearchParams(cat.id === 'all' ? {} : { category: cat.id });
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Map vs List */}
      {loading ? (
        <div className="h-[520px] bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium">Loading geospatial community radar...</span>
        </div>
      ) : error ? (
        <div className="h-64 bg-red-50 rounded-xl border border-red-200 flex flex-col items-center justify-center p-6 text-center text-red-800">
          <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchMarkers}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="h-[400px] bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="w-10 h-10 text-slate-300 mb-2" />
          <h3 className="text-base font-bold text-slate-900">No Needs Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            No community requests match your current filters. Try selecting "All Categories" or clearing the locality filter.
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[580px]">
          <NeedMap
            items={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={(it) => setSelectedItem(it)}
            center={cityData ? [cityData.lon, cityData.lat] : undefined}
            zoom={cityData?.zoom || 12}
          />
        </div>
      ) : viewMode === 'sonar' ? (
        <div className="h-[580px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <SonarRadarHUD
            needs={filteredItems}
            onSelectNeed={(it) => setSelectedItem(it)}
            className="w-full h-full"
            compact={false}
          />
        </div>
      ) : viewMode === 'water' ? (
        <div className="h-[580px] relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <WaterFlow3D className="w-full h-full" showControls={true} />

          {/* 3D Floating Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-2xl text-white shadow-xl space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-bold text-sm">3D Fluid Sonar: {currentCity}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {filteredItems.length} Active Community Need Beacons Floating on Current
              </p>
            </div>
          </div>

          {/* Interactive Floating Needs Pills on Water */}
          <div className="absolute bottom-6 left-4 right-4 z-10 overflow-x-auto flex gap-3 pb-2 scrollbar-none">
            {filteredItems.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={`/needs/${item.id}`}
                className="flex-shrink-0 bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 p-3 rounded-xl text-white shadow-lg transition-transform hover:-translate-y-1 w-64 block group"
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold mb-1">
                  <span className="capitalize">{item.category}</span>
                  <span className="text-amber-400 uppercase">{item.urgency}</span>
                </div>
                <h4 className="text-xs font-bold truncate group-hover:text-cyan-200">{item.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-800">
                  <span>{item.locality}</span>
                  <span className="text-cyan-400 font-mono">{item.supporters_count} supporters</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        /* Accessible List View with 3D Tilt Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <TiltCard
              key={item.id}
              maxTilt={8}
              scale={1.02}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="capitalize font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{item.locality}, {item.city}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.supporters_count}</span>
                  </span>
                  <span className="font-mono text-teal-700 font-bold">
                    Demand: {item.unmet_demand_score.toFixed(0)}
                  </span>
                </div>
                <Link
                  to={`/needs/${item.id}`}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      )}

      {/* Support Enquiry Modal */}
      <SupportEnquiryModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
};
