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

## 🏙️ Multi-City Deployment

NeedRadar features a dynamic multi-city architecture supporting live data and coordinates across India's largest metropolitan regions:

| City | Code | State | Coordinates | Landmark / Municipal Authority | Verified Partner NGO / Helpline |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bengaluru** | `BLR` | Karnataka | `12.9716° N, 77.5946° E` | Vidhana Soudha / BBMP | *Vidya Samarth Trust*, *Arogya Mitra* (080-22660000) |
| **Delhi (NCR)** | `DEL` | NCT of Delhi | `28.6139° N, 77.2090° E` | India Gate / MCD | *Delhi Nagrik Sahayata Samiti* (011-23415500) |
| **Mumbai** | `BOM` | Maharashtra | `19.0760° N, 72.8777° E` | Gateway of India / BMC | *Mumbai Civic Care Alliance* (022-24308911) |
| **Lucknow** | `LKO` | Uttar Pradesh | `26.8467° N, 80.9462° E` | Rumi Darwaza / LMC | *Awadh Seva Sansthan* (0522-2239081) |
| **Prayagraj** | `PRG` | Uttar Pradesh | `25.4358° N, 81.8463° E` | Triveni Sangam / PNN | *Sangam Relief & Educational Trust* (0532-2401199) |
| **Kanpur** | `KNP` | Uttar Pradesh | `26.4499° N, 80.3319° E` | JK Temple / KNN | *Ganga Seva & Community Action Mission* (0512-2543320) |
| **Varanasi** | `VNS` | Uttar Pradesh | `25.3176° N, 82.9739° E` | Kashi Vishwanath / VNN | *Kashi Ganga Seva Samiti* (0542-2275400) |
| **Hyderabad** | `HYD` | Telangana | `17.3850° N, 78.4867° E` | Charminar / GHMC | *Hyderabad Janahitha Foundation* (040-23396780) |
| **Chennai** | `MAA` | Tamil Nadu | `13.0827° N, 80.2707° E` | Marina Beach / GCC | *Chennai Makkal Sevai Maiyam* (044-28154200) |
| **Kolkata** | `CCU` | West Bengal | `22.5726° N, 88.3639° E` | Howrah Bridge / KMC | *Kolkata Nagarik Mancha* (033-22278940) |
| **Pune** | `PNQ` | Maharashtra | `18.5204° N, 73.8567° E` | Shaniwar Wada / PMC | *Pune Seva Sahayog Samiti* (020-25441919) |
| **Ahmedabad** | `AMD` | Gujarat | `23.0225° N, 72.5714° E` | Sabarmati Ashram / AMC | Municipal Control Room (155303) |
| **Jaipur** | `JAI` | Rajasthan | `26.9124° N, 75.7873° E` | Hawa Mahal / JMC | Municipal Control Room (0141-2742823) |
| **Chandigarh** | `IXC` | Punjab & Haryana | `30.7333° N, 76.7794° E` | Rock Garden / MCC | Municipal Control Room (0172-2787200) |

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
All 12 test suites pass with 100% success covering auth, RBAC permissions, duplicate detection, 9-stage state machine transitions, and demand formulas.

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
