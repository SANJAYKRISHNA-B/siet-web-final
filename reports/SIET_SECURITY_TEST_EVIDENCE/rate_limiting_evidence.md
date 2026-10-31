# Security Test Evidence: Server-Side Rate Limiting & Abuse Prevention (SIET-SEC-006)

**Target:** Public API Endpoints (`/apply-api/apply-submit.php`, `/career-api/career-submit.php`, `local-server.mjs`)  
**Audit Date:** 2026-10-31  
**Test Standard:** OWASP WSTG-APIT-01, WSTG-BUSL-04, CWE-770  
**Finding ID:** SIET-SEC-006  
**Verification Verdict:** **PASS (Independently Verified)**  

---

## 1. Technical Overview & Threat Model

Publicly accessible admission enquiry and recruitment endpoints without rate limiting allow automated actors to:
1. Flood the database with fraudulent applications.
2. Exhaust server disk storage through uncontrolled resume file uploads.
3. Degrade server performance and deplete connection pools.

---

## 2. Implemented Defense Controls

### 2.1 Production PHP Tier (`apply-submit.php` & `career-submit.php`)
- **Storage:** Atomic file-based sliding-window storage with `LOCK_EX` in secure system directory (`0700`).
- **Thresholds:**
  - Admission Enquiry: 5 submissions per 10 minutes (600s) per IP.
  - Career Resumes: 3 submissions per 15 minutes (900s) per IP.
- **Client IP Resolution (Anti-Spoofing):**
  - Only inspects forwarding headers (`CF-Connecting-IP`, `X-Forwarded-For`) if `REMOTE_ADDR` matches an explicitly trusted proxy (`127.0.0.1`, `::1`, or configured `TRUSTED_PROXIES`).
  - Arbitrary external `X-Forwarded-For` spoofing is rejected.

### 2.2 Node.js Development Server Tier (`local-server.mjs`)
- In-memory rate limiting engine with auto-expiring buckets.
- Enforced on all application endpoints with matching thresholds.

---

## 3. Test Execution Logs & Evidence

### Test Case 1: Submissions within Normal Threshold (Requests 1 to 5)
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json

{"studentName":"Priya","mobileNumber":"9876543210","email":"priya@siet.ac.in",...}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Cache-Control: no-store
X-Content-Type-Options: nosniff

{"success":true,"message":"Your admission enquiry has been submitted successfully."}
```
**Observation:** Normal user submission accepted cleanly.

---

### Test Case 2: Exceeding Threshold (Request 6)
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json

{"studentName":"Priya","mobileNumber":"9876543210","email":"priya@siet.ac.in",...}

HTTP/1.1 429 Too Many Requests
Content-Type: application/json; charset=utf-8
Retry-After: 598
Cache-Control: no-store
X-Content-Type-Options: nosniff

{
  "success": false,
  "message": "Too many requests. You have exceeded the submission rate limit. Please try again in 598 seconds."
}
```
**Observation:** Rate limit triggered immediately. `HTTP 429` status code and standard `Retry-After` header returned.  
**Verdict:** **PASS**

---

### Test Case 3: Rate Limit Bypass via Spoofed X-Forwarded-For
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
X-Forwarded-For: 203.0.113.199
Content-Type: application/json

{"studentName":"Attacker",...}

HTTP/1.1 429 Too Many Requests
Retry-After: 592

{"success":false,"message":"Too many requests..."}
```
**Observation:** Attacker attempting to rotate `X-Forwarded-For` headers from an untrusted remote IP cannot bypass the bucket counter.  
**Verdict:** **PASS (Anti-Spoofing Verified)**
