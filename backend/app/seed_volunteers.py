from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal
from app.models.volunteer import VolunteerPledge, PledgeType, PledgeStatus
from app.models.need import Need, NeedCategory, NeedUrgency, NeedScope, NeedStatus
from app.models.user import User

SAMPLE_PLEDGES = [
    {
        "volunteer_name": "Aarav Sharma",
        "volunteer_email": "aarav.sharma@example.com",
        "volunteer_phone": "+91 98111 22334",
        "city": "Bengaluru",
        "pledge_type": PledgeType.SKILLED_MENTORSHIP,
        "hours_committed": 8,
        "pledge_description": "Conducting 2-hour weekend STEM & coding mentoring sessions for underprivileged kids.",
        "availability": "Saturdays & Sundays 3 PM - 6 PM",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Dr. Sunita Patel",
        "volunteer_email": "dr.sunita@medicare.org",
        "volunteer_phone": "+91 98222 33445",
        "city": "Ahmedabad",
        "pledge_type": PledgeType.TIME_HOURS,
        "hours_committed": 12,
        "pledge_description": "Volunteering pediatric checkup camps and distributing essential vitamins for infants.",
        "availability": "Tuesday & Thursday mornings",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Gurpreet Singh",
        "volunteer_email": "gurpreet.s@sewadal.org",
        "volunteer_phone": "+91 98333 44556",
        "city": "Amritsar",
        "pledge_type": PledgeType.SUPPLIES_KIT,
        "hours_committed": 6,
        "pledge_description": "Providing 25 dry ration and warm clothing kits for unhoused night-shift workers.",
        "availability": "Daily evenings 7 PM - 10 PM",
        "status": PledgeStatus.FULFILLED
    },
    {
        "volunteer_name": "Kavitha Ranganathan",
        "volunteer_email": "kavitha.r@chennaicivic.in",
        "volunteer_phone": "+91 98444 55667",
        "city": "Chennai",
        "pledge_type": PledgeType.EMERGENCY_TRANSPORT,
        "hours_committed": 10,
        "pledge_description": "Available with utility van for elderly citizen transit and emergency water deliveries.",
        "availability": "24/7 on call alert",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Tariq Ahmad",
        "volunteer_email": "tariq.ahmad@kashmiryouth.org",
        "volunteer_phone": "+91 98555 66778",
        "city": "Srinagar",
        "pledge_type": PledgeType.TIME_HOURS,
        "hours_committed": 15,
        "pledge_description": "Organizing youth snow-clearance brigade and safe walkways for school students around Lal Chowk.",
        "availability": "Early mornings 6 AM - 10 AM",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Meera Joshi",
        "volunteer_email": "meera.joshi@puneaction.org",
        "volunteer_phone": "+91 98666 77889",
        "city": "Pune",
        "pledge_type": PledgeType.BLOOD_DONATION,
        "hours_committed": 2,
        "pledge_description": "Registered O-negative universal blood donor standing by for critical emergencies.",
        "availability": "Immediate response on notification",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Vikramaditya Rao",
        "volunteer_email": "vikram.rao@hyderabadtech.org",
        "volunteer_phone": "+91 98777 88990",
        "city": "Hyderabad",
        "pledge_type": PledgeType.SKILLED_MENTORSHIP,
        "hours_committed": 5,
        "pledge_description": "Setting up refurbished computers and teaching basic digital literacy at government high school.",
        "availability": "Sunday afternoons",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Pooja Deshmukh",
        "volunteer_email": "pooja.d@nagpurseva.org",
        "volunteer_phone": "+91 98888 99001",
        "city": "Nagpur",
        "pledge_type": PledgeType.SUPPLIES_KIT,
        "hours_committed": 4,
        "pledge_description": "Donating 10 first-aid kits and safe hydration packs for civic sanitation workers.",
        "availability": "Weekends",
        "status": PledgeStatus.PENDING
    },
    {
        "volunteer_name": "Subhashish Mohanty",
        "volunteer_email": "subhashish@odisharelief.in",
        "volunteer_phone": "+91 98999 00112",
        "city": "Bhubaneswar",
        "pledge_type": PledgeType.TIME_HOURS,
        "hours_committed": 8,
        "pledge_description": "Leading community tree planting and desilting drainage culverts with neighborhood college volunteers.",
        "availability": "Sunday mornings",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Ananya Mukherjee",
        "volunteer_email": "ananya.m@kolkatacares.org",
        "volunteer_phone": "+91 99000 11223",
        "city": "Kolkata",
        "pledge_type": PledgeType.SKILLED_MENTORSHIP,
        "hours_committed": 6,
        "pledge_description": "Free spoken English and career counseling for vocational institute students.",
        "availability": "Saturdays 4 PM - 7 PM",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Dr. Rajeshwar Saxena",
        "volunteer_email": "rajeshwar.saxena@lucknowhealth.org",
        "volunteer_phone": "+91 99111 22334",
        "city": "Lucknow",
        "pledge_type": PledgeType.TIME_HOURS,
        "hours_committed": 10,
        "pledge_description": "Free geriatric consultations and prescription review for senior citizen housing society.",
        "availability": "Saturday mornings 9 AM - 1 PM",
        "status": PledgeStatus.ACCEPTED
    },
    {
        "volunteer_name": "Harleen Kaur",
        "volunteer_email": "harleen.k@ludhianacares.org",
        "volunteer_phone": "+91 99222 33445",
        "city": "Ludhiana",
        "pledge_type": PledgeType.SUPPLIES_KIT,
        "hours_committed": 4,
        "pledge_description": "Providing notebooks, geometry kits, and school uniforms for 30 elementary students.",
        "availability": "Fridays & Saturdays",
        "status": PledgeStatus.ACCEPTED
    }
]

def seed_volunteer_pledges(db=None):
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        existing_count = db.query(VolunteerPledge).count()
        if existing_count >= 10:
            print("Volunteer pledges already populated.")
            return

        now = datetime.now(timezone.utc)
        print("Seeding civic volunteer pledges and citizen impact ledger...")

        # Find some needs to attach to
        needs = db.query(Need).limit(15).all()
        need_index = 0

        for i, item in enumerate(SAMPLE_PLEDGES):
            target_need = needs[need_index % len(needs)] if needs else None
            need_index += 1

            pledge = VolunteerPledge(
                need_id=target_need.id if target_need else None,
                volunteer_name=item["volunteer_name"],
                volunteer_email=item["volunteer_email"],
                volunteer_phone=item["volunteer_phone"],
                city=item["city"],
                pledge_type=item["pledge_type"],
                hours_committed=item["hours_committed"],
                pledge_description=item["pledge_description"],
                availability=item["availability"],
                status=item["status"],
                created_at=now - timedelta(days=i * 2, hours=i * 3)
            )
            db.add(pledge)

        db.commit()
        print(f"Successfully seeded {len(SAMPLE_PLEDGES)} citizen volunteer pledges!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding volunteer pledges: {e}")
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed_volunteer_pledges()
