from datetime import timedelta
from app.models.organisation import Organisation, OrgType, VerificationStatus, ServiceOffering
from app.models.need import Need, NeedCategory, NeedUrgency, NeedScope, NeedStatus, NeedSupporter, NeedStatusHistory

def seed_additional_cities_data(db, admin_user, resident_user, now):
    try:
        # Check if already seeded Lucknow
        if db.query(Need).filter(Need.city == "Lucknow").count() > 0:
            return

        print("Seeding Lucknow, Prayagraj, Kanpur, and Delhi records...")

        # 1. Additional Organisations
        ngo_lucknow = Organisation(
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
        )

        ngo_prayagraj = Organisation(
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
        )

        ngo_kanpur = Organisation(
            name="Ganga Seva & Community Action Mission",
            description="Empowering industrial area workers, supporting student education, and coordinating urban infrastructure reporting in Kanpur.",
            org_type=OrgType.NGO,
            registration_number="NGO-UP-2018-05541",
            contact_email="action@gangaseva.org.example",
            city="Kanpur",
            service_area="Civil Lines, Swaroop Nagar, Kakadeo, Kidwai Nagar, Govind Nagar",
            operating_hours="Mon-Sat: 10am - 6pm",
            verification_status=VerificationStatus.VERIFIED,
            verified_at=now - timedelta(days=45),
            verification_notes="Verified via verified NGO Darpan registry."
        )

        ngo_delhi = Organisation(
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
        )

        db.add_all([ngo_lucknow, ngo_prayagraj, ngo_kanpur, ngo_delhi])
        db.flush()

        # Service offerings
        db.add(ServiceOffering(organisation_id=ngo_lucknow.id, category="education", subcategories="tutoring,books"))
        db.add(ServiceOffering(organisation_id=ngo_lucknow.id, category="healthcare", subcategories="blood_coordination"))
        db.add(ServiceOffering(organisation_id=ngo_prayagraj.id, category="education", subcategories="coaching,civil_services"))
        db.add(ServiceOffering(organisation_id=ngo_prayagraj.id, category="supplies", subcategories="water,meals"))
        db.add(ServiceOffering(organisation_id=ngo_kanpur.id, category="infrastructure", subcategories="potholes,drains"))
        db.add(ServiceOffering(organisation_id=ngo_kanpur.id, category="education", subcategories="remedial_classes"))
        db.add(ServiceOffering(organisation_id=ngo_delhi.id, category="healthcare", subcategories="blood_donation,aiims"))
        db.add(ServiceOffering(organisation_id=ngo_delhi.id, category="shelter", subcategories="blankets,night_shelter"))

        # 2. Multi-City Needs
        multi_city_needs = [
            # LUCKNOW
            {
                "city": "Lucknow",
                "locality": "Gomti Nagar",
                "title": "Weekend Science & English Foundation Classes for 20 Underprivileged Children",
                "desc": "Children from nearby daily wage settlements require foundational science and English tuition ahead of final exams. Study center space is available; volunteer educators needed.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 20,
                "lat": 26.8504,
                "lon": 81.0006,
                "score": 82.5,
                "supporters": 16,
                "status": NeedStatus.MATCHED,
                "days_ago": 12
            },
            {
                "city": "Lucknow",
                "locality": "Hazratganj",
                "title": "Urgent O-Positive Blood Donor Coordination for Trauma Center Patient",
                "desc": "Patient undergoing critical emergency surgery at KGMU Trauma Center requires 2 voluntary blood donors immediately. Official requisition signed by hospital authorities.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.CRITICAL,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 1,
                "lat": 26.8532,
                "lon": 80.9472,
                "score": 95.0,
                "supporters": 28,
                "status": NeedStatus.RESOLUTION_PROPOSED,
                "days_ago": 2
            },
            {
                "city": "Lucknow",
                "locality": "Charbagh",
                "title": "Severe Waterlogging and Blocked Storm Drain near Railway Colony",
                "desc": "Stagnant stormwater accumulating on primary access road causing vector mosquito breeding and restricting commuter foot traffic towards Charbagh station.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 180,
                "lat": 26.8289,
                "lon": 80.9231,
                "score": 75.0,
                "supporters": 21,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 6
            },
            {
                "city": "Lucknow",
                "locality": "Chowk",
                "title": "Winter Blankets and Night Shelter Necessities for 25 Homeless Elders",
                "desc": "Cold wave approaching requires insulated blankets and clean sleep mats for senior citizens accommodated around the municipal night shelter.",
                "cat": NeedCategory.SHELTER,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 25,
                "lat": 26.8665,
                "lon": 80.9056,
                "score": 87.0,
                "supporters": 19,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 4
            },

            # PRAYAGRAJ
            {
                "city": "Prayagraj",
                "locality": "Katra",
                "title": "Affordable Study Materials and Reading Space for 35 Rural Civil Services Aspirants",
                "desc": "Students from rural tehsils living in modest rented rooms require access to updated reference books, mock test sheets, and quiet group discussion desks.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 35,
                "lat": 25.4601,
                "lon": 81.8569,
                "score": 86.0,
                "supporters": 27,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 10
            },
            {
                "city": "Prayagraj",
                "locality": "Daraganj",
                "title": "Free Routine Health & Eye Checkup Camp for Senior Pilgrims",
                "desc": "Senior citizens residing near Sangam ghats require cataract screenings and general vitals monitoring. Doctor volunteers and basic eye drops needed.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.LOW,
                "scope": NeedScope.COMMUNITY,
                "affected": 70,
                "lat": 25.4326,
                "lon": 81.8789,
                "score": 74.0,
                "supporters": 18,
                "status": NeedStatus.MATCHED,
                "days_ago": 14
            },
            {
                "city": "Prayagraj",
                "locality": "Naini",
                "title": "Broken Public Handpump and Potable Water Filtration Needed",
                "desc": "The primary community handpump serving 40 households is rusted and drawing turbid water. Requires cylinder replacement and water quality test.",
                "cat": NeedCategory.SUPPLIES,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 160,
                "lat": 25.3854,
                "lon": 81.8742,
                "score": 88.0,
                "supporters": 33,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 5
            },
            {
                "city": "Prayagraj",
                "locality": "Civil Lines",
                "title": "Faulty Streetlights Creating Safety Hazard on Central Promenade",
                "desc": "A continuous stretch of 8 sodium lamps has been unlit for two weeks, creating blind zones for pedestrians and night cyclists near the railway overpass.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 200,
                "lat": 25.4526,
                "lon": 81.8344,
                "score": 69.0,
                "supporters": 15,
                "status": NeedStatus.RESOLVED,
                "days_ago": 22
            },

            # KANPUR
            {
                "city": "Kanpur",
                "locality": "Kakadeo",
                "title": "Free Remedial Coaching and Library Facility for 30 Polytech Students",
                "desc": "Technical diploma students needing mentorship in applied mechanics and mathematics. Seeking voluntary engineering tutors for 2 hours every evening.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 30,
                "lat": 26.4789,
                "lon": 80.2925,
                "score": 83.0,
                "supporters": 22,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 8
            },
            {
                "city": "Kanpur",
                "locality": "Swaroop Nagar",
                "title": "Emergency Dialysis Medication Support Assistance Coordination",
                "desc": "Elderly kidney patient with no immediate family members requires transport coordination and affordable dialysis medicine support at Regency Hospital.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 1,
                "lat": 26.4805,
                "lon": 80.3156,
                "score": 92.0,
                "supporters": 14,
                "status": NeedStatus.MATCHED,
                "days_ago": 3
            },
            {
                "city": "Kanpur",
                "locality": "Mall Road",
                "title": "Deep Pothole Crater on Mall Road Near Phoolbagh Crossing",
                "desc": "Multiple two-wheeler riders have suffered severe skids on an unbarricaded excavation left after telecom fiber cable laying work.",
                "cat": NeedCategory.INFRASTRUCTURE,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 400,
                "lat": 26.4678,
                "lon": 80.3541,
                "score": 85.0,
                "supporters": 42,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 7
            },
            {
                "city": "Kanpur",
                "locality": "Govind Nagar",
                "title": "Emergency Dry Ration Kits for 20 Families of Tannery Workers",
                "desc": "Families experiencing temporary shutdown of manufacturing units require monthly essentials of wheat flour, rice, mustard oil, and lentils.",
                "cat": NeedCategory.SUPPLIES,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 80,
                "lat": 26.4415,
                "lon": 80.3015,
                "score": 86.0,
                "supporters": 25,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 9
            },

            # DELHI
            {
                "city": "Delhi",
                "locality": "Saket",
                "title": "Urgent Blood Donation Coordination for Emergency Cardiac Surgery at AIIMS",
                "desc": "Patient admitted to AIIMS Trauma Centre requires 3 units of verified A-Positive blood. Hospital requisition form verified by on-duty medical registrar.",
                "cat": NeedCategory.HEALTHCARE,
                "urgency": NeedUrgency.CRITICAL,
                "scope": NeedScope.INDIVIDUAL,
                "affected": 1,
                "lat": 28.5244,
                "lon": 77.2167,
                "score": 96.0,
                "supporters": 38,
                "status": NeedStatus.RESOLUTION_PROPOSED,
                "days_ago": 2
            },
            {
                "city": "Delhi",
                "locality": "Rohini",
                "title": "Free Evening Literacy Classes for Children of Construction Workers",
                "desc": "Over 25 children living in temporary worker shanties near Sector 22 need basic Hindi and English numeracy books, notebooks, and pencils.",
                "cat": NeedCategory.EDUCATION,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 25,
                "lat": 28.7166,
                "lon": 77.1136,
                "score": 86.0,
                "supporters": 29,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 11
            },
            {
                "city": "Delhi",
                "locality": "Lajpat Nagar",
                "title": "Accessible Wheelchair Ramp Broken at Ward Community Dispensary",
                "desc": "Cracked masonry and missing handrail prevent disabled citizens from entering the public dispensary. Needs concrete repair and stainless steel railing.",
                "cat": NeedCategory.REPAIRS,
                "urgency": NeedUrgency.MEDIUM,
                "scope": NeedScope.COMMUNITY,
                "affected": 60,
                "lat": 28.5677,
                "lon": 77.2433,
                "score": 73.0,
                "supporters": 18,
                "status": NeedStatus.MATCHED,
                "days_ago": 15
            },
            {
                "city": "Delhi",
                "locality": "Chandni Chowk",
                "title": "Emergency Night Shelter Mattresses & Warm Food Distribution",
                "desc": "High winter footfall around historic markets requires emergency replenishment of 30 clean foam mattresses and hot evening nutritious meals.",
                "cat": NeedCategory.SHELTER,
                "urgency": NeedUrgency.HIGH,
                "scope": NeedScope.COMMUNITY,
                "affected": 30,
                "lat": 28.6562,
                "lon": 77.2300,
                "score": 91.0,
                "supporters": 35,
                "status": NeedStatus.PUBLISHED,
                "days_ago": 5
            }
        ]

        for item in multi_city_needs:
            created_at = now - timedelta(days=item["days_ago"])
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
                updated_at=created_at + timedelta(days=1)
            )
            db.add(n)
            db.flush()

            # Add status history
            db.add(NeedStatusHistory(
                need_id=n.id,
                old_status=None,
                new_status=item["status"].value,
                actor_id=resident_user.id,
                note=f"Report recorded in {item['city']} community radar",
                created_at=created_at
            ))

            # Add supporters
            db.add(NeedSupporter(need_id=n.id, user_id=resident_user.id, created_at=created_at + timedelta(hours=1)))
            db.add(NeedSupporter(need_id=n.id, user_id=admin_user.id, created_at=created_at + timedelta(hours=4)))

        db.commit()
        print("Successfully seeded Lucknow, Prayagraj, Kanpur, and Delhi!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding additional cities: {e}")
