from typing import List, Optional, Dict
from pydantic import BaseModel

class AnalyticsOverview(BaseModel):
    total_reports: int
    unresolved_reports: int
    resolved_reports: int
    distinct_supporters: int
    confirmed_provider_responses: int
    verified_resolutions: int
    resolution_rate_percent: float
    median_time_to_response_hours: float
    is_demo: bool

class CategoryDistributionItem(BaseModel):
    category: str
    label: str
    count: int
    percentage: float
    unresolved_count: int
    avg_demand_score: float

class LocalityDemandItem(BaseModel):
    locality: str
    reports_count: int
    supporters_count: int
    unresolved_count: int
    resolved_count: int
    avg_demand_score: float

class WeeklyTrendItem(BaseModel):
    week_label: str
    date: str
    new_reports: int
    resolved_reports: int
    provider_responses: int

class EmergingTrendItem(BaseModel):
    category: str
    locality: str
    current_count: int
    baseline_count: int
    percent_change: float
    trend_direction: str # surging, steady, declining
    confidence: str # high, medium, low
    observation_period: str

class ServiceGapInsight(BaseModel):
    id: str
    locality: str
    category: str
    observation_period: str
    qualifying_records: int
    confirmed_providers: int
    unmet_demand_score: float
    statement: str
    supporting_metrics: Dict[str, float]
    confidence: str
    recommended_action: str

class DemandClusterItem(BaseModel):
    cluster_id: str
    category: str
    locality: str
    latitude: float
    longitude: float
    radius_km: float
    reports_count: int
    avg_score: float
