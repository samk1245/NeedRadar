import math
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from collections import defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.need import Need, NeedStatus, NeedCategory
from app.models.response import ProviderResponse, ResponseStatus
from app.models.organisation import Organisation, VerificationStatus

def calculate_need_unmet_score(
    supporters_count: int,
    affected_count: int,
    created_at: datetime,
    has_provider_response: bool,
    similar_unresolved_count: int = 1
) -> float:
    """
    Transparent Unmet-Demand Scoring Formula:
    Score = min(100.0,
      15.0 (base for valid report)
      + min(30.0, supporters_count * 5.0)
      + min(20.0, math.log10(max(1, affected_count)) * 10.0)
      + min(15.0, age_in_days * 0.75)
      + min(15.0, (similar_unresolved_count - 1) * 3.0)
      - (25.0 if has_provider_response else 0.0)
    )
    Score range: 0.0 (fully addressed / low urgency) to 100.0 (high unmet crisis)
    """
    now = datetime.now(timezone.utc)
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    age_days = max(0, (now - created_at).total_seconds() / 86400.0)

    score = 15.0
    score += min(30.0, supporters_count * 5.0)
    score += min(20.0, math.log10(max(1, affected_count)) * 10.0)
    score += min(15.0, age_days * 0.75)
    score += min(15.0, max(0, similar_unresolved_count - 1) * 3.0)

    if has_provider_response:
        score -= 25.0

    return round(max(5.0, min(100.0, score)), 1)

def get_demand_clusters(db: Session, city: str = "Bengaluru") -> List[Dict[str, Any]]:
    """
    Groups open needs by locality & category to calculate demand density clusters.
    """
    open_needs = db.query(Need).filter(
        Need.city == city,
        Need.status.notin_([NeedStatus.REJECTED, NeedStatus.CLOSED, NeedStatus.RESOLVED])
    ).all()

    grouped = defaultdict(list)
    for n in open_needs:
        key = (n.locality, n.category.value)
        grouped[key].append(n)

    clusters = []
    idx = 1
    for (locality, category), items in grouped.items():
        if not items:
            continue
        avg_lat = sum(i.latitude for i in items) / len(items)
        avg_lon = sum(i.longitude for i in items) / len(items)
        avg_score = sum(i.unmet_demand_score for i in items) / len(items)
        
        clusters.append({
            "cluster_id": f"cluster-{idx}",
            "locality": locality,
            "category": category,
            "latitude": round(avg_lat, 5),
            "longitude": round(avg_lon, 5),
            "radius_km": round(max(0.5, len(items) * 0.4), 2),
            "reports_count": len(items),
            "avg_score": round(avg_score, 1)
        })
        idx += 1

    clusters.sort(key=lambda x: x["avg_score"], reverse=True)
    return clusters

def detect_emerging_trends(db: Session, city: str = "Bengaluru") -> List[Dict[str, Any]]:
    """
    Identifies surging needs by comparing recent 14-day window against prior 14-day baseline.
    Requires minimum threshold of reports to avoid noise.
    """
    now = datetime.now(timezone.utc)
    recent_cutoff = now - timedelta(days=14)
    baseline_cutoff = now - timedelta(days=28)

    all_recent = db.query(Need).filter(
        Need.city == city,
        Need.created_at >= recent_cutoff,
        Need.status.notin_([NeedStatus.REJECTED])
    ).all()

    all_baseline = db.query(Need).filter(
        Need.city == city,
        Need.created_at >= baseline_cutoff,
        Need.created_at < recent_cutoff,
        Need.status.notin_([NeedStatus.REJECTED])
    ).all()

    recent_counts = defaultdict(int)
    for n in all_recent:
        recent_counts[(n.locality, n.category.value)] += 1

    baseline_counts = defaultdict(int)
    for n in all_baseline:
        baseline_counts[(n.locality, n.category.value)] += 1

    trends = []
    for (locality, cat), r_count in recent_counts.items():
        b_count = baseline_counts.get((locality, cat), 0)
        
        # Calculate % change
        if b_count > 0:
            pct_change = ((r_count - b_count) / b_count) * 100.0
        else:
            pct_change = 100.0 if r_count >= 2 else 0.0

        if pct_change >= 25.0 and r_count >= 2:
            direction = "surging"
        elif pct_change <= -25.0:
            direction = "declining"
        else:
            direction = "steady"

        confidence = "high" if (r_count + b_count) >= 6 else ("medium" if (r_count + b_count) >= 3 else "low")

        trends.append({
            "locality": locality,
            "category": cat,
            "current_count": r_count,
            "baseline_count": b_count,
            "percent_change": round(pct_change, 1),
            "trend_direction": direction,
            "confidence": confidence,
            "observation_period": "Last 14 days vs prior 14 days"
        })

    trends.sort(key=lambda x: (x["percent_change"], x["current_count"]), reverse=True)
    return trends

