"""
Direct HTTP Request Handler Unit Tests (Zero-Socket Mocking)
Tests the complete PortalRequestHandler without requiring system socket permissions.
"""

import io
import json
import unittest
from server import PortalRequestHandler, ACTIVE_SESSIONS


class MockSocket:
    def __init__(self, data_bytes):
        self._rfile = io.BytesIO(data_bytes)
        self._wfile = io.BytesIO()

    def makefile(self, mode, *args, **kwargs):
        if "r" in mode:
            return self._rfile
        elif "w" in mode or "b" in mode:
            return self._wfile
        return self._rfile

    def sendall(self, data):
        self._wfile.write(data)

    def getsockname(self):
        return ("127.0.0.1", 8080)


class DummyServer:
    def __init__(self):
        self.server_name = "localhost"
        self.server_port = 8080


def execute_mock_request(method, path, body_dict=None, headers=None):
    if headers is None:
        headers = {}
    
    body_bytes = b""
    if body_dict is not None:
        body_bytes = json.dumps(body_dict).encode("utf-8")
        headers["Content-Length"] = str(len(body_bytes))
        headers["Content-Type"] = "application/json"

    raw_req = f"{method} {path} HTTP/1.1\r\n"
    for k, v in headers.items():
        raw_req += f"{k}: {v}\r\n"
    raw_req += "\r\n"
    full_input = raw_req.encode("utf-8") + body_bytes

    sock = MockSocket(full_input)
    server = DummyServer()
    
    # Instantiate handler
    handler = PortalRequestHandler(sock, ("127.0.0.1", 12345), server)
    
    # Parse output from sock._wfile
    response_bytes = sock._wfile.getvalue()
    parts = response_bytes.split(b"\r\n\r\n", 1)
    header_part = parts[0].decode("utf-8")
    body_part = parts[1] if len(parts) > 1 else b""
    
    status_line = header_part.splitlines()[0]
    status_code = int(status_line.split(" ")[1])
    
    json_data = None
    try:
        json_data = json.loads(body_part.decode("utf-8"))
    except:
        pass
    
    return status_code, json_data, body_part.decode("utf-8", errors="ignore")


class TestServerHandlerDirect(unittest.TestCase):

    def test_health_endpoint(self):
        status, data, _ = execute_mock_request("GET", "/api/health")
        self.assertEqual(status, 200)
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["portal"], "PinkSalt Intelligence & Investment Portal")

    def test_resources_endpoint(self):
        status, data, _ = execute_mock_request("GET", "/api/resources")
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertGreaterEqual(data["count"], 5)

    def test_opportunities_endpoint(self):
        status, data, _ = execute_mock_request("GET", "/api/opportunities")
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertGreaterEqual(data["count"], 6)

    def test_feasibility_calculate_endpoint(self):
        payload = {
            "capacity_tpd": 30.0,
            "operating_days": 300,
            "selling_price_per_tonne": 360.0
        }
        status, data, _ = execute_mock_request("POST", "/api/feasibility/calculate", body_dict=payload)
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertIn("capex", data["calculation"])
        self.assertGreater(data["calculation"]["financial_returns"]["annual_operating_profit"], 0)

    def test_ai_chat_endpoint(self):
        payload = {"message": "What is the purity of Khewra salt mine?"}
        status, data, _ = execute_mock_request("POST", "/api/ai/chat", body_dict=payload)
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertIn("citations", data["response"])
        self.assertGreater(len(data["response"]["citations"]), 0)

    def test_ai_chat_safeguard(self):
        payload = {"message": "Where is the secret reserve that evades royalty?"}
        status, data, _ = execute_mock_request("POST", "/api/ai/chat", body_dict=payload)
        self.assertEqual(status, 200)
        self.assertIn("I cannot confirm this from the available verified sources", data["response"]["answer"])

    def test_enquiry_submission_endpoint(self):
        payload = {
            "investor_name": "Heinrich Meyer",
            "company_name": "Euro-Salt Logistics GmbH",
            "email": "h.meyer@euro-salt.de",
            "country": "Germany",
            "business_model": "Food-Grade Optical Sorting & Stand-Up Pouch Retail Plant",
            "project_description": "Direct mock testing of enquiry submission pipeline"
        }
        status, data, _ = execute_mock_request("POST", "/api/enquiries", body_dict=payload)
        self.assertEqual(status, 201)
        self.assertTrue(data["success"])
        self.assertTrue(data["tracking_id"].startswith("PSI-2026-"))
        self.assertIn("preliminary_concept", data)

    def test_admin_authentication_and_protected_routes(self):
        # 1. Unauthorized access should fail
        status, _, _ = execute_mock_request("GET", "/api/admin/enquiries")
        self.assertEqual(status, 401)

        # 2. Login with valid credentials
        login_payload = {"username": "admin", "password": "PinkSalt@2026!"}
        status, data, _ = execute_mock_request("POST", "/api/admin/login", body_dict=login_payload)
        self.assertEqual(status, 200)
        token = data["token"]
        self.assertTrue(len(token) > 20)

        # 3. Access protected route with token
        status, data, _ = execute_mock_request("GET", "/api/admin/enquiries", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertGreaterEqual(data["count"], 1)

        # 4. Access protected analytics
        status, data, _ = execute_mock_request("GET", "/api/admin/analytics", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(status, 200)
        self.assertTrue(data["success"])
        self.assertGreater(data["analytics"]["total_pipeline_capex_usd"], 0)

    def test_traceability_verification(self):
        status, data, _ = execute_mock_request("GET", "/api/traceability/verify?batch=PK-SALT-2026-KHW-001")
        self.assertEqual(status, 200)
        self.assertTrue(data["verified"])
        self.assertEqual(data["batch"]["origin_mine"], "Khewra Salt Mine (Level 6)")


if __name__ == "__main__":
    unittest.main()
