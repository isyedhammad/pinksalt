"""
PinkSalt Intelligence & Investment Portal
PinkSalt AI - Grounded Expert Assistant & RAG Retrieval Engine

Provides domain-grounded retrieval, strict citation mapping, deterministic
feasibility invocation, structured concept generation, and unverified-query safeguarding.
"""

import os
import json
import re
from typing import Dict, Any, List, Optional
from database import get_connection
from financial_engine import calculate_feasibility, get_scenario_presets

# Curated, authoritative knowledge corpus embedded directly for high-speed grounded RAG
AUTHORITATIVE_CORPUS = [
    {
        "id": "CORPUS-01",
        "title": "Geological Reserves & Mineral Formations of the Salt Range, Punjab",
        "authority": "Geological Survey of Pakistan (GSP) & PMDC",
        "date": "2024-04-18",
        "topics": ["geology", "reserves", "khewra", "warcha", "kalabagh", "salt range", "deposits", "purity", "nacl"],
        "content": (
            "Pakistan's Salt Range is an Eocambrian evaporite sequence stretching across the northern Punjab districts "
            "of Jhelum, Khushab, and Mianwali. The Billianwala Subgroup contains massive halite beds interbedded with marl and gypsum. "
            "Documented geological reserves exceed 10 billion metric tonnes across the belt, with over 1 billion tonnes classified as "
            "proven and recoverable. The Khewra Salt Mine (Jhelum District) has operated since antiquity and possesses documented reserves "
            "exceeding 600 million tonnes with average NaCl purity of 98.8%. The Warcha Mine (Khushab District) is renowned for high crystalline "
            "transparency and purity exceeding 99.1% NaCl. Kalabagh (Mianwali District) features exposed salt cliffs along the Indus River with 97.9% purity."
        ),
        "source_url": "https://www.gsp.gov.pk/publications/salt-range-memoir"
    },
    {
        "id": "CORPUS-02",
        "title": "Regulatory Framework: Mining Leases vs. Value-Addition Processing Facilities",
        "authority": "Directorate General of Mines & Minerals, Government of Punjab",
        "date": "2025-10-15",
        "topics": ["licensing", "mining rights", "processing facility", "regulations", "permits", "punjab", "concessions", "rules"],
        "content": (
            "Under the Punjab Mining Concession Rules 2022, subsurface exploration licenses and mining leases are granted exclusively through "
            "transparent competitive bidding managed by the Mines & Minerals Department. Crucially, investors seeking to establish surface "
            "mineral value addition—such as washing, optical color sorting, grinding, retail packaging, or pharmaceutical refinement—DO NOT "
            "require a subsurface mining lease. They can establish processing facilities within designated industrial estates (e.g. Quaidabad, "
            "Bhalwal, M-3 Industrial City) under ordinary industrial building and environmental permits, sourcing raw rock salt directly from "
            "licensed leaseholders or the Pakistan Mineral Development Corporation (PMDC) under commercial supply contracts."
        ),
        "source_url": "https://mnm.punjab.gov.pk/rules_and_regulations"
    },
    {
        "id": "CORPUS-03",
        "title": "Export Clearance, Pakistan Single Window (PSW) & Customs Documentation",
        "authority": "Trade Development Authority of Pakistan (TDAP) & FBR",
        "date": "2025-12-01",
        "topics": ["export", "customs", "psw", "hs code", "tariff", "certificate of origin", "e-form", "shipping", "karachi"],
        "content": (
            "Pink rock salt is classified under HS Code 2501.00 (Salt including table salt and pure sodium chloride). Export consignments require: "
            "(1) Electronic Goods Declaration (GD) filed via the Pakistan Single Window (PSW) linked with an approved commercial bank E-Form; "
            "(2) Certificate of Origin issued by the Trade Development Authority of Pakistan (TDAP) or affiliated Chamber of Commerce; "
            "(3) Phytosanitary and Fumigation Certificate from the Department of Plant Protection where timber pallets are utilized; "
            "(4) Laboratory Certificate of Analysis (CoA) verifying NaCl purity, moisture content, and absence of heavy metals. Raw bulk rock salt "
            "historically faced depressed export realizations ($35-$50/tonne), whereas retail packaged, optical-sorted pink salt commands $300-$800/tonne "
            "FOB Karachi, and private-label ceramic grinders reach $2,000-$3,500/tonne."
        ),
        "source_url": "https://tdap.gov.pk/mineral-products-export-guide"
    },
    {
        "id": "CORPUS-04",
        "title": "Geographical Indication (GI) Protection & Origin Integrity",
        "authority": "Intellectual Property Organization of Pakistan (IPO-Pakistan)",
        "date": "2021-02-22",
        "topics": ["geographical indication", "gi", "origin", "himalayan", "counterfeit", "brand", "ipo"],
        "content": (
            "Under the Geographical Indications (Registration and Protection) Act 2020, 'Himalayan Pink Salt of Pakistan' was formally registered "
            "as a protected Pakistani GI to prevent deceptive labeling and foreign rebranding. Processing and export enterprises must maintain "
            "traceability documentation tracing raw feedstock to registered mines in the Salt Range (Jhelum, Khushab, Mianwali) to qualify for "
            "authentic GI branding. Misrepresenting foreign sea salt or synthetic tinted salts as Pakistani Himalayan Pink Salt violates national "
            "and international trademark protocols."
        ),
        "source_url": "https://ipo.gov.pk/geographical_indications"
    },
    {
        "id": "CORPUS-05",
        "title": "International Food Safety & Quality Standards: Codex Alimentarius & US FDA",
        "authority": "Codex Alimentarius Commission (FAO/WHO) & US FDA",
        "date": "2024-01-10",
        "topics": ["codex", "fda", "quality", "standards", "heavy metals", "purity", "cxs 150", "testing", "lead", "arsenic"],
        "content": (
            "Food-grade salt exported to the United States and European Union must comply with Codex Standard CXS 150-1985. It must contain at least "
            "97.0% NaCl on a dry matter basis. Trace iron oxides impart the distinctive pink hue. Heavy metals must remain strictly below international "
            "tolerances: Lead (Pb) < 2.0 ppm, Arsenic (As) < 0.5 ppm, Cadmium (Cd) < 0.5 ppm, and Mercury (Hg) < 0.1 ppm. High-end food processors "
            "employ automated optical color sorters (Buhler, Tomra) with SS316 food-contact contact parts and magnetic traps to eliminate foreign "
            "matter and guarantee batch-to-batch visual uniformity."
        ),
        "source_url": "https://www.fao.org/fao-who-codexalimentarius/standards/en/"
    },
    {
        "id": "CORPUS-06",
        "title": "Processing Zone Comparison: Quaidabad vs. Bhalwal vs. M-3 Faisalabad",
        "authority": "Punjab Industrial Estates Development & Management Company (PIEDMC)",
        "date": "2026-01-20",
        "topics": ["processing zone", "site selector", "location", "quaidabad", "khushab", "bhalwal", "faisalabad", "logistics", "sez"],
        "content": (
            "Candidate industrial locations in Punjab offer distinct operational advantages: "
            "(1) Quaidabad (Khushab District): Located within 25 km of the high-purity Warcha mine; minimizes raw haulage logistics cost ($5-$8/tonne); "
            "ideal for primary washing, optical sorting, and bulk packaging. "
            "(2) Bhalwal Industrial Estate (Sargodha Corridor): Located directly on the M-2 Motorway link; provides established 3-phase grid power, "
            "gas connections, and abundant skilled packaging labor; optimal for gourmet grinders and multi-pack consumer goods. "
            "(3) M-3 Industrial City (Faisalabad SEZ): Federal Special Economic Zone offering 10-year income tax holidays and duty-free machinery imports; "
            "ideal for high-capital pharmaceutical and chemical grade salt refineries requiring sophisticated water treatment and heavy utilities."
        ),
        "source_url": "https://mnm.punjab.gov.pk/investment_and_business_promotion"
    }
]


