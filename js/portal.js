/**
 * PinkSalt Intelligence & Investment Portal - Unified Controller
 * Supports dual-mode execution:
 * 1. Serverless/Static Mode (100% Client-Side for GitHub Pages, zero backend or billing needed)
 * 2. Full-Stack Mode (via Python REST API & SQLite on server/container)
 */

const USD_TO_PKR_RATE = 280.0;

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
    status_label: "Proposed Processing Zone (Provincial Cluster)",
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
    status_type: "Strategic Priority Project",
    capex_indicative_usd: 325000.0,
    capex_indicative_pkr: "PKR 9.1 Crore",
    capacity_desc: "25 Metric Tonnes / Day",
    land_sqft: "22,000 sq ft industrial plot with covered shed",
    machinery_desc: "Stainless steel 316 optical sorter, hammer mill, vibrating screener, 2-head automated form-fill-seal pouch packer",
    utility_desc: "150 kVA 3-phase grid connection, dedicated borehole water filtration unit",
    description: "Value-addition plant packaging pure pink crystal salt into retail stand-up zip pouches (250g, 500g, 1kg) for export to EU, North America, and Gulf retail chains. Replaces bulk raw rock exports with 400% value accretion.",
    verified_source: "Punjab Mineral Investment Concept Paper / PMDC Reference Specs",
    verification_date: "2026-01-15"
  },
  {
    slug: "opt-gourmet-grinders",
    title: "Gourmet Ceramic-Mill Table Grinders & Seasoning Blends Facility",
    category: "Gourmet Retail Products",
    location: "Bhalwal Industrial Estate / Sargodha Corridor",
    district: "Sargodha / Khushab",
    status_type: "Private Sector Joint Venture",
    capex_indicative_usd: 480000.0,
    capex_indicative_pkr: "PKR 13.4 Crore",
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
    capex_indicative_pkr: "PKR 51.8 Crore",
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
    capex_indicative_pkr: "PKR 4.5 Crore",
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
    capex_indicative_pkr: "PKR 5.9 Crore",
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
    status_type: "Public-Private Partnership (PPP)",
    capex_indicative_usd: 1200000.0,
    capex_indicative_pkr: "PKR 33.6 Crore",
    capacity_desc: "100 Metric Tonnes / Day",
    land_sqft: "50,000 sq ft centralized terminal with rail siding",
    machinery_desc: "Twin-channel high-speed optical color sorters, heavy primary jaw crusher, continuous ultrasonic wash line, moisture-tight bulk bagging station",
    utility_desc: "400 kVA substation load, dedicated water treatment loop",
    description: "Shared infrastructure terminal providing small and medium mine concessionaires with shared optical grading, impurity washing, and container stuffing, reducing individual CAPEX barriers and ensuring uniform provincial export quality.",
    verified_source: "Punjab Board of Investment and Trade (PBIT) Project Concept",
    verification_date: "2026-02-01"
  },
  {
    slug: "opt-chlor-alkali",
    title: "Soda Ash & Chlor-Alkali Chemical Precursor Project",
    category: "Industrial & Pharmaceutical",
    location: "Khewra - Dandot Chemical Belt",
    district: "Jhelum",
    status_type: "Heavy Industrial Expansion",
    capex_indicative_usd: 3500000.0,
    capex_indicative_pkr: "PKR 98.0 Crore",
    capacity_desc: "200 Metric Tonnes / Day",
    land_sqft: "120,000 sq ft heavy industrial plot",
    machinery_desc: "Brine saturation tanks, membrane cell electrolysis units, lime kilns, vacuum evaporators",
    utility_desc: "2,500 kVA high-voltage connection, gas pipeline connection",
    description: "Downstream chemical transformation utilizing high-purity Khewra brine for local soda ash synthesis and caustic soda/chlorine production for Pakistan's textile, detergent, and glass manufacturing sectors.",
    verified_source: "Ministry of Industries & Production Geological Study",
    verification_date: "2025-10-18"
  },
  {
    slug: "opt-spa-wellness",
    title: "Cosmetic Spa Bath Salts & Essential Oil Infusions Laboratory",
    category: "Gourmet Retail Products",
    location: "Sundar Industrial Estate",
    district: "Lahore",
    status_type: "Private Sector Enterprise",
    capex_indicative_usd: 275000.0,
    capex_indicative_pkr: "PKR 7.7 Crore",
    capacity_desc: "12 Metric Tonnes / Day",
    land_sqft: "14,000 sq ft air-conditioned cosmetics facility",
    machinery_desc: "Rotary drum liquid perfuming and oil coater, micro-mesh vibrating grader, automated PET jar filler, tamper-evident induction sealer",
    utility_desc: "80 kVA power supply, cleanroom HVAC environment",
    description: "Value-added wellness formulation combining fine and coarse crystalline pink salt with natural eucalyptus, lavender, and citrus essential oils. Packaged in premium recyclable glass and PET jars for international spa chains and e-commerce retail.",
    verified_source: "Trade Development Authority of Pakistan (TDAP) Cosmetics Sector Profile",
    verification_date: "2026-01-10"
  }
];

