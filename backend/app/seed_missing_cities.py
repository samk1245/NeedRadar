import random
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal
from app.core.cities import CITIES_REGISTRY
from app.models.need import Need, NeedCategory, NeedUrgency, NeedScope, NeedStatus
from app.models.user import User, UserRole
from app.models.organisation import Organisation, OrgType, VerificationStatus
from app.models.response import ProviderResponse, ResponseType, ResponseStatus
from app.seed_volunteers import seed_volunteer_pledges

CITY_NEED_TEMPLATES = [
    {
        "category": NeedCategory.HEALTHCARE,
        "title_fmt": "Mobile Health Screening & First-Aid Desk at {locality}",
        "desc_fmt": "Local residents and sanitation workers in {locality}, {city} need a weekly mobile clinic providing preventative health screenings, BP/blood sugar checks, and first-aid kits.",
        "urgency": NeedUrgency.HIGH,
        "scope": NeedScope.COMMUNITY,
        "timeframe": "Within 1 week"
    },
    {
        "category": NeedCategory.EDUCATION,
        "title_fmt": "Evening Remedial Tutoring & STEM Kits for Students in {locality}",
        "desc_fmt": "Over 45 children from daily wage families in {locality}, {city} require weekend mathematics and science mentors along with basic stationery kits.",
        "urgency": NeedUrgency.MEDIUM,
        "scope": NeedScope.COMMUNITY,
        "timeframe": "Within 2 weeks"
    },
    {
        "category": NeedCategory.INFRASTRUCTURE,
        "title_fmt": "Pedestrian Safety Crosswalk & Solar Street Lighting at {locality}",
        "desc_fmt": "High-traffic intersection near community school in {locality}, {city} lacks functional illumination and pedestrian crossing signs, creating night safety hazards.",
        "urgency": NeedUrgency.CRITICAL,
        "scope": NeedScope.COMMUNITY,
        "timeframe": "Urgent attention required"
    },
    {
        "category": NeedCategory.SUPPLIES,
        "title_fmt": "Clean Water Filtration & Relief Hydration Booth in {locality}",
        "desc_fmt": "Neighborhood public transit terminus at {locality}, {city} needs community-managed drinking water dispensing points and reusable containers for transit workers.",
        "urgency": NeedUrgency.MEDIUM,
        "scope": NeedScope.COMMUNITY,
        "timeframe": "Immediate"
    }
]

def seed_missing_cities():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not admin:
            print("Admin user not found. Run main seed first.")
            return

        now = datetime.now(timezone.utc)
        cities_with_needs = set([c[0] for c in db.query(Need.city).distinct()])
        missing = [c for c in CITIES_REGISTRY if c not in cities_with_needs]

        print(f"Found {len(missing)} cities without civic records. Seeding data for: {missing}")

        for city_name in missing:
            city_meta = CITIES_REGISTRY.get(city_name)
            if not city_meta:
                continue

            localities = city_meta.get("localities", [])
            if not localities:
                continue

            # 1. Create a verified NGO for this city
            org = Organisation(
                name=f"{city_name} Civic Care & Citizen Relief Foundation",
                description=f"Grassroots NGO operating verified community volunteer dispatch, educational mentorship, and civic response across {city_name}.",
                org_type=OrgType.NGO,
                registration_number=f"NGO-{city_meta.get('code', 'CIV')}-2022-{random.randint(1000, 9999)}",
                website_url=f"https://{city_name.lower().replace(' ', '')}care.org.example",
                contact_email=f"contact@{city_name.lower().replace(' ', '')}care.org.example",
                contact_phone=f"+91 {random.randint(700, 999)} {random.randint(100, 999)} {random.randint(1000, 9999)}",
                city=city_name,
                service_area=", ".join([l["name"] for l in localities[:3]]),
                operating_hours="Mon-Sat: 8:30 AM - 6:30 PM",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=random.randint(30, 120)),
                verification_notes="Verified by state charity commissioner directory."
            )
            db.add(org)
            db.flush()

            # 2. Create 2-3 localized needs
            templates_to_use = random.sample(CITY_NEED_TEMPLATES, k=min(3, len(CITY_NEED_TEMPLATES)))
            for idx, tmpl in enumerate(templates_to_use):
                loc = localities[idx % len(localities)]
                title = tmpl["title_fmt"].format(locality=loc["name"], city=city_name)
                desc = tmpl["desc_fmt"].format(locality=loc["name"], city=city_name)
                
                status_choice = random.choice([
                    NeedStatus.PUBLISHED,
                    NeedStatus.MATCHED,
                    NeedStatus.RESOLUTION_PROPOSED,
                    NeedStatus.RESOLVED
                ])

                need = Need(
                    title=title,
                    description=desc,
                    category=tmpl["category"],
                    subcategory="Community Welfare",
                    urgency=tmpl["urgency"],
                    scope=tmpl["scope"],
                    affected_count=random.randint(25, 300),
                    desired_timeframe=tmpl["timeframe"],
                    city=city_name,
                    locality=loc["name"],
                    latitude=loc["lat"],
                    longitude=loc["lon"],
                    status=status_choice,
                    supporters_count=random.randint(3, 42),
                    unmet_demand_score=round(random.uniform(15.0, 85.0), 1),
                    creator_id=admin.id,
                    created_at=now - timedelta(days=random.randint(2, 25), hours=random.randint(1, 12))
                )
                db.add(need)
                db.flush()

                # If matched or resolved, attach provider response
                if status_choice in [NeedStatus.MATCHED, NeedStatus.RESOLUTION_PROPOSED, NeedStatus.RESOLVED]:
                    resp = ProviderResponse(
                        need_id=need.id,
                        organisation_id=org.id,
                        responder_id=admin.id,
                        response_type=ResponseType.PROPOSED_ASSISTANCE,
                        status=ResponseStatus.ACCEPTED,
                        message=f"Our volunteer network at {org.name} has coordinated field volunteers and materials to assist with this community need.",
                        proposed_assistance="Dispatching volunteers, tools, and direct field coordination.",
                        estimated_timeline="Within 48 hours",
                        contact_instructions=f"Contact desk coordinator at {org.contact_phone} or {org.contact_email} referencing need ID #{need.id[:8].upper()}.",
                        created_at=need.created_at + timedelta(hours=3)
                    )
                    db.add(resp)

        db.commit()
        print("Successfully seeded all missing cities with verified NGOs, localized needs, and provider responses!")

        # 3. Seed volunteer pledges
        seed_volunteer_pledges(db)

    except Exception as e:
        db.rollback()
        print(f"Error during missing cities seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_missing_cities()
