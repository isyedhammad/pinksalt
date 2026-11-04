"""
PinkSalt Intelligence & Investment Portal
Comprehensive Test Suite & Quality Assurance Verification

Tests database persistence, deterministic financial calculations, grounded AI RAG,
unverified safeguard triggers, enquiry lifecycle, and administrative authentication.
"""

import os
import unittest
import sqlite3
import json
from database import get_connection, verify_password, hash_password, DB_PATH
from financial_engine import calculate_feasibility, get_scenario_presets
from ai_assistant import handle_ai_query, generate_project_concept, retrieve_relevant_corpus


class TestPinkSaltPortal(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Ensure database is initialized
        cls.conn = get_connection()

    @classmethod
    def tearDownClass(cls):
        cls.conn.close()

    def test_01_database_tables_and_seeds(self):
        """Verifies database tables exist and initial domain seeds are loaded."""
        cur = self.conn.cursor()
        tables = [
            "users", "opportunities", "resource_records",
            "knowledge_docs", "enquiries", "traceability_batches", "audit_logs"
        ]
        for tbl in tables:
            cur.execute(f"SELECT COUNT(*) FROM {tbl}")
            count = cur.fetchone()[0]
            self.assertGreater(count, 0, f"Table '{tbl}' should have seeded records.")

        # Verify default administrator
        cur.execute("SELECT username, role, password_hash, salt FROM users WHERE username = 'admin'")
        admin = cur.fetchone()
        self.assertIsNotNone(admin, "Default admin should exist.")
        self.assertEqual(admin["role"], "superadmin")
        self.assertTrue(verify_password(admin["password_hash"], admin["salt"], "PinkSalt@2026!"))

    def test_02_deterministic_financial_engine(self):
        """Tests financial model deterministic formulas, EBITDA, margins, and break-even."""
        # Test Base Case
        params = {
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
        }
        res = calculate_feasibility(params)

        # 1. Total CAPEX check: 175k + 110k + 25k + 40k = 350k
        self.assertEqual(res["capex"]["total_capex"], 350000.0)

        # 2. Production check: 25 * 300 * 0.75 * 0.92 = 5,175 MT
        self.assertAlmostEqual(res["production"]["annual_finished_production_tonnes"], 5175.0, places=1)

        # 3. Revenue check: 5,175 * 350 = 1,811,250
        self.assertAlmostEqual(res["financial_returns"]["annual_revenue"], 1811250.0, places=1)

        # 4. Operating Profit > 0
        self.assertGreater(res["financial_returns"]["annual_operating_profit"], 0)
        self.assertGreater(res["financial_returns"]["operating_margin_pct"], 30.0)

        # 5. Break-even volume must be less than annual capacity
        self.assertLess(res["financial_returns"]["breakeven_volume_tonnes"], res["production"]["annual_finished_production_tonnes"])

        # 6. Break-even selling price must be less than current market selling price
        self.assertLess(res["financial_returns"]["breakeven_selling_price_per_tonne"], 350.0)

        # 7. Check sensitivity analysis structure
        self.assertIn("selling_price", res["sensitivity"])
        self.assertIn("raw_salt_cost", res["sensitivity"])
        self.assertEqual(len(res["sensitivity"]["selling_price"]), 5)

    def test_03_financial_edge_cases_safety(self):
        """Verifies zero division and missing parameter handling in calculations."""
        edge_params = {
            "capacity_tpd": 0,
            "operating_days": 0,
            "selling_price_per_tonne": 0,
            "process_yield": 0
        }
        res = calculate_feasibility(edge_params)
        self.assertIsNotNone(res)
        self.assertIn("financial_returns", res)
        # Should not raise ZeroDivisionError

    def test_04_ai_assistant_grounded_rag(self):
        """Tests that factual queries return grounded text and clickable citations."""
        query = "What are the documented reserves and purity of Khewra and Warcha salt mines?"
        res = handle_ai_query(query)
        self.assertIn("citations", res)
        self.assertGreater(len(res["citations"]), 0)
        self.assertIn("Khewra", res["answer"])
        self.assertIn("Warcha", res["answer"])
        # Check source metadata
        first_cit = res["citations"][0]
        self.assertIn("url", first_cit)
        self.assertIn("authority", first_cit)
        self.assertIn("date", first_cit)

    def test_05_ai_assistant_unverified_safeguards(self):
        """Tests that speculative or unverified claims trigger the official safeguard response."""
        speculative_queries = [
            "Can you tell me how to guarantee 100% profit in salt mining?",
            "Where is the secret reserve that evades royalty?",
            "Does pink salt cure cancer and heal asthma?"
        ]
        for q in speculative_queries:
            res = handle_ai_query(q)
            self.assertEqual(res["confidence"], "safeguard_triggered")
            self.assertIn("I cannot confirm this from the available verified sources", res["answer"])
            self.assertEqual(len(res["citations"]), 0)

    def test_06_ai_project_concept_generator(self):
        """Tests structured project concept synthesis."""
        concept = generate_project_concept({
            "business_model": "Food-Grade Optical Sorting & Retail Packaging",
            "target_location": "Quaidabad Industrial Cluster, Khushab",
            "capacity_tpd": 25.0,
            "target_market": "EU Supermarkets",
            "budget_usd": 350000.0
        })
        self.assertIn("concept_title", concept)
        self.assertIn("indicative_financials", concept)
        self.assertIn("machinery_and_processing_workflow", concept)
        self.assertIn("regulatory_and_concessions_checklist", concept)
        self.assertGreater(len(concept["machinery_and_processing_workflow"]), 3)

    def test_07_traceability_verification(self):
        """Tests valid and invalid batch lookup."""
        cur = self.conn.cursor()
        cur.execute("SELECT * FROM traceability_batches WHERE batch_code = 'PK-SALT-2026-KHW-001'")
        row = cur.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row["district"], "Jhelum")
        self.assertGreater(row["purity_pct"], 98.0)
        self.assertLess(row["heavy_metals_ppm"], 0.1)

    def test_08_enquiry_submission_and_tracking(self):
        """Tests investor enquiry recording, status lifecycle, and internal notes."""
        cur = self.conn.cursor()
        test_tracking = "PSI-TEST-9999"
        cur.execute("""
        INSERT INTO enquiries (
            tracking_id, investor_name, company_name, email, country,
            business_model, project_description, status, internal_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            test_tracking, "QA Test Lead", "Mineral Ventures Ltd", "qa@minerals.com", "UK",
            "Food-Grade Optical Sorting", "Automated QA verification test submission", "New", ""
        ))
        self.conn.commit()

        # Retrieve and verify
        cur.execute("SELECT * FROM enquiries WHERE tracking_id = ?", (test_tracking,))
        saved = cur.fetchone()
        self.assertIsNotNone(saved)
        self.assertEqual(saved["status"], "New")

        # Update status to Qualified and add notes
        cur.execute("UPDATE enquiries SET status = 'Qualified', internal_notes = 'Verified QA pass' WHERE tracking_id = ?", (test_tracking,))
        self.conn.commit()

        cur.execute("SELECT status, internal_notes FROM enquiries WHERE tracking_id = ?", (test_tracking,))
        updated = cur.fetchone()
        self.assertEqual(updated["status"], "Qualified")
        self.assertEqual(updated["internal_notes"], "Verified QA pass")

        # Clean up test row
        cur.execute("DELETE FROM enquiries WHERE tracking_id = ?", (test_tracking,))
        self.conn.commit()

    def test_09_applicant_business_categories(self):
        """Verifies the 4 applicant business categories and their machine specifications."""
        from financial_engine import get_applicant_categories
        cats = get_applicant_categories()
        expected = ["small_packaging", "medium_manufacturing", "value_added_products", "export_oriented"]
        for exp in expected:
            self.assertIn(exp, cats)
            cat = cats[exp]
            self.assertIn("activities", cat)
            self.assertIn("key_machinery", cat)
            self.assertIn("typical_investment_range_pkr", cat)
            self.assertGreater(len(cat["key_machinery"]), 2)

    def test_10_smeda_benchmark_case_study(self):
        """Verifies SMEDA Document No. 220 official benchmark pre-feasibility data."""
        from financial_engine import get_smeda_case_study
        cs = get_smeda_case_study()
        self.assertEqual(cs["publication_date"], "December 2023")
        self.assertEqual(cs["document_number"], "SMEDA Pre-Feasibility Document No. 220")
        self.assertEqual(cs["capital_costs_pkr"]["total_project_cost"], 94992710)
        self.assertEqual(cs["project_economics"]["payback_years_100_percent_equity"], 4.10)
        self.assertEqual(cs["project_economics"]["irr_100_percent_equity"], 0.29)
        self.assertEqual(cs["project_economics"]["irr_50_percent_debt"], 0.25)

    def test_11_automated_feasibility_assessment(self):
        """Verifies automated bankability scoring and underwriting advice generation."""
        params = {
            "applicant_category": "export_oriented",
            "capacity_tpd": 50.0,
            "operating_days": 280,
            "selling_price_per_tonne": 410.0,
            "machinery_cost": 111385,
            "land_building_cost": 143297,
            "installation_cost": 53000,
            "working_capital": 31645
        }
        res = calculate_feasibility(params)
        self.assertIn("automated_assessment", res)
        asm = res["automated_assessment"]
        self.assertGreaterEqual(asm["bankability_score"], 50)
        self.assertIn("rating_tier", asm)
        self.assertIn("category_advice", asm)
        self.assertIn("average_dscr", asm)
        self.assertIn("monthly_emi_pkr", asm)

    def test_12_smeda_key_assumptions_and_cash_flow(self):
        """Verifies Tables 23-26 assumptions and audited 5-year cash flow in feasibility results."""
        from financial_engine import get_smeda_case_study
        cs = get_smeda_case_study()
        self.assertIn("key_assumptions", cs)
        assump = cs["key_assumptions"]
        self.assertIn("table_23_operating_costs", assump)
        self.assertIn("table_24_production_costs", assump)
        self.assertIn("table_25_revenue_assumptions", assump)
        self.assertIn("table_26_financial_assumptions", assump)
        self.assertEqual(assump["table_24_production_costs"]["edible_salt_rock_raw_per_ton_pkr"], 16000)

        self.assertIn("audited_5_year_cash_flow", cs)
        self.assertEqual(len(cs["audited_5_year_cash_flow"]), 16)
        net_profit_row = cs["audited_5_year_cash_flow"][0]
        self.assertEqual(net_profit_row["metric"], "Net Profit")
        self.assertEqual(net_profit_row["year_1"], 10219520)
        self.assertEqual(net_profit_row["year_5"], 54118877)


if __name__ == "__main__":
    unittest.main()