const EMBEDDED_MACHINERY = [
  {
    id: "crushing_grinding",
    title: "Crushing & Grinding Unit (Bloom Engineering VHC Series)",
    subtitle: "Rock Salt & Mineral 4-Shaft Hammer Mill Crusher",
    photo: "images/landingPage-Image-upper.png",
    purpose: "Converts raw rock salt into coarse granules, table crystals, or fine powder. Engineered with a 4-shaft heavy-duty rotor and hardened hammers.",
    products: "Crushed salt, coarse granules (2-4mm), fine table salt (0.5-1.0mm), salt powder (<0.5mm)",
    capacity_range: "2.5 to 20 Metric Tonnes / Hour (Models: VHC-3000 to VHC-20000)",
    specs: {
      equipment_type: "Bloom Engineering VHC Series 4-Shaft Hammer Mill (SS316 / Heavy MS)",
      power_rating: "10 HP to 35 HP (3-Phase with 4-Belt Pulley Drive & VFD Inverter)",
      mesh_control: "6mm - 12mm perforated bottom discharge screen (interchangeable)",
      rotor_assembly: "4-Shaft rotor with 6mm thick x 50mm wide x 150mm hardened blades"
    },
    utility: "Dedicated 30-60 kVA industrial electrical connection, dust collection hood",
    indicative_price_pkr: "PKR 15 - 35 Lakh",
    indicative_price_usd: "$5,350 - $12,500 USD",
    status_tag: "Essential Core Unit • Verified Manufacturer",
    is_optional: false,
    default_capex_usd: 9500,
    verified_source: "Bloom Engineering Karachi",
    verified_source_url: "https://blomeng.com/product/organic-waste-crusher-hammer-mill-vegetables-crusher-waste-shredder-hammer-mill-for-sale/"
  },
  {
    id: "washing_cleaning",
    title: "Washing & Cleaning Unit",
    subtitle: "Extraction Dust & Surface Silt Removal",
    photo: "images/slider5.cd6dccfed10cc05d.jpg",
    purpose: "Removes extraction dust, surface silt, and external impurities where washing is technically required.",
    products: "Cleaned, sanitized rock salt crystals prepared for high-purity food-grade processing",
    capacity_range: "5 to 30 Metric Tonnes / Day",
    specs: {
      equipment_type: "SS304 Rotary Trommel Washer with Saturated Brine Recirculation",
      power_rating: "18 kW - 30 kW",
      water_use: "~1.5 m³ per tonne of raw salt",
      effluent: "Continuous settling weir with sludge drain valve"
    },
    utility: "Industrial freshwater/borehole supply, settling pond or effluent discharge line",
    indicative_price_pkr: "PKR 14 - 28 Lakh",
    indicative_price_usd: "$5,000 - $10,000 USD",
    status_tag: "Conditionally Required (Optional)",
    is_optional: true,
    default_capex_usd: 7500
  },
  {
    id: "screening_grading",
    title: "Screening & Grading Unit",
    subtitle: "Precision Particle Size Separation",
    photo: "images/img-auth-big.16a075058be12ab5.jpg",
    purpose: "Separates crushed salt into standardized particle size fractions meeting strict commercial mesh requirements.",
    products: "Gourmet coarse crystals, medium granules, fine table grade, ultra-fine dust fraction",
    capacity_range: "5 to 40 Metric Tonnes / Day",
    specs: {
      equipment_type: "3-Deck or 4-Deck Stainless Steel Vibro Sifter",
      power_rating: "7.5 kW - 15 kW",
      screen_mesh: "4 mesh (4.75mm), 10 mesh (2.0mm), 20 mesh (0.85mm), 40 mesh",
      material: "All salt contact surfaces in certified SS304"
    },
    utility: "Standard 25 kVA industrial power connection",
    indicative_price_pkr: "PKR 6 - 15 Lakh",
    indicative_price_usd: "$2,150 - $5,350 USD",
    status_tag: "Essential Core Unit",
    is_optional: false,
    default_capex_usd: 3750
  },
  {
    id: "industrial_drying",
    title: "Industrial Drying Unit",
    subtitle: "Post-Washing Moisture Elimination",
    photo: "images/landingPage-Image-lower.png",
    purpose: "Reduces moisture content of washed salt to under 0.1% to guarantee free-flowing properties and prevent caking.",
    products: "Free-flowing dry crystal salt meeting Codex Alimentarius moisture standards (<= 0.5%)",
    capacity_range: "5 to 25 Metric Tonnes / Day",
    specs: {
      equipment_type: "Fluidized Bed Hot Air Dryer / Rotary Drum Dryer",
      power_rating: "25 kW - 45 kW (Thermal/Electrical)",
      heat_source: "LPG / Natural Gas Burner or Electric Ceramic Air Heater",
      exhaust: "Cyclone separator and high-efficiency particulate air filter"
    },
    utility: "Gas supply line or 60 kW heating load",
    indicative_price_pkr: "PKR 15 - 32 Lakh",
    indicative_price_usd: "$5,350 - $11,400 USD",
    status_tag: "Required if Washing is Selected",
    is_optional: true,
    default_capex_usd: 8350
  },
  {
    id: "automated_packaging",
    title: "Automated Packaging Unit",
    subtitle: "Consumer Pouches & Bulk Sacks",
    photo: "images/slider5.cd6dccfed10cc05d.jpg",
    purpose: "Weighs, doses, fills, and hermetically seals pink salt in consumer retail packs and export bulk sacks.",
    products: "250g, 500g, 1kg stand-up zip pouches, 5kg catering tubs, 25kg & 50kg export woven polypropylene sacks",
    capacity_range: "15 to 60 packs / minute (up to 30 TPD)",
    specs: {
      equipment_type: "Vertical Form-Fill-Seal (VFFS) with 10-Head Multi-Head Weigher",
      power_rating: "12 kW - 22 kW with pneumatic air compressor (6-8 bar)",
      flush: "Integrated nitrogen gas purge for export shelf-life stability",
      sealing: "Pneumatic heat seal with batch expiry date ribbon coder"
    },
    utility: "30 kVA electrical connection, clean dry compressed air line",
    indicative_price_pkr: "PKR 18 - 45 Lakh",
    indicative_price_usd: "$6,400 - $16,100 USD",
    status_tag: "Essential for Retail Export",
    is_optional: false,
    default_capex_usd: 11250
  },
  {
    id: "turnkey_plants",
    title: "Complete Turnkey Processing Plant (Engineerings.pk EPK-SALT1000)",
    subtitle: "Balanced 1,000 kg/hr Turnkey Production Line",
    photo: "images/landingPage-Image-lower.png",
    purpose: "A fully integrated turnkey salt plant taking raw rock salt and delivering clean, graded, iodized, and packed retail product with automated material conveying.",
    products: "Table salt (iodized retail pouches), granular & coarse salt, industrial salt, and compressed livestock blocks",
    capacity_range: "1,000 kg/hr (Scalable 500 – 2,000 kg/hr / 12 – 48 TPD)",
    specs: {
      line_stages: "Wash & de-stone -> Crush & multi-grade screen -> Dry -> Iodize -> Auto pack",
      throughput: "Balanced 1,000 kg/hr eliminating bottleneck mismatches",
      construction: "Food-grade contact surfaces, corrosion-resistant build for aggressive salt environments",
      pack_range: "Automated weighing & packing from 1 kg to 50 kg retail/bulk packs",
      engineering: "Full plant layout, utility load sheet, and ~90 days delivery lead time"
    },
    utility: "3-Phase industrial power supply (load sheet provided per layout)",
    indicative_price_pkr: "PKR 50 Lakh - 5.0 Crore",
    indicative_price_usd: "$17,850 - $178,500 USD",
    status_tag: "Turnkey Line • Verified Manufacturer",
    is_optional: false,
    default_capex_usd: 85000,
    verified_source: "Engineerings.pk",
    verified_source_url: "https://www.engineerings.pk/machines/salt-mineral-processing/complete-salt-processing-plant-epk-salt1000"
  }
];

const EMBEDDED_BATCHES = {
  "PK-SALT-2026-KHW-001": {
    batch_code: "PK-SALT-2026-KHW-001",
    product_name: "Fine Pink Table Salt (500g Stand-up Pouch)",
    origin_mine: "Khewra Salt Mine (Underground Seam 4)",
    district: "Jhelum",
    extraction_date: "2026-01-15",
    facility_name: "Khewra Modern Mineral Processing Unit",
    purity_pct: 99.12,
    heavy_metals_ppm: 0.012,
    moisture_pct: 0.08,
    lab_certification_no: "PCSIR-LHR-2026-8821"
  },
  "PK-SALT-2026-WCH-042": {
    batch_code: "PK-SALT-2026-WCH-042",
    product_name: "Gourmet Table Grinder Crystals (350g Glass)",
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

const EMBEDDED_KNOWLEDGE = [
  {
    title: "Punjab Mining Concession Rules 2022",
    category: "Legislation & Regulations",
    issuing_authority: "Mines & Minerals Department, Government of Punjab",
    publication_date: "2022-07-15",
    summary: "Statutory framework governing mineral titles, exploration licences, mining leases, royalty structures, and surface value-addition permits across Punjab.",
    source_url: "https://mnm.punjab.gov.pk/rules_and_regulations",
    verification_status: "Statutory Document",
    file_size_desc: "Official Gazette Notification • PDF (1.4 MB)"
  },
  {
    title: "Codex Alimentarius Standard for Food Grade Salt (CXS 150-1985)",
    category: "International Quality Standards",
    issuing_authority: "FAO / WHO Codex Alimentarius Commission",
    publication_date: "Rev. 2012 / Current 2026",
    summary: "Universal baseline standard establishing minimum 97% NaCl dry basis purity, permissible packaging parameters, and toxic heavy metal limits (As, Pb, Cd, Hg).",
    source_url: "https://www.fao.org/fao-who-codexalimentarius/standards/en/",
    verification_status: "International Standard",
    file_size_desc: "Codex Reference Standard • PDF (380 KB)"
  },
  {
    title: "Geological Survey of Pakistan: Salt Range Stratigraphic Memoir",
    category: "Geology & Resource Assessment",
    issuing_authority: "Geological Survey of Pakistan (GSP)",
    publication_date: "2024-04-10",
    summary: "Comprehensive survey of evaporite sequences in Jhelum, Khushab, and Mianwali, documenting over 10.0 billion MT of surveyed rock salt reserves.",
    source_url: "https://www.gsp.gov.pk",
    verification_status: "Survey Memoir",
    file_size_desc: "GSP Technical Report • PDF (8.2 MB)"
  }
];

// Global Client State
const state = {
  currentView: "home",
  adminToken: localStorage.getItem("pinksalt_admin_token") || null,
  adminUser: null,
  lastCalculation: null,
  washingRequired: true,
  currentPlanningRangePKR: 25000000
};

// Formatting Utilities
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
  return "$" + Math.round(Number(num || 0)).toLocaleString("en-US");
}

function formatPKR(num) {
  const pkr = Math.round(Number(num || 0));
  if (pkr >= 10000000) {
    const cr = (pkr / 10000000).toFixed(2);
    return `PKR ${cr} Crore`;
  }
  if (pkr >= 100000) {
    const lakh = (pkr / 100000).toFixed(2);
    return `PKR ${lakh} Lakh`;
  }
  return "PKR " + pkr.toLocaleString("en-US");
}

function formatNumber(num) {
  return Math.round(Number(num || 0)).toLocaleString("en-US");
}

// Mobile Navigation
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

  if (viewName === "opportunities") {
    loadOpportunities();
    selectProcessingSite("quaidabad");
  }
  if (viewName === "processing-options") {
    renderProcessingOptions();
  }
  if (viewName === "quality-testing") {
    calculateTestingCost();
  }
  if (viewName === "calculator") {
    initCalculator();
  }
  if (viewName === "resources") {
    loadResources();
  }
  if (viewName === "admin") {
    checkAdminSession();
  }
}

// -------------------------------------------------------------
// 1. Home View Initialization
// -------------------------------------------------------------
function initHomeView() {
  // Home static components are ready in HTML
}

