<div align="center">

# 📡 NeedRadar
### AI-Powered Unmet Needs Intelligence & Community Action Platform

[![NeedRadar CI/CD Pipeline](https://github.com/samk1245/NeedRadar/actions/workflows/ci.yml/badge.svg)](https://github.com/samk1245/NeedRadar/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.13+](https://img.shields.io/badge/Python-3.13+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI: 0.115+](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React: 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript: 5+](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS: 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-Raster_%26_OSM-blue?logo=maplibre&logoColor=white)](https://maplibre.org)

<p align="center">
  <strong>Discovering unmet community needs, identifying spatial demand patterns, connecting residents with verified NGOs, and tracking verified resolutions.</strong>
</p>

[Explore Cities](#-multi-city-deployment) •
[System Architecture](#-system-architecture) •
[Demand Scoring Formula](#-transparent-unmet-demand-scoring) •
[CLI Utility](#-terminal-cli-utility) •
[Quickstart](#-quick-start-local-development) •
[API Docs](#-api-collection--documentation)

</div>

---

## 🌟 What Problem Does NeedRadar Solve?

In most cities, community requests (remedial tutoring, emergency blood coordination, pothole clusters, displaced family shelters) are scattered across WhatsApp groups, social media threads, and municipal complaints.

NeedRadar answers five critical civic questions with verified real-world data:
1. **What do people in a community currently need?**
2. **Where are those needs going unmet?**
3. **Which needs are surging or recurring?**
4. **Which verified NGOs or service providers can help?**
5. **Are reported needs actually resolved?**

---

## 🏙️ Multi-City Deployment (42 Major Indian Cities)

NeedRadar features a dynamic multi-city geospatial architecture supporting live data, coordinates, landmarks, and municipal helplines across **42 major cities spanning 28 states & union territories**:

| Region | Featured Cities Covered | State / UT | Municipal Authority & Helplines |
| :--- | :--- | :--- | :--- |
| **North** | **Delhi (NCR)**, **Lucknow**, **Prayagraj**, **Kanpur**, **Varanasi**, **Agra**, **Amritsar**, **Ludhiana**, **Chandigarh**, **Jaipur**, **Jodhpur**, **Udaipur**, **Dehradun**, **Shimla**, **Srinagar** | DL, UP, PB, CH, RJ, UK, HP, JK | MCD (011-23415500), LMC (1533), PNN (0532-2401199), ANN, MCA, JNN |
| **South** | **Bengaluru**, **Chennai**, **Hyderabad**, **Kochi**, **Thiruvananthapuram**, **Visakhapatnam**, **Vijayawada**, **Madurai**, **Coimbatore** | KA, TN, TG, KL, AP | BBMP (080-22660000), GCC (1913), GHMC (040-21111111), KMC, GVMC |
| **West** | **Mumbai**, **Pune**, **Nagpur**, **Nashik**, **Ahmedabad**, **Surat**, **Vadodara**, **Panaji** | MH, GJ, GA | BMC (022-24308911), PMC (020-25441919), NMC, SMC, AMC, CCP |
| **East & Central** | **Kolkata**, **Bhubaneswar**, **Cuttack**, **Patna**, **Ranchi**, **Jamshedpur**, **Bhopal**, **Indore**, **Gwalior**, **Guwahati** | WB, OD, BR, JH, MP, AS | KMC (033-22278940), BMC (1800 345 0061), PMC, RMC, JNAC, GMC |

Every city profile includes:
- Exact coordinates & geospatial bounding box
- Prominent landmarks & heritage centers
- Municipal corporations & verified disaster/civic emergency contacts (112, 108, 1533)
- Micro-localities with localized community needs and active NGO partners

---

## 🤝 Civic Volunteer & Citizen Resource Pledge Radar (VolunteerRadar)

Rather than just passively observing community issues, NeedRadar empowers residents, professionals, doctors, students, and local businesses to step up and directly pledge aid:

- ⏱️ **Volunteer Hours**: Commit weekly hours to on-ground community projects (rebuilding classrooms, desilting canals, elder check-ins).
- 📦 **Supplies & Ration Kits**: Donate dry rations, hygiene packs, emergency blankets, and first-aid kits.
- 🩸 **Blood Donation Standby**: Register verified blood groups for on-call emergency hospital and clinic requirements.
- 🎓 **Skilled Tutoring & Mentorship**: Offer pro-bono STEM education, coding workshops, language training, or vocational skills.
- 🚐 **Emergency Transit**: Volunteer four-wheelers or utility vans for elderly patient mobility or supply transport.
- 📈 **Real-Time Public Ledger**: Transparent impact ticker updating live across all 42 cities with zero delay.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend — React 18 + Vite + TypeScript + Tailwind"]
        Landing["Landing Page & Live Radar"]
        Discovery["Discovery Map & List (MapLibre GL + OSM)"]
        Report["4-Step Need Reporting Wizard"]
        Detail["Need Detail, Community Support & Duplicates"]
        Portal["Provider & NGO Verification Portal"]
        Dashboard["Resident Dashboard"]
        Admin["Moderation & Administrative Console"]
        Analytics["Demand Intelligence Hub (Recharts)"]
    end

    subgraph Backend ["Backend — FastAPI + SQLAlchemy 2.0 + Pydantic v2"]
        Gateway["REST API Gateway (/api/v1)"]
        AuthSvc["Auth Service (Argon2 / Bcrypt, RBAC)"]
        NeedSvc["Needs & 9-Stage State Machine"]
        GeoSvc["Geospatial Engine (Dual PostGIS & Haversine SQL)"]
        AISvc["Demand Intelligence & Offline AI Classifier"]
        ModSvc["Moderation & Audit Logger"]
    end

    subgraph Storage ["Storage & External Infrastructure"]
        DB[(PostgreSQL / SQLite Dual Engine)]
        Files[(Local / S3 Media Storage)]
        Tiles["OpenStreetMap Raster/Vector Tiles"]
    end

    Frontend -->|HTTP / JSON| Gateway
    Gateway --> AuthSvc
    Gateway --> NeedSvc
    Gateway --> GeoSvc
    Gateway --> AISvc
    Gateway --> ModSvc
    NeedSvc --> DB
    GeoSvc --> DB
    AISvc --> DB
    Discovery --> Tiles
```

---

## 📊 Transparent Unmet-Demand Scoring

NeedRadar never fabricates metrics or relies on arbitrary black-box AI scores. Every score is deterministically computed from database records:

$$\text{Score} = \min\Big(100.0, 15.0 + \min(30, S \times 5) + \min(20, \log_{10}(A) \times 10) + \min(15, T \times 0.75) + \min(15, (U-1) \times 3) - (25 \text{ if response})\Big)$$

Where:
- $S$ = Number of verified distinct community supporters
- $A$ = Number of individuals impacted ($\ge 1$)
- $T$ = Age of unresolved report in days
- $U$ = Count of unresolved similar reports in the same ward
- Response deduction: $-25.0$ if a verified NGO has submitted active assistance

---

## 💻 Terminal CLI Utility

NeedRadar includes an interactive CLI utility for civic data operators and terminal workflows:

```bash
# Multi-city national demand scorecard
python -m app.cli summary

# Locality-by-locality deep dive for Lucknow
python -m app.cli stats --city Lucknow

# Locality-by-locality deep dive for Prayagraj
python -m app.cli stats --city Prayagraj
```

Sample CLI Output:
```text
=================================================================
>> NEEDRADAR CIVIC INTELLIGENCE - NATIONAL MULTI-CITY SUMMARY
=================================================================
CITY            | REPORTS   | UNRESOLVED  | RESOLVED  | VERIFIED NGOS 
-----------------------------------------------------------------
Bengaluru       | 8         | 7           | 1         | 2             
Lucknow         | 4         | 4           | 0         | 1             
Prayagraj       | 4         | 3           | 1         | 1             
Kanpur          | 4         | 4           | 0         | 1             
Delhi           | 4         | 4           | 0         | 1             
-----------------------------------------------------------------
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/samk1245/NeedRadar.git
cd NeedRadar

# Create Python virtual environment
python -m venv .venv
.\.venv\Scripts\activate   # Windows
source .venv/bin/activate    # Linux / macOS

# Install dependencies
cd backend
pip install -r requirements.txt

# Run migrations & seed multi-city records
python -m app.seed

# Start the API server
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`
- Health Probe: `http://localhost:8000/health`

### 2. Frontend Setup
```bash
# In a separate terminal:
cd frontend
npm install --legacy-peer-deps
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Automated Testing

### Backend Test Suite (Pytest)
```bash
cd backend
pytest -v
```
All 18 backend test suites and frontend unit tests pass with 100% success covering auth, RBAC permissions, duplicate detection, 9-stage state machine transitions, citizen volunteer pledges & impact ledger, and demand formulas.

### Frontend Test Suite (Vitest)
```bash
cd frontend
npm test
```

### Production Build Verification
```bash
cd frontend
npm run build
```

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Resident** | `resident@needradar.org` | `ResidentPass123!` | Report needs, support community requests, view dashboard |
| **Verified NGO** | `provider@needradar.org` | `ProviderPass123!` | Matching opportunities, submit offers, propose resolutions |
| **Moderator** | `mod@needradar.org` | `ModPass123!` | Review abuse flags, verify providers, merge duplicates |
| **Administrator** | `admin@needradar.org` | `AdminPass123!` | Full platform audit ledger, privileged logs, and city configs |

*(Quick-fill buttons are also available on the `/login` page for one-click evaluation!)*

---

## 🐳 Docker Deployment

To launch the full production stack (PostgreSQL + PostGIS database, FastAPI backend, and Nginx-served React frontend):

```bash
docker-compose up --build -d
```

- Web App: `http://localhost`
- API Gateway: `http://localhost/api/v1`

---

## 📄 API Collection & Documentation

A ready-to-import Postman / Insomnia API collection is available in [`docs/needradar_api_collection.json`](docs/needradar_api_collection.json) covering:
- Authentication & JWT Bearer token lifecycle
- Geospatial Map and Demand Cluster retrieval
- Pre-submission Duplicate Candidate checks
- Verified NGO assistance responses & resolution proposals
- Demand intelligence overview and verifiable service-gap generation

---

## 🤝 Contributing & Security

- Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).
- To report security vulnerabilities or privacy concerns, review [SECURITY.md](SECURITY.md).
- License: [MIT](LICENSE) © 2026 samk1245.
