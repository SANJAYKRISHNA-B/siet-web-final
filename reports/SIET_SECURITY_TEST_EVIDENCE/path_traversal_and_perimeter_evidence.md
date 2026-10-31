# Security Test Evidence: Directory Traversal & Perimeter Access Guard

**Target:** SIET Static File Resolver & Route Processor  
**Audit Date:** 2026-10-31  
**Test Standard:** OWASP WSTG-CONF-05, WSTG-INPV-12, CWE-22, CWE-200  
**Verification Status:** VERIFIED SECURE  

---

## 1. Threat Model

Path traversal vulnerabilities occur when user-supplied file path input is passed directly to the filesystem without adequate sanitization, permitting attackers to escape web root directories (`../../windows/win.ini` or `../../../../etc/passwd`). Sensitive system files and internal source repositories (`.git/`, `/data/`, `.env`) must be blocked at the perimeter.

---

## 2. Test Execution & Evidence Logs

### Probe 1: Classic Dot-Dot-Slash Relative Traversal
```http
GET /../../../../../../windows/win.ini HTTP/1.1
Host: localhost:4173

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: no-cache, no-store, must-revalidate

<!doctype html>
<html lang="en">... <!-- Safe fallback to index.html; no filesystem leak -->
```
**Mechanism:** `normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "")` eliminates leading directory traversal tokens and safely routes unmatched routes to SPA root.  
**Verdict:** **PASS (Sanitized)**

---

### Probe 2: URL-Encoded Path Traversal
```http
GET /%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd HTTP/1.1
Host: localhost:4173

HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!doctype html>...
```
**Observation:** Decoded tokens are normalized; safe fallback engaged.  
**Verdict:** **PASS (Sanitized)**

---

### Probe 3: Direct Git Repository Metadata Exfiltration
```http
GET /.git/config HTTP/1.1
Host: localhost:4173

HTTP/1.1 403 Forbidden
Content-Type: text/plain; charset=utf-8

403 Forbidden: Access to sensitive path denied.
```
**Mechanism:** Perimeter Access Guard (`cleanPath.startsWith(".git")`) actively blocks access to all version control artifacts.  
**Verdict:** **PASS (403 Blocked)**

---

### Probe 4: Internal SQLite Database File Extraction
```http
GET /data/career-applications.sqlite HTTP/1.1
Host: localhost:4173

HTTP/1.1 403 Forbidden
Content-Type: text/plain; charset=utf-8

403 Forbidden: Access to sensitive path denied.
```
**Mechanism:** Guard blocks `/data` directory and `.sqlite` extensions.  
**Verdict:** **PASS (403 Blocked)**

---

### Probe 5: Environment & Config File Extraction
```http
GET /.env HTTP/1.1
Host: localhost:4173

HTTP/1.1 403 Forbidden
Content-Type: text/plain; charset=utf-8

403 Forbidden: Access to sensitive path denied.
```
**Verdict:** **PASS (403 Blocked)**

---

### Probe 6: Database Schema SQL File Access
```http
GET /apply-api/local-application-schema.sql HTTP/1.1
Host: localhost:4173

HTTP/1.1 403 Forbidden
Content-Type: text/plain; charset=utf-8

403 Forbidden: Access to sensitive path denied.
```
**Verdict:** **PASS (403 Blocked)**