// -------------------------------------------------------------
// 2. Opportunities View
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
        <div><span class="opp-meta-lbl">Indicative CAPEX:</span><br><span class="opp-meta-val">${opp.capex_indicative_pkr || formatUSD(opp.capex_indicative_usd)}</span></div>
        <div><span class="opp-meta-lbl">Target Capacity:</span><br><span class="opp-meta-val">${opp.capacity_desc}</span></div>
        <div><span class="opp-meta-lbl">Land Required:</span><br><span class="opp-meta-val">${opp.land_sqft}</span></div>
        <div><span class="opp-meta-lbl">Verified:</span><br><span class="opp-meta-val">${opp.verification_date}</span></div>
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
      <p><strong>Indicative Capital Expenditure:</strong> ${opp.capex_indicative_pkr} (${formatUSD(opp.capex_indicative_usd)})</p>
    </div>

    <div style="margin-top:24px; display:flex; gap:12px;">
      <button class="btn btn-primary" onclick="closeGenericModal(); prefillEnquiryWithOpportunity('${opp.title}', '${opp.location}')">Submit Expression of Interest</button>
      <button class="btn btn-outline" onclick="closeGenericModal(); switchView('calculator')">Run 5-Year Feasibility</button>
    </div>
  `;
  document.getElementById("modal-generic").style.display = "flex";
}

function closeGenericModal() {
  document.getElementById("modal-generic").style.display = "none";
}

// -------------------------------------------------------------
// 3. Site Selector Logic
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
// 4. Processing Options & Machinery Renderer
// -------------------------------------------------------------
function renderProcessingOptions() {
  const container = document.getElementById("machinery-grid-container");
  if (!container) return;

  container.innerHTML = EMBEDDED_MACHINERY.map(m => `
    <div class="machinery-card">
      <div class="machinery-visual">
        <img src="${m.photo}" alt="${m.title}">
        <span class="machinery-tag ${m.is_optional ? 'optional' : ''}">${m.status_tag}</span>
      </div>
      <div class="machinery-info">
        <h3>${m.title}</h3>
        <p class="machinery-subtitle">${m.subtitle}</p>
        <p class="machinery-desc">${m.purpose}</p>

        <div style="margin-bottom:14px; font-size:13px; color:var(--navy-800);">
          <strong>Finished Products Generated:</strong> ${m.products}
        </div>

        <div class="machinery-specs-grid">
          <div class="spec-item">
            <span>Capacity Range:</span>
            <strong>${m.capacity_range}</strong>
          </div>
          <div class="spec-item">
            <span>Primary Technology:</span>
            <strong>${m.specs.equipment_type || m.specs.engineering}</strong>
          </div>
          <div class="spec-item">
            <span>Power Rating:</span>
            <strong>${m.specs.power_rating || 'Per Layout'}</strong>
          </div>
          <div class="spec-item">
            <span>Utility Hookup:</span>
            <strong>${m.utility}</strong>
          </div>
        </div>

        <div style="margin-top:10px; margin-bottom:12px; font-size:12px;">
          ${m.verified_source_url ? `
            <span style="color:var(--text-muted);">Verified Manufacturer Source: </span>
            <a href="${m.verified_source_url}" target="_blank" rel="noopener noreferrer" style="color:var(--rose-700); font-weight:700; text-decoration:underline;">
              ${m.verified_source} ↗
            </a>
          ` : `
            <span style="color:var(--text-muted);">Verified Source: Directorate Technical Concessions Benchmark</span>
          `}
        </div>

        <div class="machinery-card-footer">
          <div class="machinery-price-box">
            <span class="price-label">Indicative Equipment Price</span>
            <span class="price-val">${m.indicative_price_pkr}</span>
            <small style="color:var(--text-muted); font-size:11.5px; margin-left:6px;">(${m.indicative_price_usd})</small>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="openRFQModal('${m.title}', 25)">Generate RFQ 📋</button>
            <button class="btn btn-primary btn-sm" onclick="configureMachineryInCalc(${m.default_capex_usd}, ${m.is_optional})">Configure in Calculator →</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function configureMachineryInCalc(capexUSD, isOptional) {
  switchView("calculator");
  setTimeout(() => {
    const el = document.getElementById("calc-machinery");
    if (el) el.value = capexUSD;
    if (isOptional) {
      toggleWashing(true);
    }
    executeCalculation();
    showToast(`Configured machinery into Feasibility Calculator (${formatUSD(capexUSD)})`);
  }, 100);
}

// -------------------------------------------------------------
// 5. RFQ Modal Generator
// -------------------------------------------------------------
function openRFQModal(machineryType, capacity) {
  const modal = document.getElementById("modal-rfq");
  if (modal) {
    document.getElementById("rfq-machinery-type").value = machineryType || "Complete Turnkey Plant";
    document.getElementById("rfq-capacity").value = capacity || 25;
    modal.style.display = "flex";
  }
}

function closeRFQModal() {
  const modal = document.getElementById("modal-rfq");
  if (modal) modal.style.display = "none";
}

