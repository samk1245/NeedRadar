import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_submit_enquiry():
    payload = {
        "name": "Arjun Sharma",
        "email": "arjun.sharma@example.com",
        "phone": "+91 98765 43210",
        "city": "Lucknow",
        "locality": "Gomti Nagar",
        "category": "emergency_escalation",
        "urgency": "critical",
        "subject": "Urgent Medical Assistance Required for Senior Resident",
        "message": "Elderly citizen requires emergency oxygen cylinder support and medical volunteer coordination."
    }
    response = client.post("/api/v1/enquiries", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "ticket_id" in data
    assert data["ticket_id"].startswith("RADAR-")
    assert data["status"] == "received"
    assert "Civic Action Response Desk" in data["assigned_desk"]
    assert "helpline" in data or "emergency_contact" in data

def test_get_city_helplines():
    response = client.get("/api/v1/enquiries/helplines?city=Lucknow")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Lucknow"
    assert data["national_emergency"] == "112"
    assert "LMC" in data["municipal_authority"] or "Lucknow" in data["municipal_authority"]
