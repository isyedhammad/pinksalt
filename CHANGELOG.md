# Refactoring Changelog: Pink Salt Intelligence & Investment Portal

**Directorate General of Mines & Minerals, Government of Punjab**  
**Presentation Target:** Secretary, Mines & Minerals Department — Pakistan Mineral Investment Forum  
**Refactoring Date:** November 2026  
**Auditor / Engineer:** Senior Front-End Engineer, UX Designer & Content Editor  

---

## 1. Executive Summary & Policy Compliance

This refactoring reorganizes the portal into an institutional, facilitative, and authoritative digital platform. Every legacy vendor-style artifact, unauthenticated admin bypass, speculative marketing slogan, and ungrounded commercial claim has been purged. 

In accordance with departmental instructions:
- **Zero Loss of Technical Data:** Every legitimate geological metric, reserve estimate, industrial machinery spec, purity grade, chemical threshold (Codex CXS 150 / US FDA), destination regulation, and HS code has been preserved and unified into `js/data.js`.
- **Institutional Facilitation Voice:** All language reflects the Directorate General's role as an enabler and industrial regulator ("The Directorate facilitates..."), eliminating sales copy ("We map your factory", "Advise, then build").
- **Clear Governance Separation:** Loan underwriting is clearly separated from departmental facilitation. The portal explicitly clarifies that financing under the **Chief Minister Pink Salt Value Addition Financing Scheme** is underwritten independently by The Bank of Punjab (BOP) per its own credit policy.

---

## 2. Structural & Architectural Transformations

| Legacy Architecture | Refactored Architecture | Rationale & Data Preservation |
| :--- | :--- | :--- |
| **Triple Navigation Bars:** Top announcement banner, main bar, sub-nav pill bar, and back-office link. | **Single Clean Sticky Header:** Neutral institutional masthead, 8 anchored section links, and live PKR/USD currency toggle. | Simplifies navigation from cluttered e-commerce UX to institutional clarity. |
| **Scattered Hard-Coded Figures:** Tonnage, prices, and CAPEX duplicated across HTML strings and script literals. | **Single Source of Truth (`js/data.js`):** Unified reactive JSON data architecture. | Prevents contradictory data; allows single-point updates across all tables, cards, and calculators. |
| **16 Cluttered DOM Sections:** Overlapping cards, uncalibrated base-case preview, and repeated widgets. | **8 Strategic Anchored Sections:** Exact strategic flow requested for the Ministerial Forum. | Creates one cohesive investment story from raw geology to international export compliance. |
| **Client-Side Admin Login:** Plaintext credentials `admin / PinkSalt@2026!` visible in DOM and client script. | **Archived to Prototype (`prototype_admin/`):** Entire mock dashboard safely isolated outside public build. | Eliminates critical security risk and unprofessional demo artifacts before executive review. |

---

## 3. Section-by-Section Refactoring Log

### Section 1: Overview & Value Proposition
- **Removed:** Slogans ("Advise, Then Build", "From Khewra's 500-million-year-old rock to retail shelves in Berlin, Tokyo & New York", "Zero bottleneck guarantee").
- **Added:** Dignified institutional headline: *"Directorate General of Mines & Minerals — Government of Punjab"*, with sub-headline *"Pink Salt Industrial Intelligence & Investment Facilitation"*.
- **Preserved & Structured:** 4 primary institutional indicators:
  1. Concession Reserves: **1.25+ Billion MT** proved accessible reserves across Khewra, Warcha, and Kalabagh.
  2. Baseline Purity: **98.2% – 99.4% NaCl** (food and pharmaceutical grade).
  3. Processing Target: **110-Acre Quaidabad Processing Zone** with 200 industrial plots.
  4. Strategic Shift: **10x – 15x Value Multiplier** transitioning from unrefined rock salt ($40/MT) to packaged retail and pharmaceutical grade products.
- **Added:** Dual call to action (*Explore Mineral Resources* and *CM Financing Scheme*).
- **Added:** Dynamic PKR/USD currency switcher with an editable exchange rate field (defaulted to indicative benchmark 1 USD = 280 PKR).