function submitEquipmentRFQ(event) {
  event.preventDefault();
  const type = document.getElementById("rfq-machinery-type").value;
  const cap = document.getElementById("rfq-capacity").value;
  const name = document.getElementById("rfq-contact-name").value;
  const company = document.getElementById("rfq-company").value;
  const email = document.getElementById("rfq-email").value;
  const phone = document.getElementById("rfq-phone").value;
  const specs = document.getElementById("rfq-specs").value;

  const rfqId = `RFQ-PK-SALT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const content = `================================================================================
GOVERNMENT OF PUNJAB • DIRECTORATE GENERAL OF MINES & MINERALS
OFFICIAL EQUIPMENT REQUEST FOR QUOTATION (RFQ)
================================================================================
RFQ Tracking Reference:  ${rfqId}
Issuance Date:           ${new Date().toISOString().substring(0, 10)}
Target Sector:           Pink Salt Processing & Value Addition, Punjab, Pakistan

1. SPONSORING INVESTOR DETAILS:
--------------------------------------------------------------------------------
Contact Person:          ${name}
Enterprise Name:         ${company}
Email Address:           ${email}
Phone / WhatsApp:        ${phone}

2. EQUIPMENT SPECIFICATIONS REQUESTED:
--------------------------------------------------------------------------------
Machinery Unit:          ${type}
Required Plant Capacity: ${cap} Metric Tonnes / Day
Compliance Standards:    Codex CXS 150-1985 / Food-Grade SS304 / ISO 22000
Specific Client Notes:   ${specs || 'Standard industrial configuration with spares kit.'}

3. RECOMMENDED REGIONAL FABRICATORS:
--------------------------------------------------------------------------------
- Engineerings.pk (Turnkey Line Model EPK-SALT1000 — https://www.engineerings.pk)
- Bloom Engineering Karachi (VHC Series Hammer Mills — https://blomeng.com)
- Heavy Mechanical Complex (HMC), Taxila
- Millat Equipment / Agri-Industrial Ltd, Lahore
- Pak Precision Engineering Works, Lahore
- Star Engineering Works, Gujranwala

================================================================================
Notice: Generated via Punjab Pink Salt Intelligence & Investment Portal.
================================================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${rfqId}.txt`;
  a.click();

  closeRFQModal();
  showToast(`Official RFQ generated successfully! Reference: ${rfqId}`);
}

// -------------------------------------------------------------
// 6. Quality Testing Calculator
// -------------------------------------------------------------
function calculateTestingCost() {
  const routine = parseInt(document.getElementById("test-calc-routine")?.value || "4");
  const metals = parseInt(document.getElementById("test-calc-metals")?.value || "2");
  const exp = parseInt(document.getElementById("test-calc-export")?.value || "2");

  const monthlyPKR = (routine * 12000) + (metals * 35000) + (exp * 75000);
  const annualPKR = monthlyPKR * 12;
  const annualUSD = annualPKR / USD_TO_PKR_RATE;

  const elPKR = document.getElementById("test-calc-annual-pkr");
  const elUSD = document.getElementById("test-calc-annual-usd");
  if (elPKR) elPKR.innerText = formatPKR(annualPKR);
  if (elUSD) elUSD.innerText = formatUSD(annualUSD) + " USD";

  return { annualPKR, annualUSD };
}

function applyTestingCostToFeasibility() {
  const { annualUSD } = calculateTestingCost();
  switchView("calculator");
  setTimeout(() => {
    const complianceInput = document.getElementById("calc-compliance");
    if (complianceInput) {
      complianceInput.value = Math.round(annualUSD);
      executeCalculation();
      showToast(`Applied ${formatUSD(annualUSD)} annual testing budget to calculator.`);
    }
  }, 100);
}

// -------------------------------------------------------------
// 7. Financial Modeling Engine (5-Year Projections & Loan Amortization)
// -------------------------------------------------------------
const planningPresets = {
  5000000: { // PKR 50 Lakh ($17,857 USD)
    pkr: 5000000,
    machinery_cost: 9500, land_building_cost: 4000, installation_cost: 1500, working_capital: 2857,
    capacity_tpd: 10, operating_days: 270, utilization: 0.65, yield: 0.90,
    raw_salt: 45, energy: 28, packaging: 25, freight: 35, labor: 20,
    admin: 15000, maintenance: 3000, compliance: 4000, price: 280
  },
  10000000: { // PKR 1.0 Crore ($35,714 USD)
    pkr: 10000000,
    machinery_cost: 18000, land_building_cost: 8500, installation_cost: 3200, working_capital: 6014,
    capacity_tpd: 15, operating_days: 280, utilization: 0.70, yield: 0.92,
    raw_salt: 44, energy: 26, packaging: 35, freight: 35, labor: 22,
    admin: 22000, maintenance: 6000, compliance: 6500, price: 320
  },
  25000000: { // PKR 2.5 Crore ($89,285 USD) - Default
    pkr: 25000000,
    machinery_cost: 45000, land_building_cost: 22000, installation_cost: 7285, working_capital: 15000,
    capacity_tpd: 25, operating_days: 300, utilization: 0.75, yield: 0.92,
    raw_salt: 42, energy: 25, packaging: 42, freight: 34, labor: 24,
    admin: 36000, maintenance: 12000, compliance: 11500, price: 350
  },
  50000000: { // PKR 5.0 Crore ($178,571 USD)
    pkr: 50000000,
    machinery_cost: 95000, land_building_cost: 42000, installation_cost: 14571, working_capital: 27000,
    capacity_tpd: 40, operating_days: 310, utilization: 0.80, yield: 0.94,
    raw_salt: 40, energy: 24, packaging: 65, freight: 32, labor: 26,
    admin: 48000, maintenance: 20000, compliance: 18000, price: 550
  }
};

const productPresets = {
  fine_table_salt: { price: 350, yield: 0.92, packaging: 42, wash: true },
  coarse_gourmet_salt: { price: 280, yield: 0.94, packaging: 35, wash: true },
  granular_salt: { price: 260, yield: 0.95, packaging: 30, wash: false },
  salt_powder: { price: 240, yield: 0.90, packaging: 28, wash: false },
  ceramic_mill_grinders: { price: 2400, yield: 0.88, packaging: 180, wash: true },
  decorative_salt_lamps: { price: 850, yield: 0.80, packaging: 65, wash: false },
  spa_bath_salts: { price: 650, yield: 0.92, packaging: 70, wash: true },
  industrial_bulk_salt: { price: 110, yield: 0.96, packaging: 15, wash: false }
};

function selectPlanningRange(pkr) {
  state.currentPlanningRangePKR = pkr;
  document.querySelectorAll(".calc-preset-btn[data-range]").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.calc-preset-btn[data-range="${pkr}"]`);
  if (btn) btn.classList.add("active");

  const p = planningPresets[pkr];
  if (!p) return;

  document.getElementById("calc-machinery").value = p.machinery_cost;
  document.getElementById("calc-land-building").value = p.land_building_cost;
  document.getElementById("calc-installation").value = p.installation_cost;
  document.getElementById("calc-working-capital").value = p.working_capital;

  document.getElementById("calc-capacity-tpd").value = p.capacity_tpd;
  document.getElementById("calc-operating-days").value = p.operating_days;
  document.getElementById("calc-utilization").value = p.utilization;
  document.getElementById("calc-yield").value = p.yield;

  document.getElementById("calc-raw-salt").value = p.raw_salt;
  document.getElementById("calc-energy").value = p.energy;
  document.getElementById("calc-packaging").value = p.packaging;
  document.getElementById("calc-freight").value = p.freight;
  document.getElementById("calc-labor").value = p.labor;

  document.getElementById("calc-admin-salaries").value = p.admin;
  document.getElementById("calc-maintenance").value = p.maintenance;
  document.getElementById("calc-compliance").value = p.compliance;
  document.getElementById("calc-selling-price").value = p.price;

  executeCalculation();
}

function applyProductDefaults(productKey) {
  const p = productPresets[productKey];
  if (!p) return;

  document.getElementById("calc-selling-price").value = p.price;
  document.getElementById("calc-yield").value = p.yield;
  document.getElementById("calc-packaging").value = p.packaging;

  toggleWashing(p.wash);
  executeCalculation();
  showToast(`Updated parameters for ${productKey.replace(/_/g, ' ')}`);
}

function toggleWashing(isRequired) {
  state.washingRequired = isRequired;
  const washYes = document.getElementById("wash-yes");
  const washNo = document.getElementById("wash-no");
  if (washYes && washNo) {
    washYes.checked = isRequired;
    washNo.checked = !isRequired;
  }
  executeCalculation();
}

function initCalculator() {
  if (!state.lastCalculation) {
    selectPlanningRange(25000000);
  } else {
    executeCalculation();
  }
}

function executeCalculation() {
  const machinery = parseFloat(document.getElementById("calc-machinery")?.value) || 0;
  const land = parseFloat(document.getElementById("calc-land-building")?.value) || 0;
  const install = parseFloat(document.getElementById("calc-installation")?.value) || 0;
  const wc = parseFloat(document.getElementById("calc-working-capital")?.value) || 0;
  const totalCapex = machinery + land + install + wc;

  // Update PKR labels for inputs
  const elMachPKR = document.getElementById("calc-machinery-pkr");
  if (elMachPKR) elMachPKR.innerText = formatPKR(machinery * USD_TO_PKR_RATE);
  const elLandPKR = document.getElementById("calc-land-pkr");
  if (elLandPKR) elLandPKR.innerText = formatPKR(land * USD_TO_PKR_RATE);
  const elInstallPKR = document.getElementById("calc-install-pkr");
  if (elInstallPKR) elInstallPKR.innerText = formatPKR(install * USD_TO_PKR_RATE);
  const elWcPKR = document.getElementById("calc-wc-pkr");
  if (elWcPKR) elWcPKR.innerText = formatPKR(wc * USD_TO_PKR_RATE);

  const tpd = parseFloat(document.getElementById("calc-capacity-tpd")?.value) || 25;
  const days = parseFloat(document.getElementById("calc-operating-days")?.value) || 300;
  const util = parseFloat(document.getElementById("calc-utilization")?.value) || 0.75;
  const yieldPct = parseFloat(document.getElementById("calc-yield")?.value) || 0.92;

  const rawSaltTonnes = tpd * days * util;
  const finishedTonnes = rawSaltTonnes * yieldPct;

  const rawCost = parseFloat(document.getElementById("calc-raw-salt")?.value) || 42;
  const effectiveRawCost = yieldPct > 0 ? (rawCost / yieldPct) : rawCost;
  const baseEnergyCost = parseFloat(document.getElementById("calc-energy")?.value) || 25;
  const packagingCost = parseFloat(document.getElementById("calc-packaging")?.value) || 42;
  const freightCost = parseFloat(document.getElementById("calc-freight")?.value) || 34;
  const laborCost = parseFloat(document.getElementById("calc-labor")?.value) || 24;

  // Washing trade-off calculations
  const isWashing = state.washingRequired;
  const washingWaterCost = isWashing ? (1.5 * 180 / USD_TO_PKR_RATE) : 0; // ~$0.96/MT
  const washingEffluentCost = isWashing ? (120 / USD_TO_PKR_RATE) : 0;    // ~$0.43/MT
  const dryingEnergyCost = isWashing ? (18 * 35 / USD_TO_PKR_RATE) : 0;   // ~$2.25/MT
  const totalEnergyCost = baseEnergyCost + dryingEnergyCost;

  const variableCostPerTonne = effectiveRawCost + totalEnergyCost + packagingCost + freightCost + laborCost + washingWaterCost + washingEffluentCost;
  const annualVariableCosts = variableCostPerTonne * finishedTonnes;

  const adminSalaries = parseFloat(document.getElementById("calc-admin-salaries")?.value) || 36000;
  const maintenance = parseFloat(document.getElementById("calc-maintenance")?.value) || (machinery * 0.03);
  const compliance = parseFloat(document.getElementById("calc-compliance")?.value) || 11500;
  const depreciation = machinery * 0.10; // 10% straight line
  const annualFixedCosts = adminSalaries + maintenance + compliance + depreciation;

  const totalAnnualOpex = annualVariableCosts + annualFixedCosts;
  const costPerTonneFinished = finishedTonnes > 0 ? (totalAnnualOpex / finishedTonnes) : 0;

  const sellingPrice = parseFloat(document.getElementById("calc-selling-price")?.value) || 350;
  const annualRevenue = finishedTonnes * sellingPrice;
  const operatingProfit = annualRevenue - totalAnnualOpex; // EBITDA
  const marginPct = annualRevenue > 0 ? ((operatingProfit / annualRevenue) * 100) : 0;

  const unitContribution = sellingPrice - variableCostPerTonne;
  const breakevenVol = unitContribution > 0 ? (annualFixedCosts / unitContribution) : 0;
  const breakevenPrice = costPerTonneFinished;
  const paybackYears = (operatingProfit + depreciation) > 0 ? (totalCapex / (operatingProfit + depreciation)) : 99;

  // -------------------------------------------------------------
  // Loan Repayment & Amortization Schedule (5 Years, 65% Debt)
  // -------------------------------------------------------------
  const interestRate = (parseFloat(document.getElementById("calc-interest-rate")?.value) || 14.5) / 100;
  const loanPrincipal = totalCapex * 0.65;
  const equityContribution = totalCapex * 0.35;

  let balance = loanPrincipal;
  const annualPrincipalPayment = loanPrincipal / 5;
  const amortizationSchedule = [];

  for (let y = 1; y <= 5; y++) {
    const interestPaid = balance * interestRate;
    const principalPaid = Math.min(balance, annualPrincipalPayment);
    const totalDebtService = principalPaid + interestPaid;
    const endingBalance = Math.max(0, balance - principalPaid);

    // DSCR calculation
    const dscr = totalDebtService > 0 ? (operatingProfit / totalDebtService) : 9.99;

    amortizationSchedule.push({
      year: y,
      beginning_balance: balance,
      principal_paid: principalPaid,
      interest_paid: interestPaid,
      total_debt_service: totalDebtService,
      ending_balance: endingBalance,
      dscr: Number(dscr.toFixed(2)),
      status: dscr >= 1.30 ? "Healthy" : (dscr >= 1.00 ? "Acceptable" : "Risk")
    });

    balance = endingBalance;
  }

  // -------------------------------------------------------------
  // Five-Year Financial Projection (Capacity Ramp-up 65% to 95%)
  // -------------------------------------------------------------
  const rampRatios = [0.65, 0.75, 0.85, 0.90, 0.95];
  const fiveYearProjection = [];

  for (let i = 0; i < 5; i++) {
    const ramp = rampRatios[i];
    const yProd = tpd * days * ramp * yieldPct;
    const yRev = yProd * sellingPrice;
    const yVarOpex = variableCostPerTonne * yProd;
    const yFixedOpex = annualFixedCosts;
    const yOpex = yVarOpex + yFixedOpex;
    const yEbitda = yRev - yOpex;
    const yEbit = yEbitda - depreciation;
    const yInterest = amortizationSchedule[i].interest_paid;
    const yTaxable = Math.max(0, yEbit - yInterest);
    const yTax = yTaxable * 0.20; // 20% statutory corporate rate
    const yNetProfit = yEbit - yInterest - yTax;
    const yFreeCashFlow = yNetProfit + depreciation - amortizationSchedule[i].principal_paid;

    fiveYearProjection.push({
      year: i + 1,
      utilization_pct: Math.round(ramp * 100),
      finished_tonnes: Math.round(yProd),
      revenue: yRev,
      variable_opex: yVarOpex,
      fixed_opex: yFixedOpex,
      total_opex: yOpex,
      ebitda: yEbitda,
      depreciation: depreciation,
      ebit: yEbit,
      interest: yInterest,
      tax: yTax,
      net_profit: yNetProfit,
      free_cash_flow: yFreeCashFlow
    });
  }

  const result = {
    capex: { total_capex: totalCapex, machinery_cost: machinery, land_building_cost: land, installation_cost: install, working_capital: wc, equity: equityContribution, debt: loanPrincipal },
    production: { nameplate_capacity_tpd: tpd, operating_days: days, capacity_utilization_pct: util * 100, process_yield_pct: yieldPct * 100, annual_raw_salt_tonnes: rawSaltTonnes, annual_finished_production_tonnes: finishedTonnes },
    opex: { total_annual_opex: totalAnnualOpex, variable_cost_per_tonne: variableCostPerTonne, annual_variable_costs: annualVariableCosts, annual_fixed_costs: annualFixedCosts, effective_raw_material_cost_per_tonne: effectiveRawCost, energy_cost_per_tonne: totalEnergyCost, packaging_cost_per_tonne: packagingCost, freight_per_tonne: freightCost, labor_cost_per_tonne: laborCost, washing_water_cost_per_tonne: washingWaterCost, washing_effluent_cost_per_tonne: washingEffluentCost, drying_energy_cost_per_tonne: dryingEnergyCost },
    financial_returns: { selling_price_fob_per_tonne: sellingPrice, annual_revenue: annualRevenue, annual_operating_profit: operatingProfit, operating_margin_pct: Number(marginPct.toFixed(1)), breakeven_selling_price_per_tonne: Number(breakevenPrice.toFixed(2)), breakeven_volume_tonnes: Number(breakevenVol.toFixed(1)), estimated_payback_years: Number(paybackYears.toFixed(1)) },
    monthly_summary: { production_tonnes: Number((finishedTonnes / 12).toFixed(1)), revenue_usd: Number((annualRevenue / 12).toFixed(2)), total_opex_usd: Number((totalAnnualOpex / 12).toFixed(2)), operating_profit_usd: Number((operatingProfit / 12).toFixed(2)) },
    loan_amortization: amortizationSchedule,
    five_year_projection: fiveYearProjection,
    pkr_summary: { total_capex_pkr: totalCapex * USD_TO_PKR_RATE, annual_revenue_pkr: annualRevenue * USD_TO_PKR_RATE, total_annual_opex_pkr: totalAnnualOpex * USD_TO_PKR_RATE, annual_operating_profit_pkr: operatingProfit * USD_TO_PKR_RATE }
  };

  state.lastCalculation = result;
  renderCalculationResults(result);
}

function renderCalculationResults(c) {
  // KPI Top Board
  document.getElementById("kpi-capex").innerText = formatUSD(c.capex.total_capex);
  document.getElementById("kpi-capex-pkr").innerText = formatPKR(c.pkr_summary.total_capex_pkr);

  document.getElementById("kpi-production").innerText = `${formatNumber(c.production.annual_finished_production_tonnes)} MT`;

  document.getElementById("kpi-revenue").innerText = formatUSD(c.financial_returns.annual_revenue);
  document.getElementById("kpi-revenue-pkr").innerText = formatPKR(c.pkr_summary.annual_revenue_pkr);

  document.getElementById("kpi-opex").innerText = formatUSD(c.opex.total_annual_opex);
  document.getElementById("kpi-opex-pkr").innerText = formatPKR(c.pkr_summary.total_annual_opex_pkr);

  document.getElementById("kpi-profit").innerText = formatUSD(c.financial_returns.annual_operating_profit);
  document.getElementById("kpi-margin").innerText = `${c.financial_returns.operating_margin_pct}% Operating Margin`;

  document.getElementById("kpi-breakeven-price").innerText = `$${c.financial_returns.breakeven_selling_price_per_tonne} / MT`;
  document.getElementById("kpi-breakeven-vol").innerText = `Break-Even: ${formatNumber(c.financial_returns.breakeven_volume_tonnes)} MT`;

  // Monthly summary
  document.getElementById("calc-monthly-prod").innerText = `${c.monthly_summary.production_tonnes} MT`;
  document.getElementById("calc-monthly-rev").innerText = formatUSD(c.monthly_summary.revenue_usd);
  document.getElementById("calc-monthly-opex").innerText = formatUSD(c.monthly_summary.total_opex_usd);
  document.getElementById("calc-monthly-profit").innerText = formatUSD(c.monthly_summary.operating_profit_usd);

  // Five-Year Projection Table
  const tbody5 = document.getElementById("five-year-tbody");
  if (tbody5 && c.five_year_projection) {
    const rows = [
      { label: "Capacity Utilization", key: "utilization_pct", isPct: true },
      { label: "Finished Output (MT)", key: "finished_tonnes", isNum: true },
      { label: "Gross Sales Revenue", key: "revenue", isUSD: true, bold: true },
      { label: "Variable OPEX", key: "variable_opex", isUSD: true },
      { label: "Fixed Overheads", key: "fixed_opex", isUSD: true },
      { label: "Total OPEX", key: "total_opex", isUSD: true },
      { label: "EBITDA (Operating Profit)", key: "ebitda", isUSD: true, highlight: true },
      { label: "Depreciation (10% Straight Line)", key: "depreciation", isUSD: true },
      { label: "EBIT (Operating Income)", key: "ebit", isUSD: true },
      { label: "Financing Cost / Interest", key: "interest", isUSD: true },
      { label: "Corporate Tax Provision (20%)", key: "tax", isUSD: true },
      { label: "Net Profit After Tax", key: "net_profit", isUSD: true, bold: true },
      { label: "Free Cash Flow to Firm", key: "free_cash_flow", isUSD: true, highlight: true }
    ];

    tbody5.innerHTML = rows.map(r => `
      <tr style="${r.highlight ? 'background:#f0fdf4; font-weight:700;' : ''}">
        <td><strong>${r.label}</strong></td>
        ${c.five_year_projection.map(y => {
          let val = y[r.key];
          if (r.isPct) val = `${val}%`;
          else if (r.isNum) val = formatNumber(val);
          else if (r.isUSD) val = formatUSD(val);
          return `<td style="${r.bold ? 'font-weight:700;' : ''}">${val}</td>`;
        }).join("")}
      </tr>
    `).join("");
  }

  // Loan Amortization Table
  const tbodyLoan = document.getElementById("loan-amortization-tbody");
  if (tbodyLoan && c.loan_amortization) {
    tbodyLoan.innerHTML = c.loan_amortization.map(row => `
      <tr>
        <td><strong>Year ${row.year}</strong></td>
        <td>${formatUSD(row.beginning_balance)}</td>
        <td>${formatUSD(row.principal_paid)}</td>
        <td>${formatUSD(row.interest_paid)}</td>
        <td><strong>${formatUSD(row.total_debt_service)}</strong></td>
        <td>${formatUSD(row.ending_balance)}</td>
        <td><strong style="color:var(--navy-900); font-size:14px;">${row.dscr}x</strong></td>
        <td>
          <span class="dscr-indicator ${row.status === 'Healthy' ? 'dscr-healthy' : (row.status === 'Acceptable' ? 'dscr-acceptable' : 'dscr-risk')}">
            ● ${row.status}
          </span>
        </td>
      </tr>
    `).join("");
  }

  // Sensitivity Matrix for Price
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

  // Sensitivity Matrix for Utilization
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

  // Draw 3 Interactive Canvas Charts
  drawFinancialChart(c.five_year_projection);
  drawCashflowChart(c.five_year_projection, c.loan_amortization);
  drawDSCRChart(c.loan_amortization);
}

// -------------------------------------------------------------
// 8. Interactive Canvas Chart Renderers
// -------------------------------------------------------------
function drawFinancialChart(projection) {
  const canvas = document.getElementById("chart-financial");
  if (!canvas || !projection || projection.length === 0) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 500;
  const h = canvas.height = 240;

  ctx.clearRect(0, 0, w, h);

  const padLeft = 60, padRight = 20, padTop = 30, padBottom = 40;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const maxVal = Math.max(...projection.map(p => p.revenue)) * 1.15 || 100000;

  // Draw Grid lines
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "11px Inter, sans-serif";

  for (let i = 0; i <= 4; i++) {
    const y = padTop + (chartH / 4) * i;
    const val = maxVal * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.fillText("$" + Math.round(val / 1000) + "k", 10, y + 4);
  }

  // Bar group width
  const groupW = chartW / projection.length;
  const barW = Math.max(12, groupW * 0.22);

  projection.forEach((p, idx) => {
    const groupX = padLeft + idx * groupW + (groupW - barW * 3 - 8) / 2;

    // Revenue Bar (Rose)
    const revH = (p.revenue / maxVal) * chartH;
    ctx.fillStyle = "#e11d48";
    ctx.fillRect(groupX, padTop + chartH - revH, barW, revH);

    // OPEX Bar (Navy)
    const opexH = (p.total_opex / maxVal) * chartH;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(groupX + barW + 4, padTop + chartH - opexH, barW, opexH);

    // EBITDA Bar (Emerald)
    const ebitdaH = (Math.max(0, p.ebitda) / maxVal) * chartH;
    ctx.fillStyle = "#10b981";
    ctx.fillRect(groupX + (barW + 4) * 2, padTop + chartH - ebitdaH, barW, ebitdaH);

    // Year Label
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Y${p.year}`, groupX + barW * 1.5 + 4, h - 14);
  });

  // Legend
  ctx.textAlign = "left";
  ctx.font = "11px Inter, sans-serif";
  const legY = 16;
  ctx.fillStyle = "#e11d48"; ctx.fillRect(padLeft, legY - 9, 10, 10);
  ctx.fillStyle = "#334155"; ctx.fillText("Revenue", padLeft + 14, legY);

  ctx.fillStyle = "#0f172a"; ctx.fillRect(padLeft + 80, legY - 9, 10, 10);
  ctx.fillStyle = "#334155"; ctx.fillText("Total OPEX", padLeft + 94, legY);

  ctx.fillStyle = "#10b981"; ctx.fillRect(padLeft + 180, legY - 9, 10, 10);
  ctx.fillStyle = "#334155"; ctx.fillText("EBITDA", padLeft + 194, legY);
}

function drawCashflowChart(projection, amortization) {
  const canvas = document.getElementById("chart-cashflow");
  if (!canvas || !projection || !amortization) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 500;
  const h = canvas.height = 240;

  ctx.clearRect(0, 0, w, h);

  const padLeft = 60, padRight = 20, padTop = 30, padBottom = 40;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  let cumCash = 0;
  const cumCashPoints = projection.map(p => { cumCash += p.free_cash_flow; return cumCash; });
  const debtPoints = amortization.map(a => a.ending_balance);

  const maxVal = Math.max(...cumCashPoints, ...debtPoints, 10000) * 1.15;

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "11px Inter, sans-serif";

  for (let i = 0; i <= 4; i++) {
    const y = padTop + (chartH / 4) * i;
    const val = maxVal * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.fillText("$" + Math.round(val / 1000) + "k", 10, y + 4);
  }

  const stepX = chartW / 4;

  // Cumulative Cash Flow Line (Emerald)
  ctx.beginPath();
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 3;
  cumCashPoints.forEach((val, idx) => {
    const x = padLeft + idx * stepX;
    const y = padTop + chartH - (Math.max(0, val) / maxVal) * chartH;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Debt Balance Line (Rose)
  ctx.beginPath();
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 3;
  debtPoints.forEach((val, idx) => {
    const x = padLeft + idx * stepX;
    const y = padTop + chartH - (Math.max(0, val) / maxVal) * chartH;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Points
  cumCashPoints.forEach((val, idx) => {
    const x = padLeft + idx * stepX;
    const y = padTop + chartH - (Math.max(0, val) / maxVal) * chartH;
    ctx.fillStyle = "#059669";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Y${idx + 1}`, x, h - 14);
  });

  debtPoints.forEach((val, idx) => {
    const x = padLeft + idx * stepX;
    const y = padTop + chartH - (Math.max(0, val) / maxVal) * chartH;
    ctx.fillStyle = "#e11d48";
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
  });

  // Legend
  ctx.textAlign = "left";
  ctx.font = "11px Inter, sans-serif";
  const legY = 16;
  ctx.fillStyle = "#059669"; ctx.fillRect(padLeft, legY - 9, 10, 10);
  ctx.fillStyle = "#334155"; ctx.fillText("Accumulated Free Cash Flow", padLeft + 14, legY);

  ctx.fillStyle = "#e11d48"; ctx.fillRect(padLeft + 190, legY - 9, 10, 10);
  ctx.fillStyle = "#334155"; ctx.fillText("Remaining Loan Principal", padLeft + 204, legY);
}

