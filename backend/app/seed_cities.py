from datetime import timedelta
from app.models.organisation import Organisation, OrgType, VerificationStatus, ServiceOffering
from app.models.need import Need, NeedCategory, NeedUrgency, NeedScope, NeedStatus, NeedSupporter, NeedStatusHistory
from app.models.response import ProviderResponse, ResponseType, ResponseStatus

def seed_additional_cities_data(db, admin_user, resident_user, now):
    try:
        # Check if already fully expanded
        if db.query(Need).filter(Need.city == "Varanasi").count() > 0:
            return

        print("Seeding full 14-city national data (Mumbai, Hyderabad, Varanasi, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Chandigarh, etc.)...")

        # 1. Additional Organisations with Verified Contact Information
        additional_ngos = [
            Organisation(
                name="Awadh Seva Sansthan",
                description="Dedicated grassroots non-profit providing evening remedial tutoring, civic action, and citizen blood coordination across Lucknow.",
                org_type=OrgType.NGO,
                registration_number="NGO-UP-2019-01182",
                website_url="https://awadhseva.org.example",
                contact_email="contact@awadhseva.org.example",
                contact_phone="+91 522 223 9081",
                city="Lucknow",
                service_area="Hazratganj, Gomti Nagar, Aliganj, Chowk, Charbagh",
                operating_hours="Mon-Sat: 9am - 7pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=90),
                verification_notes="Verified with UP state charity registrar."
            ),
            Organisation(
                name="Sangam Relief & Educational Trust",
                description="Civic welfare foundation coordinating educational support, senior citizen health assistance, and clean drinking water access in Prayagraj.",
                org_type=OrgType.NGO,
                registration_number="NGO-UP-2021-09823",
                website_url="https://sangamrelief.org.example",
                contact_email="helpline@sangamrelief.org.example",
                contact_phone="+91 532 240 1199",
                city="Prayagraj",
                service_area="Civil Lines, Katra, Georgetown, Daraganj, Naini",
                operating_hours="24/7 Helpline",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=60),
                verification_notes="Verified via in-person center and registration documents."
            ),
            Organisation(
                name="Ganga Seva & Community Action Mission",
                description="Empowering industrial area workers, supporting student education, and coordinating urban infrastructure reporting in Kanpur.",
                org_type=OrgType.NGO,
                registration_number="NGO-UP-2018-05541",
                website_url="https://gangaseva.org.example",
                contact_email="action@gangaseva.org.example",
                contact_phone="+91 512 254 3320",
                city="Kanpur",
                service_area="Civil Lines, Swaroop Nagar, Kakadeo, Kidwai Nagar, Govind Nagar",
                operating_hours="Mon-Sat: 10am - 6pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=45),
                verification_notes="Verified via verified NGO Darpan registry."
            ),
            Organisation(
                name="Delhi Nagrik Sahayata Samiti",
                description="Metro-wide volunteer network responding to emergency hospital blood requests, night shelter supplies, and community accessibility.",
                org_type=OrgType.NGO,
                registration_number="NGO-DL-2020-03321",
                website_url="https://delhinagrik.org.example",
                contact_email="help@delhinagrik.org.example",
                contact_phone="+91 11 2341 5500",
                city="Delhi",
                service_area="Connaught Place, Lajpat Nagar, Rohini, Saket, Chandni Chowk, Dwarka",
                operating_hours="24/7 Rapid Response",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=120),
                verification_notes="Verified official red cross and AIIMS donor coordination partner."
            ),
            Organisation(
                name="Mumbai Civic Action & Care Alliance",
                description="Grassroots coalition coordinating medical emergencies, monsoon waterlogging relief, and educational supplies in Mumbai metropolitan wards.",
                org_type=OrgType.NGO,
                registration_number="NGO-MH-2017-08842",
                website_url="https://mumbaiciviccare.org.example",
                contact_email="support@mumbaiciviccare.org.example",
                contact_phone="+91 22 2430 8911",
                city="Mumbai",
                service_area="Bandra West, Andheri East, Dadar, Colaba, Powai, Kurla",
                operating_hours="24/7 Emergency Dispatch",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=100),
                verification_notes="Verified charity registration with Maharashtra Charity Commissioner."
            ),
            Organisation(
                name="Hyderabad Janahitha Foundation",
                description="Public health access, clean water projects, and vocational tutoring for underprivileged youth in Hyderabad and Secunderabad.",
                org_type=OrgType.NGO,
                registration_number="NGO-TG-2019-04129",
                website_url="https://janahitha-hyd.org.example",
                contact_email="contact@janahitha-hyd.org.example",
                contact_phone="+91 40 2339 6780",
                city="Hyderabad",
                service_area="Banjara Hills, Hitec City, Jubilee Hills, Gachibowli, Madhapur, Secunderabad",
                operating_hours="Mon-Sun: 8am - 8pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=80),
                verification_notes="Verified via Telangana Registrar of Societies."
            ),
            Organisation(
                name="Kashi Ganga Seva Samiti",
                description="Community welfare and heritage accessibility initiative supporting elderly pilgrims, ghat safety, and primary student tutoring in Varanasi.",
                org_type=OrgType.NGO,
                registration_number="NGO-UP-2016-02741",
                website_url="https://kashigangaseva.org.example",
                contact_email="help@kashigangaseva.org.example",
                contact_phone="+91 542 227 5400",
                city="Varanasi",
                service_area="Godowlia, Lanka / BHU, Sigra, Bhelupur, Cantonment, Sarnath",
                operating_hours="24/7 Pilgrim & Resident Helpline",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=70),
                verification_notes="Verified by Varanasi Municipal Corporation."
            ),
            Organisation(
                name="Chennai Makkal Sevai Maiyam",
                description="Disaster preparedness, community tutoring, and elder support network serving coastal and urban neighborhoods across Chennai.",
                org_type=OrgType.NGO,
                registration_number="NGO-TN-2015-09114",
                website_url="https://makkalsevai.org.example",
                contact_email="connect@makkalsevai.org.example",
                contact_phone="+91 44 2815 4200",
                city="Chennai",
                service_area="T. Nagar, Adyar, Mylapore, Velachery, Anna Nagar, Besant Nagar",
                operating_hours="Mon-Sat: 8:30am - 7:30pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=110),
                verification_notes="Verified via Tamil Nadu Societies Registration Act."
            ),
            Organisation(
                name="Kolkata Nagarik Mancha",
                description="Historic community welfare association providing affordable diagnostic health clinics, street lighting advocacy, and book banks in Kolkata.",
                org_type=OrgType.NGO,
                registration_number="NGO-WB-2014-06781",
                website_url="https://kolkatanagarik.org.example",
                contact_email="info@kolkatanagarik.org.example",
                contact_phone="+91 33 2227 8940",
                city="Kolkata",
                service_area="Park Street, Salt Lake, Ballygunge, New Town, Shyambazar, Gariahat",
                operating_hours="Mon-Sat: 9am - 6pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=130),
                verification_notes="Verified by West Bengal Social Welfare Board."
            ),
            Organisation(
                name="Pune Seva Sahayog Samiti",
                description="Educational development, youth vocational guidance, and slum rehabilitation support active in Pune municipal wards.",
                org_type=OrgType.NGO,
                registration_number="NGO-MH-2018-03419",
                website_url="https://punesevasahayog.org.example",
                contact_email="seva@punesevasahayog.org.example",
                contact_phone="+91 20 2544 1919",
                city="Pune",
                service_area="Kothrud, Viman Nagar, Hinjawadi, Shivajinagar, Baner, Kalyani Nagar",
                operating_hours="Mon-Sat: 9am - 7pm",
                verification_status=VerificationStatus.VERIFIED,
                verified_at=now - timedelta(days=95),
                verification_notes="Verified 80G and Darpan compliance."
            )
        ]

        # Only add organisations that don't already exist
        existing_org_names = {o.name for o in db.query(Organisation.name).all()}
        orgs_to_add = [o for o in additional_ngos if o.name not in existing_org_names]
        if orgs_to_add:
            db.add_all(orgs_to_add)
            db.flush()

        # Map organisations by city
        city_org_map = {}
        for org in db.query(Organisation).all():
            city_org_map[org.city] = org

        # 2. Multi-City Needs with Recent Timestamps (October 2026)
        multi_city_needs = [
            # MUMBAI
            {
                "city": "Mumbai",
                "locality": "Andheri East",
                "title": "Dialysis Transport & Medical Assistance for 6 Low-Income Patients",
                "desc": "Patients requiring bi-weekly hemodialysis at Cooper Hospital need volunteer vehicle coordination and subsidized consumables. Direct contact coordinator available on site.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 6,
                "lat": 19.1136,
                "lon": 72.8697,
                "score": 86.5,
                "supporters": 22,
                "status": NeedStatus.MATCHED,
                "hours_ago": 18
            },
            {
                "city": "Mumbai",
                "locality": "Dadar",
                "title": "Pedestrian Safety Railing and Footpath Repair near Flower Market",
                "desc": "Heavy morning commuter congestion with broken pavers causing frequent senior citizen falls. BMC ward office complaint submitted, citizen follow-up active.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 450,
                "lat": 19.0178,
                "lon": 72.8478,
                "score": 79.0,
                "supporters": 38,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 36
            },
            {
                "city": "Mumbai",
                "locality": "Bandra West",
                "title": "Emergency Nutrition Kits & Milk Powder for 15 Infants in Slum Cluster",
                "desc": "Temporary wage loss among daily laborers has resulted in nutritional shortfall for young children. Verified by local Anganwadi worker.",
                "cat": NeedCategory.SUPPLIES,
                "urgency": NeedUrgency.CRITICAL,
                "scope": NeedScope.COMMUNITY,
                "affected": 15,
                "lat": 19.0596,
                "lon": 72.8295,
                "score": 93.0,
                "supporters": 45,
                "status": NeedStatus.RESOLUTION_PROPOSED,
                "hours_ago": 6
            },

            # HYDERABAD
            {
                "city": "Hyderabad",
                "locality": "Hitec City",
                "title": "Digital Skills & Python Workshop for 30 Municipal School Students",
                "desc": "High school students from government school require weekend lab access, mentors, and refurbished laptops to prepare for state talent exams.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 30,
                "lat": 17.4435,
                "lon": 78.3772,
                "score": 84.0,
                "supporters": 27,
                "status": NeedStatus.MATCHED,
                "hours_ago": 24
            },
            {
                "city": "Hyderabad",
                "locality": "Secunderabad",
                "title": "Urgent A-Negative Blood Units for Pediatric Leukemia Patient",
                "desc": "Child admitted at Niloufer Hospital requires 2 units of A-Negative fresh blood platelets immediately. Family can be reached via verified coordinator.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.CRITICAL,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 1,
                "lat": 17.4399,
                "lon": 78.4983,
                "score": 98.0,
                "supporters": 52,
                "status": NeedStatus.ASSISTANCE_IN_PROGRESS,
                "hours_ago": 3
            },

            # VARANASI
            {
                "city": "Varanasi",
                "locality": "Godowlia",
                "title": "Wheelchair Accessibility Ramp & Tactile Guide Path to Ghat Approach",
                "desc": "Elderly and differently-abled pilgrims face steep broken stairs without handrails when navigating from Godowlia crossing toward Dashashwamedh Ghat.",
                "cat": NeedCategory.REPAIRS,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 320,
                "lat": 25.3092,
                "lon": 83.0068,
                "score": 88.5,
                "supporters": 41,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 12
            },
            {
                "city": "Varanasi",
                "locality": "Lanka / BHU",
                "title": "Free Evening Science & Mathematics Tuition for 25 Weaver Children",
                "desc": "Traditional handloom weaver families in surrounding lanes request volunteer student tutors from BHU for class 8-10 science and maths coaching.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 25,
                "lat": 25.2798,
                "lon": 82.9994,
                "score": 81.0,
                "supporters": 19,
                "status": NeedStatus.MATCHED,
                "hours_ago": 30
            },

            # CHENNAI
            {
                "city": "Chennai",
                "locality": "Velachery",
                "title": "Monsoon Desilting & Stormwater Inlet Clearing on Gandhi Road",
                "desc": "Heavy seasonal showers lead to recurring knee-deep inundation near bus stop. GCC grievance lodged, volunteer monitor team deployed.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 600,
                "lat": 12.9815,
                "lon": 80.2180,
                "score": 91.0,
                "supporters": 64,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 15
            },
            {
                "city": "Chennai",
                "locality": "Adyar",
                "title": "Hot Nutritious Lunch Delivery for 18 Bedridden Elderly Residents",
                "desc": "Senior citizens living alone in tenement blocks require daily noon meal support and regular BP/sugar vitals monitoring.",
                "cat": NeedCategory.SUPPLIES,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 18,
                "lat": 13.0012,
                "lon": 80.2565,
                "score": 77.0,
                "supporters": 25,
                "status": NeedStatus.MATCHED,
                "hours_ago": 40
            },

            # KOLKATA
            {
                "city": "Kolkata",
                "locality": "Salt Lake Sector V",
                "title": "Night Shelter Thermal Bedding & First-Aid Kits for 35 Transit Workers",
                "desc": "Construction labor camp near tech park requires thermal blankets and clean water purification tablets ahead of winter season.",
                "cat": NeedCategory.SHELTER,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 35,
                "lat": 22.5802,
                "lon": 88.4350,
                "score": 85.0,
                "supporters": 33,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 20
            },

            # PUNE
            {
                "city": "Pune",
                "locality": "Kothrud",
                "title": "Community Tool Library & Ramp Repair for Disabled Senior Residents",
                "desc": "Society pathway requires a reinforced steel ramp and handrails to allow wheelchair access to dispensary.",
                "cat": NeedCategory.REPAIRS,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 40,
                "lat": 18.5074,
                "lon": 73.8077,
                "score": 76.5,
                "supporters": 21,
                "status": NeedStatus.RESOLVED,
                "hours_ago": 72
            },

            # AHMEDABAD
            {
                "city": "Ahmedabad",
                "locality": "Navrangpura",
                "title": "Affordable Textbook Library & STEM Kits for 50 Slum Youth",
                "desc": "Community hall space allocated; seeking Gujarati and English high-school science books and geometry instruments.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 50,
                "lat": 23.0365,
                "lon": 72.5611,
                "score": 80.0,
                "supporters": 29,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 14
            },

            # JAIPUR
            {
                "city": "Jaipur",
                "locality": "Malviya Nagar",
                "title": "Potable Drinking Water Filter Repair for Community Dispensary",
                "desc": "Main RO filtration unit broken for two weeks, forcing 80+ daily outpatient visitors to purchase bottled water.",
                "cat": NeedCategory.REPAIRS,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 85,
                "lat": 26.8549,
                "lon": 75.8243,
                "score": 87.0,
                "supporters": 36,
                "status": NeedStatus.MATCHED,
                "hours_ago": 8
            },

            # CHANDIGARH
            {
                "city": "Chandigarh",
                "locality": "Sector 35 (Commercial)",
                "title": "Elder Care Volunteer Network & Mobility Escort Service",
                "desc": "Senior citizens living independently require weekly escorted transport to PGIMER hospital and grocery collection assistance.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 24,
                "lat": 30.7224,
                "lon": 76.7686,
                "score": 74.0,
                "supporters": 18,
                "status": NeedStatus.PUBLISHED,
                "hours_ago": 28
            }
        ]

        # Insert new needs
        for item in multi_city_needs:
            # Check if title exists
            if db.query(Need).filter(Need.title == item["title"]).count() > 0:
                continue

            created_at = now - timedelta(hours=item["hours_ago"])
            n = Need(
                title=item["title"],
                description=item["desc"],
                category=item["cat"],
                urgency=item["urgency"],
                scope=item["scope"],
                affected_count=item["affected"],
                city=item["city"],
                locality=item["locality"],
                latitude=item["lat"],
                longitude=item["lon"],
                is_location_approximate=False,
                status=item["status"],
                supporters_count=item["supporters"],
                unmet_demand_score=item["score"],
                is_demo=True,
                creator_id=resident_user.id,
                created_at=created_at,
                updated_at=created_at + timedelta(hours=2)
            )
            db.add(n)
            db.flush()

            # Add status history
            db.add(NeedStatusHistory(
                need_id=n.id,
                old_status=None,
                new_status=item["status"].value,
                actor_id=resident_user.id,
                note=f"Report recorded in {item['city']} community radar with verified geolocation",
                created_at=created_at
            ))

            # Add supporters
            db.add(NeedSupporter(need_id=n.id, user_id=resident_user.id, created_at=created_at + timedelta(minutes=30)))
            db.add(NeedSupporter(need_id=n.id, user_id=admin_user.id, created_at=created_at + timedelta(hours=1)))

            # If matched or resolution proposed, add provider response with verified contact details
            matched_org = city_org_map.get(item["city"])
            if matched_org and item["status"] in [NeedStatus.MATCHED, NeedStatus.ASSISTANCE_IN_PROGRESS, NeedStatus.RESOLUTION_PROPOSED, NeedStatus.RESOLVED]:
                resp = ProviderResponse(
                    need_id=n.id,
                    organisation_id=matched_org.id,
                    responder_id=admin_user.id,
                    response_type=ResponseType.PROPOSED_ASSISTANCE,
                    status=ResponseStatus.ACCEPTED,
                    message=f"Our team at {matched_org.name} has coordinated field volunteers and resources to resolve this need directly.",
                    proposed_assistance="On-ground deployment of verified field volunteers and required materials.",
                    estimated_timeline="Within 24 to 48 hours",
                    contact_instructions=f"Call helpline {matched_org.contact_phone} or email {matched_org.contact_email} citing NeedRadar Ref #{n.id[:8].upper()}.",
                    created_at=created_at + timedelta(hours=2)
                )
                db.add(resp)

        db.commit()
        print("Successfully seeded all 14 cities with recent October 2026 civic data and verified contacts!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding expanded cities: {e}")
