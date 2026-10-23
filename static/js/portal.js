/**
 * PinkSalt Intelligence & Investment Portal - Frontend Controller
 * Complete interactive client for SPA navigation, financial modeling,
 * RAG AI assistance, location scoring, traceability lookup, and admin workflows.
 */

// Global State
const state = {
  currentView: "home",
  adminToken: localStorage.getItem("pinksalt_admin_token") || null,
  adminUser: null,
  calculatorParams: {},
  chatHistory: []
};

// Utilities
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function formatUSD(num) {
  return "$" + Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-US");
}

// View Routing
function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll(".page-view").forEach(el => el.style.display = "none");
  document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const activeNav = document.querySelector(`.nav-link[data-view="${viewName}"]`);
  if (activeNav) activeNav.classList.add("active");

  // Trigger lazy loaders
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
  // Load brief featured opportunities preview
  fetch("/api/opportunities")
    .then(res => res.json())
    .then(data => {
      if (data.success && data.opportunities) {
        const grid = document.getElementById("home-featured-opps");
        if (!grid) return;
        grid.innerHTML = data.opportunities.slice(0, 3).map(opp => `
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
    })
    .catch(err => console.error("Home opps error:", err));
}

// -------------------------------------------------------------
// 2. Resource Intelligence View
// -------------------------------------------------------------
function loadResources(districtFilter = "") {
  const url = districtFilter ? `/api/resources?district=${encodeURIComponent(districtFilter)}` : "/api/resources";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const tbody = document.getElementById("resource-records-tbody");
        if (!tbody) return;
        tbody.innerHTML = data.resources.map(r => `
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
    });
}

function filterMapDistrict(district) {
  document.getElementById("resource-district-select").value = district;
  loadResources(district);
  showToast(`Filtered resource records for ${district} District`);
}

// -------------------------------------------------------------
// 3. Investment Opportunities Marketplace
// -------------------------------------------------------------
function loadOpportunities() {
  const cat = document.getElementById("opp-category-filter")?.value || "All";
  const search = document.getElementById("opp-search-input")?.value || "";

  let url = `/api/opportunities?category=${encodeURIComponent(cat)}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const grid = document.getElementById("opportunities-grid");
        if (!grid) return;
        if (data.opportunities.length === 0) {
          grid.innerHTML = `<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;">No investment opportunities matched your criteria.</div>`;
          return;
        }
        grid.innerHTML = data.opportunities.map(opp => `
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
    });
}

function openOpportunityDetail(slug) {
  fetch(`/api/opportunities`)
    .then(res => res.json())
    .then(data => {
      const opp = data.opportunities.find(o => o.slug === slug);
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
    });
}

function closeGenericModal() {
  document.getElementById("modal-generic").style.display = "none";
}

// -------------------------------------------------------------
// 4. Financial Calculator
// -------------------------------------------------------------
let scenarioPresets = {};

function initCalculator() {
  fetch("/api/feasibility/scenarios")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        scenarioPresets = data.scenarios;
        loadScenario("base_case");
      }
    });
}

function loadScenario(presetKey) {
  document.querySelectorAll(".calc-preset-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.calc-preset-btn[data-preset="${presetKey}"]`);
  if (btn) btn.classList.add("active");

  const preset = scenarioPresets[presetKey];
  if (!preset) return;

  // Populate input fields
  document.getElementById("calc-machinery").value = preset.machinery_cost;
  document.getElementById("calc-land-building").value = preset.land_building_cost;
  document.getElementById("calc-installation").value = preset.installation_cost;
  document.getElementById("calc-working-capital").value = preset.working_capital;

  document.getElementById("calc-capacity-tpd").value = preset.capacity_tpd;
  document.getElementById("calc-operating-days").value = preset.operating_days;
  document.getElementById("calc-utilization").value = preset.capacity_utilization;
  document.getElementById("calc-yield").value = preset.process_yield;

  document.getElementById("calc-raw-salt").value = preset.raw_salt_cost_per_tonne;
  document.getElementById("calc-energy").value = preset.energy_cost_per_tonne;
  document.getElementById("calc-packaging").value = preset.packaging_cost_per_tonne;
  document.getElementById("calc-freight").value = preset.freight_per_tonne;
  document.getElementById("calc-labor").value = preset.labor_cost_per_tonne;

  document.getElementById("calc-admin-salaries").value = preset.annual_admin_salaries;
  document.getElementById("calc-maintenance").value = preset.annual_maintenance;
  document.getElementById("calc-compliance").value = preset.annual_compliance_marketing;
  document.getElementById("calc-selling-price").value = preset.selling_price_per_tonne;

  executeCalculation();
}

