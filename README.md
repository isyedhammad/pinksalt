# PinkSalt Intelligence & Investment Portal

> **A Strategic Digital Intelligence & Investor Facilitation Platform for Pakistan's Pink Salt Sector**  
> Developed as a Proposed Concept for the **Pakistan Mineral Investment Forum**  
> Authored by an **Assistant Director, Mines & Minerals Sector, Punjab, Pakistan**

---

## 1. Executive Summary

Pakistan possesses over **10 billion metric tonnes** of documented pink rock salt deposits across the ancient Eocambrian Salt Range formation in northern Punjab (stretching through Jhelum, Khushab, and Mianwali districts). Historically, significant volumes of raw salt were exported as unrefined bulk rock at depressed prices ($35–$50/tonne).

The **PinkSalt Intelligence & Investment Portal** demonstrates how digital technology, deterministic financial modeling, and grounded artificial intelligence can convert mineral resource data into bankable investment concepts, foster high-value domestic processing (yielding $300–$3,500/tonne), and streamline investor facilitation.

---

## 2. Key Modules & Functional Architecture

1. **Strategic Homepage & Value Chain Visualizer**:
   - Comprehensive overview of the 6-stage mineral value chain (Mining → Optical Sorting → Precision Milling → Retail Pouches → Gourmet Grinders → Pharmaceutical Refinement).
   - Sector benchmarks, verified statistics, and transparent disclaimers.

2. **Resource Intelligence**:
   - Interactive GIS SVG Map of the Punjab Salt Range belt (Khewra, Warcha, Kalabagh, Quaidabad Corridor, Chakwal).
   - Filterable geological inventory with documented reserves, NaCl purity levels (98%+), and concession statuses.

3. **Investment Opportunities Marketplace**:
   - Filterable catalog of 8 structured value-addition opportunities across food-grade packaging, gourmet grinders, wellness tiles, animal licks, and central sorting joint ventures.
   - Project specifications: land, machinery, utility loads, and indicative CAPEX.

4. **Value-Addition Explorer**:
   - Comparative business model economics demonstrating the margin expansion between raw bulk export and finished consumer goods.

5. **Investment Feasibility & Sensitivity Calculator**:
   - Fully interactive deterministic computational engine with 15 adjustable parameters.
   - Evaluates CAPEX, annual output, operating costs, EBITDA, operating margin, and break-even selling prices.
   - Dynamic 5-tier sensitivity matrix for price shifts, energy costs, and capacity utilization.
   - Instant 1-click scenario presets (Conservative, Base Case, Optimistic).
   - Downloadable structured preliminary feasibility outline.

6. **Processing Zone & Site Selector**:
   - Multi-criteria location evaluation engine comparing candidate sites in Punjab: Quaidabad (Khushab), Bhalwal Industrial Estate (Sargodha), Khewra Corridor (Jhelum), and M-3 Industrial City (Faisalabad SEZ).

7. **Export & Market Intelligence**:
   - Pakistan Single Window (PSW) 4-step compliance roadmap.
   - HS Code 2501 classifications, tariff structures, and international food safety standards (US FDA 21 CFR, EU 178/2002, Codex Alimentarius CXS 150-1985).

8. **Origin Integrity & Batch Traceability**:
   - Interactive batch verification simulator testing authentic origin against the Geographical Indications (Registration and Protection) Act 2020.
   - Real-time display of laboratory assay certificates (NaCl purity, heavy metals <0.01 ppm).

9. **Knowledge Centre**:
   - Searchable repository of official legislation, Punjab Mining Concession Rules 2022, export policy orders, and geological survey memoirs.

10. **Investor Enquiry & Project Proposal Workflow**:
    - Multi-step expression of interest registration form.
    - Server-side validation, database persistence, unique tracking identifier generation (`PSI-2026-XXXX`), and instant preliminary concept synthesis.

11. **PinkSalt AI Assistant**:
    - Grounded RAG assistant built on documented public records.
    - Answers factual questions with clickable citations.
    - Strict unverified safeguard: explicitly returns *"I cannot confirm this from the available verified sources"* when asked about speculative or unconfirmed claims.

12. **Administrative Back-Office Dashboard**:
    - Protected by PBKDF2-HMAC-SHA256 authenticated sessions.
    - Real-time aggregate analytics (total pipeline CAPEX, inquiries by stage, top origin countries).
    - Enquiry pipeline workflow (New → Qualified → Meeting Scheduled → Proposal Received → Referred → Closed).
    - Internal notes manager and immutable security audit log.

---

## 3. Technology Stack