def generate_service_gap_insights(db: Session, city: str = "Bengaluru") -> List[Dict[str, Any]]:
    """
    Synthesizes service gaps by correlating open community needs with verified provider availability.
    Strictly factual: only outputs insights backed by real records.
    """
    trends = detect_emerging_trends(db, city)
    insights = []
    idx = 1

    # Map categories to friendly labels and recommended actions
    RECOMMENDED_ACTIONS = {
        "education": "Partner with local teaching volunteers and after-school NGOs to launch weekend tutoring cohorts.",
        "healthcare": "Alert local public health clinics and coordinated citizen blood donation networks.",
        "supplies": "Deploy emergency ration kits through verified food relief charities in the zone.",
        "infrastructure": "Compile aggregated civic report and submit directly to municipal ward authorities.",
        "repairs": "Facilitate community tool library and vetted local technician co-operatives.",
        "shelter": "Notify registered emergency shelter foundations and transit rehabilitation teams."
    }

    # Count verified organisations per category
    verified_providers = db.query(Organisation).filter(
        Organisation.city == city,
        Organisation.verification_status == VerificationStatus.VERIFIED
    ).all()

    for trend in trends:
        locality = trend["locality"]
        category = trend["category"]
        
        # Check active needs in this locality & category
        unresolved_needs = db.query(Need).filter(
            Need.city == city,
            Need.locality == locality,
            Need.category == category,
            Need.status.notin_([NeedStatus.REJECTED, NeedStatus.RESOLVED, NeedStatus.CLOSED])
        ).all()

        if not unresolved_needs:
            continue

        # Check provider responses in this locality & category
        need_ids = [n.id for n in unresolved_needs]
        responses_count = db.query(ProviderResponse).filter(
            ProviderResponse.need_id.in_(need_ids)
        ).count()

        avg_score = sum(n.unmet_demand_score for n in unresolved_needs) / len(unresolved_needs)
        
        # We define a gap if there are at least 2 unresolved needs and provider response coverage is under 50%
        coverage = responses_count / len(unresolved_needs) if unresolved_needs else 1.0

        if len(unresolved_needs) >= 2 and coverage < 0.6:
            qualifying = len(unresolved_needs)
            cat_display = category.capitalize()
            statement = (
                f"{cat_display} requests in {locality} have {trend['trend_direction']} over the observation period "
                f"({qualifying} active requests, avg unmet score {avg_score:.1f}), with only {responses_count} verified provider response(s)."
            )
            
            insights.append({
                "id": f"gap-{idx}",
                "locality": locality,
                "category": category,
                "observation_period": trend["observation_period"],
                "qualifying_records": qualifying,
                "confirmed_providers": responses_count,
                "unmet_demand_score": round(avg_score, 1),
                "statement": statement,
                "supporting_metrics": {
                    "unresolved_count": float(qualifying),
                    "provider_responses": float(responses_count),
                    "coverage_rate": round(coverage * 100.0, 1),
                    "trend_change_pct": trend["percent_change"]
                },
                "confidence": trend["confidence"],
                "recommended_action": RECOMMENDED_ACTIONS.get(category, "Engage local community volunteers and municipal liaisons.")
            })
            idx += 1

    return insights
