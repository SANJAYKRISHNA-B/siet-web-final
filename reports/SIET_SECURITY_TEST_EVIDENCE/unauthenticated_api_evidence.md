# Security Test Evidence: Unauthenticated PII Listing APIs Audit & Remediation

**Target:** `/api/apply/applications` & `/api/careers/applications`  
**Audit Date:** 2026-10-31  
**Test Standard:** OWASP WSTG-ATHZ-02, CWE-306, CWE-200  
**Finding ID:** SIET-SEC-001  
**Verification Status:** VERIFIED REMEDIATED & HARDENED  

---

## 1. Vulnerability Overview (Pre-Remediation)

In the initial repository audit, `local-server.mjs` exposed two debug GET endpoints:
- `GET /api/apply/applications`
- `GET /api/careers/applications`

When requested by any client on the local network or external interface without any authentication token, these endpoints returned the latest 100 student enquiry and faculty job application records in plaintext, exposing names, mobile numbers, email addresses, and locations.

---

## 2. Test Execution & Evidence Logs

### Probe 1: Pre-Remediation Unauthenticated Request
```http
GET /api/apply/applications HTTP/1.1
Host: localhost:4173

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"success":true,"count":12,"applications":[{"id":1,"name":"Candidate","email":"candidate@example.com"...}]}
```
**Pre-Fix Vulnerability:** Information disclosure of applicant PII without credentials.

---

### Probe 2: Post-Remediation Request without Credentials
```http
GET /api/apply/applications HTTP/1.1
Host: localhost:4173

HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Unauthorized: Access to applicant PII requires local administrator authentication (X-Dev-Token)."
}
```
**Mechanism:** Server checks `X-Dev-Token` / `Authorization: Bearer <token>` and restricts execution to loopback IP (`127.0.0.1` / `::1`).  
**Verdict:** **PASS (401 Unauthorized Enforced)**

---

### Probe 3: Request with Non-Loopback IP (Spoofed Remote Address)
```http
GET /api/careers/applications HTTP/1.1
Host: 192.168.1.100:4173
X-Forwarded-For: 203.0.113.195
X-Dev-Token: siet-dev-local-secure-key

HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "success": false,
  "message": "Unauthorized: Access to applicant PII requires local administrator authentication (X-Dev-Token)."
}
```
**Mechanism:** Server queries `request.socket.remoteAddress` directly. If connection originates from a non-loopback IP, access is immediately denied regardless of headers.  
**Verdict:** **PASS (Perimeter Enforced)**

---

### Probe 4: Authenticated Local Loopback Request
```http
GET /api/apply/applications HTTP/1.1
Host: localhost:4173
X-Dev-Token: siet-dev-local-secure-key

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"success":true,"count":0,"applications":[]}
```
**Observation:** Legitimate authorized administrative testing succeeds locally with valid developer authentication.  
**Verdict:** **PASS (Authenticated Only)**
