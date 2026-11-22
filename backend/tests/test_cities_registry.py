import pytest
from app.core.cities import CITIES_REGISTRY
from app.api.v1.discovery import export_civic_data
from app.core.database import SessionLocal

def test_cities_registry_coverage():
    """Verify registry has at least 80+ cities across India."""
    assert len(CITIES_REGISTRY) >= 80

def test_cities_coordinates_within_india():
    """Verify all city centers lie within India's approximate geographic bounding box."""
    for city_name, city in CITIES_REGISTRY.items():
        lat = city.get("lat")
        lon = city.get("lon")
        assert 6.0 <= lat <= 38.0, f"{city_name} latitude {lat} outside India bounds"
        assert 68.0 <= lon <= 98.0, f"{city_name} longitude {lon} outside India bounds"
        assert 2 <= len(city.get("code", "")) <= 4, f"{city_name} must have a valid code"
        assert len(city.get("localities", [])) >= 3, f"{city_name} must have at least 3 localities"
        assert city.get("municipal_authority"), f"{city_name} must have municipal authority"

def test_localities_coordinates():
    """Verify all micro-localities have valid numeric coordinates."""
    for city_name, city in CITIES_REGISTRY.items():
        for loc in city.get("localities", []):
            assert "name" in loc and len(loc["name"]) > 0
            assert 6.0 <= loc["lat"] <= 38.0
            assert 68.0 <= loc["lon"] <= 98.0

def test_geojson_export():
    """Verify GeoJSON export produces standard compliant FeatureCollection."""
    db = SessionLocal()
    try:
        res = export_civic_data(city="Bengaluru", format="geojson", db=db)
        assert res["type"] == "FeatureCollection"
        assert "metadata" in res
        assert "features" in res
        assert isinstance(res["features"], list)
        if len(res["features"]) > 0:
            first = res["features"][0]
            assert first["type"] == "Feature"
            assert first["geometry"]["type"] == "Point"
            assert len(first["geometry"]["coordinates"]) == 2
            assert "unmet_demand_score" in first["properties"]
    finally:
        db.close()
