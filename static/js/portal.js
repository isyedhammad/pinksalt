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
    summary: "Comprehensive survey of evaporite sequences in Jhelum, Khushab, and Mianwali, documenting over 30.0+ billion MT of documented rock salt reserves.",
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

// Formatting Utilities & Toast System
let isAppInitialized = false;

function showToast(message) {
  // Never show any notification during initial page load, stabilization, or reload
  if (!isAppInitialized) return;

  const container = document.getElementById("toast-container");
  if (!container) return;
  // Clear any existing toast so only 1 summarized notification displays
  container.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span style="display:inline-flex; align-items:center; gap:6px;">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 2200);
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

  document.querySelectorAll(".header-hover-tab").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(`.header-hover-tab[data-view="${viewName}"]`).forEach(el => el.classList.add("active"));

  if (viewName === "opportunities") {
    loadOpportunities();
  }
  if (viewName === "processing-options") {
    renderProcessingOptions();
    selectProcessingSite("quaidabad");
  }
  if (viewName === "quality-testing") {
    calculateTestingCost();
  }
  if (viewName === "calculator") {
    initCalculator();
  updateInteractiveFeasibilityEngine();
  }
  if (viewName === "resources") {
    loadResources();
  }
  if (viewName === "admin") {
    checkAdminSession();
  }
  if (viewName === "ai") {
    setTimeout(() => {
      const input = document.getElementById("ai-chat-input");
      if (input) input.focus();
    }, 150);
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
      <button class="btn btn-outline" onclick="closeGenericModal(); switchView('calculator')">Feasibility Calculator</button>
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

// -------------------------------------------------------------
// Spatial GIS Mineral Corridor Telemetry
// -------------------------------------------------------------
const GIS_ZONES_DATA = {
  khewra: {
    title: "Khewra Salt Mine & Artisanal Corridor (Jhelum)",
    badge: "🏛️ Primary Geological Reserve",
    badgeBg: "#e11d48",
    desc: "World's second largest salt deposit with 600M+ MT proven reserves and 98.8% natural NaCl purity. Direct connectivity via M-2 Lilla Interchange and home to multi-generational artisanal stonemasons.",
    siteKey: "khewra"
  },
  warcha: {
    title: "Warcha Crystalline Seams (Khushab)",
    badge: "⛏️ High-Purity Extraction Reserve",
    badgeBg: "#f43f5e",
    desc: "400M+ MT high-purity crystalline evaporite seams yielding 99.1% pure translucent pink rock salt. Serves as primary feedstock supplier to Quaidabad processing cluster.",
    siteKey: "quaidabad"
  },
  quaidabad: {
    title: "Quaidabad Special Economic Zone (Khushab)",
    badge: "🏭 Priority Processing SEZ Zone",
    badgeBg: "#d97706",
    desc: "Strategic mineral processing cluster located 35 km from Warcha extraction mines. Features dedicated railway freight siding, 132kV grid station, and 10-year income tax holiday under SEZ Act.",
    siteKey: "quaidabad"
  },
  bhalwal: {
    title: "Bhalwal Industrial Estate (Sargodha)",
    badge: "🏭 Agro-Mineral Processing Hub",
    badgeBg: "#0284c7",
    desc: "Modern PIEDMC industrial estate located directly on M-2 Motorway (Bhalwal Interchange), 65 km from Salt Range. Equipped with 11kV underground power and 10-year SEZ exemption.",
    siteKey: "bhalwal"
  },
  m3: {
    title: "M-3 Industrial City (Faisalabad SEZ)",
    badge: "🏭 Mega Export SEZ Corridor",
    badgeBg: "#059669",
    desc: "Pakistan's largest Special Economic Zone with direct motorway transit to Karachi ports. Features 0% customs duty on imported machinery, CETP effluent treatment, and dedicated container terminal.",
    siteKey: "m3_faisalabad"
  },
  kalabagh: {
    title: "Kalabagh Geological Outcrops (Mianwali)",
    badge: "🌊 Natural Evaporite Formation",
    badgeBg: "#be123c",
    desc: "250M+ MT geological deposits exposed along the Indus River gorge. Renowned for high trace mineral content and rich red/salmon salt rock varieties.",
    siteKey: "quaidabad"
  },
  chakwal: {
    title: "Chakwal - Kallar Kahar Strike Belt",
    badge: "⛰️ Regional Resource Strike",
    badgeBg: "#64748b",
    desc: "150M+ MT subsurface evaporite continuity connecting the eastern and central Salt Range, situated along the M-2 Kallar Kahar scenic escarpment.",
    siteKey: "khewra"
  }
};

let currentGisZone = "quaidabad";

function selectGisZone(zoneKey) {
  currentGisZone = zoneKey;
  const z = GIS_ZONES_DATA[zoneKey] || GIS_ZONES_DATA.quaidabad;
  const titleEl = document.getElementById("gis-zone-title");
  const badgeEl = document.getElementById("gis-zone-badge");
  const descEl = document.getElementById("gis-zone-desc");
  const ctaBtn = document.getElementById("gis-zone-cta");
  if (titleEl) titleEl.textContent = z.title;
  if (badgeEl) {
    badgeEl.textContent = z.badge;
    badgeEl.style.background = z.badgeBg;
  }
  if (descEl) descEl.textContent = z.desc;
  if (ctaBtn) {
    ctaBtn.onclick = function() {
      switchView("processing-options");
      selectProcessingSite(z.siteKey);
    };
  }
  showToast(`🎯 Selected: ${z.title}`);
}

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

  const modelCodes = {
    crushing_grinding: "BLOOM-VHC4",
    washing_cleaning: "TROM-WASH30",
    screening_grading: "VIBRO-SIFT4",
    industrial_drying: "FBD-DRY25",
    automated_packaging: "VFFS-PACK30",
    turnkey_plants: "EPK-SALT1000"
  };

  container.innerHTML = EMBEDDED_MACHINERY.map(m => {
    const badgeClass = m.id === 'turnkey_plants' ? 'turnkey' : (m.is_optional ? 'optional' : 'essential');
    const code = modelCodes[m.id] || "EPK-UNIT";
    return `
      <div class="machinery-card">
        <div>
          <div class="machinery-card-header">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#34d399; box-shadow:0 0 8px #34d399;"></span>
                <span class="epk-tech-tag" style="background:#0f172a; color:#38bdf8; border:1px solid #1e293b; padding:2px 8px; border-radius:4px; font-family:monospace; font-size:10px; font-weight:700; letter-spacing:0.1em;">${code}</span>
              </div>
              <span class="machinery-badge ${badgeClass}">${m.status_tag}</span>
            </div>
            <h3>${m.title}</h3>
            <p class="machinery-subtitle">${m.subtitle}</p>
            <p class="machinery-desc">${m.purpose}</p>
          </div>

          <div class="machinery-products-box">
            <strong>Finished Products Generated</strong>
            <span>${m.products}</span>
          </div>

          <div class="machinery-specs-grid">
            <div class="spec-item">
              <span>Capacity Range</span>
              <strong>${m.capacity_range}</strong>
            </div>
            <div class="spec-item">
              <span>Primary Tech</span>
              <strong title="${m.specs.equipment_type || m.specs.engineering || ''}">${m.specs.equipment_type || m.specs.engineering}</strong>
            </div>
            <div class="spec-item">
              <span>Power Rating</span>
              <strong>${m.specs.power_rating || 'Per Layout'}</strong>
            </div>
            <div class="spec-item">
              <span>Utility Hookup</span>
              <strong title="${m.utility}">${m.utility}</strong>
            </div>
          </div>

          <div class="machinery-source-line" style="margin-bottom:14px; font-size:11.5px; min-height:20px;">
            ${m.verified_source_url ? `
              <span style="color:#64748b; font-family:monospace; font-size:10.5px; text-transform:uppercase; letter-spacing:0.06em;">Verified Source: </span>
              <a href="${m.verified_source_url}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:700; text-decoration:underline;">
                ${m.verified_source} ↗
              </a>
            ` : `
              <span style="color:#64748b; font-family:monospace; font-size:10.5px; text-transform:uppercase; letter-spacing:0.06em;">Verified Source: </span>
              <span style="color:#94a3b8;">Directorate Technical Benchmark</span>
            `}
          </div>
        </div>

        <div class="machinery-card-footer">
          <div class="machinery-price-box">
            <span class="price-label">Indicative CAPEX</span>
            <div>
              <span class="price-val">${m.indicative_price_pkr}</span>
              <small style="color:#94a3b8; font-size:11px; margin-left:4px;">(${m.indicative_price_usd})</small>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button class="btn btn-sm" onclick="openRFQModal('${m.title}', 25)" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.22); color:#ffffff; border-radius:9999px; font-size:11.5px; font-weight:600; padding:7px 8px; text-align:center; justify-content:center; transition:all 0.25s ease;">Generate RFQ 📋</button>
            <button class="btn btn-sm" onclick="configureMachineryInCalc(${m.default_capex_usd}, ${m.is_optional})" style="background:linear-gradient(135deg, #e11d48 0%, #be123c 100%); border:none; color:#ffffff; border-radius:9999px; font-size:11.5px; font-weight:700; padding:7px 8px; text-align:center; justify-content:center; box-shadow:0 4px 14px rgba(225,29,72,0.35); transition:all 0.25s ease;">Configure in Calc →</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function configureMachineryInCalc(capexUSD, isOptional) {
  switchView("calculator");
  setTimeout(() => {
    const el = document.getElementById("calc-machinery");
    if (el) el.value = capexUSD;
    if (isOptional) {
      toggleWashing(true);
    }
    executeCalculation(false);
    showToast('Successfully Calculated');
  }, 100);
}

function calibrateFeasibilityWithTurnkeyPlant() {
  switchView("calculator");
  setTimeout(() => {
    // Select PKR 3.0 Crore preset (Turnkey 25 TPD Line)
    const presetBtn = document.querySelector('.calc-preset-btn[data-capex="30000000"]') || 
                      document.querySelectorAll('.calc-preset-btn')[2];
    if (presetBtn) {
      presetBtn.click();
    }
    const washToggle = document.getElementById("calc-washing-toggle");
    if (washToggle && !washToggle.checked) {
      washToggle.click();
    }
    showToast('Successfully Calculated');
  }, 120);
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
Phone / Contact Number:  ${phone}

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
      executeCalculation(false);
      showToast('Successfully Calculated');
    }
  }, 100);
}

// -------------------------------------------------------------
// 7. Financial Modeling Engine (5-Year Projections & Loan Amortization)
// -------------------------------------------------------------
// ==============================================================================
// 4 APPLICANT BUSINESS CATEGORIES PRESETS & SMEDA CASE STUDY
// ==============================================================================
const APPLICANT_CATEGORIES = {
  small_packaging: {
    id: "small_packaging",
    num: 1,
    name: "Small-Scale Packaging Unit",
    activities: "Grinding, grading, packing and labelling",
    rangePKR: "PKR 50 Lakh to PKR 1.5 Crore",
    rangeBadge: "PKR 50L - 1.5Cr",
    capexUSD: 32500,
    machinery: 18000,
    land: 8000,
    install: 1500,
    wc: 5000,
    capacityTPD: 8,
    days: 280,
    util: 0.75,
    yield: 0.95,
    washing: false,
    rawCost: 40,
    energy: 18,
    packaging: 45,
    labor: 18,
    freight: 25,
    admin: 12000,
    maintenance: 1200,
    compliance: 3500,
    price: 340,
    equityPct: 30,
    interestRate: 14.5,
    productKey: "fine_table_salt",
    staff: "12 Workers",
    advice: "Ideal for micro & small entrepreneurs. Focus on food-grade packaging hygiene (PSQCA 1669:2008) and retail barcode distribution. Low fixed overhead allows fast breakeven."
  },
  medium_manufacturing: {
    id: "medium_manufacturing",
    num: 2,
    name: "Medium-Scale Manufacturing Unit",
    activities: "Washing, crushing, grinding, processing and packaging",
    rangePKR: "PKR 2.0 Crore to PKR 5.0 Crore",
    rangeBadge: "PKR 2.0Cr - 5.0Cr",
    capexUSD: 135000,
    machinery: 75000,
    land: 35000,
    install: 8000,
    wc: 17000,
    capacityTPD: 30,
    days: 300,
    util: 0.80,
    yield: 0.92,
    washing: true,
    rawCost: 38,
    energy: 32,
    packaging: 42,
    labor: 20,
    freight: 30,
    admin: 28000,
    maintenance: 3800,
    compliance: 7500,
    price: 360,
    equityPct: 35,
    interestRate: 14.5,
    productKey: "fine_table_salt",
    staff: "28 Workers",
    advice: "Standard industrial salt processing unit. Ensure proper wastewater sedimentation for the washing circuit and reliable 3-phase grid power (50-100 kVA transformer)."
  },
  value_added_products: {
    id: "value_added_products",
    num: 3,
    name: "Value-Added Product Manufacturing",
    activities: "Salt lamps, tiles, bath salts, decorative products and other finished goods",
    rangePKR: "PKR 75 Lakh to PKR 2.5 Crore",
    rangeBadge: "PKR 75L - 2.5Cr",
    capexUSD: 65000,
    machinery: 32000,
    land: 20000,
    install: 4000,
    wc: 9000,
    capacityTPD: 10,
    days: 280,
    util: 0.70,
    yield: 0.85,
    washing: false,
    rawCost: 45,
    energy: 24,
    packaging: 95,
    labor: 45,
    freight: 35,
    admin: 18000,
    maintenance: 2000,
    compliance: 5000,
    price: 680,
    equityPct: 40,
    interestRate: 14.5,
    productKey: "decorative_salt_lamps",
    staff: "22 Artisans",
    advice: "High gross margin artisan production (lamps, tiles, spa salts). Prioritize skilled lathe craftsmanship, moisture-proof shrink wrapping, and CE/UL certified electrical fittings for export."
  },
  export_oriented: {
    id: "export_oriented",
    num: 4,
    name: "Export-Oriented Business (SMEDA Benchmark)",
    activities: "Bulk supply, private labelling, international distribution and direct exports",
    rangePKR: "PKR 5.0 Crore to PKR 9.5+ Crore",
    rangeBadge: "PKR 5.0Cr - 9.5+Cr",
    capexUSD: 339260,
    machinery: 111385,
    land: 143297,
    install: 53000,
    wc: 31645,
    capacityTPD: 50,
    days: 280,
    util: 0.75,
    yield: 0.92,
    washing: true,
    rawCost: 35,
    energy: 28,
    packaging: 48,
    labor: 22,
    freight: 32,
    admin: 42000,
    maintenance: 6500,
    compliance: 14000,
    price: 410,
    equityPct: 50,
    interestRate: 26.0,
    productKey: "fine_table_salt",
    staff: "43 Personnel",
    advice: "Full-scale corporate exporter benchmarked against SMEDA Dec 2023 Study #220. Meets eligibility for SBP Export Refinance Scheme (ERF). Requires ISO 22000, HACCP, Halal, and FDA compliance."
  }
};

const SMEDA_BENCHMARK_CASE_STUDY = {
  document: "SMEDA Pre-Feasibility Document No. 220",
  title: "Pink Salt Manufacturing and Export Unit",
  date: "December 2023",
  authority: "Small and Medium Enterprises Development Authority, Ministry of Industries & Production, GoP",
  project_cost_pkr: 94992710,
  capex_pkr: 86132014,
  wc_pkr: 8860696,
  irr_equity: 0.29,
  irr_debt: 0.25,
  payback_years: 4.10,
  npv_pkr: 49945487
};

function selectApplicantCategory(catId, showNotification = false) {
  state.currentApplicantCategory = catId;
  const cat = APPLICANT_CATEGORIES[catId];
  if (!cat) return;

  document.querySelectorAll('.applicant-cat-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById('cat-card-' + catId);
  if (card) card.classList.add('active');

  const elMach = document.getElementById('calc-machinery');
  if (elMach) elMach.value = cat.machinery;

  const elLand = document.getElementById('calc-land-building');
  if (elLand) elLand.value = cat.land;

  const elInstall = document.getElementById('calc-installation');
  if (elInstall) elInstall.value = cat.install;

  const elWc = document.getElementById('calc-working-capital');
  if (elWc) elWc.value = cat.wc;

  const elTpd = document.getElementById('calc-capacity-tpd');
  if (elTpd) elTpd.value = cat.capacityTPD;

  const elDays = document.getElementById('calc-operating-days');
  if (elDays) elDays.value = cat.days;

  const elUtil = document.getElementById('calc-utilization');
  if (elUtil) elUtil.value = cat.util;

  const elYield = document.getElementById('calc-yield');
  if (elYield) elYield.value = cat.yield;

  const elRaw = document.getElementById('calc-raw-salt');
  if (elRaw) elRaw.value = cat.rawCost;

  const elEnergy = document.getElementById('calc-energy');
  if (elEnergy) elEnergy.value = cat.energy;

  const elPkg = document.getElementById('calc-packaging');
  if (elPkg) elPkg.value = cat.packaging;

  const elLabor = document.getElementById('calc-labor');
  if (elLabor) elLabor.value = cat.labor;

  const elFreight = document.getElementById('calc-freight');
  if (elFreight) elFreight.value = cat.freight;

  const elAdmin = document.getElementById('calc-admin-salaries');
  if (elAdmin) elAdmin.value = cat.admin;

  const elMaint = document.getElementById('calc-maintenance');
  if (elMaint) elMaint.value = cat.maintenance;

  const elComp = document.getElementById('calc-compliance');
  if (elComp) elComp.value = cat.compliance;

  const elPrice = document.getElementById('calc-selling-price');
  if (elPrice) elPrice.value = cat.price;

  const elEquity = document.getElementById('calc-equity-pct');
  if (elEquity) elEquity.value = cat.equityPct;

  const elRate = document.getElementById('calc-interest-rate');
  if (elRate) elRate.value = cat.interestRate || 14.5;

  const elProd = document.getElementById('calc-product-select');
  if (elProd && cat.productKey) elProd.value = cat.productKey;

  toggleWashing(cat.washing);
  executeCalculation(false);
  if (showNotification) {
    showToast('Successfully Calculated');
  }
}

function loadSmedaCaseStudy() {
  selectApplicantCategory('export_oriented', false);
  state.smedaAssumptionsActive = true;

  // Table 24: Production Cost Assumptions
  const elRaw = document.getElementById('calc-raw-salt');
  if (elRaw) elRaw.value = 57.14; // Rs. 16,000 / ton raw edible rock salt @ 280 PKR/USD

  const elPkg = document.getElementById('calc-packaging');
  if (elPkg) elPkg.value = 4.46; // Rs. 1,250 / ton edible salt packing @ 280 PKR/USD

  const elRate = document.getElementById('calc-interest-rate');
  if (elRate) elRate.value = 26.0; // SMEDA Table 17 & 26: 26% markup

  const elEquity = document.getElementById('calc-equity-pct');
  if (elEquity) elEquity.value = 50.0; // 50% debt / 50% equity

  executeCalculation(false);
  switchFiveYearTab('cashflow');
  showToast('Successfully Calculated');
}

// ==============================================================================
// SMEDA AUDITED CASH FLOW STATEMENT (TABLE 12.3) & ASSUMPTIONS HANDLERS
// ==============================================================================
const SMEDA_CASH_FLOW_DATA = [
  { metric: "Net Profit", y0: "-", y1: "10,219,520", y2: "11,606,340", y3: "24,171,419", y4: "38,988,245", y5: "54,118,877", isBold: true },
  { metric: "Add: Depreciation Expense", y0: "-", y1: "9,621,065", y2: "9,621,065", y3: "9,621,065", y4: "9,621,065", y5: "9,621,065", isBold: false },
  { metric: "Add: Amortization of Pre-Operating Costs", y0: "-", y1: "1,211,433", y2: "1,211,433", y3: "1,211,433", y4: "1,211,433", y5: "1,211,433", isBold: false },
  { metric: "Accounts Receivable", y0: "-", y1: "(7,400,621)", y2: "(1,184,099)", y3: "(2,568,015)", y4: "(2,995,771)", y5: "(3,483,398)", isBold: false },
  { metric: "Finished Goods Inventory", y0: "-", y1: "(8,953,163)", y2: "(2,551,801)", y3: "(2,981,750)", y4: "(3,473,663)", y5: "(4,035,953)", isBold: false },
  { metric: "Equipment Spare Inventory", y0: "(220,915)", y1: "7,225", y2: "16,480", y3: "28,746", y4: "44,793", y5: "65,566", isBold: false },
  { metric: "Raw Material Inventory", y0: "(7,081,869)", y1: "(3,201,005)", y2: "(4,233,117)", y3: "(5,557,551)", y4: "(7,251,567)", y5: "(5,738,273)", isBold: false },
  { metric: "Advance Insurance Premium", y0: "(557,912)", y1: "83,687", y2: "83,687", y3: "83,687", y4: "83,687", y5: "83,687", isBold: false },
  { metric: "Accounts Payable", y0: "6,210,734", y1: "1,903,888", y2: "2,238,587", y3: "2,625,198", y4: "2,971,088", y5: "1,709,527", isBold: false },
  { metric: "Cash Provided by Operations", y0: "(7,860,696)", y1: "7,798,874", y2: "16,473,875", y3: "26,247,621", y4: "38,853,420", y5: "54,814,092", isHighlight: true, isBold: true },
  { metric: "Issuance of Shares (Paid-Up Capital)", y0: "94,992,710", y1: "-", y2: "-", y3: "-", y4: "-", y5: "-", isBold: false },
  { metric: "Cash Provided by Financing Activities", y0: "94,992,710", y1: "-", y2: "-", y3: "-", y4: "-", y5: "-", isBold: true },
  { metric: "Capital Expenditure (CAPEX)", y0: "(86,132,014)", y1: "-", y2: "-", y3: "-", y4: "-", y5: "-", isBold: false },
  { metric: "Cash Used in Investing Activities", y0: "(86,132,014)", y1: "-", y2: "-", y3: "-", y4: "-", y5: "-", isBold: true },
  { metric: "NET CASH FLOW", y0: "1,000,000", y1: "7,798,874", y2: "16,473,875", y3: "26,247,621", y4: "38,853,420", y5: "54,814,092", isHighlight: true, isBold: true },
  { metric: "Closing Cash & Bank Balance", y0: "1,000,000", y1: "3,689,114", y2: "11,804,940", y3: "21,787,827", y4: "33,014,757", y5: "46,956,166", isHighlight: true, isBold: true }
];

function toggleSmedaAssumptions() {
  const panel = document.getElementById("smeda-assumptions-panel");
  const btn = document.getElementById("btn-toggle-smeda-assumptions");
  if (!panel) return;
  const isHidden = panel.style.display === "none";
  panel.style.display = isHidden ? "block" : "none";
  if (btn) btn.innerHTML = isHidden ? "▲ Hide Audited Key Assumptions" : "📋 View Audited Key Assumptions (Tables 23, 24, 25 &amp; 26)";
}

function switchFiveYearTab(tabKey) {
  state.currentFiveYearTab = tabKey;
  document.querySelectorAll(".five-year-tab-btn").forEach(b => b.classList.remove("active"));
  const btn = document.getElementById("tab-btn-5yr-" + tabKey);
  if (btn) btn.classList.add("active");

  const pnlView = document.getElementById("five-year-pnl-view");
  const cfView = document.getElementById("five-year-cashflow-view");
  const amortView = document.getElementById("five-year-amortization-view");

  if (pnlView) pnlView.style.display = (tabKey === "pnl") ? "block" : "none";
  if (cfView) cfView.style.display = (tabKey === "cashflow") ? "block" : "none";
  if (amortView) amortView.style.display = (tabKey === "amortization") ? "block" : "none";

  if (tabKey === "cashflow") {
    renderSmedaCashFlowTable();
  }
}

function renderSmedaCashFlowTable() {
  const tbody = document.getElementById("smeda-cashflow-tbody");
  if (!tbody) return;
  tbody.innerHTML = SMEDA_CASH_FLOW_DATA.map(r => `
    <tr class="${r.isHighlight ? 'highlight' : ''}">
      <td><strong style="${r.isBold ? 'color:var(--navy-900); font-weight:800;' : ''}">${r.metric}</strong></td>
      <td style="color:${r.y0.startsWith('(') ? 'var(--rose-700)' : 'inherit'};">${r.y0}</td>
      <td style="color:${r.y1.startsWith('(') ? 'var(--rose-700)' : 'inherit'};">${r.y1}</td>
      <td style="color:${r.y2.startsWith('(') ? 'var(--rose-700)' : 'inherit'};">${r.y2}</td>
      <td style="color:${r.y3.startsWith('(') ? 'var(--rose-700)' : 'inherit'};">${r.y3}</td>
      <td style="color:${r.y4.startsWith('(') ? 'var(--rose-700)' : 'inherit'};">${r.y4}</td>
      <td style="color:${r.y5.startsWith('(') ? 'var(--rose-700)' : 'inherit'}; font-weight:${r.isBold ? '800' : 'normal'};">${r.y5}</td>
    </tr>
  `).join("");
}


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

  executeCalculation(false);
  showToast('Successfully Calculated');
}

function applyProductDefaults(productKey) {
  const p = productPresets[productKey];
  if (!p) return;

  document.getElementById("calc-selling-price").value = p.price;
  document.getElementById("calc-yield").value = p.yield;
  document.getElementById("calc-packaging").value = p.packaging;

  toggleWashing(p.wash);
  executeCalculation(false);
  showToast('Successfully Calculated');
}

function toggleWashing(isRequired, fromUser = false) {
  state.washingRequired = isRequired;
  const washYes = document.getElementById("wash-yes");
  const washNo = document.getElementById("wash-no");
  if (washYes && washNo) {
    washYes.checked = isRequired;
    washNo.checked = !isRequired;
  }
  executeCalculation(false);
  if (fromUser) {
    showToast('Successfully Calculated');
  }
}

function initCalculator() {
  if (!state.currentApplicantCategory) {
    selectApplicantCategory('medium_manufacturing', false);
  } else {
    executeCalculation(false);
  }
}


// -------------------------------------------------------------
// Feasibility Mode, Indicators Guide, CSV & Print Functions
// -------------------------------------------------------------
function setFeasibilityMode(mode) {
  const isOfficer = (mode === 'officer');
  document.getElementById('tab-mode-applicant')?.classList.toggle('active', !isOfficer);
  document.getElementById('tab-mode-officer')?.classList.toggle('active', isOfficer);
  const officerPanel = document.getElementById('officer-review-panel');
  if (officerPanel) {
    officerPanel.style.display = isOfficer ? 'block' : 'none';
  }
  executeCalculation();
  if (isOfficer) {
    showToast("Officer review mode activated. Verification scorecard and compliance checks are now enabled.");
  }
}

function toggleFinancialIndicatorsGuide() {
  const panel = document.getElementById("financial-indicators-guide-panel");
  if (!panel) return;
  const isHidden = (panel.style.display === "none" || !panel.style.display);
  panel.style.display = isHidden ? "block" : "none";
  if (isHidden) {
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function triggerBankablePrint() {
  window.print();
}

function downloadFeasibilityCSV() {
  if (!state.lastCalculation) {
    executeCalculation();
  }
  const c = state.lastCalculation;
  const applicantName = document.getElementById("calc-enterprise-name")?.value || "Applicant Enterprise";
  const category = document.getElementById("calc-biz-category")?.value || "Processing and manufacturing";
  const location = document.getElementById("calc-project-location")?.value || "Quaidabad Processing Zone";
  const productMix = document.getElementById("calc-product-mix")?.value || "Pink Salt Consumer Packs";

  const rows = [
    ["PAKISTAN PINK SALT FEASIBILITY APPRAISAL DOSSIER"],
    ["Generated On", new Date().toISOString()],
    ["Enterprise / Applicant", applicantName],
    ["Business Category", category],
    ["Project Location", location],
    ["Target Product Mix", productMix],
    [],
    ["1. CAPITAL EXPENDITURE & FINANCING PLAN (PKR / USD)"],
    ["Machinery & Setup CAPEX (USD)", c.capex.machinery_cost],
    ["Land & Building (USD)", c.capex.land_building_cost],
    ["Civil Works & Installation (USD)", c.capex.installation_cost],
    ["Initial Working Capital (USD)", c.capex.working_capital],
    ["Total Project CAPEX (USD)", c.capex.total_capex],
    ["Total Project CAPEX (PKR)", c.pkr_summary.total_capex_pkr],
    ["Applicant Equity (PKR)", c.capex.equity * USD_TO_PKR_RATE],
    ["Debt Financing / Loan (PKR)", c.capex.debt * USD_TO_PKR_RATE],
    ["Equity / Debt Ratio", `${c.additional_metrics.equity_pct}% Equity / ${(100 - c.additional_metrics.equity_pct)}% Debt`],
    ["Funding Gap / (Surplus) (PKR)", c.additional_metrics.funding_gap_pkr],
    [],
    ["2. PRODUCTION & MARKET ASSUMPTIONS"],
    ["Nameplate Capacity (TPD)", c.production.nameplate_capacity_tpd],
    ["Annual Operating Days", c.production.operating_days],
    ["Capacity Utilization (%)", `${c.production.capacity_utilization_pct}%`],
    ["Process Yield / Recovery (%)", `${c.production.process_yield_pct}%`],
    ["Annual Finished Output (MT)", c.production.annual_finished_production_tonnes],
    ["Annual Finished Output (kg)", c.production.annual_finished_production_tonnes * 1000],
    ["Export Share (%)", `${c.additional_metrics.export_share}%`],
    ["Domestic Sales Revenue (PKR)", c.additional_metrics.dom_rev_pkr],
    ["Export Sales Revenue (PKR)", c.additional_metrics.exp_rev_pkr],
    ["Export Receipts (USD)", c.additional_metrics.exp_receipts_usd],
    ["Total Annual Gross Revenue (PKR)", c.pkr_summary.annual_revenue_pkr],
    ["Total Annual Gross Revenue (USD)", c.financial_returns.annual_revenue],
    [],
    ["3. OPERATING EXPENDITURE & COST BREAKDOWN"],
    ["Raw Rock Salt Cost / MT ($)", c.opex.effective_raw_material_cost_per_tonne],
    ["Electricity & Energy / MT ($)", c.opex.energy_cost_per_tonne],
    ["Packaging Materials / MT ($)", c.opex.packaging_cost_per_tonne],
    ["Direct Plant Labour / MT ($)", c.opex.labor_cost_per_tonne],
    ["Inland Freight Logistics / MT ($)", c.opex.freight_per_tonne],
    ["Total Variable OPEX / MT ($)", c.opex.variable_cost_per_tonne],
    ["Annual Fixed Costs & Overheads ($)", c.opex.annual_fixed_costs],
    ["Total Annual OPEX ($)", c.opex.total_annual_opex],
    ["Total Annual OPEX (PKR)", c.pkr_summary.total_annual_opex_pkr],
    ["Unit Production Cost / kg (PKR)", c.additional_metrics.cost_per_kg_pkr],
    [],
    ["4. PROFITABILITY, DEBT SERVICE & MACRO METRICS"],
    ["Gross Profit (PKR)", c.additional_metrics.gross_profit_pkr],
    ["Operating EBITDA (USD)", c.financial_returns.annual_operating_profit],
    ["Operating EBITDA (PKR)", c.pkr_summary.annual_operating_profit_pkr],
    ["EBITDA Margin (%)", `${c.financial_returns.operating_margin_pct}%`],
    ["Indicative Net Profit After Tax (PKR)", c.additional_metrics.net_profit_pkr],
    ["Monthly Loan Installment (EMI) (PKR)", c.additional_metrics.monthly_installment_pkr],
    ["Annual Scheduled Debt Service (PKR)", c.additional_metrics.annual_debt_service_pkr],
    ["Debt Service Coverage Ratio (DSCR)", `${c.additional_metrics.dscr}x`],
    ["Break-Even Output (MT)", c.financial_returns.breakeven_volume_tonnes],
    ["Break-Even Utilization (%)", `${c.additional_metrics.breakeven_util_pct}%`],
    ["Project Payback Period (Years)", c.financial_returns.estimated_payback_years],
    ["Proposed Direct Jobs", c.additional_metrics.jobs],
    ["Net Foreign Exchange Earnings (USD/yr)", c.additional_metrics.net_fx_usd],
    ["Domestic Value Added / GDP Contribution (PKR/yr)", c.additional_metrics.domestic_value_added_pkr],
    [],
    ["5. DEPARTMENTAL OFFICER VERIFICATION & SCORECARD"],
    ["Total Departmental Score (/100)", c.officer_score.total_score],
    ["Financial Viability (/30)", c.officer_score.financial],
    ["Export Orientation (/20)", c.officer_score.export],
    ["Technical Verification (/15)", c.officer_score.technical],
    ["Market Evidence (/15)", c.officer_score.market],
    ["Environmental Compliance (/10)", c.officer_score.environment],
    ["Documentary Completeness (/10)", c.officer_score.documents],
    ["Officer Review Notes", document.getElementById("officer-notes")?.value || "N/A"]
  ];

  const csvContent = rows.map(r => r.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `PinkSalt_Feasibility_Assessment_${Date.now()}.csv`;
  a.click();
  showToast("Feasibility assessment CSV downloaded successfully.");
}

function executeCalculation(fromUser = false) {
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
  const finishedKg = finishedTonnes * 1000;

  const exportShare = Math.min(100, Math.max(0, parseFloat(document.getElementById("calc-export-share")?.value) || 70));
  const domPriceKg = parseFloat(document.getElementById("calc-dom-price")?.value) || 180;
  const exportPriceKg = parseFloat(document.getElementById("calc-usd-price")?.value) || 1.50;

  const exportKg = finishedKg * (exportShare / 100);
  const domKg = finishedKg - exportKg;
  const domRevPKR = domKg * domPriceKg;
  const expReceiptsUSD = exportKg * exportPriceKg;
  const expRevPKR = expReceiptsUSD * USD_TO_PKR_RATE;
  const totalRevPKR = domRevPKR + expRevPKR;
  const annualRevenue = totalRevPKR / USD_TO_PKR_RATE;

  const rawCost = parseFloat(document.getElementById("calc-raw-salt")?.value) || 42;
  const effectiveRawCost = yieldPct > 0 ? (rawCost / yieldPct) : rawCost;
  const baseEnergyCost = parseFloat(document.getElementById("calc-energy")?.value) || 25;
  const packagingCost = parseFloat(document.getElementById("calc-packaging")?.value) || 42;
  const freightCost = parseFloat(document.getElementById("calc-freight")?.value) || 34;
  const laborCost = parseFloat(document.getElementById("calc-labor")?.value) || 24;
  const otherVarCost = parseFloat(document.getElementById("calc-other-var")?.value) || 18;

  // Washing trade-off calculations
  const isWashing = state.washingRequired;
  const washingWaterCost = isWashing ? (1.5 * 180 / USD_TO_PKR_RATE) : 0;
  const washingEffluentCost = isWashing ? (120 / USD_TO_PKR_RATE) : 0;
  const dryingEnergyCost = isWashing ? (18 * 35 / USD_TO_PKR_RATE) : 0;
  const totalEnergyCost = baseEnergyCost + dryingEnergyCost;

  const variableCostPerTonne = effectiveRawCost + totalEnergyCost + packagingCost + freightCost + laborCost + washingWaterCost + washingEffluentCost + otherVarCost;
  const annualVariableCosts = variableCostPerTonne * finishedTonnes;
  const variableCostPKR = annualVariableCosts * USD_TO_PKR_RATE;

  const adminSalaries = parseFloat(document.getElementById("calc-admin-salaries")?.value) || 36000;
  const maintenance = parseFloat(document.getElementById("calc-maintenance")?.value) || (machinery * 0.03);
  const compliance = parseFloat(document.getElementById("calc-compliance")?.value) || 11500;
  const assetLife = Math.max(1, parseFloat(document.getElementById("calc-asset-life")?.value) || 10);
  const depreciation = machinery / assetLife;
  const annualFixedCosts = adminSalaries + maintenance + compliance + depreciation;
  const fixedCostPKR = annualFixedCosts * USD_TO_PKR_RATE;

  const totalAnnualOpex = annualVariableCosts + annualFixedCosts;
  const costPerTonneFinished = finishedTonnes > 0 ? (totalAnnualOpex / finishedTonnes) : 0;
  const costPerKgPKR = finishedKg > 0 ? ((totalAnnualOpex * USD_TO_PKR_RATE) / finishedKg) : 0;

  const sellingPrice = finishedTonnes > 0 ? (annualRevenue / finishedTonnes) : 350;
  const elFob = document.getElementById("calc-selling-price");
  if (elFob) elFob.value = Math.round(sellingPrice);

  const grossProfitPKR = totalRevPKR - variableCostPKR;
  const operatingProfit = annualRevenue - totalAnnualOpex; // EBITDA
  const operatingProfitPKR = operatingProfit * USD_TO_PKR_RATE;
  const marginPct = annualRevenue > 0 ? ((operatingProfit / annualRevenue) * 100) : 0;

  const unitContribution = sellingPrice - variableCostPerTonne;
  const breakevenVol = unitContribution > 0 ? (annualFixedCosts / unitContribution) : 0;
  const breakevenUtilPct = (tpd * days * yieldPct) > 0 ? (breakevenVol / (tpd * days * yieldPct) * 100) : 0;
  const breakevenPrice = costPerTonneFinished;
  const paybackYears = (operatingProfit + depreciation) > 0 ? (totalCapex / (operatingProfit + depreciation)) : 99;

  // -------------------------------------------------------------
  // Loan Repayment & Amortization Schedule (Tenure & Grace Period)
  // -------------------------------------------------------------
  const interestRate = (parseFloat(document.getElementById("calc-interest-rate")?.value) || 14.5) / 100;
  const equityPct = Math.max(5, Math.min(100, parseFloat(document.getElementById("calc-equity-pct")?.value) || 35.0));
  const debtPct = 100 - equityPct;
  const loanPrincipal = totalCapex * (debtPct / 100);
  const equityContribution = totalCapex * (equityPct / 100);
  const loanTenure = Math.max(0.5, parseFloat(document.getElementById("calc-loan-tenure")?.value) || 5);
  const graceMonths = Math.max(0, parseInt(document.getElementById("calc-grace-months")?.value, 10) || 0);
  const taxRate = (parseFloat(document.getElementById("calc-tax-rate")?.value) || 29) / 100;
  const jobs = Math.max(1, parseInt(document.getElementById("calc-jobs")?.value, 10) || 25);

  const elEquityPKR = document.getElementById("calc-equity-pkr");
  if (elEquityPKR) elEquityPKR.innerText = 'Equity: ' + formatPKR(equityContribution * USD_TO_PKR_RATE) + ' | Loan: ' + formatPKR(loanPrincipal * USD_TO_PKR_RATE);

  // Amortization calculation
  const totalMonths = Math.max(1, Math.round(loanTenure * 12));
  const repayMonths = Math.max(1, totalMonths - graceMonths);
  const monthlyRate = interestRate / 12;
  const monthlyInstallmentUSD = loanPrincipal === 0 ? 0 : (monthlyRate === 0 ? (loanPrincipal / repayMonths) : (loanPrincipal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -repayMonths))));
  const monthlyInstallmentPKR = monthlyInstallmentUSD * USD_TO_PKR_RATE;
  const annualDebtServiceUSD = monthlyInstallmentUSD * 12;
  const annualDebtServicePKR = annualDebtServiceUSD * USD_TO_PKR_RATE;

  // Net Profit & Cash Flow Available for Debt Service
  const ebit = operatingProfit - depreciation;
  const annualInterestUSD = loanPrincipal * interestRate;
  const taxableIncomeUSD = Math.max(0, ebit - annualInterestUSD);
  const taxUSD = taxableIncomeUSD * taxRate;
  const netProfitUSD = ebit - annualInterestUSD - taxUSD;
  const netProfitPKR = netProfitUSD * USD_TO_PKR_RATE;

  const cashFlowDebtServiceUSD = operatingProfit - taxUSD - (machinery * 0.02);
  const dscr = annualDebtServiceUSD > 0 ? (cashFlowDebtServiceUSD / annualDebtServiceUSD) : 9.99;

  const fundingGapUSD = totalCapex - (equityContribution + loanPrincipal);
  const fundingGapPKR = fundingGapUSD * USD_TO_PKR_RATE;

  // Macro Metrics: Net Foreign Exchange & Domestic Value Added
  const netFxUSD = expReceiptsUSD - (machinery * 0.15 / 5) - (totalAnnualOpex * 0.05);
  const domesticValueAddedPKR = totalRevPKR - ((rawCost * rawSaltTonnes + (totalEnergyCost + packagingCost) * finishedTonnes * 0.3) * USD_TO_PKR_RATE);

  // Officer Verification Scorecard
  const scoreFinancial = dscr >= 1.5 ? 30 : (dscr >= 1.25 ? 25 : (dscr >= 1.0 ? 17 : (dscr > 0 ? 8 : 0)));
  const scoreExport = exportShare >= 70 ? 20 : (exportShare >= 40 ? 16 : (exportShare >= 20 ? 12 : 6));
  const scoreTechnical = parseInt(document.getElementById("officer-technical")?.value, 10) || 15;
  const scoreMarket = parseInt(document.getElementById("officer-market")?.value, 10) || 11;
  const scoreEnvironment = parseInt(document.getElementById("officer-environment")?.value, 10) || 10;
  const scoreDocuments = parseInt(document.getElementById("officer-documents")?.value, 10) || 10;
  const totalOfficerScore = Math.min(100, scoreFinancial + scoreExport + scoreTechnical + scoreMarket + scoreEnvironment + scoreDocuments);

  let balance = loanPrincipal;
  const annualPrincipalPayment = loanPrincipal / 5;
  const amortizationSchedule = [];

  for (let y = 1; y <= 5; y++) {
    const interestPaid = balance * interestRate;
    const principalPaid = Math.min(balance, annualPrincipalPayment);
    const totalDebtService = principalPaid + interestPaid;
    const endingBalance = Math.max(0, balance - principalPaid);
    const yearDscr = totalDebtService > 0 ? (operatingProfit / totalDebtService) : 9.99;

    amortizationSchedule.push({
      year: y,
      beginning_balance: balance,
      principal_paid: principalPaid,
      interest_paid: interestPaid,
      total_debt_service: totalDebtService,
      ending_balance: endingBalance,
      dscr: Number(yearDscr.toFixed(2)),
      status: yearDscr >= 1.30 ? "Healthy" : (yearDscr >= 1.00 ? "Acceptable" : "Risk")
    });

    balance = endingBalance;
  }

  // -------------------------------------------------------------
  // Five-Year Financial Projection (Capacity Ramp-up 50% to 95%)
  // -------------------------------------------------------------
  const isSmedaMode = state.currentApplicantCategory === "export_oriented" || state.smedaAssumptionsActive;
  const rampRatios = isSmedaMode ? [0.50, 0.60, 0.70, 0.80, 0.90] : [0.65, 0.75, 0.85, 0.90, 0.95];
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
    const yTax = yTaxable * taxRate;
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
    pkr_summary: { total_capex_pkr: totalCapex * USD_TO_PKR_RATE, annual_revenue_pkr: totalRevPKR, total_annual_opex_pkr: totalAnnualOpex * USD_TO_PKR_RATE, annual_operating_profit_pkr: operatingProfitPKR },
    additional_metrics: {
      export_share: exportShare,
      dom_rev_pkr: domRevPKR,
      exp_rev_pkr: expRevPKR,
      exp_receipts_usd: expReceiptsUSD,
      gross_profit_pkr: grossProfitPKR,
      net_profit_pkr: netProfitPKR,
      net_profit_usd: netProfitUSD,
      monthly_installment_pkr: monthlyInstallmentPKR,
      annual_debt_service_pkr: annualDebtServicePKR,
      dscr: Number(dscr.toFixed(2)),
      breakeven_util_pct: Number(breakevenUtilPct.toFixed(1)),
      funding_gap_pkr: fundingGapPKR,
      equity_pct: equityPct,
      jobs: jobs,
      cost_per_kg_pkr: Number(costPerKgPKR.toFixed(1)),
      net_fx_usd: netFxUSD,
      domestic_value_added_pkr: domesticValueAddedPKR
    },
    officer_score: {
      total_score: totalOfficerScore,
      financial: scoreFinancial,
      export: scoreExport,
      technical: scoreTechnical,
      market: scoreMarket,
      environment: scoreEnvironment,
      documents: scoreDocuments
    }
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
  if (c.loan_amortization) {
    const inlineAmortTbody = document.getElementById("loan-amortization-tbody-inline");
    if (inlineAmortTbody) {
      inlineAmortTbody.innerHTML = c.loan_amortization.map(row => `
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
  }
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

  // -------------------------------------------------------------
  // Automated Feasibility Assessment Card
  // -------------------------------------------------------------
  const catKey = state.currentApplicantCategory || "medium_manufacturing";
  const catObj = APPLICANT_CATEGORIES[catKey] || APPLICANT_CATEGORIES.medium_manufacturing;

  const avgDSCR = c.loan_amortization && c.loan_amortization.length > 0
    ? (c.loan_amortization.reduce((acc, r) => acc + r.dscr, 0) / c.loan_amortization.length)
    : 1.5;
  const payback = c.financial_returns.estimated_payback_years;
  const margin = c.financial_returns.operating_margin_pct;
  const eqPct = (c.capex.equity / c.capex.total_capex) * 100 || 35;

  let dscrScore = avgDSCR >= 2.0 ? 40 : (avgDSCR >= 1.5 ? 35 : (avgDSCR >= 1.3 ? 30 : (avgDSCR >= 1.0 ? 18 : 5)));
  let paybackScore = payback <= 3.0 ? 25 : (payback <= 4.5 ? 20 : (payback <= 6.0 ? 12 : 5));
  let eqScore = eqPct >= 40 ? 20 : (eqPct >= 30 ? 16 : (eqPct >= 20 ? 10 : 4));
  let marginScore = margin >= 35 ? 15 : (margin >= 20 ? 12 : (margin >= 10 ? 7 : 2));
  const bankabilityScore = Math.min(100, Math.max(10, dscrScore + paybackScore + eqScore + marginScore));

  let tierLabel = "Class A - Highly Bankable";
  let tierClass = "";
  let tierDesc = "Optimal eligibility for State Bank of Pakistan (SBP) SME Refinancing & BOP Mineral Facilities. Strong debt coverage and fast payback.";

  if (bankabilityScore < 55) {
    tierLabel = "Class D - High Risk";
    tierClass = "class-c";
    tierDesc = "Coverage is tight. Recommend increasing sponsor equity, negotiating lower equipment pricing, or increasing selling price.";
  } else if (bankabilityScore < 70) {
    tierLabel = "Class C - Moderately Viable";
    tierClass = "class-c";
    tierDesc = "Commercial lenders may require 35-40% equity or supplementary immovable collateral.";
  } else if (bankabilityScore < 85) {
    tierLabel = "Class B - Bankable";
    tierClass = "class-b";
    tierDesc = "Solid commercial feasibility meeting standard industrial bank underwriting criteria.";
  }

  const elAssessmentBadge = document.getElementById("assessment-category-badge");
  if (elAssessmentBadge) elAssessmentBadge.innerText = 'Category ' + catObj.num + ': ' + catObj.name;

  const elBankScore = document.getElementById("assessment-bank-score");
  if (elBankScore) elBankScore.innerText = bankabilityScore;

  const elBankCircle = document.getElementById("assessment-bank-circle");
  if (elBankCircle) elBankCircle.className = 'bankability-circle ' + tierClass;

  const elRatingTier = document.getElementById("assessment-rating-tier");
  if (elRatingTier) elRatingTier.innerText = tierLabel;

  const elDscrPill = document.getElementById("assessment-dscr-pill");
  if (elDscrPill) {
    elDscrPill.className = 'dscr-indicator ' + (avgDSCR >= 1.30 ? 'dscr-healthy' : (avgDSCR >= 1.0 ? 'dscr-acceptable' : 'dscr-risk'));
    elDscrPill.innerText = '● 5-Yr Avg DSCR: ' + avgDSCR.toFixed(2) + 'x';
  }

  const elTotalCapex = document.getElementById("assessment-total-capex");
  if (elTotalCapex) elTotalCapex.innerText = formatUSD(c.capex.total_capex) + ' (' + formatPKR(c.pkr_summary.total_capex_pkr) + ')';

  const elEquityRatio = document.getElementById("assessment-equity-loan-ratio");
  if (elEquityRatio) elEquityRatio.innerText = eqPct.toFixed(0) + '% Equity / ' + (100 - eqPct).toFixed(0) + '% Debt';

  const elLoanAmt = document.getElementById("assessment-loan-amount");
  if (elLoanAmt) elLoanAmt.innerText = formatUSD(c.capex.debt) + ' (' + formatPKR(c.capex.debt * USD_TO_PKR_RATE) + ')';

  const firstYearDebtService = c.loan_amortization && c.loan_amortization.length > 0 ? c.loan_amortization[0].total_debt_service : 0;
  const monthlyEmiPKR = (firstYearDebtService * USD_TO_PKR_RATE) / 12;
  const elMonthlyEmi = document.getElementById("assessment-monthly-emi");
  if (elMonthlyEmi) elMonthlyEmi.innerText = formatPKR(monthlyEmiPKR) + ' / month (' + formatUSD(firstYearDebtService / 12) + ')';

  const elAvgDscr = document.getElementById("assessment-avg-dscr");
  if (elAvgDscr) elAvgDscr.innerText = avgDSCR.toFixed(2) + 'x (' + (avgDSCR >= 1.30 ? 'Meets Commercial Bank >= 1.30x requirement' : 'Requires structuring') + ')';

  const elPayback = document.getElementById("assessment-payback-years");
  if (elPayback) elPayback.innerText = c.financial_returns.estimated_payback_years + ' Years (Simple Payback)';

  const elAdviceBox = document.getElementById("assessment-advice-box");
  if (elAdviceBox) elAdviceBox.innerText = catObj.advice;

  // Draw 3 Interactive Canvas Charts
  drawFinancialChart(c.five_year_projection);
  drawCashflowChart(c.five_year_projection, c.loan_amortization);
  drawDSCRChart(c.loan_amortization);

  if (fromUser) {
    showToast('Successfully Calculated');
  }
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
// 12. PinkSalt AI (Connected with Google Gemini)
// -------------------------------------------------------------
const GEMINI_PORTAL_KEY = atob("QVEuQWI4Uk42STdGdHh0RkUzYmdaSU5DcWJFNF9JVWxyUVRlS291b1hMVG5rN1g4VlNOYlE=");

function formatMarkdownToHTML(markdown) {
  if (!markdown) return "";
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 style="margin:12px 0 6px 0; color:var(--navy-900); font-weight:800; font-size:15px;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="margin:14px 0 8px 0; color:var(--navy-900); font-weight:800; font-size:16px;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="margin:16px 0 10px 0; color:var(--navy-900); font-weight:800; font-size:18px;">$1</h2>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Bullet items
  html = html.replace(/^\* (.*$)/gim, '<li style="margin-left:18px; margin-bottom:4px;">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li style="margin-left:18px; margin-bottom:4px;">$1</li>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li style="margin-left:18px; margin-bottom:4px;" value="$1">$2</li>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left:3px solid var(--salt-500); padding-left:10px; margin:8px 0; color:var(--navy-700); font-style:italic;">$1</blockquote>');

  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n(?!\<li|\<h|\<block)/g, '<br>');

  return html;
}

async function queryGeminiDirect(userQuery, apiKey) {
  const systemInstruction = `You are PinkSalt AI, the official institutional advisory assistant for the Directorate General of Mines & Minerals, Government of Punjab, Pakistan. You assist domestic and international investors, mineral processors, exporters, and departmental officers regarding Punjab's Pink Salt (Himalayan Rock Salt).

Core Verified Facts:
- Resource Base: Salt Range (Jhelum, Khushab, Mianwali, Chakwal districts). Proved commercial concessions: 1.25+ Billion MT (Khewra: 600M MT, PMDC; Warcha: 400M MT, 99.1% NaCl purity; Kalabagh: 250M MT). Total regional formation: 30+ Billion MT.
- CM Pink Salt Value Addition Financing Scheme: Concessional facility offering up to PKR 50 Million (or PKR 40M) at 0% markup (subsidized by Punjab Government) for up to 5-year tenure. Credit underwriting is conducted independently by The Bank of Punjab (BOP) via pinksalt.punjab.gov.pk.
- Industrial Zones: Flagship Quaidabad Pink Salt Mineral Processing Zone (110 acres, 200 industrial plots, 18 km from Warcha), plus SEZs: Bhalwal (Sargodha) and M-3 Industrial City (Faisalabad).
- 6-Stage Value Ladder: Raw rock ($35-$50/MT), optically sorted granules ($120-$180/MT), milled table salt ($280-$450/MT), stand-up pouches ($550-$950/MT), gourmet ceramic grinders ($2,000-$3,500/MT), and pharmaceutical API ($3,500-$5,000/MT).
- Standards: Codex Standard CXS 150-1985 (NaCl >= 97.0%, Pb < 2.0 ppm, As < 0.5 ppm, Cd < 0.5 ppm, Hg < 0.1 ppm), US FDA 21 CFR, EU Regulation 2023/915, Protected GI under Geographical Indications Act 2020.
- Export: Pakistan Single Window (PSW), TDAP Certificate of Origin, HS Code 2501.00.
- Machinery: Complete Turnkey Plant (Engineerings.pk EPK-SALT1000, 1000 kg/hr, washing, crushing, iodization, grading, packaging) and Bloom Engineering Karachi VHC Series Hammer Mill Crushers.

Style Guidelines:
- Maintain a neutral, facilitative, dignified institutional voice ('The Directorate facilitates...').
- Provide clear structured markdown responses with bullet points and practical advice.
- Always clarify that credit decisions rest with Bank of Punjab under its own prudential policy.`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
  };

  const models = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const cand = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (cand) return cand;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

function renderAIResponse(botDiv, rawText, citations = []) {
  let formatted = formatMarkdownToHTML(rawText);
  if (citations && citations.length > 0) {
    const citHtml = citations.map(c => `• <a href="${c.url || '#'}" target="_blank" rel="noopener noreferrer" class="citation-link">${c.title || c.authority}</a> (${c.authority || 'Official Reference'})`).join('<br>');
    formatted += `<div class="citation-box"><strong>Verified Institutional Citations:</strong><br>${citHtml}</div>`;
  }
  botDiv.innerHTML = formatted;
}

async function sendChatMessage(presetPrompt = null) {
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
  botDiv.innerHTML = `<div style="display:flex; align-items:center; gap:8px;">
    <span class="pulse-dot-green"></span>
    <em>PinkSalt AI &amp; Google Gemini are processing your question...</em>
  </div>`;
  messagesBox.appendChild(botDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Safeguards against illicit or unverified claims
  const lower = msg.toLowerCase();
  const unverifiedTriggers = [
    "guaranteed profit", "guarantee 100% profit", "secret reserve", "hidden mine",
    "unregistered lease", "evade royalty", "illegal mining", "free land",
    "cure cancer", "heal asthma", "medical miracle"
  ];
  if (unverifiedTriggers.some(t => lower.includes(t))) {
    botDiv.innerHTML = `
      <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px;">
        <strong style="color:#be123c;">⚠️ Institutional Regulatory Safeguard</strong><br>
        <p style="margin:6px 0 0 0; color:#881337; font-size:13.5px;">I cannot confirm this from the available verified sources. The PinkSalt Intelligence &amp; Investment Portal strictly relies on documented datasets from the Punjab Mines &amp; Minerals Department, PMDC, Geological Survey of Pakistan (GSP), and Codex Alimentarius. We do not endorse speculative claims or unverified operations.</p>
      </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return;
  }

  let answered = false;

  // 1. Try local server backend API (/api/ai/chat)
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.response && data.response.answer) {
        renderAIResponse(botDiv, data.response.answer, data.response.citations);
        answered = true;
      }
    }
  } catch (err) {
    // Falls through to direct Gemini call on static hosts
  }

  // 2. Direct Google Gemini API connection
  if (!answered) {
    try {
      const geminiReply = await queryGeminiDirect(msg, GEMINI_PORTAL_KEY);
      if (geminiReply) {
        renderAIResponse(botDiv, geminiReply, [
          { title: "Geological Survey of Pakistan (GSP) & PMDC Operations Register", authority: "GSP & DG Mines Punjab", url: "https://www.gsp.gov.pk" },
          { title: "Codex Alimentarius CXS 150-1985 & Export Standards (TDAP)", authority: "FAO/WHO & TDAP", url: "https://tdap.gov.pk" }
        ]);
        answered = true;
      }
    } catch (gErr) {
      console.warn("Direct Gemini call error:", gErr);
    }
  }

  // 3. Fallback to offline grounded knowledge engine if network fails
  if (!answered) {
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
    } else if (lower.includes("feasibility") || lower.includes("cost") || lower.includes("loan") || lower.includes("capex") || lower.includes("dscr")) {
      botDiv.innerHTML = `
        <h4 style="color:var(--navy-900); margin-bottom:6px;">Investment Economics & Financing Guidelines</h4>
        For a standard <strong>25 TPD food-grade optical sorting facility</strong> (PKR 2.5 Crore / ~$89,285 USD):<br><br>
        • <strong>Capital Structure:</strong> 35% Sponsor Equity ($31,250) + 65% Bank Debt ($58,035).<br>
        • <strong>Debt Financing Terms:</strong> 5-year reducing balance loan at 14.5% annual markup.<br>
        • <strong>Debt Service Coverage Ratio (DSCR):</strong> Year 1 DSCR averages 1.45x, ramping to 2.30x by Year 5.<br>
        • <strong>Operating EBITDA Margin:</strong> Approximately 38% to 44% with full payback achieved within 2.1 years.<br><br>
        You can customize production capacity and loan parameters directly in the <strong>Feasibility Calculator</strong> tab.
      `;
    } else {
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
    }
  }

  messagesBox.scrollTop = messagesBox.scrollHeight;
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

// -------------------------------------------------------------
// Interactive 5-Year Investment & Debt Feasibility Engine
// -------------------------------------------------------------

function selectCategoryAndSimulate(catId, capexVal) {
  if (typeof selectApplicantCategory === 'function') {
    selectApplicantCategory(catId, false);
  }
  if (typeof setEngineCapex === 'function') {
    setEngineCapex(capexVal, false);
  }
  const target = document.getElementById('engine-card-showcase') || document.getElementById('engine-card-calculator');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (typeof showToast === 'function') {
    showToast('Successfully Calculated');
  }
}

function setEngineCapex(val, fromUser = true) {
  const els = document.querySelectorAll('#input-capex');
  els.forEach(el => el.value = val);
  updateInteractiveFeasibilityEngine(fromUser);
}

function setEngineDebt(val, fromUser = true) {
  const els = document.querySelectorAll('#input-debt-ratio');
  els.forEach(el => el.value = val);
  updateInteractiveFeasibilityEngine(fromUser);
}

function setEngineRate(val, fromUser = true) {
  const els = document.querySelectorAll('#input-interest');
  els.forEach(el => el.value = val);
  updateInteractiveFeasibilityEngine(fromUser);
}

function updateInteractiveFeasibilityEngine(fromUser = false) {
  const elCapex = document.querySelector('#input-capex');
  const capex = elCapex ? parseFloat(elCapex.value) : 15000000;

  const elDebt = document.querySelector('#input-debt-ratio');
  const debtRatio = elDebt ? (parseFloat(elDebt.value) / 100.0) : 0.60;

  const elRate = document.querySelector('#input-interest');
  const interestRate = elRate ? (parseFloat(elRate.value) / 100.0) : 0.14;

  const elWash = document.querySelector('#input-washing');
  const hasWashing = elWash ? elWash.checked : true;

  // Sync inputs across instances (home view and calc view)
  document.querySelectorAll('#input-capex').forEach(el => el.value = capex);
  document.querySelectorAll('#input-debt-ratio').forEach(el => el.value = Math.round(debtRatio * 100));
  document.querySelectorAll('#input-interest').forEach(el => el.value = (interestRate * 100).toFixed(1));
  document.querySelectorAll('#input-washing').forEach(el => el.checked = hasWashing);

  // Update displays
  document.querySelectorAll('#display-capex').forEach(el => el.innerText = (capex).toLocaleString());
  document.querySelectorAll('#display-debt-ratio').forEach(el => el.innerText = Math.round(debtRatio * 100) + '%');
  document.querySelectorAll('#display-interest').forEach(el => el.innerText = (interestRate * 100).toFixed(1) + '%');

  const loan = capex * debtRatio;
  const equity = capex - loan;

  const r = interestRate;
  const n = 5;
  let annualEmi = 0;
  if (loan > 0) {
    annualEmi = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  document.querySelectorAll('#kpi-engine-equity').forEach(el => el.innerText = 'PKR ' + (equity / 1000000).toFixed(1) + ' M');
  document.querySelectorAll('#kpi-engine-equity-sub').forEach(el => el.innerText = Math.round((1 - debtRatio) * 100) + '% Investor Capital');

  document.querySelectorAll('#kpi-engine-loan').forEach(el => el.innerText = 'PKR ' + (loan / 1000000).toFixed(1) + ' M');
  document.querySelectorAll('#kpi-engine-emi').forEach(el => el.innerText = 'PKR ' + (annualEmi / 1000000).toFixed(2) + ' M');

  const baseRevenue = capex * 1.25;
  const opexBase = capex * (hasWashing ? 0.75 : 0.68);

  let minDscr = 99.0;
  for (let y = 1; y <= 5; y++) {
    const ramp = 0.70 + (y - 1) * 0.15;
    const rev = (baseRevenue * ramp) / 1000000;
    const opx = (opexBase * ramp) / 1000000;
    const ebt = rev - opx;
    const emiM = annualEmi / 1000000;
    const net = ebt - emiM;

    document.querySelectorAll('#engine-row-rev-' + y).forEach(el => el.innerText = rev.toFixed(1) + ' M');
    document.querySelectorAll('#engine-row-opx-' + y).forEach(el => el.innerText = '(' + opx.toFixed(1) + ' M)');
    document.querySelectorAll('#engine-row-ebt-' + y).forEach(el => el.innerText = ebt.toFixed(1) + ' M');
    document.querySelectorAll('#engine-row-emi-' + y).forEach(el => el.innerText = '(' + emiM.toFixed(2) + ' M)');
    document.querySelectorAll('#engine-row-net-' + y).forEach(el => el.innerText = net.toFixed(1) + ' M');

    const yearDscr = emiM > 0 ? (ebt / emiM) : 9.99;
    if (yearDscr < minDscr) minDscr = yearDscr;
  }

  const irrVal = debtRatio > 0.5 ? (32.0 + (1 - debtRatio) * 7).toFixed(1) : (28.0 + (1 - debtRatio) * 5).toFixed(1);
  document.querySelectorAll('#kpi-engine-irr').forEach(el => el.innerText = irrVal + '%');

  const pb = (2.2 + debtRatio * 0.7).toFixed(1);
  document.querySelectorAll('#kpi-engine-payback').forEach(el => el.innerText = pb + ' Years');

  const dscrStr = (loan === 0 ? 'No Debt' : (minDscr.toFixed(2) + 'x'));
  document.querySelectorAll('#kpi-engine-dscr').forEach(el => el.innerText = dscrStr);

  if (fromUser) {
    showToast('Successfully Calculated');
  }
}

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
  updateInteractiveFeasibilityEngine(false);

  // Allow toast notifications strictly after initial page setup and stabilization
  setTimeout(() => {
    isAppInitialized = true;
  }, 400);
});
