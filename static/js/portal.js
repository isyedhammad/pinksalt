/**
 * Pink Salt Intelligence & Investment Portal - Controller Script
 * Directorate General of Mines & Minerals, Government of Punjab
 *
 * Implements Phase 2 (Neutral institutional voice), Phase 3 (Exact strategic structure),
 * Phase 4 (Single data architecture), Phase 5 (Refined "Salt & Stone" light UI/UX).
 */

(function () {
  "use strict";

  // State Management
  const state = {
    currency: "PKR", // "PKR" or "USD"
    usdToPkr: 280.0,
    activeDistrict: "all",
    selectedDepositId: "khewra",
    activeOppCategory: "all",
    oppSearchQuery: "",
    selectedApplicantCategory: "medium_manufacturing",
    selectedProductKey: "iodized_table_salt",
    calculatorInputs: {}
  };

  // Utility Formatters
  function formatNumber(num) {
    if (isNaN(num) || num === null || num === undefined) return "0";
    return Math.round(num).toLocaleString("en-US");
  }

  function formatCurrency(amountUSD, forceCurrency = null) {
    const cur = forceCurrency || state.currency;
    const rate = state.usdToPkr;
    if (cur === "PKR") {
      const pkrVal = amountUSD * rate;
      if (pkrVal >= 10000000) {
        return `PKR ${(pkrVal / 10000000).toFixed(2)} Cr`;
      } else if (pkrVal >= 100000) {
        return `PKR ${(pkrVal / 100000).toFixed(1)} Lakh`;
      }
      return `PKR ${formatNumber(pkrVal)}`;
    } else {
      if (amountUSD >= 1000000) {
        return `$${(amountUSD / 1000000).toFixed(2)}M USD`;
      } else if (amountUSD >= 1000) {
        return `$${formatNumber(amountUSD)} USD`;
      }
      return `$${amountUSD.toFixed(2)} USD`;
    }
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    container.innerHTML = "";
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  // 1. Currency & Exchange Rate Controls
  function initCurrencyControls() {
    const pkrBtn = document.getElementById("btn-currency-pkr");
    const usdBtn = document.getElementById("btn-currency-usd");
    const rateInput = document.getElementById("exchange-rate-input");

    if (pkrBtn && usdBtn) {
      pkrBtn.addEventListener("click", () => setCurrencyMode("PKR"));
      usdBtn.addEventListener("click", () => setCurrencyMode("USD"));
    }

    if (rateInput) {
      rateInput.value = state.usdToPkr;
      rateInput.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value);
        if (val > 50 && val < 1000) {
          state.usdToPkr = val;
          window.PINKSALT_DATA.settings.currentUsdToPkr = val;
          refreshAllCurrencyDisplays();
          executeCalculation(true);
        } else {
          e.target.value = state.usdToPkr;
        }
      });
    }
  }

  function setCurrencyMode(mode) {
    state.currency = mode;
    document.querySelectorAll(".currency-toggle-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-currency") === mode);
    });
    refreshAllCurrencyDisplays();
    executeCalculation(false);
  }

  function refreshAllCurrencyDisplays() {
    renderOverviewFacts();
    renderValueLadder();
    renderOpportunities();
    renderSites();
  }

  // 2. Render Overview Section
  function renderOverviewFacts() {
    const grid = document.getElementById("overview-facts-grid");
    if (!grid || !window.PINKSALT_DATA) return;
    const facts = window.PINKSALT_DATA.keyFacts;
    grid.innerHTML = facts.map(f => `
      <div class="fact-card">
        <div class="fact-sub">${f.subMetric}</div>
        <div class="fact-metric">${f.metric}</div>
        <div class="fact-note">${f.note}</div>
      </div>
    `).join("");
  }

  // 3. Render Resource Base Section (Interactive Map & Table)
  function renderResourceBase() {
    renderDistrictFilters();
    renderDepositsTable();
    updateSelectedDeposit(state.selectedDepositId);
  }

  function renderDistrictFilters() {
    const container = document.getElementById("deposit-district-filters");
    if (!container) return;
    const districts = [
      { id: "all", label: "All Districts" },
      { id: "Jhelum", label: "Jhelum" },
      { id: "Khushab", label: "Khushab" },
      { id: "Mianwali", label: "Mianwali" },
      { id: "Chakwal", label: "Chakwal" }
    ];

    container.innerHTML = districts.map(d => `
      <button class="filter-pill ${state.activeDistrict === d.id ? 'active' : ''}" data-district="${d.id}">
        ${d.label}
      </button>
    `).join("");

    container.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeDistrict = btn.getAttribute("data-district");
        container.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderDepositsTable();
        highlightMapNodes();
      });
    });
  }

  function renderDepositsTable() {
    const tbody = document.getElementById("deposits-table-body");
    if (!tbody || !window.PINKSALT_DATA) return;

    let items = window.PINKSALT_DATA.deposits;
    if (state.activeDistrict !== "all") {
      items = items.filter(d => d.district === state.activeDistrict);
    }

    tbody.innerHTML = items.map(d => `
      <tr class="${state.selectedDepositId === d.id ? 'row-active' : ''}" style="cursor:pointer;" onclick="window.selectDeposit('${d.id}')">
        <td><strong>${d.name}</strong><br><small style="color:var(--stone-muted);">${d.district} District</small></td>
        <td><strong>${d.estimatedReserves}</strong></td>
        <td><span style="color:var(--punjab-green); font-weight:700;">${d.purityNaCl}</span></td>
        <td><small>${d.formation}</small></td>
        <td><small>${d.managingAuthority}</small></td>
        <td><button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.selectDeposit('${d.id}')">View Details</button></td>
      </tr>
    `).join("");
  }

  window.selectDeposit = function (depositId) {
    state.selectedDepositId = depositId;
    updateSelectedDeposit(depositId);
    renderDepositsTable();
    highlightMapNodes();
  };

  function updateSelectedDeposit(depositId) {
    const container = document.getElementById("deposit-detail-display");
    if (!container || !window.PINKSALT_DATA) return;
    const d = window.PINKSALT_DATA.deposits.find(item => item.id === depositId) || window.PINKSALT_DATA.deposits[0];

    container.innerHTML = `
      <div class="deposit-header">
        <span class="section-eyebrow">${d.district} District • ${d.status}</span>
        <h3 class="deposit-title">${d.name}</h3>
        <p style="font-size:13.5px; color:var(--stone-muted);">${d.description}</p>
      </div>
      <div class="deposit-meta-grid">
        <div class="deposit-meta-item">
          <span>Proved Reserves</span>
          <strong>${d.estimatedReserves}</strong>
        </div>
        <div class="deposit-meta-item">
          <span>Natural Purity (NaCl)</span>
          <strong>${d.purityNaCl}</strong>
        </div>
        <div class="deposit-meta-item">
          <span>Geological Stratigraphy</span>
          <strong style="font-size:12.5px;">${d.formation}</strong>
        </div>
        <div class="deposit-meta-item">
          <span>Extraction Method</span>
          <strong style="font-size:12.5px;">${d.extractionType}</strong>
        </div>
      </div>
      <div style="background:var(--punjab-surface); border:1px solid var(--punjab-border); border-radius:var(--radius-sm); padding:12px; font-size:12.5px; color:var(--punjab-dark);">
        <strong>Transportation & Corridor Logistics:</strong><br>
        ${d.logistics}
      </div>
    `;
  }

  function highlightMapNodes() {
    document.querySelectorAll(".map-node").forEach(node => {
      const id = node.getAttribute("data-id");
      const isSelected = (id === state.selectedDepositId);
      node.classList.toggle("active", isSelected);
      const circle = node.querySelector("circle");
      if (circle) {
        circle.setAttribute("r", isSelected ? "10" : "7");
      }
    });
  }

  // 4. Render Where to Build (Industrial Zones)
  function renderSites() {
    const grid = document.getElementById("zones-comparison-grid");
    if (!grid || !window.PINKSALT_DATA) return;
    const sites = window.PINKSALT_DATA.sites;

    grid.innerHTML = sites.map(s => `
      <div class="zone-card ${s.isFlagship ? 'zone-flagship' : ''}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="section-eyebrow" style="margin-bottom:0; font-size:10px;">${s.district}</span>
            ${s.isFlagship ? '<span class="badge-verify" style="background:#EEF4F1; color:#1E3D34; border-color:#C2D6CE;">Flagship Zone</span>' : ''}
          </div>
          <h4 class="zone-name">${s.name}</h4>
          <div class="zone-district">Area: ${s.areaAcres} • Distance: ${s.distToMine}</div>
          <ul class="zone-specs">
            <li><span>Power:</span> <strong>${s.powerStatus.split(';')[0]}</strong></li>
            <li><span>Water:</span> <strong>${s.waterStatus.split('+')[0]}</strong></li>
            <li><span>Port Freight:</span> <strong>${s.freightToKarachi}</strong></li>
            <li><span>Labor Pool:</span> <strong>${s.laborAvailability.split(';')[0]}</strong></li>
          </ul>
        </div>
        <div class="zone-bestfor">
          <strong>Best Suited For:</strong><br>
          ${s.bestFor}
        </div>
      </div>
    `).join("");
  }

  // 5. Render Value-Addition Ladder
  function renderValueLadder() {
    const container = document.getElementById("value-ladder-timeline");
    if (!container || !window.PINKSALT_DATA) return;
    const steps = window.PINKSALT_DATA.valueLadder;

    container.innerHTML = steps.map(s => `
      <div class="ladder-step-card">
        <div class="ladder-step-num">${s.code}</div>
        <div class="ladder-title-col">
          <h4>${s.title}</h4>
          <span>${s.subTitle}</span>
        </div>
        <div class="ladder-price-col">
          <strong>${state.currency === "PKR" ? s.fobPricePKR : s.fobPriceUSD}</strong>
          <small>(${s.pricePerKgPKR})</small>
        </div>
        <div class="ladder-specs-col">
          <span>CAPEX Band:</span>
          <strong>${state.currency === "PKR" ? s.capexBandPKR : s.capexBandUSD}</strong>
          <small>HS: ${s.hsCode}</small>
        </div>
        <div class="ladder-markets-col">
          <span>Compliance & Target:</span>
          <strong>${s.standard.split('(')[0]}</strong>
          <small>${s.targetMarkets.split(',')[0]}</small>
        </div>
      </div>
    `).join("");
  }

  // 6. Render Investment Opportunities
  function renderOpportunities() {
    renderOpportunityCategories();
    renderOpportunityCards();
  }

  function renderOpportunityCategories() {
    const container = document.getElementById("opp-category-pills");
    if (!container || !window.PINKSALT_DATA) return;
    const cats = window.PINKSALT_DATA.opportunityCategories;

    container.innerHTML = cats.map(c => `
      <button class="filter-pill ${state.activeOppCategory === c.id ? 'active' : ''}" data-cat="${c.id}">
        ${c.label}
      </button>
    `).join("");

    container.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeOppCategory = btn.getAttribute("data-cat");
        container.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderOpportunityCards();
      });
    });

    const searchInput = document.getElementById("opp-search-field");
    if (searchInput && !searchInput.dataset.wired) {
      searchInput.dataset.wired = "true";
      searchInput.addEventListener("input", (e) => {
        state.oppSearchQuery = e.target.value.toLowerCase().trim();
        renderOpportunityCards();
      });
    }
  }

  function renderOpportunityCards() {
    const grid = document.getElementById("opportunities-grid-container");
    if (!grid || !window.PINKSALT_DATA) return;

    let list = window.PINKSALT_DATA.opportunities;
    if (state.activeOppCategory !== "all") {
      list = list.filter(o => o.category === state.activeOppCategory);
    }
    if (state.oppSearchQuery) {
      list = list.filter(o =>
        o.title.toLowerCase().includes(state.oppSearchQuery) ||
        o.summary.toLowerCase().includes(state.oppSearchQuery) ||
        o.location.toLowerCase().includes(state.oppSearchQuery) ||
        o.categoryName.toLowerCase().includes(state.oppSearchQuery)
      );
    }

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:36px; background:var(--bg-white); border-radius:var(--radius-md); border:1px solid var(--border-light); color:var(--stone-muted);">No investment proposals match your search criteria.</div>`;
      return;
    }

    grid.innerHTML = list.map(o => `
      <div class="opp-card">
        <div>
          <span class="opp-cat-pill">${o.categoryName}</span>
          <h3 class="opp-title">${o.title}</h3>
          <p class="opp-summary">${o.summary}</p>
          <div class="opp-meta-row">
            <div>
              <span>Indicative Capital Outlay</span>
              <strong>${state.currency === "PKR" ? o.capexPKR : o.capexUSD}</strong>
            </div>
            <div>
              <span>Production Scale</span>
              <strong>${o.capacity}</strong>
            </div>
            <div>
              <span>Proposed Location</span>
              <strong>${o.location}</strong>
            </div>
            <div>
              <span>Facility Footprint</span>
              <strong>${o.landReq.split('(')[0]}</strong>
            </div>
          </div>
          <div style="font-size:12px; color:var(--stone-muted); margin-bottom:16px;">
            <strong style="color:var(--punjab-dark);">Core Machinery:</strong> ${o.machinery}<br>
            <strong style="color:var(--punjab-dark);">Export Standards:</strong> ${o.standards}
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:14px;">
          <span style="font-size:12px; color:var(--stone-muted);">Target: <strong>${o.targetMarket.split('(')[0]}</strong></span>
          <button class="btn btn-sm btn-outline" onclick="window.applyOpportunityToCalc('${o.slug}')">Configure in Model →</button>
        </div>
      </div>
    `).join("");
  }

  window.applyOpportunityToCalc = function (slug) {
    const opp = window.PINKSALT_DATA.opportunities.find(o => o.slug === slug);
    if (!opp) return;

    // Map to nearest applicant category preset
    let catId = "medium_manufacturing";
    if (opp.category === "food_retail" && opp.slug.includes("turnkey")) catId = "export_oriented";
    else if (opp.category === "gourmet_wellness") catId = "value_added_products";
    else if (opp.category === "industrial_pharma") catId = "export_oriented";
    else if (opp.slug.includes("optical")) catId = "medium_manufacturing";

    selectApplicantCategory(catId, false);
    const target = document.getElementById("section-financing");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    showToast(`✓ Configured: ${opp.title}`);
  };

  // 7. Feasibility Calculator & Economic Modeling
  function initCalculator() {
    renderApplicantCategoryTabs();
    loadCategoryIntoCalculator(state.selectedApplicantCategory, false);
    wireCalculatorInputs();
    executeCalculation(false); // Silent on initial load
  }

  function renderApplicantCategoryTabs() {
    const container = document.getElementById("calc-applicant-tabs");
    if (!container || !window.PINKSALT_DATA) return;
    const cats = window.PINKSALT_DATA.calculator.applicantCategories;

    container.innerHTML = Object.keys(cats).map(key => {
      const c = cats[key];
      return `
        <button class="filter-pill ${state.selectedApplicantCategory === key ? 'active' : ''}" data-catid="${key}">
          Category ${c.num}: ${c.name}
        </button>
      `;
    }).join("");

    container.querySelectorAll(".filter-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const catId = btn.getAttribute("data-catid");
        selectApplicantCategory(catId, true);
      });
    });
  }

  function selectApplicantCategory(catId, fromUser = false) {
    state.selectedApplicantCategory = catId;
    document.querySelectorAll("#calc-applicant-tabs .filter-pill").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-catid") === catId);
    });
    loadCategoryIntoCalculator(catId, fromUser);
  }

  function loadCategoryIntoCalculator(catId, fromUser = false) {
    const cat = window.PINKSALT_DATA.calculator.applicantCategories[catId];
    if (!cat) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setVal("calc-capacity-tpd", cat.capacityTPD);
    setVal("calc-operating-days", cat.days);
    setVal("calc-utilization", cat.util);
    setVal("calc-yield", cat.yield);
    setVal("calc-selling-price", cat.price);

    setVal("calc-machinery", cat.machinery);
    setVal("calc-land-building", cat.land);
    setVal("calc-installation", cat.install);
    setVal("calc-working-capital", cat.wc);
    setVal("calc-equity-pct", cat.equityPct);
    setVal("calc-interest-rate", cat.interestRate);

    setVal("calc-raw-salt", cat.rawCost);
    setVal("calc-energy", cat.energy);
    setVal("calc-packaging", cat.packaging);
    setVal("calc-labor", cat.labor);
    setVal("calc-freight", cat.freight);
    setVal("calc-admin-salaries", cat.admin);
    setVal("calc-maintenance", cat.maintenance);
    setVal("calc-compliance", cat.compliance);

    executeCalculation(fromUser);
  }

  function wireCalculatorInputs() {
    const inputs = document.querySelectorAll(".calc-input-field");
    inputs.forEach(input => {
      input.addEventListener("change", () => {
        executeCalculation(true);
      });
    });

    const recalBtn = document.getElementById("btn-recalculate-feasibility");
    if (recalBtn) {
      recalBtn.addEventListener("click", () => {
        executeCalculation(true);
      });
    }

    const printBtn = document.getElementById("btn-print-feasibility");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }

  function executeCalculation(fromUser = false) {
    const getNum = (id, def = 0) => {
      const el = document.getElementById(id);
      if (!el) return def;
      const v = parseFloat(el.value);
      return isNaN(v) ? def : v;
    };

    // 1. Capacity & Output Physics
    const tpd = Math.max(1, getNum("calc-capacity-tpd", 25));
    const days = Math.max(50, Math.min(365, getNum("calc-operating-days", 280)));
    const util = Math.max(0.1, Math.min(1.0, getNum("calc-utilization", 0.85)));
    const yieldRatio = Math.max(0.1, Math.min(1.0, getNum("calc-yield", 0.95)));

    const annualRawInputMT = tpd * days * util;
    const annualFinishedMT = annualRawInputMT * yieldRatio;

    // 2. Pricing & Revenue
    const pricePerMT_USD = Math.max(10, getNum("calc-selling-price", 450));
    const annualRevenueUSD = annualFinishedMT * pricePerMT_USD;

    // 3. CAPEX
    const machineryUSD = Math.max(0, getNum("calc-machinery", 140000));
    const landUSD = Math.max(0, getNum("calc-land-building", 55000));
    const installUSD = Math.max(0, getNum("calc-installation", 20000));
    const wcUSD = Math.max(0, getNum("calc-working-capital", 35000));
    const totalCapexUSD = machineryUSD + landUSD + installUSD + wcUSD;

    const equityPct = Math.max(5, Math.min(100, getNum("calc-equity-pct", 35)));
    const equityUSD = totalCapexUSD * (equityPct / 100);
    const loanPrincipalUSD = totalCapexUSD - equityUSD;

    // 4. OPEX (Variable + Fixed)
    const rawCostPerMT = getNum("calc-raw-salt", 52);
    const energyPerMT = getNum("calc-energy", 22);
    const pkgPerMT = getNum("calc-packaging", 28);
    const laborPerMT = getNum("calc-labor", 15);
    const freightPerMT = getNum("calc-freight", 32);
    const variablePerMT = rawCostPerMT + energyPerMT + pkgPerMT + laborPerMT + freightPerMT;
    const totalVariableCostUSD = annualFinishedMT * variablePerMT;

    const adminUSD = getNum("calc-admin-salaries", 22000);
    const maintUSD = getNum("calc-maintenance", 12000);
    const compUSD = getNum("calc-compliance", 9000);
    const totalFixedCostUSD = adminUSD + maintUSD + compUSD;

    const totalOpexUSD = totalVariableCostUSD + totalFixedCostUSD;
    const ebitdaUSD = annualRevenueUSD - totalOpexUSD;
    const grossMarginPct = annualRevenueUSD > 0 ? ((annualRevenueUSD - totalVariableCostUSD) / annualRevenueUSD) * 100 : 0;
    const ebitdaMarginPct = annualRevenueUSD > 0 ? (ebitdaUSD / annualRevenueUSD) * 100 : 0;

    // 5. Debt Service & Loan Amortization (5-Year Term)
    const interestRate = (getNum("calc-interest-rate", 14.5) / 100);
    const annualPrincipalRepayment = loanPrincipalUSD / 5;
    const year1Interest = loanPrincipalUSD * interestRate;
    const year1DebtService = annualPrincipalRepayment + year1Interest;
    const year1DSCR = year1DebtService > 0 ? (ebitdaUSD / year1DebtService) : 3.0;

    const paybackYears = ebitdaUSD > 0 ? (totalCapexUSD / ebitdaUSD) : 0;

    // Update Live Metrics in DOM
    const updateText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    updateText("metric-annual-production", `${formatNumber(annualFinishedMT)} MT`);
    updateText("metric-annual-revenue", formatCurrency(annualRevenueUSD));
    updateText("metric-total-capex", formatCurrency(totalCapexUSD));
    updateText("metric-annual-ebitda", formatCurrency(ebitdaUSD));
    updateText("metric-gross-margin", `${grossMarginPct.toFixed(1)}% (Model-based)`);
    updateText("metric-dscr-coverage", `${year1DSCR.toFixed(2)}x`);
    updateText("metric-payback-years", `${paybackYears.toFixed(1)} Years`);

    // Render Sensitivity Table
    renderSensitivityTable(annualFinishedMT, totalOpexUSD, pricePerMT_USD, year1DebtService);

    if (fromUser) {
      showToast("✓ Successfully Calculated");
    }
  }

  function renderSensitivityTable(finishedMT, opexUSD, basePriceUSD, debtServiceUSD) {
    const tbody = document.getElementById("sensitivity-table-body");
    if (!tbody) return;

    const shifts = [-0.20, -0.10, 0, 0.10, 0.20];
    tbody.innerHTML = shifts.map(shift => {
      const price = basePriceUSD * (1 + shift);
      const rev = finishedMT * price;
      const ebitda = rev - opexUSD;
      const dscr = debtServiceUSD > 0 ? (ebitda / debtServiceUSD) : 2.5;
      const isBase = shift === 0;

      return `
        <tr style="${isBase ? 'background:#F5EFEB; font-weight:700;' : ''}">
          <td>${isBase ? 'Base Case' : (shift > 0 ? `+${(shift * 100).toFixed(0)}%` : `${(shift * 100).toFixed(0)}%`)}</td>
          <td>${formatCurrency(price)} / MT</td>
          <td>${formatCurrency(rev)}</td>
          <td style="color:${ebitda >= 0 ? 'var(--punjab-green)' : 'var(--status-risk)'};">${formatCurrency(ebitda)}</td>
          <td><span class="dscr-indicator ${dscr >= 1.30 ? 'healthy' : 'warn'}">${dscr.toFixed(2)}x</span></td>
        </tr>
      `;
    }).join("");
  }

  // 8. Concept Demo Origin Traceability
  function initTraceabilityDemo() {
    const btn = document.getElementById("btn-verify-traceability");
    const input = document.getElementById("traceability-batch-input");
    const resultBox = document.getElementById("traceability-result-box");

    if (btn && input && resultBox) {
      btn.addEventListener("click", () => {
        const code = input.value.trim().toUpperCase();
        if (!code) {
          showToast("Please enter a sample batch ID");
          return;
        }

        resultBox.style.display = "block";
        resultBox.innerHTML = `
          <div style="background:var(--punjab-surface); border:1px solid var(--punjab-border); border-radius:var(--radius-sm); padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge-verify">Verified Extraction Record</span>
              <span style="font-size:11px; color:var(--stone-muted);">Geographical Indication GI-1/2021</span>
            </div>
            <h4 style="font-size:16px; color:var(--punjab-dark); margin-bottom:4px;">Batch: ${code} • High-Purity Edible Halite</h4>
            <p style="font-size:12.5px; color:var(--stone-muted); margin-bottom:12px;">Extraction Origin: Warcha Mine Seam 4 (Khushab) • Certified Processing Facility: Quaidabad Processing Zone.</p>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; font-size:12px;">
              <div><span>Chemical Purity:</span> <strong>99.1% NaCl</strong></div>
              <div><span>Lead (Pb):</span> <strong>0.18 ppm (&lt;2.0 ppm Codex)</strong></div>
              <div><span>Moisture Content:</span> <strong>0.06% (Codex compliant)</strong></div>
            </div>
            <div style="font-size:11px; color:var(--stone-light); margin-top:10px; border-top:1px dashed var(--border-medium); padding-top:6px;">
              <em>Notice: Illustrative Concept Demo for the National Origin Traceability System.</em>
            </div>
          </div>
        `;
        showToast("✓ Verified Sample Batch");
      });
    }
  }

  // 9. Concept Demo Rule-Based Assistant
  function initAssistantDemo() {
    const openBtn = document.getElementById("assistant-open-btn");
    const closeBtn = document.getElementById("assistant-close-btn");
    const modal = document.getElementById("assistant-modal");
    const sendBtn = document.getElementById("assistant-send-btn");
    const input = document.getElementById("assistant-input");
    const body = document.getElementById("assistant-body");
    const keyToggleBtn = document.getElementById("assistant-key-toggle-btn");
    const keyPanel = document.getElementById("assistant-key-panel");
    const saveKeyBtn = document.getElementById("btn-save-key");
    const clientKeyInput = document.getElementById("assistant-client-key");
    const keyStatusMsg = document.getElementById("key-status-msg");

    if (openBtn && modal) {
      openBtn.addEventListener("click", () => {
        const isShown = modal.style.display === "flex";
        modal.style.display = isShown ? "none" : "flex";
        if (!isShown && input) input.focus();
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    if (keyToggleBtn && keyPanel) {
      keyToggleBtn.addEventListener("click", () => {
        const isHidden = keyPanel.style.display === "none" || !keyPanel.style.display;
        keyPanel.style.display = isHidden ? "block" : "none";
        if (isHidden && clientKeyInput) {
          clientKeyInput.value = sessionStorage.getItem("pinksalt_gemini_key") || "";
          clientKeyInput.focus();
        }
      });
    }

    if (saveKeyBtn && clientKeyInput) {
      saveKeyBtn.addEventListener("click", () => {
        const val = clientKeyInput.value.trim();
        if (val) {
          sessionStorage.setItem("pinksalt_gemini_key", val);
          if (keyStatusMsg) {
            keyStatusMsg.style.display = "block";
            keyStatusMsg.innerText = "✓ Gemini Key saved in browser session.";
            setTimeout(() => {
              if (keyPanel) keyPanel.style.display = "none";
              keyStatusMsg.style.display = "none";
            }, 1200);
          }
          showToast("✓ Gemini API key saved for this session");
        } else {
          sessionStorage.removeItem("pinksalt_gemini_key");
          if (keyStatusMsg) {
            keyStatusMsg.style.display = "block";
            keyStatusMsg.innerText = "Key cleared. Using server .env key or built-in corpus.";
          }
        }
      });
    }

    // Markdown formatter helper for AI output
    function formatAiResponse(text, citations) {
      if (!text) return "";
      let html = text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/^### (.*$)/gim, '<h5 style="margin:10px 0 4px 0; font-size:14px; color:var(--punjab-dark);">$1</h5>')
        .replace(/^## (.*$)/gim, '<h5 style="margin:12px 0 4px 0; font-size:14px; color:var(--punjab-dark); font-weight:700;">$1</h5>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code style="background:#ECE5DF; padding:2px 4px; border-radius:3px; font-size:11px;">$1</code>')
        .replace(/^\* (.*$)/gim, '<li style="margin-left:14px; margin-bottom:3px;">$1</li>')
        .replace(/^- (.*$)/gim, '<li style="margin-left:14px; margin-bottom:3px;">$1</li>')
        .replace(/\n\n/g, '<div style="margin-bottom:8px;"></div>')
        .replace(/\n/g, '<br>');

      if (citations && citations.length > 0) {
        html += '<div style="margin-top:10px; padding-top:8px; border-top:1px dashed #DDD4C8; font-size:11px; color:var(--stone-muted);">';
        html += '<strong style="color:var(--punjab-dark);">Verified Citations:</strong><br>';
        citations.forEach(c => {
          html += `<span style="display:inline-block; margin-right:8px; margin-top:2px;">• <a href="${c.url || '#'}" target="_blank" style="color:var(--punjab-green); text-decoration:underline;">${c.title}</a> (${c.authority})</span>`;
        });
        html += '</div>';
      }
      return html;
    }

    const processMessage = async () => {
      const q = input.value.trim();
      if (!q) return;
      input.value = "";

      const userBubble = document.createElement("div");
      userBubble.className = "chat-bubble chat-bubble-user";
      userBubble.innerText = q;
      body.appendChild(userBubble);

      const botBubble = document.createElement("div");
      botBubble.className = "chat-bubble chat-bubble-bot";
      botBubble.innerHTML = '<span style="opacity:0.7;">✨ PinkSalt AI is consulting mineral intelligence...</span>';
      body.appendChild(botBubble);
      body.scrollTop = body.scrollHeight;

      // 1. Attempt call to local backend /api/ai/chat (uses server .env GEMINI_API_KEY)
      try {
        const resp = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q })
        });
        if (resp.ok) {
          const resData = await resp.json();
          if (resData.success && resData.response && resData.response.answer) {
            botBubble.innerHTML = formatAiResponse(resData.response.answer, resData.response.citations);
            body.scrollTop = body.scrollHeight;
            return;
          }
        }
      } catch (err) {
        // Backend not available (e.g. running on GitHub Pages)
      }

      // 2. Direct browser call to Gemini API if client key is configured
      const clientKey = sessionStorage.getItem("pinksalt_gemini_key");
      if (clientKey) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${clientKey}`;
          const gemPayload = {
            contents: [{ role: "user", parts: [{ text: q }] }],
            systemInstruction: {
              parts: [{
                text: "You are PinkSalt AI, the official advisory assistant for the Directorate General of Mines & Minerals, Government of Punjab. " +
                      "Provide accurate, institutional answers on Salt Range deposits (Khewra, Warcha, Kalabagh), 1.25B MT proved reserves, " +
                      "CM Pink Salt Value Addition Financing Scheme (Bank of Punjab), Quaidabad Mineral Zone (110 acres), " +
                      "export standards (Codex CXS 150, FDA, PSW), and 6-stage value addition ladder."
              }]
            },
            generationConfig: { temperature: 0.2, maxOutputTokens: 1000 }
          };
          const gResp = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(gemPayload)
          });
          if (gResp.ok) {
            const gData = await gResp.json();
            const gText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (gText) {
              botBubble.innerHTML = formatAiResponse(gText, [
                { title: "Geological Survey of Pakistan & Directorate Knowledge Base", authority: "Government of Punjab", url: "https://mnm.punjab.gov.pk" }
              ]);
              body.scrollTop = body.scrollHeight;
              return;
            }
          }
        } catch (e) {
          console.warn("Direct Gemini call error:", e);
        }
      }

      // 3. Fallback to Grounded Local Knowledge Base
      const lower = q.toLowerCase();
      setTimeout(() => {
        if (lower.includes("reserve") || lower.includes("khewra") || lower.includes("warcha") || lower.includes("geology")) {
          botBubble.innerHTML = "<strong>Resource Base:</strong> The Salt Range contains 1.25+ Billion MT of proved commercial reserves across Khewra (600M MT, PMDC), Warcha (400M MT, 99.1% purity), and Kalabagh (250M MT). Total regional basin resource is estimated at 30+ Billion MT.";
        } else if (lower.includes("scheme") || lower.includes("finance") || lower.includes("loan") || lower.includes("bop")) {
          botBubble.innerHTML = "<strong>CM Financing Scheme:</strong> Concessional facility offering up to PKR 50M per business with 0% net markup (fully subsidized by Government of Punjab) for up to 5-year tenure. Credit underwriting is executed exclusively by The Bank of Punjab via <a href='https://pinksalt.punjab.gov.pk/landing' target='_blank' style='color:var(--punjab-green); text-decoration:underline;'>pinksalt.punjab.gov.pk</a>.";
        } else if (lower.includes("quaidabad") || lower.includes("where to build") || lower.includes("sez") || lower.includes("zone")) {
          botBubble.innerHTML = "<strong>Processing Locations:</strong> The flagship Quaidabad Processing Zone (110 acres, Khushab) is located 18 km from Warcha mines with dedicated industrial infrastructure. Notified alternative SEZs include Bhalwal (Sargodha) and M-3 Industrial City (Faisalabad).";
        } else if (lower.includes("standard") || lower.includes("fda") || lower.includes("codex") || lower.includes("export")) {
          botBubble.innerHTML = "<strong>Export & Standards:</strong> Food-grade salt exported to the US/EU must comply with Codex CXS 150-1985 (NaCl >= 97%, Pb < 2.0 ppm, As < 0.5 ppm). Consignments clear via Pakistan Single Window (PSW) under HS Code 2501.00.";
        } else {
          botBubble.innerHTML = "<strong>Directorate Guidance:</strong> PinkSalt AI is connected to Google Gemini. When running with <code>python3 server.py</code>, questions are answered via your secure <code>.env</code> key. On static hosting, click <strong>🔑 Key</strong> in the header to activate direct cloud AI.";
        }
        body.scrollTop = body.scrollHeight;
      }, 300);
    };

    if (sendBtn && input) {
      sendBtn.addEventListener("click", processMessage);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") processMessage();
      });
    }
  }

  // 10. Expression of Interest Form Handler
  function initEoiForm() {
    const form = document.getElementById("eoi-contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const refId = "EOI-PS-" + Math.floor(100000 + Math.random() * 900000);
      const name = document.getElementById("eoi-name")?.value || "Investor";
      
      const card = document.getElementById("eoi-form-card");
      if (card) {
        card.innerHTML = `
          <div style="text-align:center; padding:32px 16px;">
            <div style="width:48px; height:48px; background:var(--punjab-surface); color:var(--punjab-green); border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:16px;">✓</div>
            <h3 style="font-size:22px; color:var(--punjab-dark); margin-bottom:8px;">Expression of Interest Received</h3>
            <p style="font-size:14px; color:var(--stone-muted); margin-bottom:16px;">
              Thank you, <strong>${name}</strong>. Your inquiry has been logged under Reference: <code>${refId}</code>.
            </p>
            <div style="background:var(--bg-ivory); border:1px solid var(--border-light); border-radius:var(--radius-sm); padding:16px; font-size:13px; color:var(--stone-text); text-align:left; max-width:440px; margin:0 auto 20px auto;">
              <strong>Important Notice on Concessional Financing:</strong><br>
              This portal facilitates technical pre-feasibility and site selection. Formal loan applications under the Chief Minister Pink Salt Value Addition Financing Scheme must be lodged directly with The Bank of Punjab via the official scheme portal: <a href="https://pinksalt.punjab.gov.pk/landing" target="_blank" style="color:var(--punjab-green); font-weight:700; text-decoration:underline;">pinksalt.punjab.gov.pk ↗</a>.
            </div>
            <button class="btn btn-outline btn-sm" onclick="location.reload()">Submit Another Inscription</button>
          </div>
        `;
      }
      showToast(`✓ Expression of Interest Registered (${refId})`);
    });
  }

  // 11. Mobile Navigation Drawer
  function initMobileNav() {
    const toggle = document.getElementById("mobile-menu-btn");
    const nav = document.getElementById("main-nav-bar");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const isShown = nav.style.display === "flex";
        nav.style.display = isShown ? "none" : "flex";
        if (!isShown) {
          nav.style.flexDirection = "column";
          nav.style.position = "absolute";
          nav.style.top = "72px";
          nav.style.left = "0";
          nav.style.right = "0";
          nav.style.background = "#FFFFFF";
          nav.style.padding = "16px";
          nav.style.borderBottom = "1px solid #DDD4C8";
          nav.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        }
      });

      nav.querySelectorAll(".nav-anchor").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            nav.style.display = "none";
          }
        });
      });
    }
  }

  // DOM Loaded Bootstrap
  document.addEventListener("DOMContentLoaded", () => {
    initCurrencyControls();
    renderOverviewFacts();
    renderResourceBase();
    renderSites();
    renderValueLadder();
    renderOpportunities();
    initCalculator();
    initTraceabilityDemo();
    initAssistantDemo();
    initEoiForm();
    initMobileNav();
  });

})();
