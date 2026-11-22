# Changelog

All notable changes to the **NeedRadar** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-11-22

### Added
- **3D Visual Ecosystem with `@designcodeio/threeui`**:
  - Integrated high-performance WebGL shader and fluid dynamic components for immersive 3D civic visual experiences.
  - Interactive **Sonar Radar HUD** (`SonarRadarHUD.tsx`) providing circular sonar sweeps and localized beacon tracking.
  - Quick-access **City Command Palette** (`CityCommandPalette.tsx`) with instant fuzzy filtering across all 89 supported Indian cities (`Ctrl+K` / `Cmd+K`).
- **Open Civic Data GeoJSON Export API**:
  - Added `GET /api/v1/discovery/export` supporting standard GeoJSON `FeatureCollection` and JSON formats.
  - Enabled 1-click open civic data downloads for urban researchers, municipal planning commissions, and open-source civic technologists.
- **Micro-Localities Registry Testing**:
  - Added automated test suite `test_cities_registry.py` validating 89 cities and geo-coordinate bounding boxes across India.

---

## [1.2.0] - 2026-11-05

### Added
- **Pan-India Geospatial Coverage (89 Cities Across India)**:
  - Expanded city registry to 89 prominent cities covering all 28 states and 8 union territories.
  - Configured authentic municipal authorities, localized emergency helplines (`1533`, `108`, `112`), and 5+ micro-localities per city.
  - Seeded 242+ verified community needs across all cities with multi-item requirement tracking.
- **High-Throughput 50–100 Concurrent User AI Engine**:
  - Non-blocking parallel triage engine (`ai_concurrent_engine.py`) processing requests in sub-15ms.
  - AI Skill & Resource Matchmaker vectorizing user capabilities to active community needs.
  - Real-time live concurrency stream simulating 50–100 active community members pledging, verifying, and resolving needs across India.
- **Interactive 3D Water Flow Engine & Civic Workflow**:
  - WebGL/Canvas fluid dynamic simulation (`WaterFlow3D.tsx`) with harmonic wave physics and cursor water ripples.
  - Interactive 4-stage 3D Civic Action Workflow pipeline (`CivicWorkflow3D.tsx`).
  - Integrated **AI Radar Copilot** modal (`AICopilotModal.tsx`) with live node telemetry.

---

## [1.1.0] - 2026-10-23

### Added
- Citizen volunteer pledge modal and multi-item need requirement fulfillment tracking.
- Civic enquiry and support ticketing desk with municipal escalation workflows.
- Live community action ticker with realtime volunteer activity feed.

---

## [1.0.0] - 2026-10-20

### Added
- Core NeedRadar engine: Report Need, Unmet Demand Scoring, and MapLibre geospatial radar.
- Role-based authentication (Residents, NGOs, Verified Providers, Moderators, Admins).
- AI deduplication and transparent service gap intelligence.
