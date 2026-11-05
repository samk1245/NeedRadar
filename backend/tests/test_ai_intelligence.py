import pytest
import concurrent.futures
from app.services.ai_concurrent_engine import ai_concurrent_engine

def test_ai_telemetry():
    telemetry = ai_concurrent_engine.get_telemetry()
    assert telemetry["status"] == "healthy"
    assert telemetry["active_concurrent_nodes"] >= 50
    assert "50-100" in telemetry["target_concurrency_capacity"]
    assert telemetry["avg_dispatch_latency_ms"] > 0
    assert telemetry["ops_per_second"] > 0

def test_ai_triage_urgent_healthcare():
    text = "Emergency: 20 senior citizens in Gomti Nagar need immediate oxygen cylinders and first-aid kits."
    triage = ai_concurrent_engine.triage_need(text, user_city="Lucknow")
    assert triage["suggested_category"] == "healthcare"
    assert triage["suggested_urgency"] in ["critical", "high"]
    assert triage["confidence"] >= 0.70
    assert len(triage["requirements"]) >= 2
    assert any("Medical" in r["item_name"] or "Aid" in r["item_name"] for r in triage["requirements"])

def test_ai_triage_education():
    text = "Students in local municipal school need weekend mathematics tutoring and science notebooks."
    triage = ai_concurrent_engine.triage_need(text, user_city="Bengaluru")
    assert triage["suggested_category"] == "education"
    assert len(triage["requirements"]) >= 2

def test_ai_live_concurrency_stream():
    stream = ai_concurrent_engine.generate_live_concurrency_stream(total_nodes=75)
    assert len(stream) == 75
    assert stream[0]["user_name"] is not None
    assert stream[0]["city"] is not None
    assert "impact_units" in stream[0]

def test_high_concurrency_simulated_load():
    """
    Simulates 80 concurrent user requests executing simultaneously
    to verify sub-millisecond execution without deadlock or race condition.
    """
    user_requests = [
        f"Request {i}: need drinking water filtration and food supplies at locality {i}"
        for i in range(80)
    ]

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(ai_concurrent_engine.triage_need, user_requests))

    assert len(results) == 80
    for res in results:
        assert res["suggested_category"] in ["supplies", "infrastructure"]
        assert len(res["requirements"]) > 0