def retrieve_relevant_corpus(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """Retrieves top grounded knowledge passages based on keyword and semantic matching."""
    tokens = set(re.findall(r"\b\w{3,}\b", query.lower()))
    scored_items = []

    for doc in AUTHORITATIVE_CORPUS:
        score = 0
        doc_topics = set(doc["topics"])
        content_lower = doc["content"].lower()
        title_lower = doc["title"].lower()

        # Topic overlap matches
        common_topics = tokens.intersection(doc_topics)
        score += len(common_topics) * 5

        # Content and title keyword matches
        for t in tokens:
            if t in title_lower:
                score += 4
            if t in content_lower:
                score += 1

        if score > 0:
            scored_items.append((score, doc))

    scored_items.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in scored_items[:limit]]


def generate_project_concept(concept_params: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a structured preliminary investment concept document."""
    model_name = concept_params.get("business_model", "Food-Grade Optical Sorting & Retail Packaging Plant")
    target_location = concept_params.get("target_location", "Quaidabad Industrial Cluster, Khushab")
    capacity_tpd = float(concept_params.get("capacity_tpd", 25.0))
    target_market = concept_params.get("target_market", "EU & North American Retail Chains")
    budget_usd = float(concept_params.get("budget_usd", 350000.0))

    # Run deterministic financial calculations
    calc_input = {
        "machinery_cost": budget_usd * 0.45,
        "land_building_cost": budget_usd * 0.30,
        "installation_cost": budget_usd * 0.08,
        "working_capital": budget_usd * 0.17,
        "capacity_tpd": capacity_tpd,
        "operating_days": 300,
        "capacity_utilization": 0.75,
        "process_yield": 0.92,
        "raw_salt_cost_per_tonne": 45.0,
        "energy_cost_per_tonne": 28.0,
        "packaging_cost_per_tonne": 40.0,
        "freight_per_tonne": 35.0,
        "labor_cost_per_tonne": 22.0,
        "selling_price_per_tonne": 340.0
    }
    fin = calculate_feasibility(calc_input)

    concept = {
        "concept_title": f"Preliminary Concept: {model_name}",
        "executive_summary": (
            f"A structured proposal to establish a {capacity_tpd} TPD mineral processing and value-addition facility "
            f"located at {target_location}. The project transitions raw mineral rock salt into certified consumer-ready "
            f"and export-compliant products tailored for {target_market}."
        ),
        "target_market_profile": target_market,
        "recommended_site": target_location,
        "production_capacity": {
            "nameplate_tpd": capacity_tpd,
            "annual_raw_input_tonnes": fin["production"]["annual_raw_salt_tonnes"],
            "annual_finished_output_tonnes": fin["production"]["annual_finished_production_tonnes"]
        },
        "indicative_financials": {
            "estimated_capex_usd": fin["capex"]["total_capex"],
            "annual_revenue_usd": fin["financial_returns"]["annual_revenue"],
            "annual_opex_usd": fin["opex"]["total_annual_opex"],
            "annual_operating_profit_usd": fin["financial_returns"]["annual_operating_profit"],
            "operating_margin_pct": fin["financial_returns"]["operating_margin_pct"],
            "breakeven_selling_price_usd_per_tonne": fin["financial_returns"]["breakeven_selling_price_per_tonne"],
            "estimated_payback_years": fin["financial_returns"]["estimated_payback_years"]
        },
        "machinery_and_processing_workflow": [
            "Raw salt rock inspection and primary jaw crushing (sub-25mm fraction)",
            "Dual-channel high-speed optical color sorter (Stainless Steel SS316 food contact)",
            "Vibratory multi-deck sizing screens (Fine 0.5-1.0mm, Medium 1-2mm, Coarse 2-4mm)",
            "Automated vertical form-fill-seal (VFFS) stand-up pouch packaging with nitrogen flush",
            "Continuous in-line checkweigher, metal detector, and case palletizer"
        ],
        "regulatory_and_concessions_checklist": [
            "Industrial land lease or title deed in designated industrial zone",
            "Raw salt off-take commercial agreement with PMDC or verified Punjab leaseholder",
            "Environmental Impact Assessment (EIA) / Initial Environmental Examination (IEE) from Punjab EPA",
            "Pakistan Single Window (PSW) subscription and NTN registration with FBR",
            "Codex Alimentarius compliance, ISO 22000 / HACCP food safety certification",
            "Geographical Indication (GI) traceability registration with IPO-Pakistan"
        ],
        "commercial_risks": [
            "Ocean freight volatility between Karachi port and export destination hubs",
            "Energy tariff fluctuations (mitigated by installing rooftop solar for day shifts)",
            "Consistent supply of deep-pink crystalline blocks during peak extraction months"
        ],
        "recommended_next_steps": [
            "Submit formal Investor Enquiry via the PinkSalt Portal for departmental facilitation",
            "Request raw material sample assays from Punjab Mines Testing Laboratory",
            "Engage Punjab Industrial Estates Development & Management Company (PIEDMC) for plot allotment",
            "Commission independent bankable feasibility study prior to commercial financing"
        ],
        "status_notice": "PRELIMINARY CONCEPT DOCUMENT - PREPARED FOR DISCUSSION AT PAKISTAN MINERAL INVESTMENT FORUM"
    }
    return concept


def handle_ai_query(user_message: str, session_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Core entrypoint for PinkSalt AI.
    Executes grounded RAG, checks for unverified claims, invokes deterministic tools,
    and returns citations or unconfirmed safeguards.
    """
    clean_msg = user_message.strip()
    clean_lower = clean_msg.lower()

    # 1. Unconfirmed / Speculative queries safeguard
    # Strictly enforce: if query asks for unverified rumors, secret reserves, guaranteed profits, or illicit claims:
    unverified_triggers = [
        "guaranteed profit", "guarantee 100% profit", "secret reserve", "hidden mine",
        "unregistered lease", "evade royalty", "illegal mining", "free land",
        "cure cancer", "heal asthma", "medical miracle"
    ]
    for trig in unverified_triggers:
        if trig in clean_lower:
            return {
                "answer": (
                    "I cannot confirm this from the available verified sources.\n\n"
                    "The PinkSalt Intelligence & Investment Portal only provides documented data from the "
                    "Punjab Mines & Minerals Department, Pakistan Mineral Development Corporation (PMDC), "
                    "Geological Survey of Pakistan (GSP), and international food safety bodies. "
                    "We do not endorse speculative claims, therapeutic guarantees, or unverified lease allocations."
                ),
                "citations": [],
                "confidence": "safeguard_triggered",
                "suggested_actions": ["Review verified geological records", "Explore documented business models"]
            }

    # 2. Check if user wants a structured project concept
    if any(k in clean_lower for k in ["generate concept", "project concept", "feasibility outline", "business proposal"]):
        concept_data = generate_project_concept({
            "business_model": "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
            "target_location": "Quaidabad Industrial Cluster, Khushab",
            "capacity_tpd": 25.0,
            "target_market": "EU & North American Supermarkets",
            "budget_usd": 325000.0
        })
        answer_text = (
            f"### Preliminary Investment Concept: {concept_data['concept_title']}\n\n"
            f"**Executive Summary**: {concept_data['executive_summary']}\n\n"
            f"**Indicative Financials (Deterministic Calculation)**:\n"
            f"- **Estimated CAPEX**: ${concept_data['indicative_financials']['estimated_capex_usd']:,.2f}\n"
            f"- **Annual Production**: {concept_data['production_capacity']['annual_finished_output_tonnes']:,.1f} Metric Tonnes\n"
            f"- **Projected Sales Revenue**: ${concept_data['indicative_financials']['annual_revenue_usd']:,.2f} / year\n"
            f"- **Annual Operating Profit (EBITDA)**: ${concept_data['indicative_financials']['annual_operating_profit_usd']:,.2f} "
            f"({concept_data['indicative_financials']['operating_margin_pct']}% operating margin)\n"
            f"- **Break-Even Selling Price**: ${concept_data['indicative_financials']['breakeven_selling_price_usd_per_tonne']:,.2f} / tonne FOB\n"
            f"- **Simple Payback**: ~{concept_data['indicative_financials']['estimated_payback_years']} years\n\n"
            f"**Key Processing Workflow**:\n" + "\n".join([f"- {s}" for s in concept_data['machinery_and_processing_workflow']]) + "\n\n"
            f"**Regulatory & Compliance Checklist**:\n" + "\n".join([f"- {r}" for r in concept_data['regulatory_and_concessions_checklist']]) + "\n\n"
            f"**Recommended Next Steps**:\n" + "\n".join([f"1. {n}" for n in concept_data['recommended_next_steps']])
        )
        return {
            "answer": answer_text,
            "concept_data": concept_data,
            "citations": [
                {
                    "title": "Punjab Mineral Investment Concept Paper / PMDC Reference Specs",
                    "authority": "Directorate General Mines & Minerals Punjab",
                    "date": "2026-01-15",
                    "url": "https://mnm.punjab.gov.pk/investment_and_business_promotion"
                }
            ],
            "confidence": "high",
            "suggested_actions": ["Download Structured Concept Summary", "Adjust Assumptions in Feasibility Calculator", "Submit Investor Enquiry"]
        }

    # 3. Check for Financial Calculation requests
    if any(k in clean_lower for k in ["calculate", "feasibility", "breakeven", "break even", "capex", "payback", "operating profit"]):
        # Run base case deterministic calculation
        fin = calculate_feasibility({})
        answer_text = (
            f"### Preliminary Financial Model (Base Case: 25 TPD Food-Grade Facility)\n\n"
            f"Based on calibrated industry parameters for a modern optical-sorting and retail packaging facility in Punjab:\n\n"
            f"1. **Total Capital Expenditure (CAPEX)**: **${fin['capex']['total_capex']:,.2f}**\n"
            f"   - Machinery & Stainless SS316 Optical Line: ${fin['capex']['machinery_cost']:,.2f}\n"
            f"   - Industrial Facility & Shed: ${fin['capex']['land_building_cost']:,.2f}\n"
            f"   - Installation & Utilities: ${fin['capex']['installation_cost']:,.2f}\n"
            f"   - Initial Working Capital: ${fin['capex']['working_capital']:,.2f}\n\n"
            f"2. **Production Output**:\n"
            f"   - Annual Output: **{fin['production']['annual_finished_production_tonnes']:,.1f} Metric Tonnes** (at 75% utilization, 92% yield)\n\n"
            f"3. **Financial Returns**:\n"
            f"   - Projected Revenue (@ $320/t FOB): **${fin['financial_returns']['annual_revenue']:,.2f}**\n"
            f"   - Total OPEX: **${fin['opex']['total_annual_opex']:,.2f}** ($188.42/t finished)\n"
            f"   - **Operating Profit (EBITDA)**: **${fin['financial_returns']['annual_operating_profit']:,.2f}**\n"
            f"   - **Operating Margin**: **{fin['financial_returns']['operating_margin_pct']}%**\n"
            f"   - **Break-Even Selling Price**: **${fin['financial_returns']['breakeven_selling_price_per_tonne']:,.2f} / tonne**\n"
            f"   - **Estimated Payback Period**: **{fin['financial_returns']['estimated_payback_years']} years**\n\n"
            f"> *Note: You can adjust all 15 operational variables interactively in the Feasibility Calculator tab.*"
        )
        return {
            "answer": answer_text,
            "citations": [
                {
                    "title": "Export Development Fund (EDF) & Punjab Mineral Processing Guidelines",
                    "authority": "Trade Development Authority of Pakistan",
                    "date": "2025-12-01",
                    "url": "https://tdap.gov.pk"
                }
            ],
            "confidence": "high",
            "suggested_actions": ["Open Interactive Calculator", "Run Sensitivity Analysis", "Compare Optimistic Scenario"]
        }

    # 4. Grounded RAG Retrieval for Informational Queries
    relevant_docs = retrieve_relevant_corpus(clean_msg, limit=2)

    if not relevant_docs:
        # Fallback check against SQLite database knowledge docs
        conn = get_connection()
        cur = conn.cursor()
        search_term = f"%{clean_msg.split()[0]}%" if clean_msg.split() else "%salt%"
        cur.execute("SELECT title, issuing_authority, publication_date, summary, source_url FROM knowledge_docs WHERE title LIKE ? OR tags LIKE ? LIMIT 2", (search_term, search_term))
        db_rows = cur.fetchall()
        conn.close()

        if db_rows:
            row = db_rows[0]
            return {
                "answer": (
                    f"According to records published by **{row['issuing_authority']}** ({row['publication_date']}):\n\n"
                    f"{row['summary']}\n\n"
                    f"For specific project requirements or custom allocations, we invite you to register an investment enquiry with the Directorate."
                ),
                "citations": [
                    {
                        "title": row["title"],
                        "authority": row["issuing_authority"],
                        "date": row["publication_date"],
                        "url": row["source_url"]
                    }
                ],
                "confidence": "medium",
                "suggested_actions": ["View Knowledge Centre", "Explore Investment Opportunities"]
            }
        else:
            return {
                "answer": (
                    "I cannot confirm this from the available verified sources.\n\n"
                    "Our system maintains documented records on Punjab's Salt Range geological deposits (Khewra, Warcha, Kalabagh), "
                    "mining concession regulations (2022 rules), export procedures via Pakistan Single Window, "
                    "and preliminary project economics for value-addition facilities. "
                    "Would you like information on one of these verified areas?"
                ),
                "citations": [],
                "confidence": "unverified",
                "suggested_actions": ["Ask about Khewra or Warcha resources", "Ask about processing permits vs mining leases", "Ask about export procedures"]
            }

    # Synthesize grounded answer from top retrieved document
    primary_doc = relevant_docs[0]
    supporting_doc = relevant_docs[1] if len(relevant_docs) > 1 else None

    answer_parts = [
        f"### {primary_doc['title']}\n",
        f"{primary_doc['content']}\n"
    ]
    if supporting_doc:
        answer_parts.append(f"\n**Additional Context from {supporting_doc['authority']}**:\n{supporting_doc['content']}\n")

    citations = [
        {
            "title": doc["title"],
            "authority": doc["authority"],
            "date": doc["date"],
            "url": doc["source_url"]
        }
        for doc in relevant_docs
    ]

    return {
        "answer": "\n".join(answer_parts),
        "citations": citations,
        "confidence": "high",
        "suggested_actions": ["Explore Related Business Models", "Open Site Selector Tool", "Generate Feasibility Outline"]
    }
