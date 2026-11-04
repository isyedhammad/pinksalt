"""
PinkSalt Intelligence & Investment Portal
Financial Modeling Engine

Provides deterministic, auditable calculations for preliminary investment economics,
operational expenditures, revenues, break-even thresholds, and multi-variable sensitivity analysis.
"""

from typing import Dict, Any, List


def calculate_feasibility(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes preliminary project economics based on user-supplied assumptions.
    All formulas are documented, deterministic, and protected against zero division.
    """
    # 1. Capital Expenditure (CAPEX)
    machinery_cost = max(0.0, float(params.get("machinery_cost", 150000)))  # USD
    land_building_cost = max(0.0, float(params.get("land_building_cost", 100000)))  # USD
    installation_cost = max(0.0, float(params.get("installation_cost", 25000)))  # USD
    initial_working_capital = max(0.0, float(params.get("working_capital", 35000)))  # USD
    
    total_capex = machinery_cost + land_building_cost + installation_cost + initial_working_capital

    # 2. Production Parameters
    nameplate_capacity_tpd = max(0.1, float(params.get("capacity_tpd", 25.0)))  # Tonnes per operating day
    operating_days = max(1.0, min(365.0, float(params.get("operating_days", 300.0))))  # Days per year
    capacity_utilization = max(0.05, min(1.0, float(params.get("capacity_utilization", 0.75))))  # 75% default
    process_yield = max(0.1, min(1.0, float(params.get("process_yield", 0.92))))  # 92% recovery after grading/loss

    # Annual Input Salt Needed
    annual_raw_salt_tonnes = nameplate_capacity_tpd * operating_days * capacity_utilization
    # Finished Product Output
    annual_finished_production_tonnes = annual_raw_salt_tonnes * process_yield

    # 3. Variable Costs (Per Tonne of Finished Product)
    raw_salt_cost_per_tonne = max(0.0, float(params.get("raw_salt_cost_per_tonne", 45.0)))  # Raw rock salt delivered
    # Effective raw material cost per finished tonne accounts for yield loss
    effective_raw_material_cost_per_tonne = raw_salt_cost_per_tonne / process_yield if process_yield > 0 else raw_salt_cost_per_tonne

    energy_cost_per_tonne = max(0.0, float(params.get("energy_cost_per_tonne", 28.0)))  # Power/fuel for crushing, drying
    packaging_cost_per_tonne = max(0.0, float(params.get("packaging_cost_per_tonne", 40.0)))  # Food-grade pouches/boxes/pallets
    freight_to_port_per_tonne = max(0.0, float(params.get("freight_per_tonne", 35.0)))  # Inland logistics to Karachi Port/Qasim
    direct_labor_per_tonne = max(0.0, float(params.get("labor_cost_per_tonne", 22.0)))  # Operational plant workforce

    # Washing and Cleaning processing parameters
    washing_required = bool(params.get("washing_required", False))
    washing_water_cost_per_tonne = max(0.0, float(params.get("washing_water_cost_per_tonne", 6.5))) if washing_required else 0.0
    washing_effluent_cost_per_tonne = max(0.0, float(params.get("washing_effluent_cost_per_tonne", 3.0))) if washing_required else 0.0
    drying_energy_cost_per_tonne = max(0.0, float(params.get("drying_energy_cost_per_tonne", 12.0))) if washing_required else 0.0
    total_washing_cost_per_tonne = washing_water_cost_per_tonne + washing_effluent_cost_per_tonne + drying_energy_cost_per_tonne

    # Testing & Quality Control parameters
    annual_lab_testing_cost = max(0.0, float(params.get("annual_lab_testing_cost", 6000.0)))

    variable_cost_per_tonne = (
        effective_raw_material_cost_per_tonne +
        energy_cost_per_tonne +
        packaging_cost_per_tonne +
        freight_to_port_per_tonne +
        direct_labor_per_tonne +
        total_washing_cost_per_tonne
    )
    annual_variable_costs = variable_cost_per_tonne * annual_finished_production_tonnes

    # 4. Fixed Costs (Annual)
    admin_management_salaries = max(0.0, float(params.get("annual_admin_salaries", 36000.0)))
    maintenance_spares = max(0.0, float(params.get("annual_maintenance", 18000.0)))  # 12% of machinery or fixed allocation
    insurance_and_security = max(0.0, float(params.get("annual_insurance", 8000.0)))
    marketing_regulatory_compliance = max(0.0, float(params.get("annual_compliance_marketing", 12000.0)))  # Certifications (ISO, Halal, FDA)
    depreciation_machinery = machinery_cost * 0.10  # 10-year straight line (indicative)
    
    annual_fixed_costs = (
        admin_management_salaries +
        maintenance_spares +
        insurance_and_security +
        marketing_regulatory_compliance +
        depreciation_machinery +
        annual_lab_testing_cost
    )

    # 5. Total Annual Operating Expenditure (OPEX)
    total_annual_opex = annual_variable_costs + annual_fixed_costs
    cost_per_tonne_finished = total_annual_opex / annual_finished_production_tonnes if annual_finished_production_tonnes > 0 else 0.0

    # 6. Revenue & Operating Profit (EBITDA / Operating Income)
    selling_price_fob_per_tonne = max(0.0, float(params.get("selling_price_per_tonne", 320.0)))  # Value-added FOB Karachi
    annual_revenue = annual_finished_production_tonnes * selling_price_fob_per_tonne

    # Operating Profit before interest and corporate income tax
    operating_profit = annual_revenue - total_annual_opex
    operating_margin_pct = (operating_profit / annual_revenue * 100.0) if annual_revenue > 0 else 0.0

    # 7. Break-Even Analysis
    # Contribution Margin per Tonne = Selling Price - Variable Cost per Tonne
    unit_contribution_margin = selling_price_fob_per_tonne - variable_cost_per_tonne
    
    if unit_contribution_margin > 0:
        breakeven_volume_tonnes = annual_fixed_costs / unit_contribution_margin
        breakeven_capacity_utilization_pct = (
            (breakeven_volume_tonnes / (nameplate_capacity_tpd * operating_days * process_yield)) * 100.0
            if (nameplate_capacity_tpd * operating_days * process_yield) > 0 else 0.0
        )
    else:
        breakeven_volume_tonnes = float("inf")
        breakeven_capacity_utilization_pct = float("inf")

    # Break-even Selling Price (Price required to cover all fixed and variable costs at current volume)
    breakeven_selling_price_per_tonne = cost_per_tonne_finished

    # Estimated Simple Payback Period (CAPEX / Annual Operating Cash Flow approximation)
    payback_years = (total_capex / (operating_profit + depreciation_machinery)) if (operating_profit + depreciation_machinery) > 0 else 99.9

    # 8. Monthly Breakdown
    monthly_summary = {
        "production_tonnes": round(annual_finished_production_tonnes / 12.0, 1),
        "revenue_usd": round(annual_revenue / 12.0, 2),
        "variable_costs_usd": round(annual_variable_costs / 12.0, 2),
        "fixed_costs_usd": round(annual_fixed_costs / 12.0, 2),
        "total_opex_usd": round(total_annual_opex / 12.0, 2),
        "operating_profit_usd": round(operating_profit / 12.0, 2),
    }

    # 9. Sensitivity Analysis Matrix
    variations = [-0.20, -0.10, 0.0, 0.10, 0.20]
    sensitivity = {
        "selling_price": [],
        "raw_salt_cost": [],
        "energy_cost": [],
        "capacity_utilization": []
    }

    for v in variations:
        adj_price = selling_price_fob_per_tonne * (1.0 + v)
        adj_rev = annual_finished_production_tonnes * adj_price
        sensitivity["selling_price"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_price, 2),
            "annual_operating_profit": round(adj_rev - total_annual_opex, 2),
            "margin_pct": round(((adj_rev - total_annual_opex) / adj_rev * 100.0) if adj_rev > 0 else 0.0, 1)
        })

        adj_raw_cost = raw_salt_cost_per_tonne * (1.0 + v)
        adj_var_cost = (
            (adj_raw_cost / process_yield if process_yield > 0 else adj_raw_cost) +
            energy_cost_per_tonne + packaging_cost_per_tonne + freight_to_port_per_tonne + direct_labor_per_tonne + total_washing_cost_per_tonne
        )
        adj_opex = (adj_var_cost * annual_finished_production_tonnes) + annual_fixed_costs
        sensitivity["raw_salt_cost"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_raw_cost, 2),
            "annual_operating_profit": round(annual_revenue - adj_opex, 2),
            "margin_pct": round(((annual_revenue - adj_opex) / annual_revenue * 100.0) if annual_revenue > 0 else 0.0, 1)
        })

        adj_energy_cost = energy_cost_per_tonne * (1.0 + v)
        adj_var_cost_e = (
            effective_raw_material_cost_per_tonne +
            adj_energy_cost + packaging_cost_per_tonne + freight_to_port_per_tonne + direct_labor_per_tonne + total_washing_cost_per_tonne
        )
        adj_opex_e = (adj_var_cost_e * annual_finished_production_tonnes) + annual_fixed_costs
        sensitivity["energy_cost"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_energy_cost, 2),
            "annual_operating_profit": round(annual_revenue - adj_opex_e, 2),
            "margin_pct": round(((annual_revenue - adj_opex_e) / annual_revenue * 100.0) if annual_revenue > 0 else 0.0, 1)
        })

    util_levels = [0.50, 0.65, 0.75, 0.85, 0.95]
    for u in util_levels:
        prod_u = (nameplate_capacity_tpd * operating_days * u) * process_yield
        rev_u = prod_u * selling_price_fob_per_tonne
        opex_u = (variable_cost_per_tonne * prod_u) + annual_fixed_costs
        profit_u = rev_u - opex_u
        sensitivity["capacity_utilization"].append({
            "utilization_pct": int(u * 100),
            "annual_production_tonnes": round(prod_u, 1),
            "annual_revenue": round(rev_u, 2),
            "annual_operating_profit": round(profit_u, 2),
            "margin_pct": round((profit_u / rev_u * 100.0) if rev_u > 0 else 0.0, 1)
        })

    # 10. Five-Year Loan Amortization Schedule (Reducing Balance)
    equity_ratio = max(0.10, min(1.0, float(params.get("equity_ratio", 0.40))))  # 40% equity default
    loan_amount = float(params.get("loan_amount", total_capex * (1.0 - equity_ratio)))
    loan_amount = max(0.0, loan_amount)
    equity_amount = total_capex - loan_amount
    annual_markup_rate = max(0.01, min(0.40, float(params.get("annual_markup_rate", 0.145))))  # 14.5% annual markup
    loan_tenure_years = 5
    monthly_markup_rate = annual_markup_rate / 12.0
    total_months = loan_tenure_years * 12

    if loan_amount > 0 and monthly_markup_rate > 0:
        monthly_instalment = loan_amount * (monthly_markup_rate * (1.0 + monthly_markup_rate) ** total_months) / (((1.0 + monthly_markup_rate) ** total_months) - 1.0)
    else:
        monthly_instalment = 0.0

    # Build 5-Year Loan Amortization table
    loan_schedule = []
    current_balance = loan_amount
    for y in range(1, loan_tenure_years + 1):
        year_interest = 0.0
        year_principal = 0.0
        for m in range(12):
            if current_balance <= 0:
                break
            interest_m = current_balance * monthly_markup_rate
            principal_m = min(current_balance, monthly_instalment - interest_m)
            year_interest += interest_m
            year_principal += principal_m
            current_balance -= principal_m

        year_debt_service = year_principal + year_interest
        loan_schedule.append({
            "year": y,
            "opening_balance": round(current_balance + year_principal, 2),
            "principal_repayment": round(year_principal, 2),
            "interest_payment": round(year_interest, 2),
            "total_debt_service": round(year_debt_service, 2),
            "closing_balance": round(max(0.0, current_balance), 2)
        })

    total_financing_cost = sum(item["interest_payment"] for item in loan_schedule)
    total_debt_service_overall = loan_amount + total_financing_cost

    # 11. Five-Year Comprehensive Financial Projection (Years 1 to 5)
    # Check if SMEDA official ramp & assumptions apply (Category 4 or explicit flag)
    is_smeda_mode = bool(params.get("use_smeda_assumptions") or params.get("applicant_category") == "export_oriented")
    if is_smeda_mode:
        # Table 25: 50% in Year 1 with 10% annual utilization growth up to 90% in Year 5
        ramp_multipliers = [0.50, 0.60, 0.70, 0.80, 0.90]
        # Table 23 & 24: 10% annual escalation growth rate
        inflation_rate = 0.10
    else:
        ramp_multipliers = [
            min(1.0, max(0.3, capacity_utilization * 0.85)),  # Y1 ramp-up
            capacity_utilization,                              # Y2 base
            min(1.0, capacity_utilization * 1.10),             # Y3 maturity
            min(1.0, capacity_utilization * 1.15),             # Y4 peak
            min(1.0, capacity_utilization * 1.18)              # Y5 steady
        ]
        inflation_rate = 0.05
    tax_rate = 0.20        # 20% indicative corporate/SME tax on EBT

    five_year_projection = []
    for idx, util_rate in enumerate(ramp_multipliers):
        year_num = idx + 1
        escalation = (1.0 + inflation_rate) ** idx
        y_price = selling_price_fob_per_tonne * escalation
        y_var_cost = variable_cost_per_tonne * escalation
        y_fixed_cost = annual_fixed_costs * escalation

        y_raw_salt_tonnes = nameplate_capacity_tpd * operating_days * util_rate
        y_prod_tonnes = y_raw_salt_tonnes * process_yield
        y_revenue = y_prod_tonnes * y_price
        y_opex = (y_var_cost * y_prod_tonnes) + y_fixed_cost
        y_ebitda = y_revenue - y_opex
        y_depreciation = depreciation_machinery
        y_ebit = y_ebitda - y_depreciation

        y_interest = loan_schedule[idx]["interest_payment"] if idx < len(loan_schedule) else 0.0
        y_principal = loan_schedule[idx]["principal_repayment"] if idx < len(loan_schedule) else 0.0
        y_debt_service = y_interest + y_principal

        y_ebt = max(0.0, y_ebit - y_interest)
        y_tax = y_ebt * tax_rate
        y_net_profit = y_ebt - y_tax
        y_free_cash_flow = (y_ebitda - y_interest - y_tax) - y_principal

        # DSCR = EBITDA / Total Debt Service
        dscr = (y_ebitda / y_debt_service) if y_debt_service > 0 else 99.0

        five_year_projection.append({
            "year": year_num,
            "capacity_utilization_pct": round(util_rate * 100.0, 1),
            "production_tonnes": round(y_prod_tonnes, 1),
            "revenue": round(y_revenue, 2),
            "operating_costs": round(y_opex, 2),
            "ebitda": round(y_ebitda, 2),
            "depreciation": round(y_depreciation, 2),
            "ebit": round(y_ebit, 2),
            "interest_expense": round(y_interest, 2),
            "profit_before_tax": round(y_ebt, 2),
            "tax": round(y_tax, 2),
            "net_profit": round(y_net_profit, 2),
            "principal_repayment": round(y_principal, 2),
            "total_debt_service": round(y_debt_service, 2),
            "free_cash_flow": round(y_free_cash_flow, 2),
            "dscr": round(dscr, 2),
            "dscr_status": "Healthy" if dscr >= 1.30 else ("Acceptable" if dscr >= 1.0 else "Deficit Risk")
        })

    # PKR Currency Equivalent (USD to PKR benchmark = 280.0)
    pkr_rate = float(params.get("pkr_usd_rate", 280.0))
    pkr_summary = {
        "pkr_rate": pkr_rate,
        "total_capex_pkr": round(total_capex * pkr_rate, 0),
        "machinery_cost_pkr": round(machinery_cost * pkr_rate, 0),
        "annual_revenue_pkr": round(annual_revenue * pkr_rate, 0),
        "annual_opex_pkr": round(total_annual_opex * pkr_rate, 0),
        "annual_operating_profit_pkr": round(operating_profit * pkr_rate, 0),
        "loan_amount_pkr": round(loan_amount * pkr_rate, 0),
        "equity_amount_pkr": round(equity_amount * pkr_rate, 0),
        "monthly_instalment_pkr": round(monthly_instalment * pkr_rate, 0)
    }

    # Calculate Automated Bankability Score (0 - 100)
    avg_dscr = sum(p["dscr"] for p in five_year_projection) / len(five_year_projection) if five_year_projection else 0.0
    equity_pct = (equity_amount / total_capex * 100.0) if total_capex > 0 else 100.0
    
    # 1. DSCR Score (Max 40 pts)
    if avg_dscr >= 2.0:
        dscr_score = 40
    elif avg_dscr >= 1.5:
        dscr_score = 35
    elif avg_dscr >= 1.3:
        dscr_score = 30
    elif avg_dscr >= 1.0:
        dscr_score = 18
    else:
        dscr_score = 5

    # 2. Payback Score (Max 25 pts)
    if payback_years <= 3.0:
        payback_score = 25
    elif payback_years <= 4.5:
        payback_score = 20
    elif payback_years <= 6.0:
        payback_score = 12
    else:
        payback_score = 5

    # 3. Equity Contribution Score (Max 20 pts)
    if equity_pct >= 40.0:
        equity_score = 20
    elif equity_pct >= 30.0:
        equity_score = 16
    elif equity_pct >= 20.0:
        equity_score = 10
    else:
        equity_score = 4

    # 4. Operating Margin Score (Max 15 pts)
    if operating_margin_pct >= 35.0:
        margin_score = 15
    elif operating_margin_pct >= 20.0:
        margin_score = 12
    elif operating_margin_pct >= 10.0:
        margin_score = 7
    else:
        margin_score = 2

    bankability_score = min(100, max(10, dscr_score + payback_score + equity_score + margin_score))

    if bankability_score >= 85:
        rating_tier = "Class A - Highly Bankable"
        rating_desc = "Optimal loan eligibility for State Bank of Pakistan (SBP) SME Refinancing and BOP Mineral Facilities. Strong debt coverage and rapid payback."
    elif bankability_score >= 70:
        rating_tier = "Class B - Bankable"
        rating_desc = "Solid commercial feasibility meeting standard industrial bank underwriting criteria. Standard equipment hypothecation applicable."
    elif bankability_score >= 55:
        rating_tier = "Class C - Moderate Viability"
        rating_desc = "Feasible operation; commercial lenders may require 35-40% sponsor equity or supplementary immovable collateral."
    else:
        rating_tier = "Class D - High Risk / Restructuring Needed"
        rating_desc = "Debt service coverage or profit margins are tight. Recommend reducing initial CAPEX, increasing equity, or expanding sales price."

    applicant_category_key = str(params.get("applicant_category", "medium_manufacturing"))
    category_advice_map = {
        "small_packaging": "Ideal for micro & small entrepreneurs. Focus on food-grade packaging hygiene (PSQCA 1669:2008) and retail barcode distribution. Low fixed overhead allows fast breakeven.",
        "medium_manufacturing": "Standard industrial salt processing unit. Ensure proper wastewater sedimentation for the washing circuit and reliable 3-phase grid power (50-100 kVA transformer).",
        "value_added_products": "High gross margin artisan production (lamps, tiles, spa salts). Prioritize skilled lathe craftsmanship, moisture-proof shrink wrapping, and CE/UL certified electrical fittings for export.",
        "export_oriented": "Full-scale corporate exporter benchmarked against SMEDA Dec 2023 Study #220. Meets eligibility for SBP Export Refinance Scheme (ERF). Requires ISO 22000, HACCP, Halal, and FDA compliance."
    }

    automated_assessment = {
        "bankability_score": bankability_score,
        "rating_tier": rating_tier,
        "rating_description": rating_desc,
        "applicant_category": applicant_category_key,
        "category_advice": category_advice_map.get(applicant_category_key, category_advice_map["medium_manufacturing"]),
        "average_dscr": round(avg_dscr, 2),
        "dscr_status": "Healthy" if avg_dscr >= 1.30 else ("Acceptable" if avg_dscr >= 1.0 else "Deficit Risk"),
        "equity_percentage": round(equity_pct, 1),
        "loan_percentage": round(100.0 - equity_pct, 1),
        "estimated_payback_years": round(payback_years, 2) if payback_years < 50 else 99.0,
        "monthly_emi_pkr": round(monthly_instalment * pkr_rate, 0),
        "recommended_schemes": [
            "SBP Refinance Facility for Modernization of SMEs (SME-RFM)",
            "Bank of Punjab (BOP) Mineral Sector Financing Line",
            "SBP Export Refinance Facility (Part I & II) for Export Units",
            "Punjab Small Industries Corporation (PSIC) Micro-Enterprise Credit"
        ]
    }

    return {
        "capex": {
            "machinery_cost": machinery_cost,
            "land_building_cost": land_building_cost,
            "installation_cost": installation_cost,
            "working_capital": initial_working_capital,
            "total_capex": round(total_capex, 2)
        },
        "production": {
            "nameplate_capacity_tpd": nameplate_capacity_tpd,
            "operating_days": int(operating_days),
            "capacity_utilization_pct": round(capacity_utilization * 100.0, 1),
            "process_yield_pct": round(process_yield * 100.0, 1),
            "annual_raw_salt_tonnes": round(annual_raw_salt_tonnes, 1),
            "annual_finished_production_tonnes": round(annual_finished_production_tonnes, 1)
        },
        "opex": {
            "raw_salt_cost_per_tonne": raw_salt_cost_per_tonne,
            "effective_raw_material_cost_per_tonne": round(effective_raw_material_cost_per_tonne, 2),
            "energy_cost_per_tonne": energy_cost_per_tonne,
            "packaging_cost_per_tonne": packaging_cost_per_tonne,
            "freight_per_tonne": freight_to_port_per_tonne,
            "labor_cost_per_tonne": direct_labor_per_tonne,
            "washing_cost_per_tonne": round(total_washing_cost_per_tonne, 2),
            "variable_cost_per_tonne": round(variable_cost_per_tonne, 2),
            "annual_variable_costs": round(annual_variable_costs, 2),
            "annual_fixed_costs": round(annual_fixed_costs, 2),
            "total_annual_opex": round(total_annual_opex, 2),
            "total_cost_per_tonne_finished": round(cost_per_tonne_finished, 2)
        },
        "financial_returns": {
            "selling_price_fob_per_tonne": selling_price_fob_per_tonne,
            "annual_revenue": round(annual_revenue, 2),
            "annual_operating_profit": round(operating_profit, 2),
            "operating_margin_pct": round(operating_margin_pct, 2),
            "unit_contribution_margin": round(unit_contribution_margin, 2),
            "breakeven_volume_tonnes": round(breakeven_volume_tonnes, 1) if breakeven_volume_tonnes != float("inf") else -1,
            "breakeven_capacity_utilization_pct": round(breakeven_capacity_utilization_pct, 1) if breakeven_capacity_utilization_pct != float("inf") else -1,
            "breakeven_selling_price_per_tonne": round(breakeven_selling_price_per_tonne, 2),
            "estimated_payback_years": round(payback_years, 2) if payback_years < 50 else 99.0
        },
        "monthly_summary": monthly_summary,
        "sensitivity": sensitivity,
        "five_year_projection": five_year_projection,
        "loan_amortization": {
            "loan_amount": round(loan_amount, 2),
            "equity_amount": round(equity_amount, 2),
            "annual_markup_rate_pct": round(annual_markup_rate * 100.0, 2),
            "tenure_years": loan_tenure_years,
            "monthly_instalment": round(monthly_instalment, 2),
            "annual_debt_service": round(monthly_instalment * 12.0, 2),
            "total_financing_cost": round(total_financing_cost, 2),
            "total_debt_service_overall": round(total_debt_service_overall, 2),
            "schedule": loan_schedule
        },
        "pkr_summary": pkr_summary,
        "automated_assessment": automated_assessment,
        "smeda_key_assumptions": SMEDA_BENCHMARK_CASE_STUDY["key_assumptions"],
        "smeda_cash_flow_statement": SMEDA_BENCHMARK_CASE_STUDY["audited_5_year_cash_flow"],
        "disclaimer": (
            "NOTICE: This preliminary model provides computational estimates for project evaluation "
            "and does not constitute an officially certified Bankable Feasibility Study, geological reserve report, "
            "or guarantee of commercial profitability. Figures reflect user inputs and indicative market parameters."
        )
    }


# ==============================================================================
# OFFICIAL SMEDA BENCHMARK CASE STUDY (Document No. 220, December 2023)
# ==============================================================================
SMEDA_BENCHMARK_CASE_STUDY = {
    "source_title": "Pre-Feasibility Study: Pink Salt Manufacturing and Export Unit",
    "document_number": "SMEDA Pre-Feasibility Document No. 220",
    "authority": "Small and Medium Enterprises Development Authority (SMEDA), Ministry of Industries & Production, Government of Pakistan",
    "publication_date": "December 2023",
    "legal_structure": "Private Limited Company",
    "target_location": "Salt Range Mineral Corridor (Khewra, Warcha, Kalabagh)",
    "operational_parameters": {
        "operating_days_per_year": 280,
        "shifts_per_day": 1,
        "hours_per_shift": 8,
        "workforce_headcount": 43,
        "annual_installed_edible_salt_tonnes": 14000.0,
        "annual_installed_decorative_lamps": 81312,
        "annual_installed_decorative_tiles": 121968,
        "annual_installed_soap_spa_bars": 813120,
        "annual_installed_animal_lick_blocks": 203280
    },
    "capital_costs_pkr": {
        "land_acquisition_3_2_kanal": 3840000,
        "building_civil_works": 36283250,
        "machinery_edible_salt_ss304": 25412000,
        "machinery_decorative_products": 5776000,
        "total_plant_machinery": 31188000,
        "furniture_fixtures": 1852000,
        "office_equipment_it": 2407000,
        "vehicles": 4504600,
        "pre_operating_costs": 6057164,
        "total_capital_cost": 86132014,
        "initial_working_capital": 8860696,
        "total_project_cost": 94992710
    },
    "project_economics": {
        "irr_100_percent_equity": 0.29,
        "npv_100_percent_equity_pkr": 49945487,
        "payback_years_100_percent_equity": 4.10,
        "discount_rate": 0.20,
        "irr_50_percent_debt": 0.25,
        "npv_50_percent_debt_pkr": 130885496,
        "payback_years_50_percent_debt": 4.63,
        "debt_markup_rate": 0.26,
        "year_1_breakeven_revenue_pkr": 209150000,
        "year_1_margin_of_safety": 0.23,
        "year_5_margin_of_safety": 0.45
    },
    "key_assumptions": {
        "table_23_operating_costs": {
            "title": "Table 23: Operating Cost Assumptions",
            "operating_costs_growth_rate": "10% of general inflation rate",
            "admin_benefits_expense": "10% of administration expenses",
            "utilities_direct": "59% of power consumption",
            "utilities_indirect": "41% of power consumption",
            "water_expenses": "5% of administration expenses",
            "travel_expenses": "10% of administration expenses",
            "communication_expenses": "2% of administration expenses",
            "vehicle_running_expenses": "5% of administration expenses",
            "promotional_expense": "0.50% of revenue",
            "office_expenses": "10% of administration expenses",
            "professional_fees": "5% of administration expenses",
            "bad_debt_expense": "0.50% of revenue",
            "machinery_insurance_rate": "1.50%",
            "vehicle_insurance_rate": "2.00%"
        },
        "table_24_production_costs": {
            "title": "Table 24: Production Cost Assumptions",
            "cogs_growth_rate": "10% per annum",
            "edible_salt_rock_raw_per_ton_pkr": 16000,
            "lamps_decorative_rock_per_unit_pkr": 230,
            "lamps_decorative_other_materials_per_unit_pkr": 320,
            "soap_spa_rock_per_unit_pkr": 6,
            "tiles_rock_per_unit_pkr": 90,
            "animal_lick_rock_per_unit_pkr": 150,
            "animal_lick_other_materials_per_unit_pkr": 15,
            "packing_edible_per_ton_pkr": 1250,
            "packing_other_per_unit_pkr": 10
        },
        "table_25_revenue_assumptions": {
            "title": "Table 25: Revenue Assumptions",
            "sale_price_growth_rate": "10% per annum",
            "initial_capacity_utilization": "50% (Year 1)",
            "capacity_utilization_growth_rate": "10% per annum",
            "maximum_capacity_utilization": "90% (Year 5)",
            "ramp_schedule": ["Year 1: 50%", "Year 2: 60%", "Year 3: 70%", "Year 4: 80%", "Year 5: 90%"]
        },
        "table_26_financial_assumptions": {
            "title": "Table 26: Financial & Trade Assumptions",
            "domestic_sales_proportion": "20%",
            "export_sales_proportion": "80%",
            "export_sales_growth_rate": "5% per annum",
            "export_refinancing_rate": "3% per annum (SBP ERF)",
            "export_refinancing_payments_per_year": 12,
            "project_life_years": 10,
            "debt_equity_ratio": "0:100 (Equity) or 50:50 (Financed)",
            "discount_rate_for_npv": "20%"
        }
    },
    "audited_5_year_cash_flow": [
        {"metric": "Net Profit", "year_0": "-", "year_1": 10219520, "year_2": 11606340, "year_3": 24171419, "year_4": 38988245, "year_5": 54118877, "is_bold": True},
        {"metric": "Add: Depreciation Expense", "year_0": "-", "year_1": 9621065, "year_2": 9621065, "year_3": 9621065, "year_4": 9621065, "year_5": 9621065, "is_bold": False},
        {"metric": "Add: Amortization of Pre-Operating Costs", "year_0": "-", "year_1": 1211433, "year_2": 1211433, "year_3": 1211433, "year_4": 1211433, "year_5": 1211433, "is_bold": False},
        {"metric": "Accounts Receivable", "year_0": "-", "year_1": -7400621, "year_2": -1184099, "year_3": -2568015, "year_4": -2995771, "year_5": -3483398, "is_bold": False},
        {"metric": "Finished Goods Inventory", "year_0": "-", "year_1": -8953163, "year_2": -2551801, "year_3": -2981750, "year_4": -3473663, "year_5": -4035953, "is_bold": False},
        {"metric": "Equipment Spare Inventory", "year_0": -220915, "year_1": 7225, "year_2": 16480, "year_3": 28746, "year_4": 44793, "year_5": 65566, "is_bold": False},
        {"metric": "Raw Material Inventory", "year_0": -7081869, "year_1": -3201005, "year_2": -4233117, "year_3": -5557551, "year_4": -7251567, "year_5": -5738273, "is_bold": False},
        {"metric": "Advance Insurance Premium", "year_0": -557912, "year_1": 83687, "year_2": 83687, "year_3": 83687, "year_4": 83687, "year_5": 83687, "is_bold": False},
        {"metric": "Accounts Payable", "year_0": 6210734, "year_1": 1903888, "year_2": 2238587, "year_3": 2625198, "year_4": 2971088, "year_5": 1709527, "is_bold": False},
        {"metric": "Cash Provided by Operations", "year_0": -7860696, "year_1": 7798874, "year_2": 16473875, "year_3": 26247621, "year_4": 38853420, "year_5": 54814092, "is_bold": True},
        {"metric": "Issuance of Shares (Equity)", "year_0": 94992710, "year_1": "-", "year_2": "-", "year_3": "-", "year_4": "-", "year_5": "-", "is_bold": False},
        {"metric": "Cash Provided by Financing", "year_0": 94992710, "year_1": "-", "year_2": "-", "year_3": "-", "year_4": "-", "year_5": "-", "is_bold": True},
        {"metric": "Capital Expenditure (CAPEX)", "year_0": -86132014, "year_1": "-", "year_2": "-", "year_3": "-", "year_4": "-", "year_5": "-", "is_bold": False},
        {"metric": "Cash Used in Investing Activities", "year_0": -86132014, "year_1": "-", "year_2": "-", "year_3": "-", "year_4": "-", "year_5": "-", "is_bold": True},
        {"metric": "NET CASH FLOW", "year_0": 1000000, "year_1": 7798874, "year_2": 16473875, "year_3": 26247621, "year_4": 38853420, "year_5": 54814092, "is_bold": True},
        {"metric": "Closing Cash & Bank Balance", "year_0": 1000000, "year_1": 3689114, "year_2": 11804940, "year_3": 21787827, "year_4": 33014757, "year_5": 46956166, "is_bold": True}
    ]
}


# ==============================================================================
# 4 APPLICANT BUSINESS CATEGORIES PRESETS
# ==============================================================================
APPLICANT_CATEGORIES = {
    "small_packaging": {
        "id": "small_packaging",
        "name": "Small-Scale Packaging Unit",
        "activities": "Grinding, grading, packing and labelling",
        "target_applicant": "Micro and small entrepreneurs, local packagers, women-led enterprises, retail brands",
        "typical_investment_range_pkr": "PKR 50 Lakh to PKR 1.5 Crore",
        "indicative_total_capex_usd": 32500,  # ~PKR 9.1M
        "machinery_cost_usd": 18000,
        "land_building_cost_usd": 8000,
        "installation_cost_usd": 1500,
        "working_capital_usd": 5000,
        "capacity_tpd": 8.0,
        "operating_days": 280,
        "capacity_utilization": 0.75,
        "process_yield": 0.95,
        "washing_required": False,
        "raw_salt_cost_per_tonne": 40.0,
        "energy_cost_per_tonne": 18.0,
        "packaging_cost_per_tonne": 45.0,
        "freight_per_tonne": 25.0,
        "labor_cost_per_tonne": 18.0,
        "annual_admin_salaries": 12000,
        "annual_maintenance": 1200,
        "annual_insurance": 1000,
        "annual_compliance_marketing": 3500,
        "selling_price_per_tonne": 340.0,
        "default_equity_pct": 30.0,
        "default_loan_pct": 70.0,
        "key_machinery": [
            "Hammer mill micro-pulverizer (SS 304)",
            "Vibrating multi-deck grading sieve",
            "Semi-automatic auger pouch filling & sealing machine",
            "Continuous band sealer with batch coding & date embossing",
            "Digital bench scale & carton tape dispenser"
        ],
        "products_manufactured": "Food-grade fine culinary salt (250g, 500g, 1kg pouches), coarse grinder pouches, branded shaker jars",
        "regulatory_certifications": ["PSQCA 1669:2008 Standard", "Punjab Food Authority (PFA) Food Operator License", "FBR Sales Tax & NTN Registration"]
    },
    "medium_manufacturing": {
        "id": "medium_manufacturing",
        "name": "Medium-Scale Manufacturing Unit",
        "activities": "Washing, crushing, grinding, processing and packaging",
        "target_applicant": "Commercial mineral processors, regional wholesalers, salt millers, institutional contractors",
        "typical_investment_range_pkr": "PKR 2.0 Crore to PKR 5.0 Crore",
        "indicative_total_capex_usd": 135000,  # ~PKR 37.8M
        "machinery_cost_usd": 75000,
        "land_building_cost_usd": 35000,
        "installation_cost_usd": 8000,
        "working_capital_usd": 17000,
        "capacity_tpd": 30.0,
        "operating_days": 300,
        "capacity_utilization": 0.80,
        "process_yield": 0.92,
        "washing_required": True,
        "raw_salt_cost_per_tonne": 38.0,
        "energy_cost_per_tonne": 32.0,
        "packaging_cost_per_tonne": 42.0,
        "freight_per_tonne": 30.0,
        "labor_cost_per_tonne": 20.0,
        "annual_admin_salaries": 28000,
        "annual_maintenance": 3800,
        "annual_insurance": 3000,
        "annual_compliance_marketing": 7500,
        "selling_price_per_tonne": 360.0,
        "default_equity_pct": 35.0,
        "default_loan_pct": 65.0,
        "key_machinery": [
            "Primary heavy jaw crusher",
            "Rotary wet washing cylinder & hydro-cyclone",
            "Continuous spin centrifuge & fluidized bed dryer",
            "High-output roller mill / disintegrator",
            "Double-deck high-mesh vibrating sifter",
            "Automatic Form-Fill-Seal (FFS) packaging line"
        ],
        "products_manufactured": "Washed fine table salt, coarse gourmet salt, granular salt, 5kg/25kg bags",
        "regulatory_certifications": ["PSQCA 1669:2008", "PFA Commercial License", "Punjab EPD Wastewater NOC", "ISO 9001:2015"]
    },
    "value_added_products": {
        "id": "value_added_products",
        "name": "Value-Added Product Manufacturing",
        "activities": "Salt lamps, tiles, bath salts, decorative products and other finished goods",
        "target_applicant": "Artisanal craft manufacturers, wellness/spa product exporters, interior decor brands",
        "typical_investment_range_pkr": "PKR 75 Lakh to PKR 2.5 Crore",
        "indicative_total_capex_usd": 65000,  # ~PKR 18.2M
        "machinery_cost_usd": 32000,
        "land_building_cost_usd": 20000,
        "installation_cost_usd": 4000,
        "working_capital_usd": 9000,
        "capacity_tpd": 10.0,
        "operating_days": 280,
        "capacity_utilization": 0.70,
        "process_yield": 0.85,
        "washing_required": False,
        "raw_salt_cost_per_tonne": 45.0,
        "energy_cost_per_tonne": 24.0,
        "packaging_cost_per_tonne": 95.0,
        "freight_per_tonne": 35.0,
        "labor_cost_per_tonne": 45.0,
        "annual_admin_salaries": 18000,
        "annual_maintenance": 2000,
        "annual_insurance": 1800,
        "annual_compliance_marketing": 5000,
        "selling_price_per_tonne": 680.0,
        "default_equity_pct": 40.0,
        "default_loan_pct": 60.0,
        "key_machinery": [
            "Heavy-duty 6-foot lathe machines (2 units)",
            "Diamond stone cutter saws 32-inch (3 units)",
            "Vertical core drilling press (8-foot bed)",
            "Polishing & buffing workstations",
            "Aromatherapy salt blending ribbon mixer",
            "Thermal shrink-wrap tunnel & packaging table"
        ],
        "products_manufactured": "Handcrafted pink salt lamps, precision sauna tiles, essential oil bath salts, massage stones, animal lick blocks",
        "regulatory_certifications": ["CE / UL Electrical Certification for Lamps", "Halal Cosmetics / Spa Certification", "Handicrafts Export Registration"]
    },
    "export_oriented": {
        "id": "export_oriented",
        "name": "Export-Oriented Business (SMEDA Benchmark)",
        "activities": "Bulk supply, private labelling, international distribution and direct exports",
        "target_applicant": "Corporate export houses, international joint ventures, mineral processing consortia",
        "typical_investment_range_pkr": "PKR 5.0 Crore to PKR 9.5+ Crore",
        "indicative_total_capex_usd": 339260,  # ~PKR 94.99M (SMEDA Doc #220)
        "machinery_cost_usd": 111385,          # PKR 31.19M
        "land_building_cost_usd": 143297,      # PKR 40.12M (Land 3.84M + Bldg 36.28M)
        "installation_cost_usd": 53000,        # PKR 14.84M (Office, vehicles, pre-op)
        "working_capital_usd": 31645,          # PKR 8.86M
        "capacity_tpd": 50.0,
        "operating_days": 280,
        "capacity_utilization": 0.75,
        "process_yield": 0.92,
        "washing_required": True,
        "raw_salt_cost_per_tonne": 35.0,
        "energy_cost_per_tonne": 28.0,
        "packaging_cost_per_tonne": 48.0,
        "freight_per_tonne": 32.0,
        "labor_cost_per_tonne": 22.0,
        "annual_admin_salaries": 42000,
        "annual_maintenance": 6500,
        "annual_insurance": 5500,
        "annual_compliance_marketing": 14000,
        "selling_price_per_tonne": 410.0,
        "default_equity_pct": 50.0,
        "default_loan_pct": 50.0,
        "key_machinery": [
            "Complete SS 304 automated refining & milling plant (EPK-SALT1000 grade)",
            "Optical color sorter for quartz & foreign particle separation",
            "Computerized multi-head weigher & vertical pouch packaging",
            "Automated 1-tonne FIBC jumbo bag packing station",
            "Artisanal decorative lathe, drill & tile-cutting workshop line",
            "Forklift (2-tonne) & container loading dock"
        ],
        "products_manufactured": "FCL container direct export table salt, gourmet grinder salt, private label retail pouches, bulk FIBC jumbo bags, decorative lamps & tiles",
        "regulatory_certifications": ["ISO 22000:2018 (Food Safety)", "HACCP Certification", "US FDA Food Facility Registration", "Halal Certification", "SBP Form-E Export Clearance"]
    }
}


def get_applicant_categories() -> Dict[str, Dict[str, Any]]:
    """Returns the 4 applicant categories with investment ranges and machinery."""
    return APPLICANT_CATEGORIES


def get_smeda_case_study() -> Dict[str, Any]:
    """Returns official SMEDA pre-feasibility study metrics (Document No. 220)."""
    return SMEDA_BENCHMARK_CASE_STUDY


def get_scenario_presets() -> Dict[str, Dict[str, Any]]:
    """
    Returns standard industry scenarios for pink salt value addition in Punjab:
    1. Conservative: Low utilization, higher logistics, bulk food-grade ground salt.
    2. Base Case: Standard 25 TPD food-grade optical-sorted retail packaging facility.
    3. Optimistic: High-end private label gourmet grinders & organic retail packaging.
    """
    return {
        "conservative": {
            "name": "Conservative (Bulk Coarse Ground & Sifted)",
            "description": "Standard crushing, grading, and bulk export packaging in 25kg/50kg woven bags.",
            "machinery_cost": 85000,
            "land_building_cost": 60000,
            "installation_cost": 15000,
            "working_capital": 25000,
            "capacity_tpd": 20.0,
            "operating_days": 270,
            "capacity_utilization": 0.65,
            "process_yield": 0.88,
            "raw_salt_cost_per_tonne": 50.0,
            "energy_cost_per_tonne": 32.0,
            "packaging_cost_per_tonne": 22.0,
            "freight_per_tonne": 40.0,
            "labor_cost_per_tonne": 20.0,
            "annual_admin_salaries": 28000,
            "annual_maintenance": 12000,
            "annual_insurance": 6000,
            "annual_compliance_marketing": 8000,
            "selling_price_per_tonne": 210.0
        },
        "base_case": {
            "name": "Base Case (Food-Grade Optical Sorted & Stand-Up Pouches)",
            "description": "Optical-sorted food-grade pink salt packed in 500g and 1kg branded stand-up zip pouches for export.",
            "machinery_cost": 175000,
            "land_building_cost": 110000,
            "installation_cost": 25000,
            "working_capital": 40000,
            "capacity_tpd": 25.0,
            "operating_days": 300,
            "capacity_utilization": 0.75,
            "process_yield": 0.92,
            "raw_salt_cost_per_tonne": 45.0,
            "energy_cost_per_tonne": 28.0,
            "packaging_cost_per_tonne": 42.0,
            "freight_per_tonne": 35.0,
            "labor_cost_per_tonne": 24.0,
            "annual_admin_salaries": 40000,
            "annual_maintenance": 18000,
            "annual_insurance": 8500,
            "annual_compliance_marketing": 14000,
            "selling_price_per_tonne": 350.0
        },
        "optimistic": {
            "name": "Optimistic (Gourmet Ceramic-Mill Grinders & Organic Certifications)",
            "description": "Premium retail glass grinders with ceramic grinding mechanisms, Kosher/Halal/BRCGS certified.",
            "machinery_cost": 260000,
            "land_building_cost": 140000,
            "installation_cost": 35000,
            "working_capital": 65000,
            "capacity_tpd": 30.0,
            "operating_days": 310,
            "capacity_utilization": 0.85,
            "process_yield": 0.95,
            "raw_salt_cost_per_tonne": 42.0,
            "energy_cost_per_tonne": 26.0,
            "packaging_cost_per_tonne": 75.0,
            "freight_per_tonne": 32.0,
            "labor_cost_per_tonne": 28.0,
            "annual_admin_salaries": 48000,
            "annual_maintenance": 24000,
            "annual_insurance": 12000,
            "annual_compliance_marketing": 22000,
            "selling_price_per_tonne": 620.0
        }
    }