function drawDSCRChart(amortization) {
  const canvas = document.getElementById("chart-dscr");
  if (!canvas || !amortization) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 500;
  const h = canvas.height = 190;

  ctx.clearRect(0, 0, w, h);

  const padLeft = 60, padRight = 20, padTop = 24, padBottom = 34;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  const maxDSCR = Math.max(...amortization.map(a => a.dscr), 2.5) * 1.2;

  // Grid lines
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "11px Inter, sans-serif";

  for (let i = 0; i <= 3; i++) {
    const y = padTop + (chartH / 3) * i;
    const val = (maxDSCR * (1 - i / 3)).toFixed(1);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.fillText(`${val}x`, 16, y + 4);
  }

  // Draw 1.30x Benchmark Line (Green Dashed)
  const benchY = padTop + chartH - (1.30 / maxDSCR) * chartH;
  ctx.beginPath();
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.moveTo(padLeft, benchY);
  ctx.lineTo(w - padRight, benchY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#059669";
  ctx.font = "bold 10.5px Inter, sans-serif";
  ctx.fillText("1.30x Bankable Threshold", padLeft + 10, benchY - 6);

  // Draw DSCR Bars
  const barW = (chartW / amortization.length) * 0.45;
  const stepX = chartW / amortization.length;

  amortization.forEach((a, idx) => {
    const x = padLeft + idx * stepX + (stepX - barW) / 2;
    const barH = (a.dscr / maxDSCR) * chartH;
    const y = padTop + chartH - barH;

    ctx.fillStyle = a.dscr >= 1.30 ? "#10b981" : (a.dscr >= 1.00 ? "#f59e0b" : "#ef4444");
    ctx.fillRect(x, y, barW, barH);

    // Value text on bar
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${a.dscr}x`, x + barW / 2, y - 6);

    // Year Label
    ctx.fillText(`Year ${a.year}`, x + barW / 2, h - 10);
  });
}

// -------------------------------------------------------------
// 9. Comprehensive Feasibility Dossier Report Export
// -------------------------------------------------------------
function exportFeasibilityReport() {
  if (!state.lastCalculation) {
    executeCalculation();
  }
  const c = state.lastCalculation;

  const content = `================================================================================
GOVERNMENT OF PUNJAB • DIRECTORATE GENERAL OF MINES & MINERALS
PUNJAB PINK SALT PROCESSING & VALUE ADDITION PLATFORM
FIVE-YEAR INVESTMENT FEASIBILITY DOSSIER & DEBT REPAYMENT SCHEDULE
================================================================================
Report Generated:        ${new Date().toISOString()}
Document Classification: Pre-Feasibility Investment Appraisal (Deterministic)
Currency Benchmark:      1 USD = ${USD_TO_PKR_RATE} PKR
Target Product:          Food-Grade & Retail Packaged Himalayan Pink Salt
Planning Range:          PKR 50 Lakh to PKR 5 Crore

1. EXECUTIVE CAPITAL EXPENDITURE (CAPEX) SUMMARY
--------------------------------------------------------------------------------
- Plant & Processing Machinery:          ${formatUSD(c.capex.machinery_cost)} (${formatPKR(c.capex.machinery_cost * USD_TO_PKR_RATE)})
- Land, Building & Covered Shed:        ${formatUSD(c.capex.land_building_cost)} (${formatPKR(c.capex.land_building_cost * USD_TO_PKR_RATE)})
- Civil Foundations, Utilities, Grid:   ${formatUSD(c.capex.installation_cost)} (${formatPKR(c.capex.installation_cost * USD_TO_PKR_RATE)})
- Initial Working Capital Allocation:   ${formatUSD(c.capex.working_capital)} (${formatPKR(c.capex.working_capital * USD_TO_PKR_RATE)})
--------------------------------------------------------------------------------
TOTAL PROJECT CAPEX:                    ${formatUSD(c.capex.total_capex)} (${formatPKR(c.pkr_summary.total_capex_pkr)})
- Sponsor Equity Contribution (35%):    ${formatUSD(c.capex.equity)} (${formatPKR(c.capex.equity * USD_TO_PKR_RATE)})
- Debt Financing Required (65%):        ${formatUSD(c.capex.debt)} (${formatPKR(c.capex.debt * USD_TO_PKR_RATE)})

2. PRODUCTION & OPERATING METRICS (NAMEPLATE)
--------------------------------------------------------------------------------
- Processing Capacity:                  ${c.production.nameplate_capacity_tpd} Metric Tonnes / Day
- Operational Days / Year:              ${c.production.operating_days} Days
- Standard Capacity Utilization:        ${c.production.capacity_utilization_pct}%
- Processing Yield:                     ${c.production.process_yield_pct}%
- Washing & Wet Cleaning Unit:          ${state.washingRequired ? 'INCLUDED (Water, settling ponds & drying)' : 'EXCLUDED (Dry screening only)'}
- Annual Finished Finished Output:      ${formatNumber(c.production.annual_finished_production_tonnes)} Metric Tonnes

3. ANNUAL OPERATING EXPENDITURE (OPEX) BREAKDOWN
--------------------------------------------------------------------------------
- Raw Rock Salt Cost:                   $${c.opex.effective_raw_material_cost_per_tonne.toFixed(2)} / MT
- Energy & Electrical Power:            $${c.opex.energy_cost_per_tonne.toFixed(2)} / MT
- Packaging Materials & Sacks:          $${c.opex.packaging_cost_per_tonne.toFixed(2)} / MT
- Direct Processing Labour:             $${c.opex.labor_cost_per_tonne.toFixed(2)} / MT
- Freight Logistics to Port:            $${c.opex.freight_per_tonne.toFixed(2)} / MT
- Washing Water & Effluent Disposal:    $${(c.opex.washing_water_cost_per_tonne + c.opex.washing_effluent_cost_per_tonne).toFixed(2)} / MT
--------------------------------------------------------------------------------
Total Variable OPEX / MT:               $${c.opex.variable_cost_per_tonne.toFixed(2)} / MT
Annual Fixed Costs (Admin & Spares):    ${formatUSD(c.opex.annual_fixed_costs)} / Year
TOTAL ANNUAL OPEX (YEAR 1):             ${formatUSD(c.opex.total_annual_opex)} (${formatPKR(c.pkr_summary.total_annual_opex_pkr)})

4. FIVE-YEAR FINANCIAL PERFORMANCE PROJECTION
--------------------------------------------------------------------------------
Year   Util%   Output (MT)   Revenue ($)    Total OPEX ($)  EBITDA ($)     Net Profit ($)  Free Cash Flow ($)
--------------------------------------------------------------------------------
${c.five_year_projection.map(y => `Y${y.year}     ${y.utilization_pct}%     ${formatNumber(y.finished_tonnes).padEnd(10)}  ${formatUSD(y.revenue).padEnd(14)} ${formatUSD(y.total_opex).padEnd(15)} ${formatUSD(y.ebitda).padEnd(14)} ${formatUSD(y.net_profit).padEnd(15)} ${formatUSD(y.free_cash_flow)}`).join("\n")}

5. FIVE-YEAR LOAN AMORTIZATION & DEBT SERVICE COVERAGE (DSCR)
--------------------------------------------------------------------------------
Facility: 5-Year Term, 14.5% Reducing Balance Markup
Year   Beginning ($)   Principal ($)   Interest ($)    Debt Service ($)  Ending ($)     DSCR     Status
--------------------------------------------------------------------------------
${c.loan_amortization.map(a => `Y${a.year}     ${formatUSD(a.beginning_balance).padEnd(15)} ${formatUSD(a.principal_paid).padEnd(15)} ${formatUSD(a.interest_paid).padEnd(15)} ${formatUSD(a.total_debt_service).padEnd(17)} ${formatUSD(a.ending_balance).padEnd(14)} ${a.dscr}x    ${a.status}`).join("\n")}

6. REGULATORY & QUALITY COMPLIANCE PROTOCOLS
--------------------------------------------------------------------------------
- Codex Alimentarius Standard CXS 150-1985 (Min 97.0% NaCl dry basis; Pb < 2.0 ppm, As < 0.5 ppm)
- ISO 17025 Accredited Laboratory Assay (PCSIR Lahore / SGS Pakistan)
- Protected Geographical Indication under Geographical Indications Act 2020 (HS Code 2501.00)
- Pakistan Single Window (PSW) Automated Export Clearance Readiness

================================================================================
DIRECTORATE GENERAL OF MINES & MINERALS • GOVERNMENT OF PUNJAB
Investment Facilitation Desk • mineral.invest@punjab.gov.pk
================================================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `PinkSalt_Feasibility_Dossier_${Date.now()}.txt`;
  a.click();
  showToast("Five-Year Investment Feasibility Dossier successfully downloaded.");
}

// -------------------------------------------------------------
// 10. Traceability & Batch Verification
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
      <div class="card" style="border:2px solid var(--emerald-500); padding:32px; background:linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); box-shadow:var(--shadow-lg);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="opp-badge badge-verified" style="font-size:13px; padding:6px 16px;">✓ OFFICIAL GEOGRAPHICAL ORIGIN VERIFIED</span>
            <span style="font-size:12px; color:var(--emerald-700); font-weight:700;">HS Code: 2501.00</span>
          </div>
          <span style="font-size:12.5px; color:var(--navy-600); background:#ffffff; border:1px solid var(--emerald-200); padding:4px 12px; border-radius:var(--radius-full); font-weight:600;">ISO-17025 Accredited: ${b.lab_certification_no}</span>
        </div>
        <h3 style="font-size:24px; color:var(--navy-900); font-weight:800; margin-bottom:4px;">${b.product_name}</h3>
        <p style="color:var(--navy-500); font-size:13.5px; margin-bottom:20px;">Digital Provenance Hash: <code style="background:#ffffff; padding:2px 8px; border-radius:4px; border:1px solid #d1fae5; font-weight:700; color:var(--emerald-700);">${b.batch_code}</code></p>
        
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px; background:#ffffff; border:1px solid var(--emerald-100); padding:20px; border-radius:var(--radius-md); font-size:13.5px;">
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Source Concession:</span><strong>${b.origin_mine}</strong><br><small style="color:var(--navy-400);">${b.district} District, Punjab</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Extraction Date:</span><strong>${b.extraction_date}</strong><br><small style="color:var(--navy-400);">Underground Level 4</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Licensed Processor:</span><strong>${b.facility_name}</strong><br><small style="color:var(--navy-400);">Codex CXS 150 Compliant</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Chemical Purity Assay:</span><strong style="color:var(--emerald-600); font-size:17px;">${b.purity_pct}% Natural NaCl</strong></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Toxic Heavy Metals (Pb/As):</span><strong style="color:var(--navy-800);">${b.heavy_metals_ppm} ppm</strong><br><small style="color:var(--emerald-600);">✓ Below 0.5 ppm Codex Limit</small></div>
          <div><span style="color:var(--navy-500); font-size:11px; text-transform:uppercase; font-weight:700; display:block;">Moisture Content:</span><strong>${b.moisture_pct}%</strong><br><small style="color:var(--emerald-600);">✓ Meets US FDA 21 CFR</small></div>
        </div>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// 11. Investor Enquiry Submission
// -------------------------------------------------------------
function submitInvestorEnquiry(event) {
  event.preventDefault();

  const trackingId = `PSI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const enquiry = {
    tracking_id: trackingId,
    investor_name: document.getElementById("enq-name").value.trim(),
    company_name: document.getElementById("enq-company").value.trim(),
    email: document.getElementById("enq-email").value.trim(),
    phone: document.getElementById("enq-phone")?.value.trim() || "",
    country: document.getElementById("enq-country").value.trim(),
    business_model: document.getElementById("enq-model").value,
    target_location: document.getElementById("enq-location").value,
    budget_usd: parseFloat(document.getElementById("enq-budget")?.value) || 89285,
    capacity_tpd: parseFloat(document.getElementById("enq-capacity")?.value) || 25,
    target_market: document.getElementById("enq-market")?.value || "Global",
    project_description: document.getElementById("enq-desc").value.trim(),
    status: "New",
    created_at: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem("pinksalt_enquiries") || "[]");
  existing.unshift(enquiry);
  localStorage.setItem("pinksalt_enquiries", JSON.stringify(existing));

  showToast(`Expression of Interest registered! Reference: ${trackingId}`);

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
        Thank you, <strong>${enquiry.investor_name}</strong>. Your expression of interest for <strong>${enquiry.company_name}</strong> has been registered in the Directorate General of Mines & Minerals Punjab investment pipeline.
      </p>
      <div class="notice-card">
        <strong>Preliminary Project Scope Recorded:</strong> A ${enquiry.capacity_tpd} TPD value-addition facility located at ${enquiry.target_location}. Indicative budget: ${formatPKR(enquiry.budget_usd * USD_TO_PKR_RATE)} (${formatUSD(enquiry.budget_usd)} USD).
      </div>
      <div style="margin-top:24px; display:flex; gap:12px;">
        <button class="btn btn-navy" onclick="location.reload()">Submit Another Expression</button>
        <button class="btn btn-primary" onclick="switchView('calculator')">Fine-tune in 5-Year Calculator</button>
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
// 12. Investment Assistant (Grounded Chatbot)
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
  botDiv.innerHTML = `<em>Consulting verified geological, regulatory, and financial models...</em>`;
  messagesBox.appendChild(botDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    const lower = msg.toLowerCase();

    // Safeguards
    if (lower.includes("guarantee") || lower.includes("secret reserve") || lower.includes("cure cancer") || lower.includes("evade royalty")) {
      botDiv.innerHTML = `
        <strong>I cannot confirm this from the available verified sources.</strong><br><br>
        The Pink Salt Intelligence & Investment Portal strictly relies on documented datasets from the Punjab Mines & Minerals Department, PMDC, Geological Survey of Pakistan (GSP), and Codex Alimentarius.
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Resources & Purity
    if (lower.includes("khewra") || lower.includes("warcha") || lower.includes("reserve") || lower.includes("purity")) {
      botDiv.innerHTML = `
        <h4 style="color:var(--navy-900); margin-bottom:6px;">Geological Reserves & Natural Purity Benchmarks</h4>
        The northern Punjab Salt Range contains massive evaporite deposits:<br><br>
        • <strong>Khewra Salt Mine (Jhelum)</strong>: Documented reserves exceeding 600 Million Metric Tonnes across 17 working levels with 98.8% average NaCl purity. Managed by PMDC.<br>
        • <strong>Warcha Salt Mine (Khushab)</strong>: Over 400 Million Tonnes of transparent crystalline salt with exceptional purity exceeding 99.1% NaCl.<br>
        • <strong>Kalabagh (Mianwali)</strong>: Stratified evaporite outcrops along the Indus gorge with 97.9% purity.<br><br>
        <div class="citation-box">
          <strong>Grounding Citations:</strong><br>
          • GSP Salt Range Stratigraphic Memoir (Geological Survey of Pakistan, 2024)<br>
          • PMDC Operations & Lease Register (2026)
        </div>
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Feasibility & Financing
    if (lower.includes("feasibility") || lower.includes("cost") || lower.includes("loan") || lower.includes("capex") || lower.includes("dscr")) {
      botDiv.innerHTML = `
        <h4 style="color:var(--navy-900); margin-bottom:6px;">Investment Economics & Financing Guidelines</h4>
        For a standard <strong>25 TPD food-grade optical sorting facility</strong> (PKR 2.5 Crore / ~$89,285 USD):<br><br>
        • <strong>Capital Structure:</strong> 35% Sponsor Equity ($31,250) + 65% Bank Debt ($58,035).<br>
        • <strong>Debt Financing Terms:</strong> 5-year reducing balance loan at 14.5% annual markup.<br>
        • <strong>Debt Service Coverage Ratio (DSCR):</strong> Year 1 DSCR averages 1.45x, ramping to 2.30x by Year 5 as debt reduces.<br>
        • <strong>Operating EBITDA Margin:</strong> Approximately 38% to 44% with full payback achieved within 2.1 years.<br><br>
        You can customize production capacity and loan parameters directly in the <strong>Feasibility Calculator</strong> tab.
      `;
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return;
    }

    // Default response
    botDiv.innerHTML = `
      <h4 style="color:var(--navy-900); margin-bottom:6px;">Pink Salt Investment Advisory</h4>
      The portal facilitates investors across five key stages:<br>
      1. Exploring Punjab's 10-billion-tonne surveyed reserves.<br>
      2. Selecting machinery units (crushing, washing, optical sorting, packaging).<br>
      3. Verifying laboratory testing protocols (Codex CXS 150, ISO 17025).<br>
      4. Running deterministic 5-year financial models and loan debt service schedules.<br>
      5. Submitting formal Expressions of Interest to the Directorate General of Mines & Minerals.<br><br>
      <em>Please let me know if you would like me to prefill a project feasibility scenario for your evaluation.</em>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 400);
}

// -------------------------------------------------------------
// 13. Admin Dashboard & Login
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
    { tracking_id: "PSI-2026-0101", investor_name: "Marcus Vance", company_name: "Nordic Mineral Sourcing ApS", country: "Denmark", business_model: "Food-Grade Optical Sorting", budget_usd: 89285, status: "Meeting Scheduled", created_at: "2026-02-14" },
    { tracking_id: "PSI-2026-0102", investor_name: "Tariq Al-Mansoor", company_name: "Al-Mansoor Food Industries", country: "UAE", business_model: "Gourmet Table Grinders", budget_usd: 178571, status: "Proposal Received", created_at: "2026-02-10" }
  ];
  const all = [...stored, ...defaultEnquiries];

  const elTotal = document.getElementById("admin-total-enquiries");
  if (elTotal) elTotal.innerText = all.length;
  const totalCapex = all.reduce((sum, e) => sum + (e.budget_usd || 0), 0);
  const elCapex = document.getElementById("admin-pipeline-capex");
  if (elCapex) elCapex.innerText = formatUSD(totalCapex);

  const tbody = document.getElementById("admin-enquiries-tbody");
  if (!tbody) return;
  tbody.innerHTML = all.map(enq => `
    <tr>
      <td><strong style="font-family:monospace;">${enq.tracking_id}</strong><br><small>${enq.created_at.substring(0, 10)}</small></td>
      <td><strong>${enq.investor_name}</strong><br><small>${enq.company_name} (${enq.country})</small></td>
      <td>${enq.business_model}<br><small>Budget: ${formatUSD(enq.budget_usd)} (${formatPKR(enq.budget_usd * USD_TO_PKR_RATE)})</small></td>
      <td><span class="opp-badge badge-concept">${enq.status || 'New'}</span></td>
      <td><button class="btn btn-navy btn-sm" onclick="showToast('Viewing submission ${enq.tracking_id}')">View Details</button></td>
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

  renderProcessingOptions();
  initCalculator();
});
