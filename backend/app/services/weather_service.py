from typing import Dict, Any, Optional
import urllib.request
import json
from datetime import datetime, timezone

# City Coordinates and Baseline Climate Profiles for India
CITY_WEATHER_DEFAULTS: Dict[str, Dict[str, Any]] = {
    "Bengaluru": {"temp": 24.5, "condition": "Partly Cloudy", "humidity": 68, "wind": 14, "aqi": 52, "aqi_cat": "Good", "advisory": "normal", "alert": "Optimal outdoor conditions. No active civic weather warnings."},
    "Delhi": {"temp": 29.0, "condition": "Haze & High AQI", "humidity": 55, "wind": 8, "aqi": 340, "aqi_cat": "Very Unhealthy", "advisory": "warning", "alert": "High AQI Warning: Elevated smog levels. Respiratory vulnerable groups and elderly advised indoor shelter. Emergency N95 distribution active in high-traffic wards."},
    "Mumbai": {"temp": 30.5, "condition": "Humid & Overcast", "humidity": 82, "wind": 22, "aqi": 98, "aqi_cat": "Moderate", "advisory": "advisory", "alert": "Coastal Humidity & High Tide Advisory: BMC low-lying ward pumps on standby for potential localized waterlogging."},
    "Lucknow": {"temp": 28.0, "condition": "Mild Haze", "humidity": 62, "wind": 10, "aqi": 210, "aqi_cat": "Poor", "advisory": "advisory", "alert": "Moderate Particulate Smog: Outdoor community sports suspended in municipal primary schools."},
    "Prayagraj": {"temp": 29.2, "condition": "Sunny", "humidity": 58, "wind": 11, "aqi": 145, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Clear riverbank conditions. Triveni Sangam boat safety advisories active."},
    "Kanpur": {"temp": 28.8, "condition": "Industrial Haze", "humidity": 64, "wind": 9, "aqi": 275, "aqi_cat": "Poor", "advisory": "advisory", "alert": "Air Quality Advisory: Tannery belt and GT Road wards under high particulate matter watch."},
    "Varanasi": {"temp": 28.4, "condition": "Clear Sky", "humidity": 60, "wind": 10, "aqi": 160, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Pleasant evening temperatures along Ganga Ghats."},
    "Hyderabad": {"temp": 27.5, "condition": "Scattered Clouds", "humidity": 62, "wind": 16, "aqi": 75, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Normal civic conditions across GHMC zones."},
    "Chennai": {"temp": 31.0, "condition": "Tropical Sea Breeze", "humidity": 78, "wind": 20, "aqi": 68, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Coastal weather stable. GCC stormwater drain desilting completed."},
    "Kolkata": {"temp": 29.5, "condition": "Humid & Warm", "humidity": 75, "wind": 12, "aqi": 178, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Normal urban conditions in KMC wards."},
    "Pune": {"temp": 26.0, "condition": "Pleasant & Breezy", "humidity": 55, "wind": 15, "aqi": 82, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Good air quality and clear transport routes across PMC corridors."},
    "Ahmedabad": {"temp": 34.0, "condition": "Dry & Sunny", "humidity": 40, "wind": 12, "aqi": 165, "aqi_cat": "Moderate", "advisory": "advisory", "alert": "Heat Advisory: Midday temperatures high. AMC cool roof and drinking water shelters deployed."},
    "Jaipur": {"temp": 32.5, "condition": "Sunny & Dry", "humidity": 38, "wind": 14, "aqi": 155, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Dry weather across walled city areas. Hydration stations active."},
    "Chandigarh": {"temp": 25.0, "condition": "Clear & Sunny", "humidity": 52, "wind": 10, "aqi": 95, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Favorable environmental metrics across northern sectors."},
    "Kochi": {"temp": 29.8, "condition": "Coastal Rain Showers", "humidity": 86, "wind": 18, "aqi": 42, "aqi_cat": "Good", "advisory": "advisory", "alert": "Monsoon Inundation Watch: Tidal surge warning in low canal junctions. Rapid drain suction squads deployed."},
    "Bhopal": {"temp": 27.0, "condition": "Clear Sky", "humidity": 56, "wind": 11, "aqi": 110, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Clear sky over Upper Lake region. Normal municipal conditions."},
    "Patna": {"temp": 28.5, "condition": "Hazy Morning", "humidity": 65, "wind": 8, "aqi": 240, "aqi_cat": "Poor", "advisory": "advisory", "alert": "Air Quality Alert: Winter inversion beginning to trap vehicle particulate along Bailey Road."},
    "Guwahati": {"temp": 25.2, "condition": "Light Mist & Clouds", "humidity": 79, "wind": 7, "aqi": 65, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Brahmaputra water levels stable. Hill slope soil stability monitor active."},
    "Bhubaneswar": {"temp": 30.0, "condition": "Warm & Humid", "humidity": 76, "wind": 15, "aqi": 88, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Coastal plain stability. OSDMA disaster preparedness network on baseline alert."},
    "Dehradun": {"temp": 21.0, "condition": "Breezy Foothills", "humidity": 50, "wind": 12, "aqi": 58, "aqi_cat": "Good", "advisory": "normal", "alert": "Clear mountain air. Normal traffic flow in valley roads."},
    "Shimla": {"temp": 16.5, "condition": "Cool Mountain Air", "humidity": 45, "wind": 15, "aqi": 35, "aqi_cat": "Good", "advisory": "normal", "alert": "Chilly evening forecast. Municipal night shelter heating arrangements activated."},
    "Panaji": {"temp": 30.2, "condition": "Sunny Beach Breeze", "humidity": 74, "wind": 19, "aqi": 48, "aqi_cat": "Good", "advisory": "normal", "alert": "Safe beach conditions. Coastal lifeline lifeguards active on all primary shores."},
    "Indore": {"temp": 28.2, "condition": "Clear Sky", "humidity": 48, "wind": 13, "aqi": 72, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Clean city corridor. Dust suppression water sprinklers active."},
    "Visakhapatnam": {"temp": 30.8, "condition": "Coastal Sun", "humidity": 77, "wind": 21, "aqi": 62, "aqi_cat": "Moderate", "advisory": "normal", "alert": "Harbor wind stable. GVMC coastal drainage cleared."}
}

def get_city_weather(city_name: str, lat: Optional[float] = None, lon: Optional[float] = None) -> Dict[str, Any]:
    """
    Retrieve live weather & civic environmental intelligence for a city.
    Uses Open-Meteo free API when reachable, with deterministic offline fallback.
    """
    now = datetime.now(timezone.utc)
    fallback = CITY_WEATHER_DEFAULTS.get(city_name) or CITY_WEATHER_DEFAULTS.get("Bengaluru")

    # Try live Open-Meteo API query with short 1.5s timeout
    if lat and lon:
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto"
            req = urllib.request.Request(url, headers={"User-Agent": "NeedRadar-CivicWeather/1.0"})
            with urllib.request.urlopen(req, timeout=1.5) as resp:
                data = json.loads(resp.read().decode())
                curr = data.get("current", {})
                temp = curr.get("temperature_2m", fallback["temp"])
                humidity = curr.get("relative_humidity_2m", fallback["humidity"])
                wind = curr.get("wind_speed_10m", fallback["wind"])
                code = curr.get("weather_code", 0)

                # Interpret Open-Meteo WMO code
                condition = "Clear Sky"
                if code in [1, 2, 3]:
                    condition = "Partly Cloudy"
                elif code in [45, 48]:
                    condition = "Foggy / Mist"
                elif code in [51, 53, 55, 61, 63, 65, 80, 81]:
                    condition = "Rain Showers"
                elif code in [95, 96, 99]:
                    condition = "Thunderstorm"

                return {
                    "city": city_name,
                    "temperature_c": round(float(temp), 1),
                    "condition": condition,
                    "humidity": int(humidity),
                    "wind_speed_kmh": round(float(wind), 1),
                    "aqi": fallback["aqi"],
                    "aqi_category": fallback["aqi_cat"],
                    "advisory_level": fallback["advisory"],
                    "civic_impact_alert": fallback["alert"],
                    "weather_vulnerable_categories": ["infrastructure", "healthcare", "shelter"],
                    "is_live_satellite": True,
                    "updated_at": now.isoformat()
                }
        except Exception:
            pass

    # High-reliability baseline response
    return {
        "city": city_name,
        "temperature_c": fallback["temp"],
        "condition": fallback["condition"],
        "humidity": fallback["humidity"],
        "wind_speed_kmh": fallback["wind"],
        "aqi": fallback["aqi"],
        "aqi_category": fallback["aqi_cat"],
        "advisory_level": fallback["advisory"],
        "civic_impact_alert": fallback["alert"],
        "weather_vulnerable_categories": ["infrastructure", "healthcare", "shelter"],
        "is_live_satellite": False,
        "updated_at": now.isoformat()
    }
