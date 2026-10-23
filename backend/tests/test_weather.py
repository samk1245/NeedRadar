import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_weather_bengaluru():
    response = client.get("/api/v1/weather?city=Bengaluru")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Bengaluru"
    assert "temperature_c" in data
    assert "aqi" in data
    assert "advisory_level" in data
    assert "civic_impact_alert" in data

def test_get_weather_delhi_aqi():
    response = client.get("/api/v1/weather?city=Delhi")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "Delhi"
    assert data["aqi"] >= 100
    assert "advisory_level" in data
