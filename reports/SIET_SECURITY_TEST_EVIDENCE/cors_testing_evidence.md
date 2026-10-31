# Security Test Evidence: Cross-Origin Resource Sharing (CORS) Audit

**Target:** SIET API Routing & Preflight Handlers  
**Audit Date:** 2026-10-31  
**Test Standard:** OWASP WSTG-CONF-07, CWE-942  
**Finding ID:** SIET-SEC-003  
**Verification Status:** VERIFIED REMEDIATED  

---

## 1. Threat Model & Pre-Remediation Vulnerability

Prior to remediation, both OPTIONS preflight handlers and JSON response endpoints reflected `Access-Control-Allow-Origin: *`. This configuration allowed malicious external origins to initiate unconstrained cross-origin AJAX calls against local development environments and internal APIs.

---

## 2. Test Execution & Evidence Logs

### Test 1: OPTIONS Preflight from Unauthorized External Origin
```http
OPTIONS /api/space-whiz/register HTTP/1.1
Host: localhost:4173
Origin: https://malicious-attacker.org
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

HTTP/1.1 204 No Content
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Date: Sat, 31 Oct 2026 04:18:12 GMT
Connection: keep-alive
```
**Observation:** Notice that `Access-Control-Allow-Origin` is completely omitted for the foreign origin `https://malicious-attacker.org`. The browser refuses cross-origin execution.  
**Verdict:** **PASS (Blocked)**

---

### Test 2: OPTIONS Preflight from Legitimate Same-Host Origin
```http
OPTIONS /api/space-whiz/register HTTP/1.1
Host: localhost:4173
Origin: http://localhost:4173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:4173
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Date: Sat, 31 Oct 2026 04:18:15 GMT
Connection: keep-alive
```
**Observation:** Same-origin matching correctly reflects the authorized host origin.  
**Verdict:** **PASS (Allowed)**

---

### Test 3: Cross-Origin POST to Production PHP Admission API
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Origin: https://evil-phishing-site.com
Content-Type: application/json

{"name":"Hacker"}

HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
X-Content-Type-Options: nosniff

{"success":false,"message":"Cross-origin form submissions are not allowed."}
```
**Observation:** Production PHP API strictly validates `HTTP_ORIGIN` against `HTTP_HOST` and rejects mismatched origins with `HTTP 403`.  
**Verdict:** **PASS (Protected)**
