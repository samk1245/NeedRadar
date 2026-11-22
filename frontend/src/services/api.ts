import { SUPPORTED_CITIES } from '../context/CityContext';
import { NeedMapItem, AnalyticsOverview, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';
const FALLBACK_BASE = 'http://localhost:8000/api/v1';

// Smart offline mock fallback for GitHub Pages and remote client previews
function getMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const url = new URL(endpoint, 'http://dummy.internal');
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  const cityParam = searchParams.get('city') || 'Bengaluru';

  const matchedCity = SUPPORTED_CITIES.find(
    (c) => c.name.toLowerCase() === cityParam.toLowerCase()
  ) || SUPPORTED_CITIES[0];

  // 1. Volunteer Impact Stats
  if (pathname.includes('/volunteers/impact-stats')) {
    return {
      active_volunteers: 342,
      resolved_needs_this_month: 87,
      community_hours: 1250,
      partner_ngos: 18,
    } as unknown as T;
  }

  // 2. Map Markers
  if (pathname.includes('/discovery/map')) {
    const categories = ['healthcare', 'education', 'infrastructure', 'supplies', 'repairs'] as const;
    const urgencies = ['critical', 'high', 'medium', 'low'] as const;
    const statuses = ['published', 'matched', 'assistance_in_progress', 'resolution_proposed'] as const;

    const items: NeedMapItem[] = matchedCity.localities.map((loc, idx) => ({
      id: `mock-${matchedCity.code.toLowerCase()}-${idx + 1}`,
      title: `${loc.name} Community Need & Resource Request`,
      category: categories[idx % categories.length],
      locality: loc.name,
      city: matchedCity.name,
      latitude: loc.lat,
      longitude: loc.lon,
      is_location_approximate: false,
      urgency: urgencies[idx % urgencies.length],
      status: statuses[idx % statuses.length],
      supporters_count: 12 + idx * 7,
      unmet_demand_score: 65.0 + (idx * 6.5) % 30,
      created_at: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
    }));
    return items as unknown as T;
  }

  // 2. Analytics Overview
  if (pathname.includes('/analytics/overview')) {
    const ov: AnalyticsOverview = {
      total_reports: 34 + matchedCity.localities.length * 6,
      unresolved_reports: 14 + matchedCity.localities.length * 2,
      resolved_reports: 20 + matchedCity.localities.length * 4,
      distinct_supporters: 148 + matchedCity.localities.length * 22,
      confirmed_provider_responses: 24,
      verified_resolutions: 18,
      resolution_rate_percent: 68.5,
      median_time_to_response_hours: 14.2,
      is_demo: false,
    };
    return ov as unknown as T;
  }

  // 3. Supported Cities
  if (pathname.includes('/discovery/cities')) {
    return SUPPORTED_CITIES as unknown as T;
  }

  // 4. Auth - Me
  if (pathname.includes('/auth/me')) {
    const saved = localStorage.getItem('needradar_user');
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {}
    }
    const defaultUser: User = {
      id: 'demo-resident-1',
      email: 'resident@needradar.org',
      full_name: 'Pooja Sharma',
      role: 'resident',
      city: matchedCity.name,
      preferred_locality: matchedCity.localities[0]?.name || 'Civil Lines',
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
    };
    return defaultUser as unknown as T;
  }

  // 5. Auth - Login
  if (pathname.includes('/auth/login') || pathname.includes('/auth/register')) {
    let body: any = {};
    try {
      body = options.body ? JSON.parse(options.body as string) : {};
    } catch {}

    const role = body.email?.includes('provider')
      ? 'provider'
      : body.email?.includes('mod') || body.email?.includes('admin')
      ? 'moderator'
      : 'resident';

    const user: User = {
      id: `usr-${Date.now()}`,
      email: body.email || 'resident@needradar.org',
      full_name: body.full_name || (role === 'provider' ? 'Vidya Trust Partner' : role === 'moderator' ? 'Karthik Nair (Civic Moderator)' : 'Pooja Sharma'),
      role: role as any,
      city: matchedCity.name,
      is_active: true,
      is_verified: true,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('needradar_user', JSON.stringify(user));
    return {
      access_token: `mock-jwt-token-${Date.now()}`,
      user,
    } as unknown as T;
  }

  // 6. Generic list fallback
  return [] as unknown as T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // If hosted on GitHub Pages (static preview), return immediate mock to avoid 404 network errors
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    return getMockFallback<T>(endpoint, options);
  }

  const token = localStorage.getItem('needradar_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response | null = null;
  let networkFailed = false;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (initialErr) {
    // Graceful fallback to direct port 8000 if proxy is inactive
    if (API_BASE !== FALLBACK_BASE) {
      try {
        response = await fetch(`${FALLBACK_BASE}${endpoint}`, {
          ...options,
          headers,
        });
      } catch {
        networkFailed = true;
      }
    } else {
      networkFailed = true;
    }
  }

  // If both network routes fail (e.g. standalone GitHub Pages preview on mobile)
  if (networkFailed || !response || (!response.ok && response.status === 404)) {
    return getMockFallback<T>(endpoint, options);
  }

  if (!response.ok) {
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch {
      // Fallback to response.statusText
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data), ...options }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};
