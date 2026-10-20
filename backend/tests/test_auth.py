def test_register_resident(client):
    res = client.post("/api/v1/auth/register", json={
        "email": "newuser@test.org",
        "password": "Password123!",
        "full_name": "New User",
        "city": "Bengaluru",
        "role": "admin" # Attempt to self-assign admin should be rejected or downgraded to resident
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "resident" # Safe fallback prevents privilege escalation

def test_login_success(client):
    # Register first
    client.post("/api/v1/auth/register", json={
        "email": "loginuser@test.org",
        "password": "Password123!",
        "full_name": "Login User",
        "city": "Bengaluru"
    })
    # Login
    res = client.post("/api/v1/auth/login", json={
        "email": "loginuser@test.org",
        "password": "Password123!"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()

def test_login_invalid_password(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "loginuser@test.org",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_get_current_user(client, auth_headers):
    res = client.get("/api/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "test_resident@needradar.org"