### Section 2: Resource Base & Concessions
- **Removed:** Conflicting standalone claims ("30+ Billion MT" vs "10+ Billion MT" with no geological context).
- **Reconciled:** Proved concession tonnage (1.25B MT total: Khewra 600M MT, Warcha 400M MT, Kalabagh 250M MT) reconciled with the 30B MT regional evaporite formation (Salt Range Formation / Eocambrian). Flagged for formal review in `VERIFY.md`.
- **Preserved & Structured:** 
  - Interactive district filter (All, Jhelum, Khushab, Mianwali, Chakwal).
  - Complete geological deposit table with coordinates, purity, geological formation, concession status, and managing authority (PMDC / Provincial Concessions).
  - Logistics overview highlighting M-2 Motorway interchanges (Lilla, Balkassar, Kallar Kahar) and Pakistan Railways freight sidings.

### Section 3: Where to Build (Industrial Zones)
- **Removed:** Unverifiable marketing claims and duplicate location cards.
- **Added:** Flagship profile for **Quaidabad Pink Salt Mineral Processing Zone (110 Acres)**:
  - 200 industrial plots, dedicated 132kV grid connection, effluent treatment plant, high-speed fiber, and on-site one-window facilitation centre.
- **Preserved & Structured:** 4-Zone comparative infrastructure matrix:
  - Quaidabad (Mianwali/Khushab corridor)
  - Bhalwal Industrial Estate (SEZ)
  - Khewra Mining Corridor (Jhelum)
  - M-3 Industrial City (Faisalabad SEZ)
- **Resolved:** SEZ tax-holiday conditions and utility readiness reconciled and marked `[VERIFY]` in `VERIFY.md`.

### Section 4: Value-Addition Ladder
- **Removed:** Inconsistent price points scattered across the site ($120–$180 vs $280–$450 vs $300–$450 vs $320–$650 vs $550–$950; gourmet $2,000–$3,500 vs $1,800–$3,500).
- **Reconciled:** Structured 6-tier value ladder with uniform FOB price bands and CAPEX estimates:
  1. *Stage 1 — Raw Rock Salt:* $35 – $50 / MT (Bulk mining, no processing).
  2. *Stage 2 — Crushed & Optically Sorted Granules:* $120 – $180 / MT (Optical sorter, stainless screens).
  3. *Stage 3 — Food-Grade Fine Table Salt:* $280 – $450 / MT (SS304 pin mills, fluidized bed dryers).
  4. *Stage 4 — Retail Stand-Up Pouches (Nitrogen Flushed):* $550 – $950 / MT (Multi-head weighers, automated form-fill-seal).
  5. *Stage 5 — Gourmet Himalayan Infusions & Ceramics:* $2,000 – $3,500 / MT (Flavour blending, glass/ceramic mill assembly).
  6. *Stage 6 — Ultra-Pure Pharmaceutical API:* $3,500 – $5,000 / MT (Multi-stage recrystallization, cleanroom packaging).
- **Preserved:** Strategic rationale explaining the economic mandate to discontinue raw export in favor of domestic processing.

### Section 5: Investment Opportunities
- **Removed:** Vendor machine-selling tags ("We build turnkey lines", "Bloom Engineering").
- **Preserved & Reorganized:** 8 high-potential industrial projects organized into 4 policy categories:
  - *Food-Grade & Retail:*
    1. Optical Sorting & Retail Table Salt Packaging (30 TPD)
    2. Nitrogen-Flushed Stand-Up Pouch Retail Plant (15 TPD)
  - *Gourmet, Artisanal & Wellness:*
    3. Gourmet Flavoured Salt & Ceramic Mill Assembly (5 TPD)
    4. Salt Therapy Bricks & Artisanal Wellness Products (10 TPD)
  - *Agricultural & Livestock:*
    5. Mineral-Enriched Livestock Lick Blocks (20 TPD)
    6. Agricultural Soil Conditioner & De-Icing Salt (50 TPD)
  - *Industrial & Pharmaceutical JV:*
    7. High-Purity Pharmaceutical Grade NaCl API (5 TPD)
    8. Chlor-Alkali Industrial Feedstock Plant (100 TPD)
- **Features Preserved:** Real-time search by keyword, category filtering pills, and dynamic budget display in both PKR and USD.

### Section 6: Financing & Economics
- **Removed:** "Automated Bank Approval Score", "We underwrite your loan", and "35% - 70% gross margins".
- **Added:** Official **Chief Minister Pink Salt Value Addition Financing Scheme** overview:
  - Rs5.0 Billion provincial allocation.
  - Up to Rs50 Million debt financing at 0% mark-up (with Rs40M variant noted for verification).
  - Explicit notification that credit underwriting is conducted by The Bank of Punjab under its independent prudential guidelines.
  - Direct outbound button to the official PITB application portal: `https://pinksalt.punjab.gov.pk/landing`.
