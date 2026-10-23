import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_submit_volunteer_pledge():
    payload = {
        "volunteer_name": "Dr. Rohit Verma",
        "volunteer_email": "rohit.verma@civicaction.org",
        "volunteer_phone": "+91 98888 77777",
        "city": "Lucknow",
        "pledge_type": "skilled_mentorship",
        "hours_committed": 6,
        "pledge_description": "Offering free weekend clinical checkups and first-aid kits for community shelters.",
        "availability": "Saturdays 10 AM - 4 PM"
    }
    response = client.post("/api/v1/volunteers/pledge", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["volunteer_name"] == "Dr. Rohit Verma"
    assert data["city"] == "Lucknow"
    assert data["hours_committed"] == 6
    assert data["status"] == "pending"

def test_get_volunteer_pledges():
    # Submit a pledge first
    payload = {
        "volunteer_name": "Ananya Sen",
        "volunteer_email": "ananya.sen@example.com",
        "volunteer_phone": "+91 97777 66666",
        "city": "Kolkata",
        "pledge_type": "supplies_kit",
        "hours_committed": 4,
        "pledge_description": "Donating 15 emergency dry ration and hydration kits.",
        "availability": "Weekdays after 5 PM"
    }
    create_resp = client.post("/api/v1/volunteers/pledge", json=payload)
    assert create_resp.status_code == 201

    response = client.get("/api/v1/volunteers/pledges?city=Kolkata")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert any(p["volunteer_name"] == "Ananya Sen" for p in data)

def test_get_volunteer_impact_stats():
    response = client.get("/api/v1/volunteers/impact-stats")
    assert response.status_code == 200
    stats = response.json()
    assert "total_pledges" in stats
    assert "total_volunteer_hours" in stats
    assert "pledges_by_type" in stats
    assert "recent_pledges" in stats
    assert stats["total_pledges"] >= 1
    assert stats["total_volunteer_hours"] >= 1

def test_update_pledge_status():
    payload = {
        "volunteer_name": "Karan Mehra",
        "volunteer_email": "karan.mehra@example.com",
        "volunteer_phone": "+91 96666 55555",
        "city": "Delhi",
        "pledge_type": "blood_donation",
        "hours_committed": 2,
        "pledge_description": "Registered O+ blood donor available for urgent blood bank calls.",
        "availability": "On-call 24x7"
    }
    create_resp = client.post("/api/v1/volunteers/pledge", json=payload)
    assert create_resp.status_code == 201
    pledge_id = create_resp.json()["id"]

    update_resp = client.patch(
        f"/api/v1/volunteers/pledges/{pledge_id}/status",
        json={"status": "accepted"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "accepted"
