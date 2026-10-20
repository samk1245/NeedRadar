from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.organisation import Organisation, OrgType, VerificationStatus, OrganisationMember, ServiceOffering
from app.models.need import (
    Need, NeedCategory, NeedUrgency, NeedScope, NeedStatus,
    NeedSupporter, NeedStatusHistory
)
from app.models.response import ProviderResponse, ResponseType, ResponseStatus, ResolutionProposal, ResolutionStatus
from app.models.notification import Notification, NotificationType

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            return

        print("Seeding NeedRadar database with demonstration data...")
        now = datetime.now(timezone.utc)

        # 1. Users
        admin_user = User(
            email="admin@needradar.org",
            hashed_password=get_password_hash("AdminPass123!"),
            full_name="Radha Raman (Admin)",
            role=UserRole.ADMIN,
            city="Bengaluru",
            preferred_locality="Koramangala",
            is_active=True,
            is_verified=True
        )
        mod_user = User(
            email="mod@needradar.org",
            hashed_password=get_password_hash("ModPass123!"),
            full_name="Karthik Nair (Moderator)",
            role=UserRole.MODERATOR,
            city="Bengaluru",
            preferred_locality="Indiranagar",
            is_active=True,
            is_verified=True
        )
        resident_user = User(
            email="resident@needradar.org",
            hashed_password=get_password_hash("ResidentPass123!"),
            full_name="Pooja Sharma",
            role=UserRole.RESIDENT,
            city="Bengaluru",
            preferred_locality="HSR Layout",
            is_active=True,
            is_verified=True
        )
        resident_2 = User(
            email="vikram@needradar.org",
            hashed_password=get_password_hash("ResidentPass123!"),
            full_name="Vikram Rao",
            role=UserRole.RESIDENT,
            city="Bengaluru",
            preferred_locality="Whitefield",
            is_active=True,
            is_verified=True
        )
        provider_user = User(
            email="provider@needradar.org",
            hashed_password=get_password_hash("ProviderPass123!"),
            full_name="Anita Deshmukh",
            role=UserRole.NGO,
            city="Bengaluru",
            preferred_locality="Koramangala",
            is_active=True,
            is_verified=True
        )
        tech_provider_user = User(
            email="service@needradar.org",
            hashed_password=get_password_hash("ProviderPass123!"),
            full_name="Suresh Kumar",
            role=UserRole.PROVIDER,
            city="Bengaluru",
            preferred_locality="Jayanagar",
            is_active=True,
            is_verified=True
        )

        db.add_all([admin_user, mod_user, resident_user, resident_2, provider_user, tech_provider_user])
        db.flush()

        # 2. Organisations
        ngo_shiksha = Organisation(
            name="Vidya Samarth Trust",
            description="Dedicated to after-school coaching, digital literacy, and basic supplies for underprivileged municipal school children across Bengaluru.",
            org_type=OrgType.NGO,
            registration_number="NGO-KA-2018-00912",
            website_url="https://vidyasamarth.org.example",
            contact_email="contact@vidyasamarth.org.example",
            contact_phone="+91 80 2552 1100",
            city="Bengaluru",
            service_area="Koramangala, HSR Layout, BTM Layout, Ejipura",
            operating_hours="Mon-Sat: 10am - 6pm",
            capacity_description="20 volunteer teachers, 3 physical study centers",
            eligibility_criteria="Students enrolled in grades 4-10 in government/aided schools",
            verification_status=VerificationStatus.VERIFIED,
            verified_at=now - timedelta(days=60),
            verification_notes="Verified via NGO Darpan registration and in-person center check."
        )

        ngo_health = Organisation(
            name="Arogya Mitra Foundation",
            description="Grassroots healthcare assistance, regular medical health camps, and volunteer blood donation matching network.",
            org_type=OrgType.NGO,
            registration_number="NGO-KA-2020-04431",
            website_url="https://arogyamitra.org.example",
            contact_email="helpline@arogyamitra.org.example",
            contact_phone="+91 80 4112 8899",
            city="Bengaluru",
            service_area="Indiranagar, Ulsoor, Domlur, CV Raman Nagar",
            operating_hours="24/7 Helpline for emergency coordination",
            capacity_description="Network of 450 verified citizen donors, 4 partner clinics",
            verification_status=VerificationStatus.VERIFIED,
            verified_at=now - timedelta(days=45),
            verification_notes="Verified with state red cross society coordination."
        )

        pending_org = Organisation(
            name="Civic Green Hand Initiative",
            description="Local community volunteers tackling pothole reports and neighborhood storm water drainage issues.",
            org_type=OrgType.COMMUNITY_GROUP,
            registration_number="REG-PENDING-2026",
            website_url="https://civicgreenhand.org.example",
            contact_email="team@civicgreenhand.org.example",
            city="Bengaluru",
            service_area="Whitefield, Kadugodi, Hoodi",
            operating_hours="Weekends: 8am - 2pm",
            verification_status=VerificationStatus.PENDING,
            verification_notes="Awaiting submission of registration certificate copy."
        )

        db.add_all([ngo_shiksha, ngo_health, pending_org])
        db.flush()

        # Memberships
        db.add(OrganisationMember(organisation_id=ngo_shiksha.id, user_id=provider_user.id, role="admin"))
        db.add(OrganisationMember(organisation_id=pending_org.id, user_id=tech_provider_user.id, role="admin"))

        # Offerings
        db.add(ServiceOffering(organisation_id=ngo_shiksha.id, category="education", subcategories="tutoring,books,scholarship"))
        db.add(ServiceOffering(organisation_id=ngo_health.id, category="healthcare", subcategories="blood_coordination,health_camp"))

        # 3. Community Needs across Bengaluru
        # Coordinates:
        # Koramangala: 12.9352, 77.6245
        # HSR Layout: 12.9121, 77.6446
        # Indiranagar: 12.9784, 77.6408
        # Whitefield: 12.9698, 77.7500
        # Jayanagar: 12.9308, 77.5838
        # Malleshwaram: 13.0031, 77.5643

        needs_data = [
            {
                "title": "Affordable 10th Grade Math & Science Tutoring for 14 Students",
                "desc": "A cohort of 14 students from our neighbourhood municipal school require weekend remedial tutoring for board exams. Parents are daily wage earners unable to afford commercial coaching centers.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 14,
                "locality": "HSR Layout",
                "lat": 12.9121,
                "lon": 77.6446,
                "status": NeedStatus.MATCHED,
                "created_days_ago": 18,
                "supporters": 8,
                "score": 78.5,
                "creator": resident_user
            },
            {
                "title": "Need 2 Units of Rare B-Negative Blood for Cardiac Patient",
                "desc": "Emergency volunteer donor coordination needed for surgery scheduled at Victoria Hospital. Official hospital request letter available on verification.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.CRITICAL,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 1,
                "locality": "Koramangala",
                "lat": 12.9352,
                "lon": 77.6245,
                "status": NeedStatus.RESOLUTION_PROPOSED,
                "created_days_ago": 4,
                "supporters": 12,
                "score": 92.0,
                "creator": resident_2
            },
            {
                "title": "Severe Waterlogging and Broken Footpath near Metro Station Gate 2",
                "desc": "The pedestrian pathway is completely submerged after evening rains. Senior citizens and wheelchair users are forced onto oncoming vehicular traffic on Old Madras Road.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 120,
                "locality": "Indiranagar",
                "lat": 12.9784,
                "lon": 77.6408,
                "status": NeedStatus.PUBLISHED,
                "created_days_ago": 8,
                "supporters": 24,
                "score": 84.0,
                "creator": resident_user
            },
            {
                "title": "Essential Dry Ration Kits Needed for 8 Elderly Daily-Wage Workers",
                "desc": "Elderly domestic workers unable to find consistent employment in recent weeks need basic wheat flour, pulses, cooking oil and salt supplies.",
                "cat": NeedCategory.SUPPLIES,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 8,
                "locality": "Koramangala",
                "lat": 12.9340,
                "lon": 77.6210,
                "status": NeedStatus.PUBLISHED,
                "created_days_ago": 12,
                "supporters": 6,
                "score": 64.0,
                "creator": resident_2
            },
            {
                "title": "Emergency Temporary Shelter Assistance for Evicted Family",
                "desc": "Family with two young school-aged children requires transitional shelter guidance following sudden building structural condemnation.",
                "cat": NeedCategory.SHELTER,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 4,
                "locality": "Whitefield",
                "lat": 12.9698,
                "lon": 77.7500,
                "status": NeedStatus.PUBLISHED,
                "created_days_ago": 3,
                "supporters": 5,
                "score": 72.0,
                "is_sensitive": True,
                "creator": resident_user
            },
            {
                "title": "Wheelchair Ramp Repair and Handrail Installation at Community Park",
                "desc": "The concrete ramp leading to the central park is cracked and poses slip hazards. Needs masonry repair and secure stainless handrails.",
                "cat": NeedCategory.REPAIRS,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 45,
                "locality": "Jayanagar",
                "lat": 12.9308,
                "lon": 77.5838,
                "status": NeedStatus.RESOLVED,
                "created_days_ago": 26,
                "supporters": 19,
                "score": 35.0,
                "creator": resident_2
            },
            {
                "title": "Free Spoken English and Basic Computing Classes for Youth",
                "desc": "High school passouts seeking employment in local retail need foundational conversational English and basic computer operation skills.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.LOW,
                "scope": NeedScope.COMMUNITY,
                "affected": 25,
                "locality": "Malleshwaram",
                "lat": 13.0031,
                "lon": 77.5643,
                "status": NeedStatus.PUBLISHED,
                "created_days_ago": 7,
                "supporters": 9,
                "score": 58.0,
                "creator": resident_user
            },
            {
                "title": "Deep Pothole Cluster on 14th Main Road Causing Two-Wheeler Accidents",
                "desc": "Three large craters spanning across both lanes after water line work was completed last month. Multiple commuters have fallen during dark evenings.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 300,
                "locality": "HSR Layout",
                "lat": 12.9145,
                "lon": 77.6480,
                "status": NeedStatus.PUBLISHED,
                "created_days_ago": 5,
                "supporters": 38,
                "score": 89.0,
                "creator": resident_user
            }
        ]

        created_needs = []
        for d in needs_data:
            created_at = now - timedelta(days=d["created_days_ago"])
            need = Need(
                title=d["title"],
                description=d["desc"],
                category=d["cat"],
                urgency=d["urgency"],
                scope=d["scope"],
                affected_count=d["affected"],
                city="Bengaluru",
                locality=d["locality"],
                latitude=d["lat"],
                longitude=d["lon"],
                is_location_approximate=d.get("is_sensitive", False),
                approx_latitude=d["lat"] + 0.002 if d.get("is_sensitive", False) else d["lat"],
                approx_longitude=d["lon"] - 0.002 if d.get("is_sensitive", False) else d["lon"],
                is_sensitive=d.get("is_sensitive", False),
                status=d["status"],
                supporters_count=d["supporters"],
                unmet_demand_score=d["score"],
                is_demo=True,
                creator_id=d["creator"].id,
                created_at=created_at,
                updated_at=created_at + timedelta(days=1)
            )
            db.add(need)
            db.flush()

            # Status history
            db.add(NeedStatusHistory(
                need_id=need.id,
                old_status=None,
                new_status=NeedStatus.PUBLISHED.value,
                actor_id=d["creator"].id,
                note="Report submitted and published to community radar",
                created_at=created_at
            ))

            # Add sample supporters
            db.add(NeedSupporter(need_id=need.id, user_id=resident_user.id, created_at=created_at + timedelta(hours=2)))
            if d["creator"].id != resident_2.id:
                db.add(NeedSupporter(need_id=need.id, user_id=resident_2.id, created_at=created_at + timedelta(hours=5)))

            created_needs.append(need)

        # 4. Responses and Resolution Proposals
        # Response 1 to Need 0 (Tutoring)
        resp1 = ProviderResponse(
            need_id=created_needs[0].id,
            organisation_id=ngo_shiksha.id,
            responder_id=provider_user.id,
            response_type=ResponseType.PROPOSED_ASSISTANCE,
            status=ResponseStatus.SUBMITTED,
            message="Vidya Samarth Trust can conduct 2-hour coaching sessions every Saturday & Sunday morning at our HSR Sector 2 study center. Books and study notes will be provided free.",
            proposed_assistance="Weekend cohort for 15 students in Physics, Chemistry & Mathematics",
            eligibility_requirements="Grade 10 government or municipal school students",
            estimated_timeline="Starting this coming Saturday",
            contact_instructions="Visit our center on 19th Main HSR Layout or call center coordinator at +91 80 2552 1100.",
            created_at=now - timedelta(days=15)
        )
        db.add(resp1)

        # Response 2 to Need 1 (Blood)
        resp2 = ProviderResponse(
            need_id=created_needs[1].id,
            organisation_id=ngo_health.id,
            responder_id=provider_user.id,
            response_type=ResponseType.PROPOSED_ASSISTANCE,
            status=ResponseStatus.ACCEPTED,
            message="Arogya Mitra network contacted 3 verified B-Negative voluntary donors. Two donors have confirmed availability to donate at Victoria Hospital blood bank.",
            proposed_assistance="Coordination of 2 volunteer donors for direct hospital replacement",
            eligibility_requirements="Valid hospital requisition form",
            estimated_timeline="Completed within 6 hours",
            contact_instructions="Helpline coordinator dispatched to hospital blood bank.",
            created_at=now - timedelta(days=3)
        )
        db.add(resp2)
        db.flush()

        # Resolution Proposal for Need 1
        prop1 = ResolutionProposal(
            need_id=created_needs[1].id,
            response_id=resp2.id,
            organisation_id=ngo_health.id,
            proposer_id=provider_user.id,
            summary="Two units of verified B-Negative blood were collected and delivered to Victoria Hospital Blood Bank under Requisition #VH-88219. Patient surgery successfully performed.",
            evidence_notes="Receipt acknowledgement signed by Victoria Blood Bank Medical Officer on duty.",
            completion_date=now - timedelta(days=2),
            status=ResolutionStatus.PROPOSED,
            created_at=now - timedelta(days=2)
        )
        db.add(prop1)

        # 5. Notifications
        db.add(Notification(
            user_id=resident_user.id,
            title="Provider Response: Vidya Samarth Trust",
            message="Vidya Samarth Trust offered free weekend coaching for your reported tutoring request in HSR Layout.",
            notification_type=NotificationType.NEW_RESPONSE,
            link_url=f"/needs/{created_needs[0].id}",
            created_at=now - timedelta(days=15)
        ))

        db.commit()
        print("Successfully seeded NeedRadar database!")
        from app.seed_cities import seed_additional_cities_data
        seed_additional_cities_data(db, admin_user, resident_user, now)
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