function executeCalculation() {
  const payload = {
    machinery_cost: parseFloat(document.getElementById("calc-machinery").value) || 0,
    land_building_cost: parseFloat(document.getElementById("calc-land-building").value) || 0,
    installation_cost: parseFloat(document.getElementById("calc-installation").value) || 0,
    working_capital: parseFloat(document.getElementById("calc-working-capital").value) || 0,

    capacity_tpd: parseFloat(document.getElementById("calc-capacity-tpd").value) || 25,
    operating_days: parseFloat(document.getElementById("calc-operating-days").value) || 300,
    capacity_utilization: parseFloat(document.getElementById("calc-utilization").value) || 0.75,
    process_yield: parseFloat(document.getElementById("calc-yield").value) || 0.92,

    raw_salt_cost_per_tonne: parseFloat(document.getElementById("calc-raw-salt").value) || 45,
    energy_cost_per_tonne: parseFloat(document.getElementById("calc-energy").value) || 28,
    packaging_cost_per_tonne: parseFloat(document.getElementById("calc-packaging").value) || 40,
    freight_per_tonne: parseFloat(document.getElementById("calc-freight").value) || 35,
    labor_cost_per_tonne: parseFloat(document.getElementById("calc-labor").value) || 22,

    annual_admin_salaries: parseFloat(document.getElementById("calc-admin-salaries").value) || 36000,
    annual_maintenance: parseFloat(document.getElementById("calc-maintenance").value) || 18000,
    annual_compliance_marketing: parseFloat(document.getElementById("calc-compliance").value) || 12000,
    selling_price_per_tonne: parseFloat(document.getElementById("calc-selling-price").value) || 320
  };

  fetch("/api/feasibility/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        state.lastCalculation = data.calculation;
        renderCalculationResults(data.calculation);
      }
    })
    .catch(err => console.error("Calculation error:", err));
}

