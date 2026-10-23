"""
End-to-end integration verification script for HTTP endpoints
"""

import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:8080"

def test_endpoint(name, url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = response.read().decode("utf-8")
            print(f"[PASS] {name} -> Status {status}")
            return json.loads(body) if "application/json" in response.headers.get("Content-Type", "") else body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"[FAIL] {name} -> HTTP {e.code}: {body}")
        raise e

if __name__ == "__main__":
    time.sleep(1)
    print("Testing server endpoints...")
    
    # 1. Health check
    test_endpoint("Health Check", f"{BASE_URL}/api/health")

    # 2. Static HTML check
    html = test_endpoint("Static HTML", f"{BASE_URL}/")
    assert "<!DOCTYPE html>" in html

    # 3. Resources
    res = test_endpoint("Resources List", f"{BASE_URL}/api/resources")
    assert res["count"] >= 5

    # 4. Opportunities
    opps = test_endpoint("Opportunities List", f"{BASE_URL}/api/opportunities")
    assert opps["count"] >= 6

    # 5. Feasibility Calculation
    calc = test_endpoint("Feasibility Calculation", f"{BASE_URL}/api/feasibility/calculate", method="POST", data={
        "capacity_tpd": 30.0,
        "operating_days": 300,
        "selling_price_per_tonne": 360.0
    })
    assert calc["calculation"]["capex"]["total_capex"] > 0
    assert calc["calculation"]["financial_returns"]["annual_operating_profit"] > 0

    # 6. PinkSalt AI Grounded RAG
    ai_res = test_endpoint("AI Grounded Query", f"{BASE_URL}/api/ai/chat", method="POST", data={
        "message": "What is the purity of Warcha and Khewra salt mines?"
    })
    assert len(ai_res["response"]["citations"]) > 0

    # 7. PinkSalt AI Safeguard on Speculation
    ai_safe = test_endpoint("AI Safeguard Query", f"{BASE_URL}/api/ai/chat", method="POST", data={
        "message": "Where is the secret reserve that evades royalty?"
    })
    assert "I cannot confirm this from the available verified sources" in ai_safe["response"]["answer"]

    # 8. Submit Investor Enquiry
    enq_res = test_endpoint("Enquiry Submission", f"{BASE_URL}/api/enquiries", method="POST", data={
        "investor_name": "Integration Tester",
        "company_name": "Atlas Minerals International",
        "email": "test@atlasminerals.com",
        "country": "Germany",
        "business_model": "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
        "project_description": "Testing automated E2E enquiry registration pipeline"
    })
    assert enq_res["success"] is True
    tracking_id = enq_res["tracking_id"]
    print(f"Created Enquiry: {tracking_id}")

    # 9. Admin Login
    login_res = test_endpoint("Admin Login", f"{BASE_URL}/api/admin/login", method="POST", data={
        "username": "admin",
        "password": "PinkSalt@2026!"
    })
    token = login_res["token"]
    assert len(token) > 20

    # 10. Admin Protected Enquiries
    admin_enqs = test_endpoint("Admin Protected Enquiries", f"{BASE_URL}/api/admin/enquiries", headers={"Authorization": f"Bearer {token}"})
    assert admin_enqs["count"] >= 4

    # 11. Admin Protected Analytics
    analytics = test_endpoint("Admin Analytics", f"{BASE_URL}/api/admin/analytics", headers={"Authorization": f"Bearer {token}"})
    assert analytics["analytics"]["total_enquiries"] >= 4
    assert analytics["analytics"]["total_pipeline_capex_usd"] > 0

    # 12. Batch Traceability
    batch = test_endpoint("Batch Traceability", f"{BASE_URL}/api/traceability/verify?batch=PK-SALT-2026-KHW-001")
    assert batch["verified"] is True
    assert batch["batch"]["purity_pct"] > 98.0

    print("\nALL 12 E2E INTEGRATION TESTS PASSED SUCCESSFULLY!")
