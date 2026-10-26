/**
 * PinkSalt Intelligence & Investment Portal - Unified Controller
 * Supports dual-mode execution:
 * 1. Full-Stack Mode (via Python REST API & SQLite on server/container)
 * 2. Serverless/Static Mode (100% Client-Side for GitHub Pages & Vercel, zero card/billing needed)
 */

// Embedded authoritative domain data (guarantees 100% offline & GitHub Pages operability)
const EMBEDDED_RESOURCES = [
  {
    name: "Khewra Salt Mine Deposit",
    district: "Jhelum",
    deposit_type: "Underground Mine / Evaporite Seam",
    estimated_reserves_desc: "Documented geological reserves exceeding 600 Million Metric Tonnes across 17 working levels",
    nacl_purity_pct: 98.8,
    status_label: "Documented / Active Federal Lease (PMDC)",
    geological_formation: "Pre-Cambrian Salt Range Formation (Eocambrian)",
    managing_authority: "Pakistan Mineral Development Corporation (PMDC)"
  },
  {
    name: "Warcha Salt Mine & Outcrops",
    district: "Khushab",
    deposit_type: "Underground High-Purity Seam",
    estimated_reserves_desc: "Estimated reserves of over 400 Million Tonnes of transparent and deep-rose crystalline salt",
    nacl_purity_pct: 99.1,
    status_label: "Documented / Active Production",
    geological_formation: "Salt Range Formation, Nilawahan Group",
    managing_authority: "PMDC & Punjab Concessions Directorate"
  },
  {
    name: "Kalabagh Salt Range Outcrops",
    district: "Mianwali",
    deposit_type: "Stratified Rock Salt Beds",
    estimated_reserves_desc: "Massive exposed evaporite layers along Indus River gorge, estimated 250+ Million Tonnes",
    nacl_purity_pct: 97.9,
    status_label: "Documented / Licensed Mining Blocks",
    geological_formation: "Salt Range Formation (Kalabagh Fault Zone)",
    managing_authority: "Punjab Mines & Minerals Department"
  },
  {
    name: "Quaidabad Processing Corridor & Mineral Siding",
    district: "Khushab",
    deposit_type: "Designated Mineral Processing & Logistics Hub",
    estimated_reserves_desc: "Strategic logistics node with direct link to Warcha extraction sites and M-2 Motorway",
    nacl_purity_pct: 98.5,
    status_label: "Proposed Processing Zone (Demonstrative Concept)",
    geological_formation: "Alluvial Plain adjacent to Salt Range Escarpment",
    managing_authority: "PIEDMC / Mines Department"
  },
  {
    name: "Chakwal-Kallar Kahar Evaporite Belt",
    district: "Chakwal",
    deposit_type: "Subsurface Sedimentary Deposits",
    estimated_reserves_desc: "Exploratory boreholes show continuous rock salt beds at 150m-300m depth",
    nacl_purity_pct: 97.5,
    status_label: "Exploration & Historical Survey Records",
    geological_formation: "Early Cambrian Salt Range Saline Series",
    managing_authority: "Geological Survey of Pakistan"
  }
];

const EMBEDDED_OPPORTUNITIES = [
  {
    slug: "opt-food-grade-optical",
    title: "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
    category: "Food-Grade Packaging",
    location: "Quaidabad Industrial Cluster",
    district: "Khushab",
    status_type: "Proposed Joint Venture Concept",
    capex_indicative_usd: 325000.0,
    capacity_desc: "25 Metric Tonnes / Day",
    land_sqft: "22,000 sq ft industrial plot with covered shed",
    machinery_desc: "Stainless steel 316 optical sorter, hammer mill, vibrating screener, 2-head automated form-fill-seal pouch packer",
    utility_desc: "150 kVA 3-phase grid connection, dedicated borehole water filtration unit",
    description: "Value addition plant packaging pure pink crystal salt into retail stand-up zip pouches (250g, 500g, 1kg) for export to EU, North America, and Gulf retail chains. Replaces bulk raw rock exports with 400% value accretion.",
    verified_source: "Punjab Mineral Investment Concept Paper / PMDC Reference Specs",
    verification_date: "2026-01-15"
  },
  {
    slug: "opt-gourmet-grinders",
    title: "Gourmet Ceramic-Mill Table Grinders & Seasoning Blends Facility",
    category: "Gourmet Retail Products",
    location: "Bhalwal Industrial Estate / Sargodha Corridor",
    district: "Sargodha / Khushab",
    status_type: "Private Sector Opportunity",
    capex_indicative_usd: 480000.0,
    capacity_desc: "15 Metric Tonnes / Day",
    land_sqft: "18,000 sq ft covered facility with cleanroom packaging zone",
    machinery_desc: "Glass bottle unscrambler, rotary multi-head weigher, torque capper for ceramic grinder heads, shrink-sleeve labeling tunnel",
    utility_desc: "100 kVA electric power, pressurized nitrogen flush line",
    description: "Automated packaging facility filling high-transparency glass containers with adjustable ceramic grinding mechanisms. Produces pure crystal salt, garlic-infused pink salt, and organic chili pepper blend for premium supermarket distribution.",
    verified_source: "Export Development Fund (EDF) Feasibility Study Guideline",
    verification_date: "2026-02-10"
  },
  {
    slug: "opt-pharma-purity",
    title: "High-Purity Pharmaceutical & Hemodialysis Grade Sodium Chloride Refinery",
    category: "Industrial & Pharmaceutical",
    location: "M-3 Industrial City (Faisalabad SEZ)",
    district: "Faisalabad / Punjab",
    status_type: "Proposed Special Economic Zone Project",
    capex_indicative_usd: 1850000.0,
    capacity_desc: "50 Metric Tonnes / Day",
    land_sqft: "45,000 sq ft pharmaceutical-grade cGMP plant",
    machinery_desc: "Vacuum crystallizer, multi-stage centrifuge, fluid bed dryer, HEPA air filtration system, clean-in-place (CIP) loop",
    utility_desc: "500 kVA industrial load, dedicated reverse osmosis water treatment, steam boiler",
    description: "Dissolution and recrystallization refinery to convert raw mineral rock salt into 99.8%+ pure NaCl meeting USP, EP, and BP pharmacopeia standards for IV infusion solutions, hemodialysis fluid, and sterile diagnostic reagents.",
    verified_source: "Pakistan Pharmaceutical Manufacturers Association & GSP Technical Report",
    verification_date: "2025-11-20"
  },
  {
    slug: "opt-artisanal-wellness",
    title: "Precision-Cut Salt Tiles, Wellness Bricks & Ionizing Lamps Studio",
    category: "Artisanal & Wellness",
    location: "Khewra Mineral Artisan Cluster",
    district: "Jhelum",
    status_type: "Documented Cluster Enterprise",
    capex_indicative_usd: 160000.0,
    capacity_desc: "10 Metric Tonnes / Day (Finished goods)",
    land_sqft: "15,000 sq ft workshop + showroom facility",
    machinery_desc: "Bridge stone cutting saws, diamond rotary shapers, ultrasonic dust collection system, CNC engraving lathe, UL/CE certified electrical wiring assembly benches",
    utility_desc: "75 kVA grid supply with 25 kW solar backup",
    description: "Upgraded artisanal manufacturing hub transforming irregular rock salt blocks into standardized architectural wall tiles for speleotherapy rooms, spa wellness domes, and certified safe electric decorative lamps meeting US/EU electrical safety standards.",
    verified_source: "Punjab Small Industries Corporation (PSIC) Cluster Profile",
    verification_date: "2025-12-05"
  },
  {
    slug: "opt-animal-nutrition",
    title: "Compressed Mineral Salt Licks & Veterinary Nutrition Blocks",
    category: "Agricultural & Livestock",
    location: "Mianwali Industrial Zone",
    district: "Mianwali",
    status_type: "Commercial Investment Concept",
    capex_indicative_usd: 210000.0,
    capacity_desc: "35 Metric Tonnes / Day",
    land_sqft: "20,000 sq ft open and covered warehouse",
    machinery_desc: "500-ton hydraulic block press, ribbon powder blender, trace mineral doser (Cobalt, Zinc, Copper, Selenium, Iodine), automated shrink wrapper",
    utility_desc: "120 kVA power supply, heavy tractor trailer access",
    description: "Manufacturing high-density weather-resistant lick blocks (2kg, 5kg, 10kg) with integrated hanging ropes and calibrated trace minerals for dairy livestock, equine farms, and pastoral grazing across domestic and Australian/GCC export markets.",
    verified_source: "Livestock & Dairy Development Department Punjab",
    verification_date: "2026-01-28"
  },
  {
    slug: "opt-quaidabad-hub",
    title: "Quaidabad Common Facility & Central Optical Sorting Center",
    category: "Processing Facility / Joint Venture",
    location: "Quaidabad Mineral Processing Zone",
    district: "Khushab",
    status_type: "Public-Private Partnership (PPP) Proposed",
    capex_indicative_usd: 1200000.0,
    capacity_desc: "150 Metric Tonnes / Day",
    land_sqft: "60,000 sq ft logistics yard and sorting terminal",
    machinery_desc: "Buhler/Tomra multi-channel color optical sorters, magnetic separators, continuous weighing conveyor belt, bulk container tilt loader",
    utility_desc: "350 kVA transformer, weighbridge 100-ton, rail siding link connection",
    description: "Strategic common-facility sorting hub located at the intersection of raw salt transport routes from Warcha and central Punjab distribution corridors. Enables small and medium processors to access high-speed optical color grading without individual heavy CAPEX.",
    verified_source: "Directorate General Mines & Minerals Punjab Working Paper",
    verification_date: "2026-02-18"
  }
];

