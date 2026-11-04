/**
 * Pink Salt Intelligence & Investment Portal - Authoritative Data Repository
 * Directorate General of Mines & Minerals, Government of Punjab
 *
 * Single source of truth for all geological, technical, financial, and regulatory figures.
 * All views, tables, cards, and calculation engines read strictly from this structure.
 */

const PINKSALT_DATA = {
  settings: {
    usdToPkrDefault: 280.0,
    currentUsdToPkr: 280.0,
    defaultCurrency: "PKR", // Primary for domestic investors & provincial scheme
    presentationMode: false
  },

  // 1. Overview: 4 Verified Key Facts
  keyFacts: [
    {
      id: "reserves",
      metric: "1.25+ Billion MT",
      subMetric: "Proved Commercial Reserves",
      note: "Active underground seams across Khewra, Warcha & Kalabagh [VERIFY: 30B MT regional basin resource]",
      icon: "layers"
    },
    {
      id: "purity",
      metric: "98.8% – 99.2%",
      subMetric: "Natural Halite Purity",
      note: "High-grade crystalline NaCl requiring minimal processing to meet Codex CXS 150 food standards",
      icon: "shield-check"
    },
    {
      id: "value_multiplier",
      metric: "11x – 16x",
      subMetric: "Value-Addition Escalation",
      note: "From $35–$50/MT raw rock to $550–$950/MT retail consumer packaging and $2,000+/MT gourmet tableware",
      icon: "trending-up"
    },
    {
      id: "flagship_zone",
      metric: "110 Acres",
      subMetric: "Quaidabad Processing Zone",
      note: "Flagship industrial cluster in Khushab dedicated to value addition, automated grading, and export logistics [VERIFY]",
      icon: "map-pin"
    }
  ],

  // 2. Resource Base: Geological Deposits & Logistics
  deposits: [
    {
      id: "khewra",
      name: "Khewra Salt Mine & Seams",
      district: "Jhelum",
      coords: { x: 645, y: 155, lat: 32.65, lng: 73.01 },
      estimatedReserves: "600+ Million MT",
      purityNaCl: "98.8%",
      formation: "Salt Range Formation (Eocambrian / Pre-Cambrian evaporite)",
      status: "Documented / Active Federal Lease (PMDC)",
      managingAuthority: "Pakistan Mineral Development Corporation (PMDC)",
      extractionType: "Underground room-and-pillar mining across 17 working levels",
      logistics: "12 km to M-2 Motorway (Lilla Interchange); direct rail siding available at Khewra Station.",
      description: "Pakistan's oldest and largest commercial salt mine. High-volume extraction of deep-pink to translucent halite with low moisture and minimal insoluble matter."
    },
    {
      id: "warcha",
      name: "Warcha Salt Mine & Outcrops",
      district: "Khushab",
      coords: { x: 380, y: 185, lat: 32.41, lng: 71.96 },
      estimatedReserves: "400+ Million MT",
      purityNaCl: "99.1%",
      formation: "Salt Range Formation, Nilawahan Group",
      status: "Documented / Active Production",
      managingAuthority: "PMDC & Punjab Concessions Directorate",
      extractionType: "Underground room-and-pillar extraction of transparent and high-purity rose crystals",
      logistics: "18 km to Quaidabad Processing Zone; 45 km to Khushab bypass connecting to M-2 Motorway.",
      description: "Renowned for exceptional natural crystalline purity (>99.1% NaCl), low sulfate, and deep-red natural coloration, making it the primary feedstock for gourmet table salt and high-clarity wellness crafts."
    },
    {
      id: "kalabagh",
      name: "Kalabagh Salt Range Deposits",
      district: "Mianwali",
      coords: { x: 210, y: 165, lat: 32.96, lng: 71.55 },
      estimatedReserves: "250+ Million MT",
      purityNaCl: "97.9%",
      formation: "Salt Range Formation (Kalabagh Fault Zone)",
      status: "Documented / Licensed Mining Blocks",
      managingAuthority: "Mines & Minerals Department, Government of Punjab",
      extractionType: "Stratified evaporite beds and massive surface outcrops along the Indus River gorge",
      logistics: "Direct access to CPEC Western Alignment and Daud Khel / Mianwali railway junction.",
      description: "Thick evaporite exposures suitable for large-scale industrial salt processing, chemical feedstock (chlor-alkali and soda ash), and de-icing exports."
    },
    {
      id: "chakwal_belt",
      name: "Dandot & Chakwal Salt Corridor",
      district: "Chakwal",
      coords: { x: 530, y: 140, lat: 32.75, lng: 72.85 },
      estimatedReserves: "150+ Million MT [VERIFY]",
      purityNaCl: "98.2%",
      formation: "Subsurface continuation of the Salt Range Escarpment",
      status: "Documented / Provincial Concession Holdings",
      managingAuthority: "Punjab Mines & Minerals Directorate",
      extractionType: "Subsurface and escarpment mining leases",
      logistics: "Immediate frontage onto M-2 Motorway corridor (Kallar Kahar & Balkassar interchanges).",
      description: "Strategic link between raw extraction centers and northern industrial consumers, with direct highway connectivity for FMCG distribution across Punjab and Khyber Pakhtunkhwa."
    }
  ],

  // 3. Where to Build: Industrial Processing Zones Comparison
  sites: [
    {
      id: "quaidabad",
      name: "Quaidabad Pink Salt Mineral Processing Zone",
      district: "Khushab",
      isFlagship: true,
      areaAcres: "110 Acres [VERIFY]",
      distToMine: "15 – 25 km (Warcha Seams)",
      powerStatus: "132 kV Grid station with dedicated industrial mineral feeder planned [VERIFY]",
      waterStatus: "Subsurface supply + link to canal irrigation channel",
      freightToKarachi: "860 km via M-2 / CPEC Corridor ($32 – $36 / MT)",
      laborAvailability: "Extensive mining workforce; expanding food-grade packaging labor pool",
      incentives: "Designated Provincial Mineral Processing Zone; eligibility for CM Financing Scheme; BOI SEZ application under submission [VERIFY]",
      bestFor: "Food-grade retail packaging, automated optical sorting, gourmet table salt, and artisan craft clusters"
    },
    {
      id: "bhalwal",
      name: "Bhalwal Industrial Estate (PIEDMC)",
      district: "Sargodha",
      isFlagship: false,
      areaAcres: "450 Acres",
      distToMine: "85 km via Sargodha–Khushab Highway",
      powerStatus: "Fully energised dedicated 132 kV grid with underground industrial distribution",
      waterStatus: "Engineered industrial water supply & effluent drainage system",
      freightToKarachi: "810 km via M-2 / M-4 Motorway network ($30 – $34 / MT)",
      laborAvailability: "High skilled packaging, electrical, and agro-processing technical personnel",
      incentives: "Notified SEZ: 10-Year corporate income tax holiday + 0% customs duty on capital machinery [VERIFY]",
      bestFor: "Export-oriented high-speed retail packaging, automated VFFS plants, and certified food-processing facilities"
    },
    {
      id: "khewra_corridor",
      name: "Khewra - Pind Dadan Khan Corridor",
      district: "Jhelum",
      isFlagship: false,
      areaAcres: "Corridor-based private & municipal land",
      distToMine: "0 – 10 km (Khewra Mine Mouth)",
      powerStatus: "Established grid supply; subject to seasonal peak loads",
      waterStatus: "Municipal supply + tube well sources",
      freightToKarachi: "920 km via M-2 Lilla Interchange ($34 – $38 / MT)",
      laborAvailability: "Generations of hereditary master salt-lamp artisans and stone carvers",
      incentives: "Provincial artisan cluster incentives; low logistics overhead for raw stone lumps",
      bestFor: "Hand-carved salt lamps, culinary salt slabs/tiles, spa decor, and artisanal wellness items"
    },
    {
      id: "m3_faisalabad",
      name: "M-3 Industrial City (FIEDMC)",
      district: "Faisalabad",
      isFlagship: false,
      areaAcres: "4,500 Acres (Mega Industrial Park)",
      distToMine: "175 km via M-4 Motorway",
      powerStatus: "Redundant high-capacity industrial power grid (500 kV / 132 kV)",
      waterStatus: "High-volume industrial RO water supply, common effluent treatment plant (CETP)",
      freightToKarachi: "720 km via M-4 / M-5 Motorway network ($26 – $30 / MT)",
      laborAvailability: "Extensive industrial labor pool, chemical engineers, and certified laboratory personnel",
      incentives: "Federal Notified SEZ: 10-Year corporate income tax holiday + 0% customs duty on capital goods [VERIFY]",
      bestFor: "Pharmaceutical-grade API sodium chloride refinery, vacuum recrystallization, chlor-alkali & joint ventures"
    }
  ],

  // 4. Value-Addition Ladder: Single Unified Progression
  valueLadder: [
    {
      stage: 1,
      code: "STAGE-01",
      title: "Raw Rock Salt Mining",
      subTitle: "Underground room-and-pillar extraction",
      fobPriceUSD: "$35 – $50 / MT",
      fobPricePKR: "PKR 9,800 – 14,000 / MT",
      pricePerKgPKR: "Rs. 10 – 14 / kg",
      capexBandUSD: "$50k – $150k",
      capexBandPKR: "PKR 1.4 – 4.2 Cr",
      machinery: "Pneumatic rock drills, undercutters, primary jaw crusher, haulage loaders",
      standard: "Punjab Mining Concession Rules 2022 / Explosives Act",
      hsCode: "2501.00.10",
      hsDesc: "Common salt in bulk (Run-of-mine lumps)",
      targetMarkets: "Domestic heavy industrial buyers, local crude crushers, regional livestock feeds",
      multiplier: "1.0x (Baseline extraction value)"
    },
    {
      stage: 2,
      code: "STAGE-02",
      title: "Optically-Sorted Industrial Granules",
      subTitle: "High-speed optical color grading & washing",
      fobPriceUSD: "$120 – $180 / MT",
      fobPricePKR: "PKR 33,600 – 50,400 / MT",
      pricePerKgPKR: "Rs. 34 – 50 / kg",
      capexBandUSD: "$150k – $350k",
      capexBandPKR: "PKR 4.2 – 9.8 Cr",
      machinery: "Bichromatic optical sorters, SS304 trommel washer, dewatering centrifuge, vibratory screens",
      standard: "Codex CXS 150-1985 (Raw input grade, <0.2% insoluble matter)",
      hsCode: "2501.00.20",
      hsDesc: "Pure sodium chloride in intermediate granular forms",
      targetMarkets: "Overseas salt repacking brands, high-clarity decorative manufacturers, industrial food processors",
      multiplier: "3.5x – 4.0x"
    },
    {
      stage: 3,
      code: "STAGE-03",
      title: "Food-Grade Milled Table Salt",
      subTitle: "Precision particle sizing (0.5mm – 2mm) in bulk sacks",
      fobPriceUSD: "$280 – $450 / MT",
      fobPricePKR: "PKR 78,400 – 126,000 / MT",
      pricePerKgPKR: "Rs. 78 – 126 / kg",
      capexBandUSD: "$250k – $600k",
      capexBandPKR: "PKR 7.0 – 16.8 Cr",
      machinery: "SS316 hammer mill, multi-deck vibro-sifters, fluid bed hot-air dryer, micro-doser for iodization",
      standard: "Codex CXS 150-1985 (Min 97% NaCl, moisture <=0.5%), PSQCA 166:2008",
      hsCode: "2501.00.20",
      hsDesc: "Refined table salt in 25kg & 50kg export bags",
      targetMarkets: "International catering suppliers, wholesale supermarket distributors, food ingredient blenders",
      multiplier: "7.0x – 9.0x"
    },
    {
      stage: 4,
      code: "STAGE-04",
      title: "Branded Retail Stand-Up Pouches",
      subTitle: "Automated nitrogen-flush consumer packaging (250g – 1kg)",
      fobPriceUSD: "$550 – $950 / MT",
      fobPricePKR: "PKR 154,000 – 266,000 / MT",
      pricePerKgPKR: "Rs. 154 – 266 / kg",
      capexBandUSD: "$400k – $1.2M",
      capexBandPKR: "PKR 11.2 – 33.6 Cr",
      machinery: "Vertical Form-Fill-Seal (VFFS) with 10-head multi-head weigher, checkweigher, metal detector, carton sealer",
      standard: "US FDA 21 CFR 101, EU Regulation 1169/2011, ISO 22000, HACCP, Halal",
      hsCode: "2501.00.90",
      hsDesc: "Retail consumer packaged salt in hermetic standing pouches",
      targetMarkets: "Global retail supermarket chains (North America, EU, Gulf Cooperation Council, East Asia)",
      multiplier: "12x – 19x"
    },
    {
      stage: 5,
      code: "STAGE-05",
      title: "Gourmet Table Mills & Infusions",
      subTitle: "Refillable ceramic grinders, organic herb infusions, salt cooking slabs",
      fobPriceUSD: "$2,000 – $3,500 / MT",
      fobPricePKR: "PKR 560,000 – 980,000 / MT",
      pricePerKgPKR: "Rs. 560 – 980 / kg",
      capexBandUSD: "$200k – $500k",
      capexBandPKR: "PKR 5.6 – 14.0 Cr",
      machinery: "Diamond-tipped block saws, automated bottle filling & capping lines, moisture-controlled blending tumblers",
      standard: "Protected Geographical Indication (GI) Pakistan, Organic Certified, US FDA GRAS",
      hsCode: "2501.00.90",
      hsDesc: "Gourmet culinary presentation & artisanal salt tableware",
      targetMarkets: "Specialty delicatessens, luxury kitchenware retail, gourmet hospitality, culinary gifting",
      multiplier: "45x – 70x"
    },
    {
      stage: 6,
      code: "STAGE-06",
      title: "Pharmaceutical & Hemodialysis API",
      subTitle: "99.8%+ pure NaCl for intravenous infusions and hemodialysis",
      fobPriceUSD: "$3,500 – $5,000 / MT",
      fobPricePKR: "PKR 980,000 – 1,400,000 / MT",
      pricePerKgPKR: "Rs. 980 – 1,400 / kg",
      capexBandUSD: "$1.5M – $4.0M",
      capexBandPKR: "PKR 42.0 – 112.0 Cr",
      machinery: "Vacuum multiple-effect evaporation crystallizers, chemical brine purifiers, cGMP cleanroom packaging",
      standard: "United States Pharmacopeia (USP), European Pharmacopoeia (EP), British Pharmacopoeia (BP)",
      hsCode: "2501.00.90",
      hsDesc: "Pharmaceutical-grade sodium chloride API",
      targetMarkets: "Domestic IV fluid manufacturers (import substitution), international dialysis solution blenders",
      multiplier: "80x – 100x"
    }
  ],

  // 5. Strategic Investment Opportunities: 8 Projects in 4 Clean Categories
  opportunityCategories: [
    { id: "all", label: "All Projects (8)" },
    { id: "food_retail", label: "Food-Grade & Retail Processing (2)" },
    { id: "gourmet_wellness", label: "Gourmet, Artisanal & Wellness (2)" },
    { id: "agri_livestock", label: "Agricultural & Livestock (2)" },
    { id: "industrial_pharma", label: "Industrial & Pharmaceutical / JV (2)" }
  ],

  opportunities: [
    // Category 1: Food-Grade & Retail Processing
    {
      id: "opt-food-grade-optical",
      slug: "food-grade-optical-sorting",
      category: "food_retail",
      categoryName: "Food-Grade & Retail Processing",
      title: "Optical Sorting & Food-Grade Stand-Up Pouch Packaging Unit",
      location: "Quaidabad Mineral Processing Zone",
      district: "Khushab",
      capexPKR: "PKR 9.1 Crore",
      capexUSD: "$325,000",
      capacity: "25 MT / Day (~7,000 MT / yr)",
      landReq: "22,000 sq ft industrial shed",
      machinery: "SS316 optical crystal sorter, high-speed VFFS packaging, nitrogen-flush dosing, metal detection",
      standards: "Codex CXS 150-1985, ISO 22000, HACCP, Halal",
      targetMarket: "Export pouches (250g, 500g, 1kg) for supermarket chains across Middle East, UK, and European Union",
      summary: "Modern packaging plant converting raw rock salt into high-purity table crystals in branded consumer packaging, meeting export retail shelf requirements."
    },
    {
      id: "opt-turnkey-table-salt",
      slug: "turnkey-iodized-table-salt",
      category: "food_retail",
      categoryName: "Food-Grade & Retail Processing",
      title: "Commercial Edible Table Salt & Iodization Facility",
      location: "Bhalwal Industrial Estate (SEZ)",
      district: "Sargodha",
      capexPKR: "PKR 14.5 Crore",
      capexUSD: "$518,000",
      capacity: "50 MT / Day (~14,000 MT / yr)",
      landReq: "35,000 sq ft industrial plot",
      machinery: "Continuous saturated brine washer, fluid bed hot-air dryer, multi-deck vibro sifters, potassium iodate sprayers",
      standards: "PSQCA 166:2008, Codex CXS 150, Universal Salt Iodization (USI) standards",
      targetMarket: "National domestic retail networks, bulk packaging for FMCG commercial food processors, export to Central Asian republics",
      summary: "High-volume washing and refining line balanced for consistent granulometry, moisture control (<0.1%), and certified mandatory iodization."
    },

    // Category 2: Gourmet, Artisanal & Wellness
    {
      id: "opt-artisan-culinary-crafts",
      slug: "artisan-culinary-crafts",
      category: "gourmet_wellness",
      categoryName: "Gourmet, Artisanal & Wellness",
      title: "Artisanal Salt Lamps, Wellness Tiles & Cooking Slabs Unit",
      location: "Khewra - Pind Dadan Khan Corridor",
      district: "Jhelum",
      capexPKR: "PKR 4.2 Crore",
      capexUSD: "$150,000",
      capacity: "10 MT / Day (~2,800 MT / yr)",
      landReq: "15,000 sq ft artisanal workshop",
      machinery: "Water-cooled diamond band saws, calibrated core drills, high-precision surface planers, shrink-wrap tunnels",
      standards: "Protected GI Registration (Pakistan IPO), CE / UL electrical certification for lamp wiring",
      targetMarket: "Home decor, spa therapy centers, gourmet kitchenware retailers across North America, Japan, and Western Europe",
      summary: "Dedicated artisan facility utilizing Khewra mineral seams to manufacture hand-carved ionising lamps, searing cooking slabs, and therapeutic sauna wall tiles."
    },
    {
      id: "opt-gourmet-bath-salts",
      slug: "gourmet-bath-salts",
      category: "gourmet_wellness",
      categoryName: "Gourmet, Artisanal & Wellness",
      title: "Gourmet Refillable Grinders & Essential Oil Bath Salts Facility",
      location: "Quaidabad Mineral Processing Zone",
      district: "Khushab",
      capexPKR: "PKR 5.6 Crore",
      capexUSD: "$200,000",
      capacity: "8 MT / Day (~2,240 MT / yr)",
      landReq: "18,000 sq ft clean formulation facility",
      machinery: "Rotary blending drums, automated bottle capping machine, label applicators, nitrogen vacuum sealers",
      standards: "ISO 22716 (Cosmetics GMP), US FDA Food Facility Registration, Halal",
      targetMarket: "Premium organic grocery stores, boutique cosmetic lines, hospitality chains, wellness spas worldwide",
      summary: "High-margin specialty production of ceramic-mechanism table salt grinders and therapeutically infused magnesium-rich bath salts with natural botanical extracts."
    },

    // Category 3: Agricultural & Livestock
    {
      id: "opt-livestock-mineral-blocks",
      slug: "livestock-mineral-blocks",
      category: "agri_livestock",
      categoryName: "Agricultural & Livestock",
      title: "Hydraulic Compressed Mineral Lick Blocks for Dairy & Livestock",
      location: "Quaidabad Mineral Processing Zone",
      district: "Khushab",
      capexPKR: "PKR 5.2 Crore",
      capexUSD: "$185,000",
      capacity: "30 MT / Day (~8,400 MT / yr)",
      landReq: "20,000 sq ft manufacturing shed",
      machinery: "150-ton hydraulic compression block presses, ribbon blenders for trace mineral premixing, moisture-barrier shrink-wrapping",
      standards: "FAO Animal Feed Guidelines, PSQCA Livestock Mineral Standards",
      targetMarket: "Commercial dairy farms across Punjab, livestock pastoralists in Sindh/Balochistan, export to Gulf agricultural markets and Australia",
      summary: "Converting secondary salt granules into weather-resistant, mineral-fortified salt lick blocks containing essential selenium, zinc, and cobalt for enhanced livestock lactation and health."
    },
    {
      id: "opt-agri-deicing-bulk",
      slug: "agri-deicing-bulk",
      category: "agri_livestock",
      categoryName: "Agricultural & Livestock",
      title: "Industrial Bulk Crushed Salt & Highway De-Icing Plant",
      location: "Daud Khel / Kalabagh Corridor",
      district: "Mianwali",
      capexPKR: "PKR 6.5 Crore",
      capexUSD: "$232,000",
      capacity: "100 MT / Day (~28,000 MT / yr)",
      landReq: "30,000 sq ft industrial yard with rail siding link",
      machinery: "Heavy-duty impact crushers, dual-deck vibrating screens, automated 1-tonne jumbo bag filling stations, bulk hopper conveyor",
      standards: "ASTM D632 (Specification for Sodium Chloride for De-icing), BS 3247",
      targetMarket: "Municipal transport departments in Northern Europe, North America, and Central Asia for winter road safety; domestic industrial chemical tanning",
      summary: "High-throughput primary crushing and sizing terminal producing 2–6mm granular rock salt packed in 1,000 kg FIBC bags for international seasonal de-icing contracts."
    },

    // Category 4: Industrial & Pharmaceutical / JV
    {
      id: "opt-pharma-api-refinery",
      slug: "pharma-api-refinery",
      category: "industrial_pharma",
      categoryName: "Industrial & Pharmaceutical / JV",
      title: "Pharmaceutical-Grade API Sodium Chloride Vacuum Refinery (JV Proposal)",
      location: "M-3 Industrial City (SEZ)",
      district: "Faisalabad",
      capexPKR: "PKR 42.0 Crore",
      capexUSD: "$1,500,000",
      capacity: "50 MT / Day (~14,000 MT / yr)",
      landReq: "45,000 sq ft cGMP pharmaceutical complex",
      machinery: "Continuous chemical brine purification reactors, multi-stage vacuum evaporation crystallizers, titanium centrifuges, cleanroom drying and packaging",
      standards: "USP, EP, BP Pharmacopeia compliance, WHO-cGMP certified, ISO 17025 laboratory",
      targetMarket: "Domestic intravenous fluid manufacturers (import substitution saving $15M+ annually in foreign exchange), export to regional pharmaceutical formulation hubs",
      summary: "Joint-venture pharmaceutical chemical refinery processing high-grade Warcha rock salt into pyrogen-free 99.8%+ pure NaCl for life-saving hemodialysis and IV infusion products."
    },
    {
      id: "opt-chemical-chlor-alkali",
      slug: "chemical-chlor-alkali-feedstock",
      category: "industrial_pharma",
      categoryName: "Industrial & Pharmaceutical / JV",
      title: "Purified Industrial Saturated Brine & Chlor-Alkali Feedstock Terminal",
      location: "Khewra - Dandot Industrial Zone",
      district: "Jhelum",
      capexPKR: "PKR 18.0 Crore",
      capexUSD: "$642,000",
      capacity: "80 MT / Day (~22,400 MT / yr)",
      landReq: "40,000 sq ft industrial chemical site",
      machinery: "Deep brine dissolution shafts, automated chemical clarification clarifiers, membrane cell pre-treatment filtration units, insulated road tanker loading gantry",
      standards: "Industrial Chlor-Alkali Grade (Sulfate <0.3%, Calcium <0.1%, Magnesium <0.05%)",
      targetMarket: "Textile bleaching mills, caustic soda producers, soda ash manufacturing plants in Punjab's industrial heartland",
      summary: "Dedicated raw brine extraction and purification hub supplying consistent, low-impurity saturated brine directly to Pakistan's major chemical and textile sectors."
    }
  ],

  // 6. Chief Minister Pink Salt Value Addition Financing Scheme (Summary)
  scheme: {
    title: "Chief Minister Pink Salt Value Addition Financing Scheme",
    mandate: "Facilitating transition from low-yield raw rock extraction to high-margin export-grade value-addition infrastructure in Punjab.",
    officialPortalUrl: "https://pinksalt.punjab.gov.pk/landing",
    executingBank: "The Bank of Punjab (BOP)",
    sponsoringDept: "Mines & Minerals Department, Government of Punjab",
    parameters: [
      { label: "Total Program Allocation", value: "PKR 5.0 Billion (Rs. 500 Crore)", status: "Active Provincial Budget Allocation [VERIFY]" },
      { label: "Financing Limit Per Business", value: "Up to PKR 50.0 Million (Rs. 5.0 Crore)", status: "Tiered by applicant manufacturing category [VERIFY]" },
      { label: "Markup / Interest Rate", value: "0% Net Cost to Borrower", status: "100% Mark-up subsidized by Government of Punjab [VERIFY]" },
      { label: "Financing Tenure", value: "Up to 5 Years", status: "Includes grace period of up to 6 months for plant commissioning [VERIFY]" },
      { label: "Sponsor Equity Ratio", value: "30% – 50% Equity", status: "Borrower equity structured according to enterprise category" },
      { label: "Processing & Sanctioning", value: "Bank of Punjab Credit Division", status: "Underwritten under BOP commercial credit policy; portal does not approve loans" }
    ],
    eligibilityCriteria: [
      "Resident citizen of Punjab with valid CNIC / SECP registered business entity",
      "Conforms to Small & Medium Enterprise (SME) criteria defined by State Bank of Pakistan",
      "Possession of owned or legally leased industrial premises in Punjab (e.g. Quaidabad Zone, Bhalwal SEZ, Khewra Corridor)",
      "Clear credit bureau (e-CIB) record with no default history",
      "Viable business proposal focused on value addition (washing, crushing, optical sorting, packaging, or wellness crafting)"
    ],
    disclaimer: "The Directorate General of Mines & Minerals provides industrial benchmarking and technical data. All credit decisions, loan appraisals, and disbursements are executed independently by The Bank of Punjab under applicable banking regulations."
  },

  // 7. Base Case Financial Parameters & Calculator Presets
  calculator: {
    baseCase: {
      name: "Standard 25 TPD Edible Salt Value-Addition Facility",
      capacityTPD: 25.0,
      operatingDays: 280,
      utilization: 0.85,
      yield: 0.95,
      machineryUSD: 165000,
      landBuildingUSD: 70000,
      installationUSD: 25000,
      workingCapitalUSD: 40000,
      equityPct: 35.0,
      interestRate: 14.5, // Used for commercial bank benchmarking
      tenureYears: 5,
      graceMonths: 6,
      sellingPriceUSD: 450.0,
      rawCostUSD: 57.14,
      energyCostUSD: 22.0,
      packagingCostUSD: 28.0,
      laborCostUSD: 16.0,
      freightCostUSD: 34.0,
      otherVarCostUSD: 12.0,
      adminSalariesUSD: 24000,
      maintenanceUSD: 14000,
      complianceUSD: 10000
    },

    applicantCategories: {
      small_packaging: {
        num: 1,
        id: "small_packaging",
        name: "Small-Scale Packaging Unit",
        badge: "PKR 50L – 1.5Cr ($18k – $54k)",
        capacityTPD: 8.0,
        days: 280,
        util: 0.80,
        yield: 0.94,
        machinery: 28000,
        land: 12000,
        install: 4000,
        wc: 8000,
        price: 380,
        rawCost: 55,
        energy: 20,
        packaging: 26,
        labor: 18,
        freight: 34,
        admin: 12000,
        maintenance: 6000,
        compliance: 4000,
        equityPct: 30.0,
        interestRate: 14.5,
        washing: false,
        productKey: "iodized_table_salt"
      },
      medium_manufacturing: {
        num: 2,
        id: "medium_manufacturing",
        name: "Medium-Scale Manufacturing Unit",
        badge: "PKR 2.0Cr – 5.0Cr ($71k – $178k)",
        capacityTPD: 30.0,
        days: 280,
        util: 0.85,
        yield: 0.95,
        machinery: 140000,
        land: 55000,
        install: 20000,
        wc: 35000,
        price: 450,
        rawCost: 52,
        energy: 22,
        packaging: 28,
        labor: 15,
        freight: 32,
        admin: 22000,
        maintenance: 12000,
        compliance: 9000,
        equityPct: 35.0,
        interestRate: 14.5,
        washing: true,
        productKey: "iodized_table_salt"
      },
      value_added_products: {
        num: 3,
        id: "value_added_products",
        name: "Value-Added Crafts & Wellness Unit",
        badge: "PKR 75L – 2.5Cr ($27k – $89k)",
        capacityTPD: 10.0,
        days: 260,
        util: 0.80,
        yield: 0.90,
        machinery: 45000,
        land: 20000,
        install: 6000,
        wc: 15000,
        price: 650,
        rawCost: 65,
        energy: 18,
        packaging: 45,
        labor: 35,
        freight: 36,
        admin: 16000,
        maintenance: 8000,
        compliance: 6000,
        equityPct: 40.0,
        interestRate: 14.5,
        washing: true,
        productKey: "spa_bath_salts"
      },
      export_oriented: {
        num: 4,
        id: "export_oriented",
        name: "Export-Oriented Enterprise",
        badge: "PKR 5.0Cr – 15Cr ($178k – $535k)",
        capacityTPD: 50.0,
        days: 300,
        util: 0.90,
        yield: 0.96,
        machinery: 320000,
        land: 120000,
        install: 45000,
        wc: 80000,
        price: 520,
        rawCost: 48,
        energy: 24,
        packaging: 32,
        labor: 14,
        freight: 30,
        admin: 36000,
        maintenance: 22000,
        compliance: 16000,
        equityPct: 50.0,
        interestRate: 14.5,
        washing: true,
        productKey: "standup_pouches_retail"
      }
    },

    productPresets: {
      iodized_table_salt: { name: "Iodized Table Salt (Bulk/Retail)", price: 420, yield: 0.95, packaging: 26, wash: true },
      standup_pouches_retail: { name: "Branded Stand-Up Pouches (1kg)", price: 680, yield: 0.95, packaging: 48, wash: true },
      gourmet_grinders: { name: "Ceramic Table Grinders (Glass)", price: 2400, yield: 0.90, packaging: 220, wash: false },
      salt_lamps_handcrafted: { name: "Handcrafted Salt Lamps & Tiles", price: 750, yield: 0.88, packaging: 65, wash: false },
      spa_bath_salts: { name: "Botanical Infused Bath Salts", price: 850, yield: 0.92, packaging: 75, wash: true },
      industrial_bulk_salt: { name: "Industrial Crushed Granules", price: 150, yield: 0.97, packaging: 16, wash: false }
    }
  },

  // 8. Export Standards & Regulatory Destination Matrices
  exportStandards: [
    {
      jurisdiction: "International Codex Alimentarius",
      standardName: "CXS 150-1985 (Standard for Food Grade Salt)",
      keyParameters: "Min 97.0% NaCl (dry basis); Lead <= 2.0 ppm; Arsenic <= 0.5 ppm; Cadmium <= 0.5 ppm; Mercury <= 0.1 ppm; Moisture <= 0.5%",
      inspectionAgency: "Accredited ISO 17025 testing laboratories (PAFDA, PCSIR, SGS, TTI)"
    },
    {
      jurisdiction: "United States (US FDA)",
      standardName: "21 CFR 100.155 & Food Facility Registration",
      keyParameters: "GRAS status; mandatory nutrition labeling; food-contact packaging compliance (21 CFR 177); foreign supplier verification (FSVP)",
      inspectionAgency: "US FDA foreign facility audit & authorized pre-shipment lab certificate"
    },
    {
      jurisdiction: "European Union (EU EFSA)",
      standardName: "Regulation (EC) No 178/2002 & Food Hygiene",
      keyParameters: "Traceability to point of extraction; heavy metal screening; anti-caking additives limited to approved E-numbers (E535/E536)",
      inspectionAgency: "Designated port health inspection & European Food Safety Authority compliance"
    },
    {
      jurisdiction: "Gulf Cooperation Council (GCC / GSO)",
      standardName: "GSO 1099/2002 (Edible Salt Standard)",
      keyParameters: "Mandatory potassium iodate fortification (30–50 ppm); Halal certification; Arabic bilingual retail packaging labels",
      inspectionAgency: "GSO authorized certification bodies & Gulf country customs clearance"
    }
  ],

  // 9. HS Code Classifications (Pakistan Customs Tariff)
  hsCodes: [
    { code: "2501.00.10", desc: "Common salt: Rock salt in bulk (Uncrushed / run-of-mine lumps)", dutyExport: "0%", status: "Permitted under export quota and mining royalty documentation" },
    { code: "2501.00.20", desc: "Pure sodium chloride: Salt suitable for human consumption in bulk (25kg/50kg bags)", dutyExport: "0%", status: "Standard food-grade export classification" },
    { code: "2501.00.90", desc: "Other: Packaged retail table salt, gourmet grinders, bath salts, and artisan items", dutyExport: "0%", status: "Eligible for standard export facilitation & duty drawback" },
    { code: "9405.20.00", desc: "Electric table lamps of carved rock salt with electrical fittings", dutyExport: "0%", status: "Finished artisanal handicraft classification" },
    { code: "3004.90.99", desc: "Sodium chloride sterile solutions & API dialysis grade preparations", dutyExport: "0%", status: "Regulated under Drug Regulatory Authority of Pakistan (DRAP)" }
  ],

  // 10. Knowledge Base Documents (Categorized Official Publications)
  knowledgeBase: [
    {
      id: "doc-smeda-2023",
      category: "Feasibility Benchmarks",
      title: "SMEDA Pre-Feasibility Study: Edible Salt Processing & Packaging Unit",
      publisher: "Small and Medium Enterprises Development Authority (SMEDA)",
      date: "December 2023",
      refCode: "Document No. 220",
      description: "Official pre-feasibility benchmark modeling a 30 TPD edible table salt plant with PKR 94.99M total capital expenditure and verified 5-year cash flows."
    },
    {
      id: "doc-concession-rules",
      category: "Provincial Legislation",
      title: "Punjab Mining Concession Rules 2022 (Consolidated)",
      publisher: "Mines & Minerals Department, Government of Punjab",
      date: "July 2022",
      refCode: "Rules Gazetted 2022",
      description: "Authoritative regulatory rules governing mineral exploration licenses, mining leases, auction bidding protocols, safety compliance, and royalty schedules in Punjab."
    },
    {
      id: "doc-codex-salt",
      category: "Quality & Testing Standards",
      title: "Codex Standard for Food Grade Salt (CXS 150-1985)",
      publisher: "Codex Alimentarius Commission (FAO / WHO)",
      date: "Revised 2012 / Current",
      refCode: "CXS 150-1985",
      description: "International benchmark mandating >=97.0% dry NaCl purity, trace contaminant limits, permitted anticaking additives, and global hygiene standards for edible salt."
    },
    {
      id: "doc-gsp-salt-range",
      category: "Geological Memoirs",
      title: "Geology and Mineral Resources of the Salt Range, Pakistan",
      publisher: "Geological Survey of Pakistan (GSP)",
      date: "Special Publication Series",
      refCode: "GSP Memoir Vol. 14",
      description: "Comprehensive geological and stratigraphical survey documenting evaporite basin seams, stratigraphy, structural faulting, and regional resource potential."
    }
  ]
};

// Export to window for global browser availability
if (typeof window !== "undefined") {
  window.PINKSALT_DATA = PINKSALT_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = PINKSALT_DATA;
}