function renderCalculationResults(c) {
  // KPI Top Board
  document.getElementById("kpi-capex").innerText = formatUSD(c.capex.total_capex);
  document.getElementById("kpi-production").innerText = `${formatNumber(c.production.annual_finished_production_tonnes)} MT`;
  document.getElementById("kpi-revenue").innerText = formatUSD(c.financial_returns.annual_revenue);
  document.getElementById("kpi-opex").innerText = formatUSD(c.opex.total_annual_opex);
  document.getElementById("kpi-profit").innerText = formatUSD(c.financial_returns.annual_operating_profit);
  document.getElementById("kpi-margin").innerText = `${c.financial_returns.operating_margin_pct}%`;
  document.getElementById("kpi-breakeven-price").innerText = `$${c.financial_returns.breakeven_selling_price_per_tonne} / MT`;
  document.getElementById("kpi-breakeven-vol").innerText = `${formatNumber(c.financial_returns.breakeven_volume_tonnes)} MT`;
  document.getElementById("kpi-payback").innerText = `${c.financial_returns.estimated_payback_years} Yrs`;

  // Monthly summary
  document.getElementById("calc-monthly-prod").innerText = `${c.monthly_summary.production_tonnes} MT`;
  document.getElementById("calc-monthly-rev").innerText = formatUSD(c.monthly_summary.revenue_usd);
  document.getElementById("calc-monthly-opex").innerText = formatUSD(c.monthly_summary.total_opex_usd);
  document.getElementById("calc-monthly-profit").innerText = formatUSD(c.monthly_summary.operating_profit_usd);

  // Sensitivity Matrix (Selling Price)
  const tbodyPrice = document.getElementById("sensitivity-price-tbody");
  if (tbodyPrice && c.sensitivity.selling_price) {
    tbodyPrice.innerHTML = c.sensitivity.selling_price.map(row => `
      <tr style="${row.delta_pct === 0 ? 'font-weight:700; background:#fff1f2;' : ''}">
        <td>${row.delta_pct > 0 ? '+' : ''}${row.delta_pct}%</td>
        <td>$${row.value} / MT</td>
        <td>${formatUSD(row.annual_operating_profit)}</td>
        <td>${row.margin_pct}%</td>
      </tr>
    `).join("");
  }

  // Sensitivity Matrix (Capacity Utilization)
  const tbodyUtil = document.getElementById("sensitivity-util-tbody");
  if (tbodyUtil && c.sensitivity.capacity_utilization) {
    tbodyUtil.innerHTML = c.sensitivity.capacity_utilization.map(row => `
      <tr style="${row.utilization_pct === 75 ? 'font-weight:700; background:#f0fdf4;' : ''}">
        <td>${row.utilization_pct}%</td>
        <td>${formatNumber(row.annual_production_tonnes)} MT</td>
        <td>${formatUSD(row.annual_revenue)}</td>
        <td>${formatUSD(row.annual_operating_profit)}</td>
      </tr>
    `).join("");
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
Sector: Minerals & Value Addition (Punjab, Pakistan)
Target Product: Food-Grade / Value-Added Rock Salt

1. CAPITAL EXPENDITURE (CAPEX)
--------------------------------------------------------------------------------
- Plant & Machinery:                    ${formatUSD(c.capex.machinery_cost)}
- Land, Building & Factory Shed:        ${formatUSD(c.capex.land_building_cost)}
- Installation, Civil Works, Utilities: ${formatUSD(c.capex.installation_cost)}
- Working Capital Allocation:           ${formatUSD(c.capex.working_capital)}
TOTAL ESTIMATED CAPEX:                  ${formatUSD(c.capex.total_capex)}

2. ANNUAL PRODUCTION & OPERATING VOLUMES
--------------------------------------------------------------------------------
- Nameplate Capacity:                   ${c.production.nameplate_capacity_tpd} Tonnes/Day
- Operating Schedule:                   ${c.production.operating_days} Days/Year
- Capacity Utilization:                 ${c.production.capacity_utilization_pct}%
- Processing Yield:                     ${c.production.process_yield_pct}%
- Annual Raw Salt Consumed:             ${c.production.annual_raw_salt_tonnes} Tonnes
- Annual Finished Product:              ${c.production.annual_finished_production_tonnes} Tonnes

3. OPERATIONAL EXPENDITURES (OPEX)
--------------------------------------------------------------------------------
- Raw Material Cost (Delivered):        $${c.opex.effective_raw_material_cost_per_tonne} / finished tonne
- Power & Energy Cost:                  $${c.opex.energy_cost_per_tonne} / finished tonne
- Packaging & Stand-up Pouches:         $${c.opex.packaging_cost_per_tonne} / finished tonne
- Inland Freight to Karachi:            $${c.opex.freight_per_tonne} / finished tonne
- Direct Labor:                         $${c.opex.labor_cost_per_tonne} / finished tonne
- Total Variable Cost / Finished Tonne: $${c.opex.variable_cost_per_tonne}
- Annual Variable OPEX:                 ${formatUSD(c.opex.annual_variable_costs)}
- Annual Fixed Overheads:               ${formatUSD(c.opex.annual_fixed_costs)}
TOTAL ANNUAL OPEX:                      ${formatUSD(c.opex.total_annual_opex)}

4. FINANCIAL RETURNS & PROFITABILITY (EBITDA)
--------------------------------------------------------------------------------
- Selling Price (FOB Karachi):          $${c.financial_returns.selling_price_fob_per_tonne} / finished tonne
- Annual Projected Revenue:             ${formatUSD(c.financial_returns.annual_revenue)}
- Annual Operating Profit (EBITDA):     ${formatUSD(c.financial_returns.annual_operating_profit)}
- Operating Margin:                     ${c.financial_returns.operating_margin_pct}%
- Break-Even Selling Price:             $${c.financial_returns.breakeven_selling_price_per_tonne} / finished tonne
- Break-Even Finished Volume:           ${c.financial_returns.breakeven_volume_tonnes} Tonnes
- Estimated Simple Payback:             ${c.financial_returns.estimated_payback_years} Years

DISCLAIMER:
${c.disclaimer}
================================================================================
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `PinkSalt_Feasibility_Outline_${Date.now()}.txt`;
  a.click();
  showToast("Feasibility Outline downloaded successfully.");
}

// -------------------------------------------------------------
// 5. Processing Zone & Site Selector
// -------------------------------------------------------------
const siteData = {
  quaidabad: {
    name: "Quaidabad Mineral Processing Cluster (Khushab)",
    district: "Khushab",
    distToMine: "15 - 25 km (Warcha Mine)",
    powerStatus: "132 kV Grid station (industrial feeder planned)",
    waterStatus: "Subsurface brackish/tube well + canal source",
    freightToKarachi: "860 km via M-2 / CPEC Corridor ($32 - $36/tonne)",
    laborAvailability: "Extensive mining labor; moderate packaging expertise",
    sezBenefits: "Designated mineral processing zone under provincial scheme",
    bestFor: "Primary crushing, optical sorting, bulk packaging, animal lick blocks"
  },
  bhalwal: {
    name: "Bhalwal Industrial Estate (Sargodha)",
    district: "Sargodha",
    distToMine: "65 km (Salt Range belt)",
    powerStatus: "Dedicated 11 kV underground electrical network",
    waterStatus: "High-volume industrial water supply & RO plants",
    freightToKarachi: "810 km directly on M-2 Motorway ($30 - $34/tonne)",
    laborAvailability: "Skilled agro-processing and packaging technicians",
    sezBenefits: "Approved Special Economic Zone with 10-year income tax holiday",
    bestFor: "Gourmet retail grinders, glass container packaging, gift sets"
  },
  khewra: {
    name: "Khewra - Pind Dadan Khan Corridor (Jhelum)",
    district: "Jhelum",
    distToMine: "0 - 10 km (Khewra Mine)",
    powerStatus: "Established grid supply; subject to seasonal peak loads",
    waterStatus: "Local freshwater springs & municipal industrial pipeline",
    freightToKarachi: "920 km via M-2 Lilla Interchange ($35 - $38/tonne)",
    laborAvailability: "Generations of artisanal rock carving masters & stonemasons",
    sezBenefits: "Artisanal cluster support via Punjab Small Industries (PSIC)",
    bestFor: "Salt lamps, precision tiles, speleotherapy construction blocks"
  },
  m3_faisalabad: {
    name: "M-3 Industrial City (Faisalabad SEZ)",
    district: "Faisalabad",
    distToMine: "140 km",
    powerStatus: "Redundant dual-circuit high-tension power supply",
    waterStatus: "Industrial RO water treatment & effluent treatment plant (CETP)",
    freightToKarachi: "720 km via Motorway / Faisalabad Dry Port ($26 - $30/tonne)",
    laborAvailability: "Highly trained chemical, pharmaceutical and engineering graduates",
    sezBenefits: "Federal SEZ with 0% customs duty on imported plant & machinery",
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
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Distance to Raw Salt Mines:</strong><br>${s.distToMine}
        </div>
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Power & Electrical Grid:</strong><br>${s.powerStatus}
        </div>
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Water & Effluent Infrastructure:</strong><br>${s.waterStatus}
        </div>
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Freight Logistics to Karachi Ports:</strong><br>${s.freightToKarachi}
        </div>
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Labor Workforce Profile:</strong><br>${s.laborAvailability}
        </div>
        <div class="card" style="padding:14px; background:var(--bg-alt);">
          <strong>Investment Incentives & SEZ:</strong><br>${s.sezBenefits}
        </div>
      </div>
      <div class="notice-card" style="margin-top:20px;">
        <strong>Recommended Value-Addition Profile:</strong> ${s.bestFor}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 6. Traceability & Batch Verification
// -------------------------------------------------------------
function verifyTraceabilityBatch(batchCodeOverride = null) {
  const code = batchCodeOverride || document.getElementById("traceability-input")?.value?.trim();
  if (!code) {
    showToast("Please enter a batch code to verify.");
    return;
  }

  fetch(`/api/traceability/verify?batch=${encodeURIComponent(code)}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("traceability-result-container");
      if (!container) return;

      if (data.success && data.verified) {
        const b = data.batch;
        container.innerHTML = `
          <div class="card" style="border-left:5px solid var(--success); padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="opp-badge badge-verified">✓ AUTHENTIC GEOGRAPHICAL ORIGIN VERIFIED</span>
              <small style="color:var(--text-muted)">Certificate: ${b.lab_certification_no}</small>
            </div>
            <h3 style="font-size:22px; color:var(--navy-900); margin:12px 0 4px 0;">${b.product_name}</h3>
            <p style="color:var(--text-muted); font-size:13px; margin-bottom:16px;">Batch Identifier: <code>${b.batch_code}</code></p>
            
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; background:var(--bg-alt); padding:16px; border-radius:var(--radius-sm); font-size:13px;">
              <div><strong>Origin Mine:</strong><br>${b.origin_mine} (${b.district})</div>
              <div><strong>Extraction Date:</strong><br>${b.extraction_date}</div>
              <div><strong>Processing Facility:</strong><br>${b.facility_name}</div>
              <div><strong>NaCl Purity Grade:</strong><br><span style="color:var(--success); font-weight:700;">${b.purity_pct}% NaCl</span></div>
              <div><strong>Heavy Metals (Pb/As/Cd):</strong><br><span style="color:var(--navy-700); font-weight:700;">${b.heavy_metals_ppm} ppm (Exceeds Codex CXS 150)</span></div>
              <div><strong>Moisture Content:</strong><br>${b.moisture_pct}%</div>
            </div>
            <p style="margin-top:14px; font-size:12px; color:var(--text-muted);">
              Authenticity verified under the Geographical Indications (Registration and Protection) Act 2020. Mined from the Salt Range Formation, Punjab.
            </p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="card" style="border-left:5px solid var(--danger); padding:24px;">
            <span class="opp-badge" style="background:#fee2e2; color:#b91c1c;">UNVERIFIED BATCH IDENTIFIER</span>
            <h4 style="margin-top:10px; color:#b91c1c;">Batch '${code}' Not Found</h4>
            <p style="font-size:13.5px; color:var(--text-main); margin-top:6px;">
              This identifier does not match any authenticated production run in the Punjab Pink Salt Traceability Register. 
              Be cautious of counterfeit unverified salt originating outside documented Salt Range concessions.
            </p>
          </div>
        `;
      }
    });
}

// -------------------------------------------------------------
// 7. Knowledge Base Documents
// -------------------------------------------------------------
function loadKnowledgeDocs() {
  const cat = document.getElementById("knowledge-category-select")?.value || "All";
  const q = document.getElementById("knowledge-search-input")?.value?.trim() || "";

  let url = `/api/knowledge?category=${encodeURIComponent(cat)}`;
  if (q) url += `&q=${encodeURIComponent(q)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const list = document.getElementById("knowledge-docs-list");
        if (!list) return;
        list.innerHTML = data.documents.map(doc => `
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
    });
}

// -------------------------------------------------------------
// 8. Investor Enquiry Submission
// -------------------------------------------------------------
function submitInvestorEnquiry(event) {
  event.preventDefault();

  const payload = {
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
    requested_assistance: document.getElementById("enq-assistance").value.trim(),
    consent_given: document.getElementById("enq-consent").checked
  };

  fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(`Enquiry registered successfully! Reference: ${data.tracking_id}`);
        // Render confirmation and generated preliminary concept
        const container = document.getElementById("enquiry-form-container");
        container.innerHTML = `
          <div class="card" style="border-top:5px solid var(--success); padding:32px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
              <div style="width:40px; height:40px; border-radius:50%; background:var(--success-bg); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:bold;">✓</div>
              <div>
                <h3 style="font-size:22px; color:var(--navy-900);">Expression of Interest Successfully Stored</h3>
                <p style="color:var(--text-muted); font-size:13px;">Tracking Reference: <strong style="color:var(--navy-900); font-family:monospace; font-size:15px;">${data.tracking_id}</strong></p>
              </div>
            </div>
            <p style="font-size:14px; color:var(--text-main); line-height:1.6; margin-bottom:24px;">
              Thank you, <strong>${payload.investor_name}</strong>. Your enquiry for <strong>${payload.company_name}</strong> has been logged in the Directorate of Mines & Minerals Punjab investment pipeline. An Investment Facilitation Officer will review your parameters.
            </p>

            <div class="notice-card">
              <strong>Interactive Concept Generated:</strong> Below is a preliminary concept outline generated by the portal's modeling engine based on your parameters.
            </div>

            <div style="background:var(--bg-alt); padding:20px; border-radius:var(--radius-sm); margin-top:20px; font-size:13.5px; line-height:1.6;">
              <h4 style="color:var(--navy-900); margin-bottom:8px;">${data.preliminary_concept.concept_title}</h4>
              <p>${data.preliminary_concept.executive_summary}</p>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;">
                <div><strong>Estimated CAPEX:</strong> ${formatUSD(data.preliminary_concept.indicative_financials.estimated_capex_usd)}</div>
                <div><strong>Annual Revenue:</strong> ${formatUSD(data.preliminary_concept.indicative_financials.annual_revenue_usd)}</div>
                <div><strong>Operating Profit (EBITDA):</strong> ${formatUSD(data.preliminary_concept.indicative_financials.annual_operating_profit_usd)}</div>
                <div><strong>Estimated Payback:</strong> ~${data.preliminary_concept.indicative_financials.estimated_payback_years} Years</div>
              </div>
            </div>

            <div style="margin-top:24px; display:flex; gap:12px;">
              <button class="btn btn-navy" onclick="location.reload()">Submit Another Expression</button>
              <button class="btn btn-primary" onclick="switchView('calculator')">Fine-tune in Calculator</button>
            </div>
          </div>
        `;
      } else {
        alert(data.error || "Submission error.");
      }
    })
    .catch(err => alert("Submission failed: " + err));
}

function prefillEnquiryWithOpportunity(oppTitle, oppLocation) {
  switchView("enquiry");
  setTimeout(() => {
    const descField = document.getElementById("enq-desc");
    if (descField) descField.value = `Expression of interest in project: ${oppTitle} (${oppLocation}). Seeking information on land allocation and commercial off-take agreements.`;
  }, 100);
}

// -------------------------------------------------------------
// 9. PinkSalt AI Assistant
// -------------------------------------------------------------
function sendChatMessage(presetPrompt = null) {
  const inputEl = document.getElementById("ai-chat-input");
  const msg = presetPrompt || inputEl.value.trim();
  if (!msg) return;

  if (!presetPrompt) inputEl.value = "";

  const messagesBox = document.getElementById("ai-chat-messages");
  // Append user bubble
  const userDiv = document.createElement("div");
  userDiv.className = "message-bubble bubble-user";
  userDiv.innerText = msg;
  messagesBox.appendChild(userDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Append thinking indicator
  const botDiv = document.createElement("div");
  botDiv.className = "message-bubble bubble-bot";
  botDiv.innerHTML = `<em>Consulting verified geological and regulatory sources...</em>`;
  messagesBox.appendChild(botDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.response) {
        const resp = data.response;
        let formattedAnswer = resp.answer.replace(/\n/g, "<br>");
        formattedAnswer = formattedAnswer.replace(/### (.*?)(<br>|$)/g, '<h4 style="color:var(--navy-900); font-size:16px; margin:8px 0 4px 0;">$1</h4>');
        formattedAnswer = formattedAnswer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        let citationsHtml = "";
        if (resp.citations && resp.citations.length > 0) {
          citationsHtml = `
            <div class="citation-box">
              <strong>Grounding Citations & Sources:</strong><br>
              ${resp.citations.map(c => `• <a href="${c.url}" target="_blank" class="citation-link">${c.title}</a> (${c.authority}, ${c.date})`).join("<br>")}
            </div>
          `;
        }

        botDiv.innerHTML = `
          <div>${formattedAnswer}</div>
          ${citationsHtml}
        `;
        messagesBox.scrollTop = messagesBox.scrollHeight;
      }
    })
    .catch(err => {
      botDiv.innerHTML = `<span style="color:var(--danger)">Error querying PinkSalt AI assistant. Please try again.</span>`;
    });
}

// -------------------------------------------------------------
// 10. Protected Administrative Dashboard
// -------------------------------------------------------------
function checkAdminSession() {
  if (!state.adminToken) {
    showAdminLoginModal();
    return;
  }

  fetch("/api/admin/status", {
    headers: { "Authorization": `Bearer ${state.adminToken}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.authenticated) {
        state.adminUser = data.user;
        renderAdminDashboard();
      } else {
        showAdminLoginModal();
      }
    })
    .catch(() => showAdminLoginModal());
}

function showAdminLoginModal() {
  const modal = document.getElementById("modal-admin-login");
  if (modal) modal.style.display = "flex";
}

function submitAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("admin-user-input").value.trim();
  const password = document.getElementById("admin-pwd-input").value;

  fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.token) {
        state.adminToken = data.token;
        state.adminUser = data.user;
        localStorage.setItem("pinksalt_admin_token", data.token);
        document.getElementById("modal-admin-login").style.display = "none";
        showToast("Authenticated as Directorate Administrator.");
        renderAdminDashboard();
      } else {
        alert(data.error || "Authentication failed.");
      }
    })
    .catch(err => alert("Login error: " + err));
}

