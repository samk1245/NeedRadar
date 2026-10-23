import sys
import argparse
from datetime import datetime, timezone
from app.core.database import SessionLocal
from app.models.need import Need, NeedStatus
from app.models.organisation import Organisation, VerificationStatus
from app.models.user import User
from app.core.cities import CITIES_REGISTRY
from app.services.weather_service import get_city_weather

def print_header(title: str):
    print("\n" + "=" * 65)
    print(f">> NEEDRADAR CIVIC INTELLIGENCE - {title.upper()}")
    print("=" * 65)

def cmd_stats(args):
    db = SessionLocal()
    try:
        city = args.city
        print_header(f"PLATFORM METRICS [{city}]")
        
        needs_query = db.query(Need).filter(Need.city == city)
        total_needs = needs_query.count()
        unresolved = needs_query.filter(Need.status.notin_([NeedStatus.RESOLVED, NeedStatus.CLOSED, NeedStatus.REJECTED])).count()
        resolved = needs_query.filter(Need.status == NeedStatus.RESOLVED).count()
        
        verified_orgs = db.query(Organisation).filter(
            Organisation.city == city,
            Organisation.verification_status == VerificationStatus.VERIFIED
        ).count()
        
        print(f"  - Total Community Reports : {total_needs}")
        print(f"  - Active Unresolved Demand: {unresolved}")
        print(f"  - Verified Resolutions    : {resolved}")
        print(f"  - Verified NGOs & Partners: {verified_orgs}")
        
        rate = (resolved / total_needs * 100.0) if total_needs > 0 else 0.0
        print(f"  - Resolution Rate         : {rate:.1f}%\n")
        
        # Emerging Trends
        trends = detect_emerging_trends(db, city=city)
        if trends:
            print("  * TOP DEMAND VELOCITY AREAS:")
            for t in trends[:3]:
                print(f"     - [{t['trend_direction'].upper()}] {t['locality']} ({t['category'].capitalize()}): +{t['percent_change']}% change ({t['current_count']} reports)")
        print("=" * 65 + "\n")
    finally:
        db.close()

def cmd_summary(args):
    db = SessionLocal()
    try:
        print_header("NATIONAL MULTI-CITY SUMMARY")
        cities = list(CITIES_REGISTRY.keys())
        
        print(f"{'CITY':<15} | {'REPORTS':<9} | {'UNRESOLVED':<11} | {'RESOLVED':<9} | {'VERIFIED NGOS':<14}")
        print("-" * 65)
        for c in cities:
            tot = db.query(Need).filter(Need.city == c).count()
            unr = db.query(Need).filter(Need.city == c, Need.status.notin_([NeedStatus.RESOLVED, NeedStatus.CLOSED, NeedStatus.REJECTED])).count()
            res = db.query(Need).filter(Need.city == c, Need.status == NeedStatus.RESOLVED).count()
            orgs = db.query(Organisation).filter(Organisation.city == c, Organisation.verification_status == VerificationStatus.VERIFIED).count()
            print(f"{c:<15} | {tot:<9} | {unr:<11} | {res:<9} | {orgs:<14}")
        print("-" * 65 + "\n")
    finally:
        db.close()

def cmd_weather(args):
    city = args.city
    city_data = CITIES_REGISTRY.get(city) or CITIES_REGISTRY.get("Bengaluru")
    w = get_city_weather(city, lat=city_data.get("lat"), lon=city_data.get("lon"))
    
    print_header(f"CIVIC CLIMATE & AQI INTELLIGENCE [{city}]")
    print(f"  - Temperature   : {w['temperature_c']} deg C")
    print(f"  - Condition     : {w['condition']}")
    print(f"  - Air Quality   : AQI {w['aqi']} ({w['aqi_category']})")
    print(f"  - Humidity/Wind : {w['humidity']}% | {w['wind_speed_kmh']} km/h")
    print(f"  - Advisory Level: {w['advisory_level'].upper()}")
    print(f"  - Civic Alert   : {w['civic_impact_alert']}")
    print("=" * 65 + "\n")

def main():
    parser = argparse.ArgumentParser(description="NeedRadar Civic Intelligence Command Line Tool")
    subparsers = parser.add_subparsers(dest="command")

    p_stats = subparsers.add_parser("stats", help="Display civic scorecard for a city")
    p_stats.add_argument("--city", default="Bengaluru", help="Target city (default: Bengaluru)")

    p_weather = subparsers.add_parser("weather", help="Display civic weather & AQI intelligence for a city")
    p_weather.add_argument("--city", default="Delhi", help="Target city (default: Delhi)")

    p_summary = subparsers.add_parser("summary", help="Display multi-city national summary")

    args = parser.parse_args()
    if args.command == "stats":
        cmd_stats(args)
    elif args.command == "weather":
        cmd_weather(args)
    elif args.command == "summary":
        cmd_summary(args)
    else:
        cmd_summary(args)

if __name__ == "__main__":
    main()
