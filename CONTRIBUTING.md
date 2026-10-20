# Contributing to NeedRadar 📡

Thank you for your interest in contributing to **NeedRadar**! This project builds open civic technology to discover unmet community needs and connect residents with verified grassroots NGOs.

---

## 🏛️ Code of Conduct
We are committed to providing a welcoming, harassment-free, and safe civic space. Please treat all contributors and community members with respect.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Python 3.13+**
- **Node.js 20+** & **npm**
- **Git**

### 2. Fork & Clone
```bash
git clone https://github.com/samk1245/NeedRadar.git
cd NeedRadar
```

### 3. Backend Setup
```bash
python -m venv .venv
# Activate virtual environment
source .venv/bin/activate  # macOS / Linux
.\.venv\Scripts\activate   # Windows

cd backend
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🧪 Testing Guidelines
All contributions must include automated test coverage before submitting a pull request:
- **Backend Tests**: Run `pytest -v` inside `/backend`.
- **Frontend Tests**: Run `npm test` inside `/frontend`.
- **Build Check**: Ensure `npm run build` succeeds without TypeScript errors.

---

## 🌿 Branch Naming & Commits
We follow conventional commit specifications:
- `feat: add WhatsApp community broadcast integration`
- `fix: correct PostGIS radius boundary calculation for Kanpur`
- `docs: update deployment guidelines for AWS ECS`
- `test: add unit tests for resolution proposal rejection`

---

## 🔒 Security & Privacy
NeedRadar strictly protects citizen privacy:
- Never commit private personal phone numbers or exact domestic coordinates.
- Sensitive individual needs (shelter, home health) must use approximate location obfuscation (~300m jitter).
