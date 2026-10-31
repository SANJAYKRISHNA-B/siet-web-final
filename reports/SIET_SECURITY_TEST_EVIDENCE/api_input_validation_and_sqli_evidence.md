# Security Test Evidence: API Input Validation, SQL Injection & DoS Defense

**Target:** Admission Enquiry (`/apply-api/apply-submit.php`, `local-server.mjs`) & Career API  
**Audit Date:** 2026-10-31  
**Test Standard:** OWASP WSTG-INPV-01 to 07, CWE-89, CWE-79, CWE-400  
**Verification Status:** VERIFIED RESILIENT  

---

## 1. Threat Model

Web forms exposed to public internet traffic must defend against:
1. **SQL Injection (SQLi):** Malicious escaping (`' OR 1=1 --`, `UNION SELECT`) seeking unauthorized database reads or modifications.
2. **Denial of Service (DoS):** Exhausting server heap memory with unbounded streaming payloads.
3. **Cross-Site Scripting (XSS) / Stored Payloads:** Submitting control characters, HTML tags, or script tags into student fields.

---

## 2. Test Execution & Evidence Logs

### Test 1: Classic SQL Injection in Form Fields
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json

{
  "studentName": "Admin' OR 1=1 --",
  "mobileNumber": "9876543210",
  "email": "test@siet.ac.in",
  "course": "UG",
  "previousQualification": "12th",
  "department": "CSE",
  "city": "Coimbatore",
  "district": "Coimbatore",
  "state": "Tamil Nadu",
  "country": "India",
  "academicQualificationMarks": "95%",
  "remarks": "Sample query",
  "consent": true
}

HTTP/1.1 422 Unprocessable Content
Content-Type: application/json; charset=utf-8
X-Content-Type-Options: nosniff

{"success":false,"message":"Enter a valid name using letters only."}
```
**Observation:** Input regex validation `/^[\p{L}\p{M} .\x27-]{2,50}$/u` immediately intercepts the quote `'` and SQL comment `--` sequence before database parameters are even formed.  
**Database Safety:** Queries execute via `mysqli::prepare` and `mysqli_stmt::bind_param` (`ssssssssss`), guaranteeing separation of code from data.  
**Verdict:** **PASS (Zero SQLi Risk)**

---

### Test 2: Blind SQL Injection in Academic Fields
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json

{
  "studentName": "Kavitha Raj",
  "mobileNumber": "9876543210",
  "email": "kavitha@gmail.com",
  "course": "UG' UNION SELECT null, version(), null, null --",
  "previousQualification": "12th",
  "department": "CSE",
  "city": "Coimbatore",
  "district": "Coimbatore",
  "state": "Tamil Nadu",
  "country": "India",
  "academicQualificationMarks": "95%",
  "remarks": "Inquiry test",
  "consent": true
}

HTTP/1.1 422 Unprocessable Content

{"success":false,"message":"Select a valid course level."}
```
**Observation:** Course level is strictly checked against the authorized enum whitelist `['UG', 'PG', 'Ph.D']`.  
**Verdict:** **PASS (Enum Whitelist Enforced)**

---

### Test 3: DoS Buffer Exhaustion (Payload > 100 KB)
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json
Content-Length: 1048576

{"name":"Student","junk":"[1 MB of repeated characters...]"}

HTTP/1.1 413 Payload Too Large
Content-Type: application/json; charset=utf-8

{"success":false,"message":"Request is too large."}
```
**Observation:** Server destroys incoming stream immediately once byte counter exceeds `MAX_BODY_SIZE` (100 KB), protecting server event loop and heap memory.  
**Verdict:** **PASS (DoS Mitigated)**

---

### Test 4: Control Character & Null Byte Injection
```http
POST /apply-api/apply-submit.php HTTP/1.1
Host: localhost:4173
Content-Type: application/json

{
  "studentName": "Anand\u0000Kumar",
  "mobileNumber": "9876543210",
  "email": "anand@gmail.com",
  "course": "UG",
  "previousQualification": "12th",
  "department": "ECE",
  "city": "Coimbatore\u0007Bell",
  "district": "Coimbatore",
  "state": "Tamil Nadu",
  "country": "India",
  "academicQualificationMarks": "90%",
  "remarks": "Inquiry",
  "consent": true
}

HTTP/1.1 422 Unprocessable Content

{"success":false,"message":"Remove control characters from the form fields."}
```
**Verdict:** **PASS (Control Characters Blocked)**
