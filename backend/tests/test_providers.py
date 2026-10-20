from app.models.organisation import VerificationStatus

def test_organisation_registration_and_verification_flow(client, auth_headers, admin_headers):
    # 1. Register an NGO
    org_payload = {
        "name": "Bangalore Green Action",
        "description": "Tree plantation and park accessibility repairs NGO across Bangalore.",
        "org_type": "ngo",
        "contact_email": "team@bgreen.org.example",
        "service_area": "Koramangala, Indiranagar",
        "categories": ["repairs", "infrastructure"]
    }
    reg_res = client.post("/api/v1/providers/organisations", json=org_payload, headers=auth_headers)
    assert reg_res.status_code == 201
    org = reg_res.json()
    org_id = org["id"]
    assert org["verification_status"] == "pending"

    # 2. Admin reviews and verifies the organisation
    verify_res = client.post(
        f"/api/v1/moderation/organisations/{org_id}/verification",
        json={"status": "verified", "notes": "Registered NGO verified via audit"},
        headers=admin_headers
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["verification_status"] == "verified"

def test_analytics_endpoints(client):
    res = client.get("/api/v1/analytics/overview?city=Bengaluru")
    assert res.status_code == 200
    data = res.json()
    assert "total_reports" in data
    assert "resolution_rate_percent" in data
    assert data["is_demo"] is False
