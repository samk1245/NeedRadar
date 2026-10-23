from typing import Dict, Any, Optional
from fastapi import APIRouter, Query
from app.services.weather_service import get_city_weather
from app.core.cities import CITIES_REGISTRY

router = APIRouter()

@router.get("", response_model=Dict[str, Any])
def get_weather(city: Optional[str] = "Bengaluru"):
    """
    Get live weather & environmental civic advisory for a specified city.
    """
    city_data = CITIES_REGISTRY.get(city) or CITIES_REGISTRY.get("Bengaluru")
    lat = city_data.get("lat") if city_data else None
    lon = city_data.get("lon") if city_data else None
    
    return get_city_weather(city, lat=lat, lon=lon)
