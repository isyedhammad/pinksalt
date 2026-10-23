"""
PinkSalt Intelligence & Investment Portal
Database Management & Data Persistence Layer

Provides SQLite schema initialization, cryptographic password hashing (PBKDF2-HMAC-SHA256),
thread-safe operations, seed data populator, and audit logging.
"""

import os
import sqlite3
import hashlib
import secrets
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pinksalt.db")


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def hash_password(password: str, salt: Optional[str] = None) -> tuple:
    """Hashes a password with PBKDF2-HMAC-SHA256 and a random salt."""
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations=100000
    )
    return key.hex(), salt


def verify_password(stored_hash: str, salt: str, provided_password: str) -> bool:
    key, _ = hash_password(provided_password, salt)
    return secrets.compare_digest(stored_hash, key)


def init_db():
    """Initializes tables and seeds initial administrative and domain data."""
    conn = get_connection()
    cur = conn.cursor()

    # 1. Users & Auth
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'analyst',
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Opportunities Catalog
    cur.execute("""
    CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        location TEXT NOT NULL,
        district TEXT NOT NULL,
        status_type TEXT NOT NULL,
        capex_indicative_usd REAL,
        capacity_desc TEXT,
        land_sqft TEXT,
        machinery_desc TEXT,
        utility_desc TEXT,
        description TEXT NOT NULL,
        verified_source TEXT,
        verification_date TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Resource Records (Geological and Deposit Data)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS resource_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        deposit_type TEXT NOT NULL,
        estimated_reserves_desc TEXT,
        nacl_purity_pct REAL,
        coordinates_lat REAL,
        coordinates_lng REAL,
        status_label TEXT NOT NULL,
        geological_formation TEXT,
        managing_authority TEXT,
        source_doc TEXT,
        last_updated TEXT
    )
    """)

    # 4. Knowledge Base Documents
    cur.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_docs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        issuing_authority TEXT NOT NULL,
        publication_date TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        summary TEXT NOT NULL,
        source_url TEXT,
        file_size_desc TEXT,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 5. Investor Enquiries & Project Proposals
    cur.execute("""
    CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_id TEXT UNIQUE NOT NULL,
        investor_name TEXT NOT NULL,
        company_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        country TEXT NOT NULL,
        business_model TEXT NOT NULL,
        target_location TEXT,
        budget_usd REAL,
        capacity_tpd REAL,
        target_market TEXT,
        project_description TEXT NOT NULL,
        requested_assistance TEXT,
        consent_given INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'New',
        internal_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 6. Traceability and Quality Batches
    cur.execute("""
    CREATE TABLE IF NOT EXISTS traceability_batches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_code TEXT UNIQUE NOT NULL,
        product_name TEXT NOT NULL,
        origin_mine TEXT NOT NULL,
        district TEXT NOT NULL,
        extraction_date TEXT NOT NULL,
        processing_date TEXT NOT NULL,
        purity_pct REAL NOT NULL,
        heavy_metals_ppm REAL NOT NULL,
        moisture_pct REAL NOT NULL,
        facility_name TEXT NOT NULL,
        lab_certification_no TEXT NOT NULL,
        verification_status TEXT NOT NULL
    )
    """)

    # 7. Audit Logs
    cur.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_name TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT,
        details TEXT
    )
    """)

    conn.commit()

    # Seed Default Administrator if not present
    cur.execute("SELECT id FROM users WHERE username = 'admin'")
    if not cur.fetchone():
        pwd_hash, salt = hash_password("PinkSalt@2026!")
        cur.execute("""
        INSERT INTO users (username, password_hash, salt, full_name, role, email)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("admin", pwd_hash, salt, "Directorate Administrator", "superadmin", "directorate.minerals@punjab.gov.pk"))
        conn.commit()

    # Seed Audit Logs with initial setup entry if empty
    cur.execute("SELECT COUNT(*) FROM audit_logs")
    if cur.fetchone()[0] == 0:
        cur.execute("""
        INSERT INTO audit_logs (user_name, action, target_type, target_id, details)
        VALUES (?, ?, ?, ?, ?)
        """, ("SYSTEM_INITIALIZER", "PORTAL_INITIALIZATION", "system", "v1.0", "Punjab Pink Salt Portal database initialized with verified geological and regulatory seed data"))
        conn.commit()

    # Seed Domain Tables if empty
    seed_opportunities(cur, conn)
    seed_resources(cur, conn)
    seed_knowledge(cur, conn)
    seed_traceability(cur, conn)
    seed_enquiries(cur, conn)

    conn.close()


def seed_opportunities(cur, conn):
    cur.execute("SELECT COUNT(*) FROM opportunities")
    if cur.fetchone()[0] == 0:
        opps = [
            (
                "opt-food-grade-optical",
                "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
                "Food-Grade Packaging",
                "Quaidabad Industrial Cluster",
                "Khushab",
                "Proposed Joint Venture Concept",
                325000.0,
                "25 Metric Tonnes / Day",
                "22,000 sq ft industrial plot with covered shed",
                "Stainless steel 316 optical sorter, hammer mill, vibrating screener, 2-head automated form-fill-seal pouch packer",
                "150 kVA 3-phase grid connection, dedicated borehole water filtration unit",
                "Value addition plant packaging pure pink crystal salt into retail stand-up zip pouches (250g, 500g, 1kg) for export to EU, North America, and Gulf retail chains. Replaces bulk raw rock exports with 400% value accretion.",
                "Punjab Mineral Investment Concept Paper / PMDC Reference Specs",
                "2026-01-15"
            ),
            (
                "opt-gourmet-grinders",
                "Gourmet Ceramic-Mill Table Grinders & Seasoning Blends Facility",
                "Gourmet Retail Products",
                "Bhalwal Industrial Estate / Sargodha Corridor",
                "Sargodha / Khushab",
                "Private Sector Opportunity",
                480000.0,
                "15 Metric Tonnes / Day",
                "18,000 sq ft covered facility with cleanroom packaging zone",
                "Glass bottle unscrambler, rotary multi-head weigher, torque capper for ceramic grinder heads, shrink-sleeve labeling tunnel",
                "100 kVA electric power, pressurized nitrogen flush line",
                "Automated packaging facility filling high-transparency glass containers with adjustable ceramic grinding mechanisms. Produces pure crystal salt, garlic-infused pink salt, and organic chili pepper blend for premium supermarket distribution.",
                "Export Development Fund (EDF) Feasibility Study Guideline",
                "2026-02-10"
            ),
            (
                "opt-pharma-purity",
                "High-Purity Pharmaceutical & Hemodialysis Grade Sodium Chloride Refinery",
                "Industrial & Pharmaceutical",
                "M-3 Industrial City (Faisalabad SEZ)",
                "Faisalabad / Punjab",
                "Proposed Special Economic Zone Project",
                1850000.0,
                "50 Metric Tonnes / Day",
                "45,000 sq ft pharmaceutical-grade cGMP plant",
                "Vacuum crystallizer, multi-stage centrifuge, fluid bed dryer, HEPA air filtration system, clean-in-place (CIP) loop",
                "500 kVA industrial load, dedicated reverse osmosis water treatment, steam boiler",
                "Dissolution and recrystallization refinery to convert raw mineral rock salt into 99.8%+ pure NaCl meeting USP, EP, and BP pharmacopeia standards for IV infusion solutions, hemodialysis fluid, and sterile diagnostic reagents.",
                "Pakistan Pharmaceutical Manufacturers Association & GSP Technical Report",
                "2025-11-20"
            ),
            (
                "opt-artisanal-wellness",
                "Precision-Cut Salt Tiles, Wellness Bricks & Ionizing Lamps Studio",
                "Artisanal & Wellness",
                "Khewra Mineral Artisan Cluster",
                "Jhelum",
                "Documented Cluster Enterprise",
                160000.0,
                "10 Metric Tonnes / Day (Finished goods)",
                "15,000 sq ft workshop + showroom facility",
                "Bridge stone cutting saws, diamond rotary shapers, ultrasonic dust collection system, CNC engraving lathe, UL/CE certified electrical wiring assembly benches",
                "75 kVA grid supply with 25 kW solar backup",
                "Upgraded artisanal manufacturing hub transforming irregular rock salt blocks into standardized architectural wall tiles for speleotherapy rooms, spa wellness domes, and certified safe electric decorative lamps meeting US/EU electrical safety standards.",
                "Punjab Small Industries Corporation (PSIC) Cluster Profile",
                "2025-12-05"
            ),
            (
                "opt-animal-nutrition",
                "Compressed Mineral Salt Licks & Veterinary Nutrition Blocks",
                "Agricultural & Livestock",
                "Mianwali Industrial Zone",
                "Mianwali",
                "Commercial Investment Concept",
                210000.0,
                "35 Metric Tonnes / Day",
                "20,000 sq ft open and covered warehouse",
                "500-ton hydraulic block press, ribbon powder blender, trace mineral doser (Cobalt, Zinc, Copper, Selenium, Iodine), automated shrink wrapper",
                "120 kVA power supply, heavy tractor trailer access",
                "Manufacturing high-density weather-resistant lick blocks (2kg, 5kg, 10kg) with integrated hanging ropes and calibrated trace minerals for dairy livestock, equine farms, and pastoral grazing across domestic and Australian/GCC export markets.",
                "Livestock & Dairy Development Department Punjab",
                "2026-01-28"
            ),
            (
                "opt-quaidabad-hub",
                "Quaidabad Common Facility & Central Optical Sorting Center",
                "Processing Facility / Joint Venture",
                "Quaidabad Mineral Processing Zone",
                "Khushab",
                "Public-Private Partnership (PPP) Proposed",
                1200000.0,
                "150 Metric Tonnes / Day",
                "60,000 sq ft logistics yard and sorting terminal",
                "Buhler/Tomra multi-channel color optical sorters, magnetic separators, continuous weighing conveyor belt, bulk container tilt loader",
                "350 kVA transformer, weighbridge 100-ton, rail siding link connection",
                "Strategic common-facility sorting hub located at the intersection of raw salt transport routes from Warcha and central Punjab distribution corridors. Enables small and medium processors to access high-speed optical color grading without individual heavy CAPEX.",
                "Directorate General Mines & Minerals Punjab Working Paper",
                "2026-02-18"
            )
        ]
        cur.executemany("""
        INSERT INTO opportunities (
            slug, title, category, location, district, status_type,
            capex_indicative_usd, capacity_desc, land_sqft, machinery_desc,
            utility_desc, description, verified_source, verification_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, opps)
        conn.commit()


def seed_resources(cur, conn):
    cur.execute("SELECT COUNT(*) FROM resource_records")
    if cur.fetchone()[0] == 0:
        records = [
            (
                "Khewra Salt Mine Deposit",
                "Jhelum",
                "Underground Mine / Evaporite Seam",
                "Documented geological reserves exceeding 600 Million Metric Tonnes across 17 working levels",
                98.8,
                32.6486,
                73.0108,
                "Documented / Active Federal Lease (PMDC)",
                "Pre-Cambrian Salt Range Formation (Eocambrian)",
                "Pakistan Mineral Development Corporation (PMDC)",
                "Geological Survey of Pakistan Memoir Vol. XI / PMDC Operations Report",
                "2026-01-10"
            ),
            (
                "Warcha Salt Mine & Outcrops",
                "Khushab",
                "Underground High-Purity Seam",
                "Estimated reserves of over 400 Million Tonnes of transparent and deep-rose crystalline salt",
                99.1,
                32.4172,
                71.9683,
                "Documented / Active Production",
                "Salt Range Formation, Nilawahan Group",
                "PMDC & Punjab Concessions Directorate",
                "GSP Mineral Information Series No. 44",
                "2025-11-15"
            ),
            (
                "Kalabagh Salt Range Outcrops",
                "Mianwali",
                "Stratified Rock Salt Beds",
                "Massive exposed evaporite layers along Indus River gorge, estimated 250+ Million Tonnes",
                97.9,
                32.9614,
                71.5447,
                "Documented / Licensed Mining Blocks",
                "Salt Range Formation (Kalabagh Fault Zone)",
                "Punjab Mines & Minerals Department",
                "Directorate General of Mines & Minerals Punjab Geo-Database",
                "2025-10-30"
            ),
            (
                "Quaidabad Processing Corridor & Mineral Siding",
                "Khushab",
                "Designated Mineral Processing & Logistics Hub",
                "Strategic logistics node with direct link to Warcha extraction sites and M-2 Motorway",
                98.5,
                32.3292,
                71.8953,
                "Proposed Processing Zone (Demonstrative Concept)",
                "Alluvial Plain adjacent to Salt Range Escarpment",
                "Punjab Industrial Estates Development & Management Company (PIEDMC) / Mines Dept",
                "Punjab Mineral Investment Forum Concept Proposal",
                "2026-02-01"
            ),
            (
                "Chakwal-Kallar Kahar Evaporite Belt",
                "Chakwal",
                "Subsurface Sedimentary Deposits",
                "Exploratory boreholes show continuous rock salt beds at 150m-300m depth",
                97.5,
                32.7825,
                72.6989,
                "Exploration & Historical Survey Records",
                "Early Cambrian Salt Range Saline Series",
                "Geological Survey of Pakistan",
                "GSP Regional Mapping Bulletin No. 19",
                "2025-08-12"
            )
        ]
        cur.executemany("""
        INSERT INTO resource_records (
            name, district, deposit_type, estimated_reserves_desc, nacl_purity_pct,
            coordinates_lat, coordinates_lng, status_label, geological_formation,
            managing_authority, source_doc, last_updated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, records)
        conn.commit()


def seed_knowledge(cur, conn):
    cur.execute("SELECT COUNT(*) FROM knowledge_docs")
    if cur.fetchone()[0] == 0:
        docs = [
            (
                "Punjab Mining Concession Rules 2022 (Consolidated)",
                "Legislation & Regulations",
                "Mines & Minerals Department, Government of Punjab",
                "2022-07-01",
                "Official Document",
                "Comprehensive statutory framework governing exploration licenses, mineral prospecting licenses, mining leases, royalty schedules, bidding procedures, and surface rent in Punjab.",
                "https://mnm.punjab.gov.pk/rules_and_regulations",
                "1.4 MB PDF",
                "mining lease, concession rules, royalty, punjab, licensing"
            ),
            (
                "Regulatory Distinction: Mining Rights vs. Mineral Processing Facilities",
                "Policy & Technical Guidance",
                "Directorate General of Mines & Minerals Punjab",
                "2025-10-15",
                "Official Clarification",
                "Clarifies that establishing a salt washing, optical sorting, or value-addition packaging unit does not require a subsurface mining lease. Processors can operate on industrial land with standard commercial registrations while sourcing raw salt from licensed leaseholders or PMDC.",
                "https://mnm.punjab.gov.pk/investment_and_business_promotion",
                "450 KB PDF",
                "processing facility, mining rights, permits, environmental approval, raw salt sourcing"
            ),
            (
                "Export Procedures & Pakistan Single Window (PSW) Integration for Rock Salt",
                "Export & Trade Intelligence",
                "Trade Development Authority of Pakistan (TDAP) / FBR",
                "2025-12-01",
                "Official Export Guide",
                "Step-by-step export clearance under HS Code 2501.00. Covers electronic E-Form filing, Phytosanitary certification, Certificate of Origin (TDAP), Chamber of Commerce membership, and mandatory packaging requirements.",
                "https://tdap.gov.pk/mineral-products-export-guide",
                "820 KB PDF",
                "export, PSW, customs, HS 2501, certificate of origin, TDAP"
            ),
            (
                "Geographical Indication (GI) Registration for 'Himalayan Pink Salt of Pakistan'",
                "Intellectual Property & Origin",
                "Intellectual Property Organization of Pakistan (IPO-Pakistan)",
                "2021-02-22",
                "Official Gazette Notification",
                "Details the protection of Pakistani Pink Salt under the Geographical Indications (Registration and Protection) Act 2020. Prohibits foreign entities from branding foreign salt as Himalayan Pink Salt without authentic Pakistani origin certification.",
                "https://ipo.gov.pk/geographical_indications",
                "310 KB PDF",
                "geographical indication, GI tag, provenance, IPO Pakistan, brand protection"
            ),
            (
                "Codex Standard for Food Grade Salt (CXS 150-1985, Rev. 2012)",
                "International Quality Standards",
                "Codex Alimentarius Commission (FAO / WHO)",
                "2012-07-01",
                "International Benchmark",
                "Global food safety benchmark mandating minimum 97.0% NaCl content on a dry matter basis, moisture thresholds, permitted food-grade anticaking agents, and strict limits on heavy metals (Lead < 2 ppm, Arsenic < 0.5 ppm, Cadmium < 0.5 ppm, Mercury < 0.1 ppm).",
                "https://www.fao.org/fao-who-codexalimentarius/standards/en/",
                "620 KB PDF",
                "codex, food grade, purity, heavy metals, ASTM, international compliance"
            ),
            (
                "Geological Survey of Pakistan: Mineral Resources of the Salt Range",
                "Geology & Resource Assessment",
                "Geological Survey of Pakistan (GSP), Quetta/Lahore",
                "2024-04-18",
                "Official Survey Report",
                "Comprehensive stratigraphic analysis of the Precambrian Billianwala Subgroup of the Salt Range Formation. Maps salt marl, potash beds, gypsum horizons, and structural thickness across Jhelum, Khushab, and Mianwali districts.",
                "https://www.gsp.gov.pk/publications/salt-range-memoir",
                "3.8 MB PDF",
                "geology, salt range, stratigraphy, reserves, Khewra, Warcha, Kalabagh"
            )
        ]
        cur.executemany("""
        INSERT INTO knowledge_docs (
            title, category, issuing_authority, publication_date, verification_status,
            summary, source_url, file_size_desc, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, docs)
        conn.commit()


def seed_traceability(cur, conn):
    cur.execute("SELECT COUNT(*) FROM traceability_batches")
    if cur.fetchone()[0] == 0:
        batches = [
            (
                "PK-SALT-2026-KHW-001",
                "Gourmet Fine Pink Salt (0.5mm - 1.0mm)",
                "Khewra Salt Mine (Level 6)",
                "Jhelum",
                "2026-01-14",
                "2026-01-20",
                99.12,
                0.012,
                0.08,
                "Khewra Export Processing Unit A",
                "ISO-17025-PCSIR-2026-881",
                "Verified Authentic Origin"
            ),
            (
                "PK-SALT-2026-WCH-042",
                "Coarse Crystalline Pink Grinder Salt (2mm - 4mm)",
                "Warcha Salt Mine (Block C)",
                "Khushab",
                "2026-02-02",
                "2026-02-08",
                99.35,
                0.008,
                0.05,
                "Quaidabad Optical Value Processing",
                "SGS-PK-MIN-2026-0419",
                "Verified Authentic Origin"
            ),
            (
                "PK-SALT-2026-KLB-108",
                "Compressed Livestock Mineral Salt Block (5kg)",
                "Kalabagh Deposit Outcrops",
                "Mianwali",
                "2026-01-28",
                "2026-02-04",
                98.40,
                0.045,
                0.15,
                "Mianwali Agro-Minerals Plant",
                "VET-LAB-UAF-2026-102",
                "Verified Authentic Origin"
            )
        ]
        cur.executemany("""
        INSERT INTO traceability_batches (
            batch_code, product_name, origin_mine, district, extraction_date,
            processing_date, purity_pct, heavy_metals_ppm, moisture_pct,
            facility_name, lab_certification_no, verification_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, batches)
        conn.commit()


def seed_enquiries(cur, conn):
    cur.execute("SELECT COUNT(*) FROM enquiries")
    if cur.fetchone()[0] == 0:
        samples = [
            (
                "PSI-2026-0101",
                "Marcus Vance",
                "Nordic Mineral Sourcing ApS",
                "m.vance@nordicminerals.dk",
                "+45 32 88 19 00",
                "Denmark",
                "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
                "Quaidabad Industrial Cluster",
                450000.0,
                30.0,
                "Scandinavia & Northern Europe Supermarkets",
                "Seeking joint venture partnership with a licensed raw salt processor in Khushab. We require 6,000 tonnes/year of BRCGS-certified optical sorted pink salt in private label 500g pouches.",
                "Industrial land allocation support and facilitation with local mining concessions.",
                1,
                "Meeting Scheduled",
                "Qualified European retail buyer. Scheduled technical video consultation for Oct 28th."
            ),
            (
                "PSI-2026-0102",
                "Tariq Al-Mansoor",
                "Al-Mansoor Food Industries",
                "tariq@almansoorfoods.ae",
                "+971 4 290 8821",
                "United Arab Emirates",
                "Gourmet Ceramic-Mill Table Grinders & Seasoning Blends Facility",
                "Bhalwal Industrial Estate",
                600000.0,
                20.0,
                "GCC & North Africa Retail",
                "Planning to set up automated glass grinder assembly line in Sargodha/Bhalwal for fast transit via Karachi to Jebel Ali. Need assurance of power availability and tax exemption under SEZ framework.",
                "Assistance with SEZ enterprise status application and electricity feeder sanctioning.",
                1,
                "Proposal Received",
                "Submitted detailed capital expenditure breakdown. Forwarded to PIEDMC desk."
            ),
            (
                "PSI-2026-0103",
                "Dr. Haroon Rasheed",
                "Apex Bio-Minerals Ltd",
                "hrasheed@apexbiominerals.pk",
                "+92 300 845 2210",
                "Pakistan",
                "High-Purity Pharmaceutical Grade Sodium Chloride Refinery",
                "M-3 Industrial City Faisalabad",
                1500000.0,
                45.0,
                "Domestic Infusion Manufacturers & Regional Export",
                "Developing import substitution project for pharmaceutical grade API sodium chloride. Need verified assay certificates for Warcha raw salt feedstocks.",
                "Facilitation with Geological Survey of Pakistan and Mines Department testing labs.",
                1,
                "Referred for Review",
                "Reviewed by Technical Advisory Committee. Requires raw salt supply assurance letter from PMDC."
            )
        ]
        cur.executemany("""
        INSERT INTO enquiries (
            tracking_id, investor_name, company_name, email, phone,
            country, business_model, target_location, budget_usd,
            capacity_tpd, target_market, project_description,
            requested_assistance, consent_given, status, internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, samples)
        conn.commit()


# Initialize database upon import
init_db()
