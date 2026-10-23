"""
PinkSalt Intelligence & Investment Portal
Production Server & RESTful API Gateway

Multi-threaded HTTP Server in Python 3 standard library with SQLite persistence,
session authentication, financial calculation engine, grounded AI integration,
and protected administration routes.
"""

import os
import sys
import json
import secrets
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from datetime import datetime
from typing import Dict, Any, List, Optional

# Local module imports
from database import get_connection, verify_password, hash_password
from financial_engine import calculate_feasibility, get_scenario_presets
from ai_assistant import handle_ai_query, generate_project_concept

PORT = int(os.environ.get("PORT", 8080))
STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

# In-memory authenticated admin sessions: {token: {"user_id": 1, "username": "admin", "role": "superadmin", "expires": ...}}
ACTIVE_SESSIONS = {}


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handles requests in a separate thread for concurrent client access."""
    daemon_threads = True


class PortalRequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {args[0]} {args[1]} -> {args[2]}\n")

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def send_json(self, data: Any, status: int = 200):
        response_bytes = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(response_bytes)

    def send_error_json(self, message: str, status: int = 400):
        self.send_json({"success": False, "error": message}, status=status)

    def read_json_body(self) -> Dict[str, Any]:
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                return {}
            body_bytes = self.rfile.read(content_length)
            return json.loads(body_bytes.decode("utf-8"))
        except Exception as e:
            return {}

    def get_auth_session(self) -> Optional[Dict[str, Any]]:
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            return ACTIVE_SESSIONS.get(token)
        return None

    # -------------------------------------------------------------
    # GET Request Dispatcher
    # -------------------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. API Health Check
        if path == "/api/health":
            self.send_json({
                "status": "healthy",
                "portal": "PinkSalt Intelligence & Investment Portal",
                "version": "1.0.0-production",
                "timestamp": datetime.utcnow().isoformat(),
                "ai_assistant_mode": "Grounded Expert Engine (Active)",
                "database": "SQLite (Connected)"
            })
            return

        # 2. Resource Intelligence (Geological deposits & mines)
        if path == "/api/resources":
            conn = get_connection()
            cur = conn.cursor()
            district = query.get("district", [None])[0]
            if district:
                cur.execute("SELECT * FROM resource_records WHERE district LIKE ?", (f"%{district}%",))
            else:
                cur.execute("SELECT * FROM resource_records ORDER BY id ASC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json({"success": True, "count": len(rows), "resources": rows})
            return

        # 3. Investment Opportunities Marketplace
        if path == "/api/opportunities":
            conn = get_connection()
            cur = conn.cursor()
            category = query.get("category", [None])[0]
            search = query.get("search", [None])[0]

            sql = "SELECT * FROM opportunities WHERE is_active = 1"
            params = []
            if category and category != "All":
                sql += " AND category = ?"
                params.append(category)
            if search:
                sql += " AND (title LIKE ? OR description LIKE ? OR location LIKE ?)"
                term = f"%{search}%"
                params.extend([term, term, term])

            sql += " ORDER BY id ASC"
            cur.execute(sql, params)
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json({"success": True, "count": len(rows), "opportunities": rows})
            return

        # 4. Feasibility Scenarios
        if path == "/api/feasibility/scenarios":
            scenarios = get_scenario_presets()
            self.send_json({"success": True, "scenarios": scenarios})
            return

        # 5. Knowledge Base Documents
        if path == "/api/knowledge":
            conn = get_connection()
            cur = conn.cursor()
            cat = query.get("category", [None])[0]
            q = query.get("q", [None])[0]

            sql = "SELECT * FROM knowledge_docs WHERE 1=1"
            params = []
            if cat and cat != "All":
                sql += " AND category = ?"
                params.append(cat)
            if q:
                sql += " AND (title LIKE ? OR summary LIKE ? OR tags LIKE ?)"
                term = f"%{q}%"
                params.extend([term, term, term])
            sql += " ORDER BY id ASC"
            cur.execute(sql, params)
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json({"success": True, "count": len(rows), "documents": rows})
            return

        # 6. Traceability Batch Verification
        if path == "/api/traceability/verify":
            batch_code = query.get("batch", [None])[0]
            if not batch_code:
                self.send_error_json("Please provide a batch code parameter, e.g. ?batch=PK-SALT-2026-KHW-001")
                return
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT * FROM traceability_batches WHERE batch_code = ?", (batch_code.strip(),))
            row = cur.fetchone()
            conn.close()
            if row:
                self.send_json({"success": True, "verified": True, "batch": dict(row)})
            else:
                self.send_json({
                    "success": True,
                    "verified": False,
                    "message": f"Batch identifier '{batch_code}' could not be verified in the Punjab Pink Salt Traceability Register."
                })
            return

        # 7. Protected Admin Status & Current User
        if path == "/api/admin/status":
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized. Admin authentication required.", status=401)
                return
            self.send_json({"success": True, "authenticated": True, "user": session})
            return

        # 8. Protected Admin Enquiries List
        if path == "/api/admin/enquiries":
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized access to investor enquiry pipeline.", status=401)
                return
            conn = get_connection()
            cur = conn.cursor()
            status_filter = query.get("status", [None])[0]
            if status_filter and status_filter != "All":
                cur.execute("SELECT * FROM enquiries WHERE status = ? ORDER BY id DESC", (status_filter,))
            else:
                cur.execute("SELECT * FROM enquiries ORDER BY id DESC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json({"success": True, "count": len(rows), "enquiries": rows})
            return

        # 9. Protected Admin Analytics
        if path == "/api/admin/analytics":
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized.", status=401)
                return
            conn = get_connection()
            cur = conn.cursor()

            cur.execute("SELECT COUNT(*), SUM(budget_usd) FROM enquiries")
            tot_row = cur.fetchone()
            total_enquiries = tot_row[0] or 0
            total_pipeline_capex = tot_row[1] or 0.0

            cur.execute("SELECT status, COUNT(*) FROM enquiries GROUP BY status")
            status_distribution = {row[0]: row[1] for row in cur.fetchall()}

            cur.execute("SELECT business_model, COUNT(*) FROM enquiries GROUP BY business_model")
            model_distribution = {row[0]: row[1] for row in cur.fetchall()}

            cur.execute("SELECT country, COUNT(*) FROM enquiries GROUP BY country ORDER BY COUNT(*) DESC LIMIT 5")
            top_countries = [{"country": row[0], "count": row[1]} for row in cur.fetchall()]

            cur.execute("SELECT COUNT(*) FROM opportunities WHERE is_active = 1")
            active_opportunities = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM knowledge_docs")
            knowledge_docs_count = cur.fetchone()[0]

            conn.close()

            self.send_json({
                "success": True,
                "analytics": {
                    "total_enquiries": total_enquiries,
                    "total_pipeline_capex_usd": total_pipeline_capex,
                    "active_opportunities": active_opportunities,
                    "knowledge_docs_count": knowledge_docs_count,
                    "status_distribution": status_distribution,
                    "model_distribution": model_distribution,
                    "top_countries": top_countries
                }
            })
            return

        # 10. Protected Admin Audit Logs
        if path == "/api/admin/audit-logs":
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized.", status=401)
                return
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
            logs = [dict(row) for row in cur.fetchall()]
            conn.close()
            self.send_json({"success": True, "logs": logs})
            return

        # 11. Serve Static Assets (HTML, CSS, JS)
        self.serve_static(path)

    # -------------------------------------------------------------
    # POST Request Dispatcher
    # -------------------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # 1. Feasibility Calculation
        if path == "/api/feasibility/calculate":
            result = calculate_feasibility(body)
            self.send_json({"success": True, "calculation": result})
            return

        # 2. PinkSalt AI Chatbot Interaction
        if path == "/api/ai/chat":
            user_message = body.get("message", "")
            if not user_message:
                self.send_error_json("Message cannot be empty.")
                return
            ai_response = handle_ai_query(user_message, body.get("context"))
            self.send_json({"success": True, "response": ai_response})
            return

        # 3. AI Project Concept Generator
        if path == "/api/ai/concept":
            concept = generate_project_concept(body)
            self.send_json({"success": True, "concept": concept})
            return

        # 4. Investor Enquiry Submission (Public Workflow)
        if path == "/api/enquiries":
            required = ["investor_name", "company_name", "email", "country", "business_model", "project_description"]
            for field in required:
                if not body.get(field):
                    self.send_error_json(f"Missing required field: '{field}'")
                    return

            tracking_id = f"PSI-2026-{secrets.randbelow(9000) + 1000}"
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("""
            INSERT INTO enquiries (
                tracking_id, investor_name, company_name, email, phone,
                country, business_model, target_location, budget_usd,
                capacity_tpd, target_market, project_description,
                requested_assistance, consent_given, status, internal_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', '')
            """, (
                tracking_id,
                body.get("investor_name").strip(),
                body.get("company_name").strip(),
                body.get("email").strip(),
                body.get("phone", "").strip(),
                body.get("country").strip(),
                body.get("business_model"),
                body.get("target_location", "Salt Range Corridor"),
                float(body.get("budget_usd", 250000.0)),
                float(body.get("capacity_tpd", 20.0)),
                body.get("target_market", "Export / International Retail"),
                body.get("project_description").strip(),
                body.get("requested_assistance", "").strip(),
                1 if body.get("consent_given", True) else 0
            ))
            conn.commit()

            # Record public submission in audit log
            cur.execute("""
            INSERT INTO audit_logs (user_name, action, target_type, target_id, details)
            VALUES (?, ?, ?, ?, ?)
            """, ("Public Investor", "ENQUIRY_SUBMITTED", "enquiries", tracking_id, f"Submission by {body.get('company_name')} ({body.get('country')})"))
            conn.commit()
            conn.close()

            # Also synthesize preliminary concept for the user
            concept = generate_project_concept({
                "business_model": body.get("business_model"),
                "target_location": body.get("target_location", "Quaidabad / Khushab"),
                "capacity_tpd": float(body.get("capacity_tpd", 20.0)),
                "target_market": body.get("target_market", "Export"),
                "budget_usd": float(body.get("budget_usd", 250000.0))
            })

            self.send_json({
                "success": True,
                "tracking_id": tracking_id,
                "message": "Your investment enquiry has been successfully recorded in the Punjab Directorate Minerals pipeline.",
                "preliminary_concept": concept
            }, status=201)
            return

        # 5. Admin Authentication (Login)
        if path == "/api/admin/login":
            username = body.get("username", "").strip()
            password = body.get("password", "")

            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT id, username, password_hash, salt, full_name, role FROM users WHERE username = ?", (username,))
            user = cur.fetchone()

            if not user or not verify_password(user["password_hash"], user["salt"], password):
                conn.close()
                self.send_error_json("Invalid administrator credentials.", status=401)
                return

            token = secrets.token_hex(24)
            user_info = {
                "user_id": user["id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "role": user["role"]
            }
            ACTIVE_SESSIONS[token] = user_info

            # Audit log
            cur.execute("""
            INSERT INTO audit_logs (user_name, action, target_type, target_id, details)
            VALUES (?, ?, ?, ?, ?)
            """, (user["username"], "ADMIN_LOGIN", "session", token[:8], "Successful administrative login"))
            conn.commit()
            conn.close()

            self.send_json({
                "success": True,
                "token": token,
                "user": user_info
            })
            return

        # 6. Admin Logout
        if path == "/api/admin/logout":
            token = self.headers.get("Authorization", "").replace("Bearer ", "").strip()
            if token in ACTIVE_SESSIONS:
                user_info = ACTIVE_SESSIONS.pop(token)
                conn = get_connection()
                cur = conn.cursor()
                cur.execute("""
                INSERT INTO audit_logs (user_name, action, target_type, target_id, details)
                VALUES (?, ?, ?, ?, ?)
                """, (user_info.get("username", "admin"), "ADMIN_LOGOUT", "session", token[:8], "Administrator logged out"))
                conn.commit()
                conn.close()
            self.send_json({"success": True, "message": "Logged out successfully."})
            return

        # 7. Protected Admin: Update Opportunity or Add Document
        if path == "/api/admin/opportunities":
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized.", status=401)
                return
            title = body.get("title")
            category = body.get("category")
            if not title or not category:
                self.send_error_json("Title and category are required.")
                return

            slug = f"opt-{secrets.randbelow(99999)}"
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("""
            INSERT INTO opportunities (
                slug, title, category, location, district, status_type,
                capex_indicative_usd, capacity_desc, land_sqft, machinery_desc,
                utility_desc, description, verified_source, verification_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                slug, title, category,
                body.get("location", "Punjab Mineral Zone"),
                body.get("district", "Khushab"),
                body.get("status_type", "Proposed Concept"),
                float(body.get("capex_indicative_usd", 200000)),
                body.get("capacity_desc", "20 TPD"),
                body.get("land_sqft", "15,000 sq ft"),
                body.get("machinery_desc", "Standard processing equipment"),
                body.get("utility_desc", "Standard 3-phase grid power"),
                body.get("description", ""),
                body.get("verified_source", "Administrative Entry"),
                datetime.now().strftime("%Y-%m-%d")
            ))
            conn.commit()
            conn.close()
            self.send_json({"success": True, "message": "Opportunity created successfully.", "slug": slug})
            return

        self.send_error_json("Endpoint not found", status=404)

    # -------------------------------------------------------------
    # PATCH Request Dispatcher (for Enquiry Status / Notes)
    # -------------------------------------------------------------
    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()

        # Update Enquiry Status or Internal Notes
        if path.startswith("/api/admin/enquiries/"):
            session = self.get_auth_session()
            if not session:
                self.send_error_json("Unauthorized.", status=401)
                return

            try:
                enquiry_id = int(path.split("/")[-1])
            except ValueError:
                self.send_error_json("Invalid enquiry ID.")
                return

            new_status = body.get("status")
            new_notes = body.get("internal_notes")

            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT id, tracking_id, status, internal_notes FROM enquiries WHERE id = ?", (enquiry_id,))
            existing = cur.fetchone()
            if not existing:
                conn.close()
                self.send_error_json("Enquiry record not found.", status=404)
                return

            status_to_set = new_status if new_status else existing["status"]
            notes_to_set = new_notes if new_notes is not None else existing["internal_notes"]

            cur.execute("""
            UPDATE enquiries
            SET status = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """, (status_to_set, notes_to_set, enquiry_id))

            # Audit log
            cur.execute("""
            INSERT INTO audit_logs (user_name, action, target_type, target_id, details)
            VALUES (?, ?, ?, ?, ?)
            """, (session["username"], "ENQUIRY_UPDATED", "enquiries", str(existing["tracking_id"]), f"Updated status to '{status_to_set}'. Notes updated: {bool(new_notes)}"))

            conn.commit()
            conn.close()

            self.send_json({
                "success": True,
                "message": f"Enquiry {existing['tracking_id']} updated successfully.",
                "status": status_to_set
            })
            return

        self.send_error_json("Endpoint not found", status=404)

    # -------------------------------------------------------------
    # Static Assets Handler
    # -------------------------------------------------------------
    def serve_static(self, path: str):
        if path == "/" or path == "/index.html":
            filepath = os.path.join(STATIC_DIR, "index.html")
        else:
            rel_path = path.lstrip("/")
            filepath = os.path.join(STATIC_DIR, rel_path)

        # Normalize and prevent directory traversal
        norm_path = os.path.abspath(filepath)
        if not norm_path.startswith(os.path.abspath(STATIC_DIR)):
            self.send_error(403, "Access denied")
            return

        if not os.path.exists(norm_path) or os.path.isdir(norm_path):
            # Fallback to SPA root index.html if file doesn't exist
            norm_path = os.path.join(STATIC_DIR, "index.html")
            if not os.path.exists(norm_path):
                self.send_error(404, "File not found")
                return

        # Determine MIME type
        ext = os.path.splitext(norm_path)[1].lower()
        mime_types = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".ico": "image/x-icon",
            ".pdf": "application/pdf"
        }
        content_type = mime_types.get(ext, "application/octet-stream")

        try:
            with open(norm_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-cache, must-revalidate")
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Server Error: {str(e)}")


def run_server(port: int = PORT):
    server_address = ("0.0.0.0", port)
    httpd = ThreadedHTTPServer(server_address, PortalRequestHandler)
    print(f"===============================================================")
    print(f" PinkSalt Intelligence & Investment Portal (Production Server)")
    print(f" Hosted at: http://localhost:{port}")
    print(f" Static Directory: {STATIC_DIR}")
    print(f" Database: {os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pinksalt.db')}")
    print(f" Default Admin: admin / PinkSalt@2026!")
    print(f"===============================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    run_server()
