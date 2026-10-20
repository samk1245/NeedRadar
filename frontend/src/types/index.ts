export type UserRole = 'resident' | 'provider' | 'ngo' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  city: string;
  preferred_locality?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export type NeedCategory =
  | 'education'
  | 'healthcare'
  | 'supplies'
  | 'infrastructure'
  | 'repairs'
  | 'shelter';

export type NeedUrgency = 'low' | 'medium' | 'high' | 'critical';
export type NeedScope = 'individual' | 'community';

export type NeedStatus =
  | 'submitted'
  | 'under_review'
  | 'published'
  | 'matched'
  | 'assistance_in_progress'
  | 'resolution_proposed'
  | 'resolved'
  | 'closed'
  | 'rejected';

export interface Need {
  id: string;
  title: string;
  description: string;
  category: NeedCategory;
  subcategory?: string;
  urgency: NeedUrgency;
  scope: NeedScope;
  affected_count: number;
  desired_timeframe: string;
  image_url?: string;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
  is_location_approximate: boolean;
  is_sensitive: boolean;
  public_contact_preference: string;
  status: NeedStatus;
  supporters_count: number;
  unmet_demand_score: number;
  is_demo: boolean;
  creator_id: string;
  creator_name?: string;
  created_at: string;
  updated_at?: string;
  has_supported?: boolean;
  has_followed?: boolean;
  responses_count?: number;
}

export type NeedRead = Need;

export interface NeedMapItem {
  id: string;
  title: string;
  category: NeedCategory;
  locality: string;
  city: string;
  latitude: number;
  longitude: number;
  is_location_approximate: boolean;
  urgency: NeedUrgency;
  status: NeedStatus;
  supporters_count: number;
  unmet_demand_score: number;
  created_at: string;
}

export interface DuplicateSuggestion {
  id: string;
  title: string;
  category: NeedCategory;
  locality: string;
  similarity_score: number;
  distance_km?: number;
  reason: string;
  status: NeedStatus;
}

export type OrgType = 'ngo' | 'community_group' | 'service_provider' | 'volunteer_network';
export type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export interface Organisation {
  id: string;
  name: string;
  description: string;
  org_type: OrgType;
  registration_number?: string;
  website_url?: string;
  contact_email: string;
  contact_phone?: string;
  city: string;
  service_area: string;
  operating_hours: string;
  capacity_description?: string;
  eligibility_criteria?: string;
  verification_status: VerificationStatus;
  verification_notes?: string;
  verified_at?: string;
  created_at: string;
}

export interface ProviderResponse {
  id: string;
  need_id: string;
  organisation_id: string;
  organisation_name?: string;
  responder_id?: string;
  response_type: string;
  status: string;
  message: string;
  proposed_assistance?: string;
  eligibility_requirements?: string;
  estimated_timeline: string;
  contact_instructions: string;
  resident_feedback?: string;
  created_at: string;
}

export interface ResolutionProposal {
  id: string;
  need_id: string;
  response_id?: string;
  organisation_id: string;
  organisation_name?: string;
  summary: string;
  evidence_notes?: string;
  completion_date?: string;
  status: 'proposed' | 'confirmed' | 'rejected' | 'clarification_requested';
  resident_feedback?: string;
  verified_at?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  total_reports: number;
  unresolved_reports: number;
  resolved_reports: number;
  distinct_supporters: number;
  confirmed_provider_responses: number;
  verified_resolutions: number;
  resolution_rate_percent: number;
  median_time_to_response_hours: number;
  is_demo: boolean;
}

export interface CategoryDistributionItem {
  category: string;
  label: string;
  count: number;
  percentage: number;
  unresolved_count: number;
  avg_demand_score: number;
}

export interface LocalityDemandItem {
  locality: string;
  reports_count: number;
  supporters_count: number;
  unresolved_count: number;
  resolved_count: number;
  avg_demand_score: number;
}

export interface WeeklyTrendItem {
  week_label: string;
  date: string;
  new_reports: number;
  resolved_reports: number;
  provider_responses: number;
}

export interface EmergingTrendItem {
  category: string;
  locality: string;
  current_count: number;
  baseline_count: number;
  percent_change: number;
  trend_direction: string;
  confidence: string;
  observation_period: string;
}

export interface ServiceGapInsight {
  id: string;
  locality: string;
  category: string;
  observation_period: string;
  qualifying_records: number;
  confirmed_providers: number;
  unmet_demand_score: number;
  statement: string;
  supporting_metrics: Record<string, number>;
  confidence: string;
  recommended_action: string;
}
