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

    variable_cost_per_tonne = (
        effective_raw_material_cost_per_tonne +
        energy_cost_per_tonne +
        packaging_cost_per_tonne +
        freight_to_port_per_tonne +
        direct_labor_per_tonne
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
        depreciation_machinery
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
    # Computes operating profit impact across variations in:
    # A) Selling Price (-20%, -10%, Base, +10%, +20%)
    # B) Raw Salt Price (-20%, -10%, Base, +10%, +20%)
    # C) Energy Cost (-20%, -10%, Base, +10%, +20%)
    # D) Capacity Utilization (50%, 65%, 75%, 85%, 95%)
    variations = [-0.20, -0.10, 0.0, 0.10, 0.20]
    sensitivity = {
        "selling_price": [],
        "raw_salt_cost": [],
        "energy_cost": [],
        "capacity_utilization": []
    }

    for v in variations:
        # Price sensitivity
        adj_price = selling_price_fob_per_tonne * (1.0 + v)
        adj_rev = annual_finished_production_tonnes * adj_price
        sensitivity["selling_price"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_price, 2),
            "annual_operating_profit": round(adj_rev - total_annual_opex, 2),
            "margin_pct": round(((adj_rev - total_annual_opex) / adj_rev * 100.0) if adj_rev > 0 else 0.0, 1)
        })

        # Raw material sensitivity
        adj_raw_cost = raw_salt_cost_per_tonne * (1.0 + v)
        adj_var_cost = (
            (adj_raw_cost / process_yield if process_yield > 0 else adj_raw_cost) +
            energy_cost_per_tonne + packaging_cost_per_tonne + freight_to_port_per_tonne + direct_labor_per_tonne
        )
        adj_opex = (adj_var_cost * annual_finished_production_tonnes) + annual_fixed_costs
        sensitivity["raw_salt_cost"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_raw_cost, 2),
            "annual_operating_profit": round(annual_revenue - adj_opex, 2),
            "margin_pct": round(((annual_revenue - adj_opex) / annual_revenue * 100.0) if annual_revenue > 0 else 0.0, 1)
        })

        # Energy sensitivity
        adj_energy_cost = energy_cost_per_tonne * (1.0 + v)
        adj_var_cost_e = (
            effective_raw_material_cost_per_tonne +
            adj_energy_cost + packaging_cost_per_tonne + freight_to_port_per_tonne + direct_labor_per_tonne
        )
        adj_opex_e = (adj_var_cost_e * annual_finished_production_tonnes) + annual_fixed_costs
        sensitivity["energy_cost"].append({
            "delta_pct": int(v * 100),
            "value": round(adj_energy_cost, 2),
            "annual_operating_profit": round(annual_revenue - adj_opex_e, 2),
            "margin_pct": round(((annual_revenue - adj_opex_e) / annual_revenue * 100.0) if annual_revenue > 0 else 0.0, 1)
        })

    # Utilization sensitivity: 50%, 65%, 75%, 85%, 95%
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