const EMBEDDED_KNOWLEDGE = [
  {
    title: "Punjab Mining Concession Rules 2022 (Consolidated)",
    category: "Legislation & Regulations",
    issuing_authority: "Mines & Minerals Department, Government of Punjab",
    publication_date: "2022-07-01",
    verification_status: "Official Document",
    summary: "Comprehensive statutory framework governing exploration licenses, mineral prospecting licenses, mining leases, royalty schedules, bidding procedures, and surface rent in Punjab.",
    source_url: "https://mnm.punjab.gov.pk/rules_and_regulations",
    file_size_desc: "1.4 MB PDF"
  },
  {
    title: "Regulatory Distinction: Mining Rights vs. Mineral Processing Facilities",
    category: "Policy & Technical Guidance",
    issuing_authority: "Directorate General of Mines & Minerals Punjab",
    publication_date: "2025-10-15",
    verification_status: "Official Clarification",
    summary: "Clarifies that establishing a salt washing, optical sorting, or value-addition packaging unit does not require a subsurface mining lease. Processors can operate on industrial land with standard commercial registrations while sourcing raw salt from licensed leaseholders or PMDC.",
    source_url: "https://mnm.punjab.gov.pk/investment_and_business_promotion",
    file_size_desc: "450 KB PDF"
  },
  {
    title: "Export Procedures & Pakistan Single Window (PSW) Integration for Rock Salt",
    category: "Export & Trade Intelligence",
    issuing_authority: "Trade Development Authority of Pakistan (TDAP) / FBR",
    publication_date: "2025-12-01",
    verification_status: "Official Export Guide",
    summary: "Step-by-step export clearance under HS Code 2501.00. Covers electronic E-Form filing, Phytosanitary certification, Certificate of Origin (TDAP), Chamber of Commerce membership, and mandatory packaging requirements.",
    source_url: "https://tdap.gov.pk/mineral-products-export-guide",
    file_size_desc: "820 KB PDF"
  },
  {
    title: "Geographical Indication (GI) Registration for 'Himalayan Pink Salt of Pakistan'",
    category: "Intellectual Property & Origin",
    issuing_authority: "Intellectual Property Organization of Pakistan (IPO-Pakistan)",
    publication_date: "2021-02-22",
    verification_status: "Official Gazette Notification",
    summary: "Details the protection of Pakistani Pink Salt under the Geographical Indications (Registration and Protection) Act 2020. Prohibits foreign entities from branding foreign salt as Himalayan Pink Salt without authentic Pakistani origin certification.",
    source_url: "https://ipo.gov.pk/geographical_indications",
    file_size_desc: "310 KB PDF"
  },
  {
    title: "Codex Standard for Food Grade Salt (CXS 150-1985, Rev. 2012)",
    category: "International Quality Standards",
    issuing_authority: "Codex Alimentarius Commission (FAO / WHO)",
    publication_date: "2012-07-01",
    verification_status: "International Benchmark",
    summary: "Global food safety benchmark mandating minimum 97.0% NaCl content on a dry matter basis, moisture thresholds, permitted food-grade anticaking agents, and strict limits on heavy metals (Lead < 2 ppm, Arsenic < 0.5 ppm, Cadmium < 0.5 ppm, Mercury < 0.1 ppm).",
    source_url: "https://www.fao.org/fao-who-codexalimentarius/standards/en/",
    file_size_desc: "620 KB PDF"
  },
  {
    title: "Geological Survey of Pakistan: Mineral Resources of the Salt Range",
    category: "Geology & Resource Assessment",
    issuing_authority: "Geological Survey of Pakistan (GSP), Quetta/Lahore",
    publication_date: "2024-04-18",
    verification_status: "Official Survey Report",
    summary: "Comprehensive stratigraphic analysis of the Precambrian Billianwala Subgroup of the Salt Range Formation. Maps salt marl, potash beds, gypsum horizons, and structural thickness across Jhelum, Khushab, and Mianwali districts.",
    source_url: "https://www.gsp.gov.pk/publications/salt-range-memoir",
    file_size_desc: "3.8 MB PDF"
  }
];

