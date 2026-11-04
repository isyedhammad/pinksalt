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
    # Ramp-up: Y1=65%, Y2=75%, Y3=85%, Y4=90%, Y5=95% (relative baseline)
    ramp_multipliers = [
        min(1.0, max(0.3, capacity_utilization * 0.85)),  # Y1 ramp-up
        capacity_utilization,                              # Y2 base
        min(1.0, capacity_utilization * 1.10),             # Y3 maturity
        min(1.0, capacity_utilization * 1.15),             # Y4 peak
        min(1.0, capacity_utilization * 1.18)              # Y5 steady
    ]
    inflation_rate = 0.05  # 5% annual escalation for selling price and cost
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
        "disclaimer": (
            "NOTICE: This preliminary model provides computational estimates for project evaluation "
            "and does not constitute an officially certified Bankable Feasibility Study, geological reserve report, "
            "or guarantee of commercial profitability. Figures reflect user inputs and indicative market parameters."
        )
    }


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