- **Backend**: Python 3 standard library (`http.server`, `socketserver.ThreadingMixIn`, `sqlite3`, `hashlib`, `secrets`, `urllib`). Zero external package dependencies required for baseline execution.
- **Frontend**: Modern responsive Single Page Architecture (SPA) with custom CSS design system (Institutional Navy `#0B192C`, Warm White `#F8FAFC`, Rose `#E11D48`, Mineral Gold `#D97706`).
- **Database**: SQLite (`pinksalt.db`) with full relational schema, thread-safe access, and automatic domain seeders.
- **AI & RAG Engine**: Grounded keyword + semantic retrieval engine with optional Gemini API integration via `GEMINI_API_KEY`.
- **Testing**: Python `unittest` suite (`test_portal.py` and `test_handler.py`).

---

## 4. Local Installation & Running

### Prerequisites
- Python 3.8 or higher
- Git

### Quick Start
```bash
# 1. Clone or navigate to the project directory
cd pinksalt-portal

# 2. Run unit and integration tests
python3 test_portal.py
python3 test_handler.py

# 3. Start the production server
python3 server.py
```

The portal will be live at:
**`http://localhost:8080`**

### Default Administrator Credentials
- **Username**: `admin`
- **Password**: `PinkSalt@2026!`

*(Can be configured via `.env`)*

---

## 5. Deploying to Render.com

The repository includes both a **`render.yaml`** (Infrastructure as Code Blueprint) and a **`Dockerfile`** for seamless one-click cloud hosting on [Render](https://render.com).

### Option A: 1-Click Blueprint Deploy (Recommended)
1. Push your repository to GitHub (see Section 6).
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** → **Blueprint**.
4. Select your GitHub repository (`pinksalt-portal`).
5. Render will automatically detect `render.yaml` and configure:
   - Web Service: `pinksalt-intelligence-portal`
   - Runtime: `Python` (or `Docker`)
   - Health check: `/api/health`
   - Persistent Disk: 1 GB mounted for SQLite persistence
6. Click **Apply**. Your portal will be live on a custom `.onrender.com` URL in ~2 minutes!

### Option B: Manual Web Service Setup on Render
1. Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Set the following settings:
   - **Environment**: Python
   - **Build Command**: `python -m pip install -r requirements.txt || true`
   - **Start Command**: `python server.py`
   - **Health Check Path**: `/api/health`
4. In **Environment Variables**, set:
   - `PORT`: `10000` (or `8080`)
   - `PYTHONUNBUFFERED`: `1`
   - `GEMINI_API_KEY`: *(Optional: your Google Gemini API key)*
5. Click **Create Web Service**.

---

## 6. Pushing Code to GitHub

To push this codebase to your own GitHub account:

```bash
# 1. Initialize git (if not already initialized)
cd pinksalt-portal
git init

# 2. Add all files and commit
git add .
git commit -m "feat: complete PinkSalt Intelligence & Investment Portal for Pakistan Mineral Investment Forum"

# 3. Rename branch to main
git branch -M main

# 4. Add your GitHub repository remote
# Replace YOUR_USERNAME and YOUR_REPO with your actual details:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 5. Push to GitHub
git push -u origin main
```

---

## 7. Verification & Quality Assurance Report

The project includes an automated test suite executed during testing:

```
$ python3 test_portal.py
........
Ran 8 tests in 0.033s (OK)

$ python3 test_handler.py
.........
Ran 9 tests in 0.037s (OK)
```

### Verified Test Cases:
- **`test_01_database_tables_and_seeds`**: Verified all 7 SQLite tables and domain seeds.
- **`test_02_deterministic_financial_engine`**: Verified CAPEX calculations, finished yield production (5,175 MT), annual revenue ($1.81M), EBITDA margin (>30%), and break-even pricing.
- **`test_03_financial_edge_cases_safety`**: Verified zero-division immunity on 0 capacity or 0 price.
- **`test_04_ai_assistant_grounded_rag`**: Verified grounded answers on Khewra and Warcha resources with clickable citations.
- **`test_05_ai_assistant_unverified_safeguards`**: Verified trigger of *"I cannot confirm this from the available verified sources"* on speculative/unverified queries.
- **`test_06_ai_project_concept_generator`**: Verified structured concept generation across workflow, checklists, and risks.
- **`test_07_traceability_verification`**: Verified batch `PK-SALT-2026-KHW-001` lab credentials.
- **`test_08_enquiry_submission_and_tracking`**: Verified investor enquiry persistence, tracking ID generation, and admin status updates.
- **`test_handler.py (9 endpoints)`**: Verified `/api/health`, `/api/resources`, `/api/opportunities`, `/api/feasibility/calculate`, `/api/ai/chat`, `/api/enquiries`, `/api/admin/login`, `/api/admin/enquiries` (protected 401 & 200), and `/api/traceability/verify`.

---

## 8. Disclaimer & Institutional Status

This software application was designed as an independent strategic concept by an Assistant Director in the Punjab Mines & Minerals sector for demonstration and policy dialogue at the **Pakistan Mineral Investment Forum**. It does not constitute a formal government electronic concession application portal or a certified banking underwriting document.