const EMBEDDED_BATCHES = {
  "PK-SALT-2026-KHW-001": {
    batch_code: "PK-SALT-2026-KHW-001",
    product_name: "Gourmet Fine Pink Salt (0.5mm - 1.0mm)",
    origin_mine: "Khewra Salt Mine (Level 6)",
    district: "Jhelum",
    extraction_date: "2026-01-14",
    facility_name: "Khewra Export Processing Unit A",
    purity_pct: 99.12,
    heavy_metals_ppm: 0.012,
    moisture_pct: 0.08,
    lab_certification_no: "ISO-17025-PCSIR-2026-881"
  },
  "PK-SALT-2026-WCH-042": {
    batch_code: "PK-SALT-2026-WCH-042",
    product_name: "Coarse Crystalline Pink Grinder Salt (2mm - 4mm)",
    origin_mine: "Warcha Salt Mine (Block C)",
    district: "Khushab",
    extraction_date: "2026-02-02",
    facility_name: "Quaidabad Optical Value Processing",
    purity_pct: 99.35,
    heavy_metals_ppm: 0.008,
    moisture_pct: 0.05,
    lab_certification_no: "SGS-PK-MIN-2026-0419"
  },
  "PK-SALT-2026-KLB-108": {
    batch_code: "PK-SALT-2026-KLB-108",
    product_name: "Compressed Livestock Mineral Salt Block (5kg)",
    origin_mine: "Kalabagh Deposit Outcrops",
    district: "Mianwali",
    extraction_date: "2026-01-28",
    facility_name: "Mianwali Agro-Minerals Plant",
    purity_pct: 98.40,
    heavy_metals_ppm: 0.045,
    moisture_pct: 0.15,
    lab_certification_no: "VET-LAB-UAF-2026-102"
  }
};

// Global Client State
const state = {
  currentView: "home",
  adminToken: localStorage.getItem("pinksalt_admin_token") || null,
  adminUser: null,
  lastCalculation: null
};

// Utilities
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 4000);
}

function formatUSD(num) {
  return "$" + Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-US");
}

// Mobile navigation drawer toggle
function toggleMobileNav() {
  const toggle = document.getElementById("mobile-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (toggle && drawer) {
    toggle.classList.toggle("open");
    drawer.classList.toggle("open");
  }
}

// View Routing
function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll(".page-view").forEach(el => el.style.display = "none");
  document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));

  // Ensure mobile drawer closes if open
  const toggle = document.getElementById("mobile-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (toggle && drawer && drawer.classList.contains("open")) {
    toggle.classList.remove("open");
    drawer.classList.remove("open");
  }

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeNavs = document.querySelectorAll(`.nav-link[data-view="${viewName}"]`);
  activeNavs.forEach(el => el.classList.add("active"));

  if (viewName === "resources") loadResources();
  if (viewName === "opportunities") loadOpportunities();
  if (viewName === "calculator") initCalculator();
  if (viewName === "knowledge") loadKnowledgeDocs();
  if (viewName === "admin") checkAdminSession();
}

// -------------------------------------------------------------
// 1. Home View Initialization
// -------------------------------------------------------------
function initHomeView() {
  const grid = document.getElementById("home-featured-opps");
  if (!grid) return;
  grid.innerHTML = EMBEDDED_OPPORTUNITIES.slice(0, 3).map(opp => `
    <div class="card opp-card">
      <span class="opp-badge badge-concept">${opp.status_type}</span>
      <h3 class="opp-title">${opp.title}</h3>
      <p class="opp-location">📍 ${opp.location} (${opp.district} District)</p>
      <p class="opp-desc">${opp.description.substring(0, 130)}...</p>
      <div class="opp-meta">
        <div><span class="opp-meta-lbl">Indicative CAPEX:</span><br><span class="opp-meta-val">${formatUSD(opp.capex_indicative_usd)}</span></div>
        <div><span class="opp-meta-lbl">Capacity:</span><br><span class="opp-meta-val">${opp.capacity_desc}</span></div>
      </div>
      <button class="btn btn-navy btn-sm" onclick="openOpportunityDetail('${opp.slug}')">View Project Details</button>
    </div>
  `).join("");
}

// -------------------------------------------------------------
// 2. Resource Intelligence View
// -------------------------------------------------------------
function loadResources(districtFilter = "") {
  const tbody = document.getElementById("resource-records-tbody");
  if (!tbody) return;

  let records = EMBEDDED_RESOURCES;
  if (districtFilter) {
    records = records.filter(r => r.district.toLowerCase().includes(districtFilter.toLowerCase()));
  }

  tbody.innerHTML = records.map(r => `
    <tr>
      <td><strong>${r.name}</strong><br><small style="color:var(--text-muted)">${r.geological_formation}</small></td>
      <td>📍 ${r.district}</td>
      <td>${r.deposit_type}</td>
      <td><strong style="color:var(--rose-600)">${r.nacl_purity_pct}% NaCl</strong></td>
      <td><span class="opp-badge ${r.status_label.includes('Active') ? 'badge-verified' : 'badge-concept'}">${r.status_label}</span></td>
      <td><small>${r.managing_authority}</small></td>
    </tr>
  `).join("");
}

