from datetime import datetime, timezone, timedelta
from app.services.demand_intelligence import calculate_need_unmet_score
from app.services.ai_service import get_ai_service

def test_unmet_demand_score_formula():
    now = datetime.now(timezone.utc)
    
    # Baseline fresh report with zero supporters and no responses
    score_baseline = calculate_need_unmet_score(
        supporters_count=0,
        affected_count=1,
        created_at=now,
        has_provider_response=False
    )
    assert 15.0 <= score_baseline <= 30.0

    # High supporter report with old age should have much higher score
    score_high = calculate_need_unmet_score(
        supporters_count=10,
        affected_count=50,
        created_at=now - timedelta(days=14),
        has_provider_response=False
    )
    assert score_high > score_baseline

    # Confirmed provider response reduces unmet score
    score_with_response = calculate_need_unmet_score(
        supporters_count=10,
        affected_count=50,
        created_at=now - timedelta(days=14),
        has_provider_response=True
    )
    assert score_with_response < score_high

def test_rule_based_ai_service():
    ai = get_ai_service()
    classification = ai.classify_request("We urgently need a volunteer tutor for 8th grade science students")
    assert classification["suggested_category"] == "education"
    assert classification["is_rule_based"] is True

    healthcare_test = ai.classify_request("Emergency blood needed at hospital for critical patient")
    assert healthcare_test["suggested_category"] == "healthcare"
    assert healthcare_test["suggested_urgency"] == "high"