- **Refactored Feasibility Calculator:**
  - Preloaded with realistic 25 TPD base case (no `$0.00` error states on load).
  - 3 scenario presets (25 TPD Retail Base Case, 15 TPD Artisanal Gourmet, 50 TPD Industrial Feedstock).
  - Mathematical transparency: formulas explicitly rendered on-screen:
    $$\text{Annual Output} = \text{Capacity} \times \text{Operating Days} \times \text{Utilisation} \times \text{Yield}$$
    $$\text{Gross Revenue} = \text{Annual Output} \times \text{Selling Price}$$
    $$\text{EBITDA} = \text{Gross Revenue} - \text{Total OPEX}$$
  - Full client-side input validation (utilisation and yield constrained between 0.1 and 1.0; no negatives).
  - Live sensitivity matrix (Price $\pm 15\%$, Raw Material $\pm 20\%$).
  - Clean browser print function for formal ministerial/investor dossiers (`window.print()`).

### Section 7: Export Compliance & Knowledge Base
- **Removed:** Implied institutional partner endorsements ("Institutional Data Partners with tick marks").
- **Preserved & Structured:**
  - Pakistan Single Window (PSW) 4-step digital onboarding roadmap.
  - Destination quality compliance matrix (US FDA 21 CFR, EU Regulation 2023/915, Codex CXS 150, GSO Standards).
  - Customs HS Code classification table (HS 2501.00.10 through HS 2501.00.90).
  - Traceability note detailing Protected Geographical Indication under the Geographical Indications (Registration and Protection) Act, 2020.
  - Concept Demo: Origin Verification lookup clearly marked as *"Concept Demonstration for Supply-Chain Traceability"*.
  - Categorised Knowledge Base repository featuring 5 key regulatory and technical downloads.

### Section 8: Expression of Interest (Investor Facilitation)
- **Removed:** Redundant vendor enquiry checkboxes and loan pre-approval promises.
- **Preserved & Streamlined:** 9 clean fields: Investor Name, Company, Email, Country, Business Model, Preferred Industrial Location, Budget Band, Proposed Capacity, and Project Scope.
- **Added:** Clear disclaimer indicating this form registers an expression of interest with the Directorate for industrial facilitation; formal financing applications must be submitted directly to The Bank of Punjab.

---

## 4. UI/UX & Design System Transformation

1. **"Salt & Stone" Institutional Palette:**
   - Background: Natural salt white / ivory (`#FBF8F5`)
   - Surface: Pure white (`#FFFFFF`) with subtle stone borders (`#E5DFD7`)
   - Primary Institutional Brand: Deep Punjab Forest Green (`#162E27` / `#1E3D34`)
   - Secondary Accent: Mineral Rose Pink (`#D98E9A`) with deeper Rose for CTAs (`#B8566A`)
   - Typography: Elegant editorial serif headers (*Playfair Display*) and high-legibility geometric sans (*Plus Jakarta Sans* / *Inter*).
2. **Responsiveness:**
   - Full desktop layout calibrated for 1440px and wide presentation screens.
   - Fluid mobile layout verified at 390px viewport width with horizontal-scrolling responsive tables.
3. **Print & PDF Export Styling:**
   - Dedicated `@media print` CSS rules hiding navigation, CTAs, and interactive widgets to produce clean, executive-ready paper briefs.

---

## 5. Security & Risk Remediation Log

| Identified Risk | Risk Level | Action Taken |
| :--- | :--- | :--- |
| Hardcoded admin credentials (`PinkSalt@2026!`) in public script. | **Critical** | Completely removed from public DOM and client script; moved to isolated `prototype_admin/`. |
| Client-side mock authentication pretending to secure back-office. | **High** | Back-office dashboard and audit trail purged from public bundle. |
| Implied loan guarantees by Directorate General. | **High** | Replaced with clear statutory disclaimer indicating BOP credit independence. |
| False partner endorsements (claiming formal data partnership with GSP, TDAP, PMDC without sign-off). | **Medium** | Replaced with neutral attribution: *"Data sources: Geological Survey of Pakistan, PMDC, Pakistan Customs"*. |
| Unverified commercial claims (e.g. 70% gross margins, zero bottlenecks). | **Medium** | Rewritten to model-based indicative ranges with statutory disclaimers. |

---

## 6. Verification Register Status

All 10 ambiguous or conflicting items identified during the audit have been logged in `VERIFY.md` with specific official gazette, department, or standard references required for final ministerial sign-off before the Pakistan Mineral Investment Forum.
