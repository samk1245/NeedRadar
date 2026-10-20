# NeedRadar 📡
### AI-Powered Unmet Needs Intelligence & Community Action Platform

NeedRadar discovers unmet community needs, identifies geographic demand patterns, connects residents with verified service providers and NGOs, and tracks whether reported needs are actually resolved through an audited verification workflow.

Initial deployment targets **Bengaluru, India** (BBMP wards: Koramangala, Indiranagar, HSR Layout, Whitefield, Jayanagar, Malleshwaram, etc.) with a multi-city extensible architecture.

---

## 🌟 Key Features

1. **Deterministic & AI-Powered Demand Intelligence**:
   - **Clustering Engine**: Groups localized community requests by proximity and category.
   - **Transparent Unmet-Demand Score**:
     $$\text{Score} = \min\Big(100, 15 + \min(30, S \times 5) + \min(20, \log_{10}(A) \times 10) + \min(15, T \times 0.75) + \min(15, (U-1) \times 3) - (25 \text{ if response})\Big)$$
     Where $S = \text{Supporters}$, $A = \text{Affected Count}$, $T = \text{Age in days}$, $U = \text{Similar unresolved reports}$.
   - **Emerging Trend Detection**: Identifies surging demand velocity by comparing a 14-day rolling window against prior 14-day baselines.
   - **Verifiable Service-Gap Insights**: Synthesizes factual, evidence-backed service gap statements (e.g. *"Education requests surged in HSR Layout with only 1 provider response"*) with actionable recommendations.
   - **Rule-Based Deterministic Fallback**: Provider-independent AI abstraction that operates offline without requiring paid API keys.

2. **9-Stage Need Lifecycle State Machine**:
   - Enforces transition constraints: `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `PUBLISHED` ➔ `MATCHED` ➔ `ASSISTANCE_IN_PROGRESS` ➔ `RESOLUTION_PROPOSED` ➔ `RESOLVED` / `CLOSED` / `REJECTED`.
   - Prevents providers from self-certifying completion without resident or moderator review.

3. **Geospatial Discovery Map (MapLibre GL & OSM)**:
   - High-performance vector/raster map with real-time category markers, filters (locality, category, status), and map/accessible-list toggle.
   - **Privacy Protection**: Automatic coordinate jittering (~300m) for sensitive personal requests (shelter, home healthcare) while preserving district analytics.

4. **Community Support & Momentum**:
   - Residents can support existing requests to increase community demand weight.
   - Strict database constraints prevent duplicate support from the same account.
   - Pre-submission duplicate candidate detection suggests existing nearby needs.

5. **Provider & NGO Verification Portal**:
   - Onboarding flow with verification stages (`PENDING` ➔ `UNDER_REVIEW` ➔ `VERIFIED` / `REJECTED`).
   - Matchmaking queue filtering needs by category and service territory.
   - Response dispatch with timeline estimates, eligibility criteria, and safe contact instructions.
   - Structured Resolution Proposals with completion notes and verification review.

6. **Administrative & Moderation Console**:
   - Moderation queue for user-flagged content (spam, privacy leaks, safety).
   - Duplicate candidate merge tool (transfers unique supporters and preserves audit trail).
   - Provider credential verification queue.
   - Immutable audit logs recording actor, role, action, and state change diffs.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v6, TanStack Query, Recharts, MapLibre GL JS with OpenStreetMap tiles.
- **Backend**: Python 3.13+, FastAPI, Pydantic v2, SQLAlchemy 2.0 (Dual SQLite/PostgreSQL support with Haversine spatial SQL), JWT authentication, Argon2/Bcrypt password hashing.
- **Testing**: Pytest & HTTPX (Backend), Vitest & React Testing Library (Frontend).
- **Deployment**: Docker, Docker Compose, Nginx reverse proxy.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 20+ & npm
- Python 3.13+

### 1. Backend Setup
```bash
# From repository root:
python -m venv .venv
.\.venv\Scripts\activate  # Windows (or source .venv/bin/activate on Linux/macOS)

cd backend
pip install -r requirements.txt

# Run migrations & seed realistic demonstration data (Bengaluru):
python -m app.seed

# Start the FastAPI server on port 8000:
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# In a separate terminal:
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Web application will be running at: `http://localhost:5173`

---

## 🧪 Running Automated Tests

### Backend Test Suite (Pytest)
```bash
cd backend
..\.venv\Scripts\pytest -v
```
All 12 test suites cover:
- Authentication, registration, and privilege escalation prevention
- Community need creation, support, and duplicate support prevention
- Pre-submission duplicate candidate detection
- 9-stage state machine transitions
- Demand intelligence scoring formula and deterministic AI classifier
- Provider registration and admin verification flow

### Frontend Test Suite (Vitest)
```bash
cd frontend
npm run test
```

### Production Build Verification
```bash
cd frontend
npm run build
```

---

## 🔑 Pre-Seeded Demonstration Accounts

For local demonstration and evaluation:

| Role | Email | Password | Locality |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@needradar.org` | `AdminPass123!` | Koramangala |
| **Moderator** | `mod@needradar.org` | `ModPass123!` | Indiranagar |
| **Verified NGO** | `provider@needradar.org` | `ProviderPass123!` | Koramangala (Vidya Trust) |
| **Resident** | `resident@needradar.org` | `ResidentPass123!` | HSR Layout (Pooja Sharma) |
| **Resident 2** | `vikram@needradar.org` | `ResidentPass123!` | Whitefield (Vikram Rao) |

*(Quick-fill buttons are also available on the `/login` page for single-click evaluation!)*

---

## 🐳 Docker Deployment

To launch the full production stack (PostgreSQL + PostGIS database, FastAPI backend, and Nginx-served React frontend):

```bash
docker-compose up --build -d
```

- Web Application: `http://localhost`
- API Endpoint: `http://localhost/api/v1`
- Health Check: `http://localhost:8000/health`
