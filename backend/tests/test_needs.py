def test_create_and_support_need(client, auth_headers):
    # 1. Create a community need
    create_payload = {
        "title": "Need 5 Volunteers for Evening Tutoring Center",
        "description": "Providing basic algebra and English assistance to government school children in HSR Layout.",
        "category": "education",
        "locality": "HSR Layout",
        "latitude": 12.9121,
        "longitude": 77.6446,
        "affected_count": 25,
        "desired_timeframe": "Next 2 weeks"
    }
    res = client.post("/api/v1/needs", json=create_payload, headers=auth_headers)
    assert res.status_code == 201
    need = res.json()
    need_id = need["id"]
    assert need["title"] == create_payload["title"]
    assert need["supporters_count"] == 0
    assert need["unmet_demand_score"] > 0

    # 2. Support the need
    sup_res = client.post(f"/api/v1/needs/{need_id}/support", headers=auth_headers)
    assert sup_res.status_code == 200
    assert sup_res.json()["supporters_count"] == 1

    # 3. Prevent duplicate support by same user
    dup_res = client.post(f"/api/v1/needs/{need_id}/support", headers=auth_headers)
    assert dup_res.status_code == 400
    assert "already supported" in dup_res.json()["detail"].lower()

def test_duplicate_check_preview(client, auth_headers):
    # Check duplicate suggestion for similar title
    payload = {
        "title": "Need Volunteers for Evening Tutoring Center",
        "description": "Looking for volunteers to teach maths and english to school children.",
        "category": "education",
        "locality": "HSR Layout",
        "latitude": 12.9121,
        "longitude": 77.6446,
        "affected_count": 20
    }
    res = client.post("/api/v1/needs/check-duplicates", json=payload)
    assert res.status_code == 200
    suggestions = res.json()
    assert isinstance(suggestions, list)
    if suggestions:
        assert suggestions[0]["similarity_score"] > 0.4