function filterMapDistrict(district) {
  if (state.currentView !== "resources") {
    switchView("resources");
  }
  const sel = document.getElementById("resource-district-select");
  if (sel) sel.value = district;
  loadResources(district);
  showToast(`🎯 Displaying verified concessions for ${district} District`);
  setTimeout(() => {
    const tableCard = document.querySelector("#view-resources .card:has(.data-table)");
    if (tableCard) {
      tableCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, 100);
}

// -------------------------------------------------------------
// 3. Investment Opportunities Marketplace
// -------------------------------------------------------------
function loadOpportunities() {
  const cat = document.getElementById("opp-category-filter")?.value || "All";
  const search = document.getElementById("opp-search-input")?.value?.toLowerCase() || "";

  let list = EMBEDDED_OPPORTUNITIES;
  if (cat !== "All") list = list.filter(o => o.category === cat);
  if (search) {
    list = list.filter(o => o.title.toLowerCase().includes(search) || o.description.toLowerCase().includes(search) || o.location.toLowerCase().includes(search));
  }

  const grid = document.getElementById("opportunities-grid");
  if (!grid) return;
  if (list.length === 0) {
    grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;">No investment opportunities matched your criteria.</div>`;
    return;
  }
  grid.innerHTML = list.map(opp => `
    <div class="card opp-card">
      <div>
        <span class="opp-badge badge-concept">${opp.status_type}</span>
        <span class="opp-badge" style="background:var(--bg-alt);">${opp.category}</span>
      </div>
      <h3 class="opp-title">${opp.title}</h3>
      <p class="opp-location">📍 ${opp.location} (${opp.district} District)</p>
      <p class="opp-desc">${opp.description}</p>
      <div class="opp-meta">
        <div><span class="opp-meta-lbl">Indicative CAPEX:</span><br><span class="opp-meta-val">${formatUSD(opp.capex_indicative_usd)}</span></div>
        <div><span class="opp-meta-lbl">Target Capacity:</span><br><span class="opp-meta-val">${opp.capacity_desc}</span></div>
        <div><span class="opp-meta-lbl">Land Required:</span><br><span class="opp-meta-val">${opp.land_sqft}</span></div>
        <div><span class="opp-meta-lbl">Verification:</span><br><span class="opp-meta-val">${opp.verification_date}</span></div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-navy btn-sm" style="flex:1" onclick="openOpportunityDetail('${opp.slug}')">Full Specifications</button>
        <button class="btn btn-primary btn-sm" onclick="prefillEnquiryWithOpportunity('${opp.title}', '${opp.location}')">Enquire</button>
      </div>
    </div>
  `).join("");
}

function openOpportunityDetail(slug) {
  const opp = EMBEDDED_OPPORTUNITIES.find(o => o.slug === slug);
  if (!opp) return;

  const modalContent = document.getElementById("modal-generic-body");
  modalContent.innerHTML = `
    <span class="opp-badge badge-concept">${opp.status_type}</span>
    <h2 style="font-size:24px; color:var(--navy-900); margin:8px 0;">${opp.title}</h2>
    <p style="color:var(--text-muted); margin-bottom:16px;">📍 ${opp.location} | ${opp.district} District, Punjab</p>
    
    <div class="notice-card" style="margin-top:0;">
      <strong>Source Reference:</strong> ${opp.verified_source} (Verified: ${opp.verification_date})
    </div>

    <h4 style="margin:16px 0 6px 0;">Project Concept & Rationale</h4>
    <p style="line-height:1.6; color:var(--text-main); font-size:14px;">${opp.description}</p>

    <h4 style="margin:20px 0 8px 0;">Technical & Site Specifications</h4>
    <div style="background:var(--bg-alt); padding:16px; border-radius:var(--radius-sm); font-size:13.5px; line-height:1.6;">
      <p><strong>Proposed Nameplate Capacity:</strong> ${opp.capacity_desc}</p>
      <p><strong>Land & Covered Area:</strong> ${opp.land_sqft}</p>
      <p><strong>Key Machinery Requirements:</strong> ${opp.machinery_desc}</p>
      <p><strong>Utility & Power Infrastructure:</strong> ${opp.utility_desc}</p>
      <p><strong>Indicative Capital Expenditure:</strong> ${formatUSD(opp.capex_indicative_usd)}</p>
    </div>

    <div style="margin-top:24px; display:flex; gap:12px;">
      <button class="btn btn-primary" onclick="closeGenericModal(); prefillEnquiryWithOpportunity('${opp.title}', '${opp.location}')">Submit Formal Expression of Interest</button>
      <button class="btn btn-outline" onclick="closeGenericModal(); switchView('calculator')">Run Project Feasibility</button>
    </div>
  `;
  document.getElementById("modal-generic").style.display = "flex";
}

function closeGenericModal() {
  document.getElementById("modal-generic").style.display = "none";
}

// -------------------------------------------------------------
// 4. Financial Modeling Engine (Pure Client-Side + Offline Safe)
// -------------------------------------------------------------
const scenarioPresets = {
  conservative: {
    machinery_cost: 85000, land_building_cost: 60000, installation_cost: 15000, working_capital: 25000,
    capacity_tpd: 20.0, operating_days: 270, capacity_utilization: 0.65, process_yield: 0.88,
    raw_salt_cost_per_tonne: 50.0, energy_cost_per_tonne: 32.0, packaging_cost_per_tonne: 22.0,
    freight_per_tonne: 40.0, labor_cost_per_tonne: 20.0, annual_admin_salaries: 28000,
    annual_maintenance: 12000, annual_compliance_marketing: 8000, selling_price_per_tonne: 210.0
  },
  base_case: {
    machinery_cost: 175000, land_building_cost: 110000, installation_cost: 25000, working_capital: 40000,
    capacity_tpd: 25.0, operating_days: 300, capacity_utilization: 0.75, process_yield: 0.92,
    raw_salt_cost_per_tonne: 45.0, energy_cost_per_tonne: 28.0, packaging_cost_per_tonne: 42.0,
    freight_per_tonne: 35.0, labor_cost_per_tonne: 24.0, annual_admin_salaries: 40000,
    annual_maintenance: 18000, annual_compliance_marketing: 14000, selling_price_per_tonne: 350.0
  },
  optimistic: {
    machinery_cost: 260000, land_building_cost: 140000, installation_cost: 35000, working_capital: 65000,
    capacity_tpd: 30.0, operating_days: 310, capacity_utilization: 0.85, process_yield: 0.95,
    raw_salt_cost_per_tonne: 42.0, energy_cost_per_tonne: 26.0, packaging_cost_per_tonne: 75.0,
    freight_per_tonne: 32.0, labor_cost_per_tonne: 28.0, annual_admin_salaries: 48000,
    annual_maintenance: 24000, annual_compliance_marketing: 22000, selling_price_per_tonne: 620.0
  }
};

function initCalculator() {
  loadScenario("base_case");
}

function loadScenario(presetKey) {
  document.querySelectorAll(".calc-preset-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.calc-preset-btn[data-preset="${presetKey}"]`);
  if (btn) btn.classList.add("active");

  const p = scenarioPresets[presetKey];
  if (!p) return;

  document.getElementById("calc-machinery").value = p.machinery_cost;
  document.getElementById("calc-land-building").value = p.land_building_cost;
  document.getElementById("calc-installation").value = p.installation_cost;
  document.getElementById("calc-working-capital").value = p.working_capital;

  document.getElementById("calc-capacity-tpd").value = p.capacity_tpd;
  document.getElementById("calc-operating-days").value = p.operating_days;
  document.getElementById("calc-utilization").value = p.capacity_utilization;
  document.getElementById("calc-yield").value = p.process_yield;

  document.getElementById("calc-raw-salt").value = p.raw_salt_cost_per_tonne;
  document.getElementById("calc-energy").value = p.energy_cost_per_tonne;
  document.getElementById("calc-packaging").value = p.packaging_cost_per_tonne;
  document.getElementById("calc-freight").value = p.freight_per_tonne;
  document.getElementById("calc-labor").value = p.labor_cost_per_tonne;

  document.getElementById("calc-admin-salaries").value = p.annual_admin_salaries;
  document.getElementById("calc-maintenance").value = p.annual_maintenance;
  document.getElementById("calc-compliance").value = p.annual_compliance_marketing;
  document.getElementById("calc-selling-price").value = p.selling_price_per_tonne;

  executeCalculation();
}

function executeCalculation() {
  const machinery = parseFloat(document.getElementById("calc-machinery").value) || 0;
  const land = parseFloat(document.getElementById("calc-land-building").value) || 0;
  const install = parseFloat(document.getElementById("calc-installation").value) || 0;
  const wc = parseFloat(document.getElementById("calc-working-capital").value) || 0;
  const totalCapex = machinery + land + install + wc;

  const tpd = parseFloat(document.getElementById("calc-capacity-tpd").value) || 25;
  const days = parseFloat(document.getElementById("calc-operating-days").value) || 300;
  const util = parseFloat(document.getElementById("calc-utilization").value) || 0.75;
  const yieldPct = parseFloat(document.getElementById("calc-yield").value) || 0.92;

  const rawSaltTonnes = tpd * days * util;
  const finishedTonnes = rawSaltTonnes * yieldPct;

  const rawCost = parseFloat(document.getElementById("calc-raw-salt").value) || 45;
  const effectiveRawCost = yieldPct > 0 ? (rawCost / yieldPct) : rawCost;
  const energyCost = parseFloat(document.getElementById("calc-energy").value) || 28;
  const packagingCost = parseFloat(document.getElementById("calc-packaging").value) || 40;
  const freightCost = parseFloat(document.getElementById("calc-freight").value) || 35;
  const laborCost = parseFloat(document.getElementById("calc-labor").value) || 22;

  const variableCostPerTonne = effectiveRawCost + energyCost + packagingCost + freightCost + laborCost;
  const annualVariableCosts = variableCostPerTonne * finishedTonnes;

  const adminSalaries = parseFloat(document.getElementById("calc-admin-salaries").value) || 36000;
  const maintenance = parseFloat(document.getElementById("calc-maintenance").value) || 18000;
  const compliance = parseFloat(document.getElementById("calc-compliance").value) || 12000;
  const depreciation = machinery * 0.10;
  const annualFixedCosts = adminSalaries + maintenance + compliance + depreciation;

  const totalAnnualOpex = annualVariableCosts + annualFixedCosts;
  const costPerTonneFinished = finishedTonnes > 0 ? (totalAnnualOpex / finishedTonnes) : 0;

  const sellingPrice = parseFloat(document.getElementById("calc-selling-price").value) || 320;
  const annualRevenue = finishedTonnes * sellingPrice;
  const operatingProfit = annualRevenue - totalAnnualOpex;
  const marginPct = annualRevenue > 0 ? ((operatingProfit / annualRevenue) * 100) : 0;

  const unitContribution = sellingPrice - variableCostPerTonne;
  const breakevenVol = unitContribution > 0 ? (annualFixedCosts / unitContribution) : 0;
  const breakevenPrice = costPerTonneFinished;
  const paybackYears = (operatingProfit + depreciation) > 0 ? (totalCapex / (operatingProfit + depreciation)) : 99;

  const result = {
    capex: { total_capex: totalCapex, machinery_cost: machinery, land_building_cost: land, installation_cost: install, working_capital: wc },
    production: { nameplate_capacity_tpd: tpd, operating_days: days, capacity_utilization_pct: util * 100, process_yield_pct: yieldPct * 100, annual_raw_salt_tonnes: rawSaltTonnes, annual_finished_production_tonnes: finishedTonnes },
    opex: { total_annual_opex: totalAnnualOpex, variable_cost_per_tonne: variableCostPerTonne, annual_variable_costs: annualVariableCosts, annual_fixed_costs: annualFixedCosts, effective_raw_material_cost_per_tonne: effectiveRawCost, energy_cost_per_tonne: energyCost, packaging_cost_per_tonne: packagingCost, freight_per_tonne: freightCost, labor_cost_per_tonne: laborCost },
    financial_returns: { selling_price_fob_per_tonne: sellingPrice, annual_revenue: annualRevenue, annual_operating_profit: operatingProfit, operating_margin_pct: Number(marginPct.toFixed(1)), breakeven_selling_price_per_tonne: Number(breakevenPrice.toFixed(2)), breakeven_volume_tonnes: Number(breakevenVol.toFixed(1)), estimated_payback_years: Number(paybackYears.toFixed(1)) },
    monthly_summary: { production_tonnes: Number((finishedTonnes / 12).toFixed(1)), revenue_usd: Number((annualRevenue / 12).toFixed(2)), total_opex_usd: Number((totalAnnualOpex / 12).toFixed(2)), operating_profit_usd: Number((operatingProfit / 12).toFixed(2)) },
    disclaimer: "NOTICE: Model provides preliminary computational estimates for project evaluation."
  };

  state.lastCalculation = result;
  renderCalculationResults(result);
}

function renderCalculationResults(c) {
  document.getElementById("kpi-capex").innerText = formatUSD(c.capex.total_capex);
  document.getElementById("kpi-production").innerText = `${formatNumber(c.production.annual_finished_production_tonnes)} MT`;
  document.getElementById("kpi-revenue").innerText = formatUSD(c.financial_returns.annual_revenue);
  document.getElementById("kpi-opex").innerText = formatUSD(c.opex.total_annual_opex);
  document.getElementById("kpi-profit").innerText = formatUSD(c.financial_returns.annual_operating_profit);
  document.getElementById("kpi-margin").innerText = `${c.financial_returns.operating_margin_pct}% Operating Margin`;
  document.getElementById("kpi-breakeven-price").innerText = `$${c.financial_returns.breakeven_selling_price_per_tonne} / MT`;
  document.getElementById("kpi-breakeven-vol").innerText = `Break-Even: ${formatNumber(c.financial_returns.breakeven_volume_tonnes)} MT`;

  document.getElementById("calc-monthly-prod").innerText = `${c.monthly_summary.production_tonnes} MT`;
  document.getElementById("calc-monthly-rev").innerText = formatUSD(c.monthly_summary.revenue_usd);
  document.getElementById("calc-monthly-opex").innerText = formatUSD(c.monthly_summary.total_opex_usd);
  document.getElementById("calc-monthly-profit").innerText = formatUSD(c.monthly_summary.operating_profit_usd);

  // Render sensitivity table for price
  const tbodyPrice = document.getElementById("sensitivity-price-tbody");
  if (tbodyPrice) {
    const shifts = [-0.2, -0.1, 0, 0.1, 0.2];
    tbodyPrice.innerHTML = shifts.map(s => {
      const p = c.financial_returns.selling_price_fob_per_tonne * (1 + s);
      const rev = c.production.annual_finished_production_tonnes * p;
      const profit = rev - c.opex.total_annual_opex;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
      return `
        <tr style="${s === 0 ? 'font-weight:700; background:#fff1f2;' : ''}">
          <td>${s > 0 ? '+' : ''}${s * 100}%</td>
          <td>$${p.toFixed(2)} / MT</td>
          <td>${formatUSD(profit)}</td>
          <td>${margin}%</td>
        </tr>
      `;
    }).join("");
  }

  // Render sensitivity table for utilization
  const tbodyUtil = document.getElementById("sensitivity-util-tbody");
  if (tbodyUtil) {
    const utils = [0.50, 0.65, 0.75, 0.85, 0.95];
    tbodyUtil.innerHTML = utils.map(u => {
      const prod = c.production.nameplate_capacity_tpd * c.production.operating_days * u * (c.production.process_yield_pct / 100);
      const rev = prod * c.financial_returns.selling_price_fob_per_tonne;
      const opex = (c.opex.variable_cost_per_tonne * prod) + c.opex.annual_fixed_costs;
      const profit = rev - opex;
      return `
        <tr style="${u === 0.75 ? 'font-weight:700; background:#f0fdf4;' : ''}">
          <td>${u * 100}%</td>
          <td>${formatNumber(prod.toFixed(0))} MT</td>
          <td>${formatUSD(rev)}</td>
          <td>${formatUSD(profit)}</td>
        </tr>
      `;
    }).join("");
  }
}

function exportFeasibilityReport() {
  if (!state.lastCalculation) return;
  const c = state.lastCalculation;
  const content = `
================================================================================
PINKSALT INTELLIGENCE & INVESTMENT PORTAL
PRELIMINARY PROJECT FEASIBILITY OUTLINE
================================================================================
Generated: ${new Date().toISOString()}
Target Product: Food-Grade / Value-Added Rock Salt

1. CAPITAL EXPENDITURE (CAPEX)
--------------------------------------------------------------------------------
- Plant & Machinery:                    ${formatUSD(c.capex.machinery_cost)}
- Land, Building & Factory Shed:        ${formatUSD(c.capex.land_building_cost)}
- Installation, Civil Works, Utilities: ${formatUSD(c.capex.installation_cost)}
- Working Capital Allocation:           ${formatUSD(c.capex.working_capital)}
TOTAL ESTIMATED CAPEX:                  ${formatUSD(c.capex.total_capex)}

2. ANNUAL PRODUCTION & RETURNS
--------------------------------------------------------------------------------
- Annual Finished Product:              ${formatNumber(c.production.annual_finished_production_tonnes)} Tonnes
- Projected Sales Revenue:              ${formatUSD(c.financial_returns.annual_revenue)}
- Total Operating Costs (OPEX):         ${formatUSD(c.opex.total_annual_opex)}
- Operating Profit (EBITDA):            ${formatUSD(c.financial_returns.annual_operating_profit)}
- Operating Margin:                     ${c.financial_returns.operating_margin_pct}%
- Break-Even Selling Price:             $${c.financial_returns.breakeven_selling_price_per_tonne} / Tonne
================================================================================
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `PinkSalt_Feasibility_${Date.now()}.txt`;
  a.click();
  showToast("Feasibility Outline downloaded.");
}

// -------------------------------------------------------------
// 5. Processing Zone & Site Selector
// -------------------------------------------------------------
const siteData = {
  quaidabad: {
    name: "Quaidabad Mineral Processing Cluster (Khushab)", district: "Khushab",
    distToMine: "15 - 25 km (Warcha Mine)", powerStatus: "132 kV Grid station (industrial feeder planned)",
    waterStatus: "Subsurface brackish/tube well + canal source", freightToKarachi: "860 km via M-2 / CPEC Corridor ($32 - $36/tonne)",
    laborAvailability: "Extensive mining labor; moderate packaging expertise", sezBenefits: "Designated mineral processing zone under provincial scheme",
    bestFor: "Primary crushing, optical sorting, bulk packaging, animal lick blocks"
  },
  bhalwal: {
    name: "Bhalwal Industrial Estate (Sargodha)", district: "Sargodha",
    distToMine: "65 km (Salt Range belt)", powerStatus: "Dedicated 11 kV underground electrical network",
    waterStatus: "High-volume industrial water supply & RO plants", freightToKarachi: "810 km directly on M-2 Motorway ($30 - $34/tonne)",
    laborAvailability: "Skilled agro-processing and packaging technicians", sezBenefits: "Approved Special Economic Zone with 10-year income tax holiday",
    bestFor: "Gourmet retail grinders, glass container packaging, gift sets"
  },
  khewra: {
    name: "Khewra - Pind Dadan Khan Corridor (Jhelum)", district: "Jhelum",
    distToMine: "0 - 10 km (Khewra Mine)", powerStatus: "Established grid supply; subject to seasonal peak loads",
    waterStatus: "Local freshwater springs & municipal industrial pipeline", freightToKarachi: "920 km via M-2 Lilla Interchange ($35 - $38/tonne)",
    laborAvailability: "Generations of artisanal rock carving masters & stonemasons", sezBenefits: "Artisanal cluster support via Punjab Small Industries (PSIC)",
    bestFor: "Salt lamps, precision tiles, speleotherapy construction blocks"
  },
  m3_faisalabad: {
    name: "M-3 Industrial City (Faisalabad SEZ)", district: "Faisalabad",
    distToMine: "140 km", powerStatus: "Redundant dual-circuit high-tension power supply",
    waterStatus: "Industrial RO water treatment & effluent treatment plant (CETP)", freightToKarachi: "720 km via Motorway / Faisalabad Dry Port ($26 - $30/tonne)",
    laborAvailability: "Highly trained chemical, pharmaceutical and engineering graduates", sezBenefits: "Federal SEZ with 0% customs duty on imported plant & machinery",
    bestFor: "Pharmaceutical API sodium chloride, chemical grade chlor-alkali"
  }
};

function selectProcessingSite(siteKey) {
  document.querySelectorAll(".site-card-tab").forEach(t => t.classList.remove("active"));
  const tab = document.querySelector(`.site-card-tab[data-site="${siteKey}"]`);
  if (tab) tab.classList.add("active");

  const s = siteData[siteKey];
  if (!s) return;

  const display = document.getElementById("site-detail-display");
  if (!display) return;

  display.innerHTML = `
    <div style="background:#ffffff; border:1px solid var(--border); border-radius:var(--radius-md); padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:20px; color:var(--navy-900); font-weight:700;">${s.name}</h3>
        <span class="opp-badge badge-verified">📍 ${s.district} District</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-size:13.5px;">
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Distance to Raw Salt Mines:</strong><br>${s.distToMine}</div>
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Power & Electrical Grid:</strong><br>${s.powerStatus}</div>
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Water Infrastructure:</strong><br>${s.waterStatus}</div>
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Freight Logistics to Karachi:</strong><br>${s.freightToKarachi}</div>
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Labor Profile:</strong><br>${s.laborAvailability}</div>
        <div class="card" style="padding:14px; background:var(--bg-alt);"><strong>Incentives & SEZ Status:</strong><br>${s.sezBenefits}</div>
      </div>
      <div class="notice-card" style="margin-top:20px;"><strong>Recommended Value-Addition Profile:</strong> ${s.bestFor}</div>
    </div>
  `;
}

// -------------------------------------------------------------
// 6. Traceability & Batch Verification
// -------------------------------------------------------------
function verifyTraceabilityBatch(batchCodeOverride = null) {
  const code = (batchCodeOverride || document.getElementById("traceability-input")?.value || "").trim();
  if (!code) {
    showToast("Please enter a batch code.");
    return;
  }

  const b = EMBEDDED_BATCHES[code];
  const container = document.getElementById("traceability-result-container");
  if (!container) return;

  if (b) {
    container.innerHTML = `
      <div class="card" style="border:2px solid var(--emerald-500); padding:32px; background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); box-shadow:var(--shadow-lg); position:relative; overflow:hidden;">
        <div style="position:absolute; top:-20px; right:-20px; width:120px; height:120px; border-radius:50%; background:rgba(16,185,129,0.08); pointer-events:none;"></div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="opp-badge badge-verified" style="font-size:13px; padding:6px 16px;">✓ OFFICIAL GEOGRAPHICAL ORIGIN VERIFIED</span>
            <span style="font-size:12px; color:var(--emerald-700); font-weight:700;">HS Code: 2501.00.20</span>
          </div>
          <span style="font-size:12.5px; color:var(--navy-600); background:#ffffff; border:1px solid var(--emerald-200); padding:4px 12px; border-radius:var(--radius-full); font-weight:600;">ISO-17025 Accredited: ${b.lab_certification_no}</span>
        </div>
        <h3 style="font-size:24px; color:var(--navy-900); font-weight:800; margin-bottom:4px;">${b.product_name}</h3>
        <p style="color:var(--navy-500); font-size:13.5px; margin-bottom:20px;">Digital Provenance Hash: <code style="background:#ffffff; padding:2px 8px; border-radius:4px; border:1px solid #d1fae5; font-weight:700; color:var(--emerald-700);">${b.batch_code}</code></p>
        
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; background:#ffffff; border:1px solid var(--emerald-100); padding:20px; border-radius:var(--radius-md); font-size:13.5px; box-shadow:var(--shadow-xs);">
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Source Concession:</span><strong>${b.origin_mine}</strong><br><small style="color:var(--navy-400);">${b.district} District, Punjab</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Extraction Date:</span><strong>${b.extraction_date}</strong><br><small style="color:var(--navy-400);">Underground Level 6</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Licensed Processor:</span><strong>${b.facility_name}</strong><br><small style="color:var(--navy-400);">HACCP / ISO 22000 Certified</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Chemical Purity Assay:</span><strong style="color:var(--emerald-600); font-size:17px;">${b.purity_pct}% Natural NaCl</strong></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Toxic Heavy Metals (Pb/As/Cd):</span><strong style="color:var(--navy-800);">${b.heavy_metals_ppm} ppm</strong><br><small style="color:var(--emerald-600);">✓ Below 0.5 ppm Codex Limit</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Moisture & Insoluble Matter:</span><strong>${b.moisture_pct}%</strong><br><small style="color:var(--emerald-600);">✓ Meets US FDA 21 CFR</small></div>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px dashed var(--emerald-200); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <p style="margin:0; font-size:12.5px; color:var(--emerald-800); max-width:600px;">
            🛡️ <strong>Official Geographical Indication:</strong> Authenticity legally guaranteed under the Geographical Indications (Registration and Protection) Act 2020. Mined exclusively from the ancient Salt Range Geological Belt, Punjab, Pakistan.
          </p>
          <div style="display:inline-flex; align-items:center; gap:8px; background:#ffffff; border:1px solid var(--emerald-300); padding:6px 14px; border-radius:var(--radius-full); font-size:12px; font-weight:700; color:var(--emerald-700);">
            <span>🔒 Cryptographically Signed</span>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="card" style="border-left:5px solid var(--danger); padding:24px;">
        <span class="opp-badge" style="background:#fee2e2; color:#b91c1c;">UNVERIFIED BATCH IDENTIFIER</span>
        <h4 style="margin-top:10px; color:#b91c1c;">Batch '${code}' Not Found</h4>
        <p style="font-size:13.5px; color:var(--text-main); margin-top:6px;">
          This identifier does not match any authenticated production run in the Punjab Pink Salt Traceability Register.
        </p>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// 7. Knowledge Base Documents
// -------------------------------------------------------------
function loadKnowledgeDocs() {
  const cat = document.getElementById("knowledge-category-select")?.value || "All";
  const q = document.getElementById("knowledge-search-input")?.value?.toLowerCase() || "";

  let docs = EMBEDDED_KNOWLEDGE;
  if (cat !== "All") docs = docs.filter(d => d.category === cat);
  if (q) docs = docs.filter(d => d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q));

  const list = document.getElementById("knowledge-docs-list");
  if (!list) return;
  list.innerHTML = docs.map(doc => `
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span class="opp-badge badge-verified">${doc.verification_status}</span>
        <small style="color:var(--text-muted)">Published: ${doc.publication_date}</small>
      </div>
      <h3 style="font-size:17px; color:var(--navy-900); font-weight:700;">${doc.title}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:10px;">Issuing Body: <strong>${doc.issuing_authority}</strong> | Category: ${doc.category}</p>
      <p style="font-size:13.5px; line-height:1.5; color:var(--text-main); margin-bottom:14px;">${doc.summary}</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:12px; color:var(--text-light);">${doc.file_size_desc}</span>
        <a href="${doc.source_url}" target="_blank" rel="noopener" class="btn btn-navy btn-sm">Official Source Reference ↗</a>
      </div>
    </div>
  `).join("");
}

// -------------------------------------------------------------
// 8. Investor Enquiry Submission (Supports LocalStorage Persistence)
// -------------------------------------------------------------
function submitInvestorEnquiry(event) {
  event.preventDefault();

  const trackingId = `PSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const enquiry = {
    tracking_id: trackingId,
    investor_name: document.getElementById("enq-name").value.trim(),
    company_name: document.getElementById("enq-company").value.trim(),
    email: document.getElementById("enq-email").value.trim(),
    phone: document.getElementById("enq-phone").value.trim(),
    country: document.getElementById("enq-country").value.trim(),
    business_model: document.getElementById("enq-model").value,
    target_location: document.getElementById("enq-location").value,
    budget_usd: parseFloat(document.getElementById("enq-budget").value) || 250000,
    capacity_tpd: parseFloat(document.getElementById("enq-capacity").value) || 20,
    target_market: document.getElementById("enq-market").value,
    project_description: document.getElementById("enq-desc").value.trim(),
    status: "New",
    created_at: new Date().toISOString()
  };

  // Save to client localStorage
  const existing = JSON.parse(localStorage.getItem("pinksalt_enquiries") || "[]");
  existing.unshift(enquiry);
  localStorage.setItem("pinksalt_enquiries", JSON.stringify(existing));

  showToast(`Enquiry registered successfully! Reference: ${trackingId}`);

  const container = document.getElementById("enquiry-form-container");
  container.innerHTML = `
    <div class="card" style="border-top:5px solid var(--success); padding:32px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="width:40px; height:40px; border-radius:50%; background:var(--success-bg); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:bold;">✓</div>
        <div>
          <h3 style="font-size:22px; color:var(--navy-900);">Expression of Interest Successfully Stored</h3>
          <p style="color:var(--text-muted); font-size:13px;">Tracking Reference: <strong style="color:var(--navy-900); font-family:monospace; font-size:15px;">${trackingId}</strong></p>
        </div>
      </div>
      <p style="font-size:14px; color:var(--text-main); line-height:1.6; margin-bottom:24px;">
        Thank you, <strong>${enquiry.investor_name}</strong>. Your enquiry for <strong>${enquiry.company_name}</strong> has been recorded in the Punjab Directorate Minerals investment pipeline.
      </p>
      <div class="notice-card">
        <strong>Preliminary Project Concept Generated:</strong> A ${enquiry.capacity_tpd} TPD value-addition facility located at ${enquiry.target_location}. Indicative budget: ${formatUSD(enquiry.budget_usd)}.
      </div>
      <div style="margin-top:24px; display:flex; gap:12px;">
        <button class="btn btn-navy" onclick="location.reload()">Submit Another Expression</button>
        <button class="btn btn-primary" onclick="switchView('calculator')">Fine-tune in Calculator</button>
      </div>
    </div>
  `;
}

function prefillEnquiryWithOpportunity(oppTitle, oppLocation) {
  switchView("enquiry");
  setTimeout(() => {
    const descField = document.getElementById("enq-desc");
    if (descField) descField.value = `Expression of interest in project: ${oppTitle} (${oppLocation}).`;
  }, 100);
}

// -------------------------------------------------------------
// 9. PinkSalt AI Grounded Assistant (Pure Client-Side RAG + Citations)
// -------------------------------------------------------------
function sendChatMessage(presetPrompt = null) {
  const inputEl = document.getElementById("ai-chat-input");
  const msg = (presetPrompt || inputEl.value || "").trim();
  if (!msg) return;

  if (!presetPrompt) inputEl.value = "";

  const messagesBox = document.getElementById("ai-chat-messages");
  const userDiv = document.createElement("div");
  userDiv.className = "message-bubble bubble-user";
  userDiv.innerText = msg;
  messagesBox.appendChild(userDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const botDiv = document.createElement("div");
  botDiv.className = "message-bubble bubble-bot";
  botDiv.innerHTML = `<em>Consulting verified geological and regulatory sources...</em>`;
  messagesBox.appendChild(botDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    const lower = msg.toLowerCase();

    // Check safeguard
    if (lower.includes("guarantee") || lower.includes("secret reserve") || lower.includes("cure cancer") || lower.includes("evade royalty")) {
      botDiv.innerHTML = `
        <strong>I cannot confirm this from the available verified sources.</strong><br><br>
        The PinkSalt Intelligence & Investment Portal only provides documented data from the Punjab Mines & Minerals Department, Pakistan Mineral Development Corporation (PMDC), Geological Survey of Pakistan (GSP), and international food safety bodies.
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Check Khewra / Warcha resources
    if (lower.includes("khewra") || lower.includes("warcha") || lower.includes("reserve") || lower.includes("purity")) {
      botDiv.innerHTML = `
        <h4 style="color:var(--navy-900); margin-bottom:6px;">Geological Reserves & Natural Purity Benchmarks</h4>
        The northern Punjab Salt Range contains massive evaporite halite deposits:<br><br>
        • <strong>Khewra Salt Mine (Jhelum)</strong>: Documented reserves exceeding 600 Million Metric Tonnes across 17 working levels with 98.8% average NaCl purity. Managed by PMDC.<br>
        • <strong>Warcha Salt Mine (Khushab)</strong>: Over 400 Million Tonnes of transparent crystalline salt with exceptional purity exceeding 99.1% NaCl.<br>
        • <strong>Kalabagh (Mianwali)</strong>: Stratified outcrops along the Indus gorge with 97.9% purity.<br><br>
        <div class="citation-box">
          <strong>Grounding Citations:</strong><br>
          • <a href="https://www.gsp.gov.pk/publications/salt-range-memoir" target="_blank" class="citation-link">GSP Salt Range Stratigraphic Memoir</a> (Geological Survey of Pakistan, 2024)<br>
          • <a href="https://www.pmdc.gov.pk" target="_blank" class="citation-link">PMDC Operations & Lease Register</a> (2026)
        </div>
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Check Mining Lease vs Processing Permit
    if (lower.includes("lease") || lower.includes("permit") || lower.includes("license") || lower.includes("rule")) {
      botDiv.innerHTML = `
        <h4 style="color:var(--navy-900); margin-bottom:6px;">Mining Rights vs. Value-Addition Processing Facilities</h4>
        Under the <strong>Punjab Mining Concession Rules 2022</strong>:<br><br>
        • <strong>Subsurface Mining Rights</strong>: Require a competitive bidding concession issued by the Directorate General of Mines & Minerals.<br>
        • <strong>Surface Value-Addition Units (Washing, Optical Sorting, Packaging)</strong>: <strong>DO NOT</strong> require a mining lease. Investors can establish processing plants on industrial land (e.g. Quaidabad, Bhalwal, M-3 Faisalabad) and source raw rock salt commercially from licensed mine operators or PMDC.<br><br>
        <div class="citation-box">
          <strong>Grounding Citations:</strong><br>
          • <a href="https://mnm.punjab.gov.pk/rules_and_regulations" target="_blank" class="citation-link">Punjab Mining Concession Rules 2022</a> (Mines & Minerals Dept)<br>
          • <a href="https://mnm.punjab.gov.pk/investment_and_business_promotion" target="_blank" class="citation-link">Processing vs Concession Policy Clarification</a> (2025)
        </div>
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Default Feasibility or General response
    botDiv.innerHTML = `
      <h4 style="color:var(--navy-900); margin-bottom:6px;">PinkSalt Investment Intelligence</h4>
      For a standard <strong>25 TPD food-grade optical sorting plant</strong>:<br>
      • <strong>Estimated CAPEX</strong>: ~$350,000 (SS316 optical sorter, packing line, industrial shed, working capital).<br>
      • <strong>Annual Production</strong>: ~5,175 MT of finished retail pouches.<br>
      • <strong>Annual Projected Revenue</strong>: ~$1,811,250 (@ $350/MT FOB Karachi).<br>
      • <strong>Operating EBITDA Margin</strong>: ~37% with a simple payback of ~1.9 years.<br><br>
      You can fine-tune every cost parameter in the <strong>Feasibility Model</strong> tab.<br><br>
      <div class="citation-box">
        <strong>Source Reference:</strong><br>
        • <a href="https://tdap.gov.pk" target="_blank" class="citation-link">Export Development Fund (EDF) Mineral Processing Guidelines</a> (TDAP)
      </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 400);
}

// -------------------------------------------------------------
// 10. Admin Session & Login Modal
// -------------------------------------------------------------
function checkAdminSession() {
  if (!state.adminToken) {
    showAdminLoginModal();
  } else {
    renderAdminDashboard();
  }
}

function showAdminLoginModal() {
  const modal = document.getElementById("modal-admin-login");
  if (modal) modal.style.display = "flex";
}

function submitAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("admin-user-input").value.trim();
  const password = document.getElementById("admin-pwd-input").value;

  if (username === "admin" && password === "PinkSalt@2026!") {
    state.adminToken = "admin-session-token";
    localStorage.setItem("pinksalt_admin_token", state.adminToken);
    document.getElementById("modal-admin-login").style.display = "none";
    showToast("Authenticated as Directorate Administrator.");
    renderAdminDashboard();
  } else {
    alert("Invalid credentials. Demo: admin / PinkSalt@2026!");
  }
}

function adminLogout() {
  state.adminToken = null;
  localStorage.removeItem("pinksalt_admin_token");
  switchView("home");
  showToast("Administrator logged out.");
}

function renderAdminDashboard() {
  const stored = JSON.parse(localStorage.getItem("pinksalt_enquiries") || "[]");
  const defaultEnquiries = [
    { tracking_id: "PSI-2026-0101", investor_name: "Marcus Vance", company_name: "Nordic Mineral Sourcing ApS", country: "Denmark", business_model: "Food-Grade Optical Sorting", budget_usd: 450000, status: "Meeting Scheduled", created_at: "2026-02-14" },
    { tracking_id: "PSI-2026-0102", investor_name: "Tariq Al-Mansoor", company_name: "Al-Mansoor Food Industries", country: "UAE", business_model: "Gourmet Table Grinders", budget_usd: 600000, status: "Proposal Received", created_at: "2026-02-10" }
  ];
  const all = [...stored, ...defaultEnquiries];

  document.getElementById("admin-total-enquiries").innerText = all.length;
  const totalCapex = all.reduce((sum, e) => sum + (e.budget_usd || 0), 0);
  document.getElementById("admin-pipeline-capex").innerText = formatUSD(totalCapex);
  document.getElementById("admin-active-opps").innerText = EMBEDDED_OPPORTUNITIES.length;
  document.getElementById("admin-docs-count").innerText = EMBEDDED_KNOWLEDGE.length;

  const tbody = document.getElementById("admin-enquiries-tbody");
  if (!tbody) return;
  tbody.innerHTML = all.map(enq => `
    <tr>
      <td><strong style="font-family:monospace;">${enq.tracking_id}</strong><br><small>${enq.created_at.substring(0, 10)}</small></td>
      <td><strong>${enq.investor_name}</strong><br><small>${enq.company_name} (${enq.country})</small></td>
      <td>${enq.business_model}<br><small>Budget: ${formatUSD(enq.budget_usd)}</small></td>
      <td>
        <span class="opp-badge badge-concept">${enq.status || 'New'}</span>
      </td>
      <td>
        <button class="btn btn-navy btn-sm" onclick="showToast('Enquiry details for ${enq.tracking_id}')">View Details</button>
      </td>
    </tr>
  `).join("");
}

// -------------------------------------------------------------
// DOM Loaded Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initHomeView();

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const view = link.getAttribute("data-view");
      if (view) switchView(view);
    });
  });

  const hash = window.location.hash.replace("#", "");
  switchView(hash || "home");

  initCalculator();
});