function adminLogout() {
  if (state.adminToken) {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Authorization": `Bearer ${state.adminToken}` }
    });
  }
  state.adminToken = null;
  state.adminUser = null;
  localStorage.removeItem("pinksalt_admin_token");
  switchView("home");
  showToast("Administrator logged out.");
}

function renderAdminDashboard() {
  // Load Analytics
  fetch("/api/admin/analytics", {
    headers: { "Authorization": `Bearer ${state.adminToken}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const a = data.analytics;
        document.getElementById("admin-total-enquiries").innerText = a.total_enquiries;
        document.getElementById("admin-pipeline-capex").innerText = formatUSD(a.total_pipeline_capex_usd);
        document.getElementById("admin-active-opps").innerText = a.active_opportunities;
        document.getElementById("admin-docs-count").innerText = a.knowledge_docs_count;
      }
    });

  // Load Enquiries Pipeline Table
  fetch("/api/admin/enquiries", {
    headers: { "Authorization": `Bearer ${state.adminToken}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const tbody = document.getElementById("admin-enquiries-tbody");
        if (!tbody) return;
        tbody.innerHTML = data.enquiries.map(enq => `
          <tr>
            <td><strong style="font-family:monospace;">${enq.tracking_id}</strong><br><small>${enq.created_at.substring(0, 10)}</small></td>
            <td><strong>${enq.investor_name}</strong><br><small>${enq.company_name} (${enq.country})</small></td>
            <td>${enq.business_model}<br><small>Budget: ${formatUSD(enq.budget_usd)} | ${enq.capacity_tpd} TPD</small></td>
            <td>
              <select class="form-control" style="font-size:12px; padding:4px 8px;" onchange="updateEnquiryStatus(${enq.id}, this.value)">
                ${["New", "Information Requested", "Qualified", "Meeting Scheduled", "Proposal Received", "Referred for Review", "In Progress", "Closed"].map(st => `
                  <option value="${st}" ${enq.status === st ? 'selected' : ''}>${st}</option>
                `).join("")}
              </select>
            </td>
            <td>
              <button class="btn btn-navy btn-sm" onclick="openEnquiryNotesModal(${enq.id}, '${enq.tracking_id}', \`${(enq.internal_notes || '').replace(/'/g, "\\'")}\`, \`${enq.project_description.replace(/'/g, "\\'")}\`)">Review & Notes</button>
            </td>
          </tr>
        `).join("");
      }
    });

  // Load Audit Logs
  fetch("/api/admin/audit-logs", {
    headers: { "Authorization": `Bearer ${state.adminToken}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const tbody = document.getElementById("admin-audit-tbody");
        if (!tbody) return;
        tbody.innerHTML = data.logs.map(log => `
          <tr>
            <td><small>${log.timestamp}</small></td>
            <td><strong>${log.user_name}</strong></td>
            <td><code>${log.action}</code></td>
            <td><small>${log.details}</small></td>
          </tr>
        `).join("");
      }
    });
}

function updateEnquiryStatus(enquiryId, newStatus) {
  fetch(`/api/admin/enquiries/${enquiryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${state.adminToken}`
    },
    body: JSON.stringify({ status: newStatus })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast(data.message);
        renderAdminDashboard();
      }
    });
}

function openEnquiryNotesModal(enquiryId, trackingId, currentNotes, description) {
  const modalContent = document.getElementById("modal-generic-body");
  modalContent.innerHTML = `
    <h3 style="font-size:20px; color:var(--navy-900);">Enquiry Details: ${trackingId}</h3>
    <h4 style="margin:16px 0 6px 0;">Investor Project Description:</h4>
    <p style="background:var(--bg-alt); padding:12px; border-radius:var(--radius-sm); font-size:13.5px; line-height:1.5;">${description}</p>

    <h4 style="margin:20px 0 6px 0;">Departmental Internal Notes & Actions:</h4>
    <textarea id="modal-enquiry-notes" class="form-control" rows="5" placeholder="Add follow-up notes, due diligence comments, or meeting outcomes...">${currentNotes || ''}</textarea>

    <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:12px;">
      <button class="btn btn-outline" onclick="closeGenericModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEnquiryNotes(${enquiryId})">Save Notes</button>
    </div>
  `;
  document.getElementById("modal-generic").style.display = "flex";
}

function saveEnquiryNotes(enquiryId) {
  const notes = document.getElementById("modal-enquiry-notes").value;
  fetch(`/api/admin/enquiries/${enquiryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${state.adminToken}`
    },
    body: JSON.stringify({ internal_notes: notes })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast("Internal notes updated successfully.");
        closeGenericModal();
        renderAdminDashboard();
      }
    });
}

// -------------------------------------------------------------
// DOM Loaded Initialization
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initHomeView();

  // Navigation click handling
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const view = link.getAttribute("data-view");
      if (view) switchView(view);
    });
  });

  // Check initial hash
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    switchView(hash);
  } else {
    switchView("home");
  }

  // Pre-load calculator
  initCalculator();
});
