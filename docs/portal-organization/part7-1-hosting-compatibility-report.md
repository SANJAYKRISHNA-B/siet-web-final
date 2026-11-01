# PART 7.1 — ACTUAL PRODUCTION HOSTING COMPATIBILITY AUDIT REPORT

**Project:** Sri Shakthi Institute of Engineering and Technology (SIET)  
**Project Path:** `G:\siet-final\siet-web-final`  
**Audit Date:** 2026-11-01  
**Audit Type:** Static Architecture & Production Compatibility Audit (Read-Only)  
**Target Production Stack:** Apache 2.4+ / LiteSpeed Web Server, PHP 8.2 (`ea-php82___lsphp`), MySQL / MariaDB on cPanel (`https://siet.ac.in`)  
**Local Audit Environment:** Node.js v22.14.0 Windows Staging Environment  
**Verdict:** **CONDITIONALLY COMPATIBLE / READY FOR STAGED HOSTING ONBOARDING**

---

## 1. Executive Summary & Audit Context

Following the completion of Part 7 (*Production Readiness Validation*), this audit investigates the real-world operational compatibility of the codebase with its target cPanel production infrastructure. 

Because the local development environment executes via a Node.js runtime (`local-server.mjs`) and native SQLite databases, **Node.js test results cannot substitute for live PHP/MySQL execution**. 

This audit analyzes the actual PHP backend code, Apache configuration directives, production path dependencies, and MySQL database schema mappings. It clearly separates **empirically verified facts** from **unverified runtime assumptions** that require live server access to confirm.

---

## 2. Apache & Web Server Configuration Analysis

### 2.1 Rule Ordering & Execution Flow
The root `.htaccess` file was analyzed for syntactic validity and execution precedence under Apache 2.4 / LiteSpeed:

1. **Global Security Options (Lines 6–12):**
   - `Options -Indexes -ExecCGI -MultiViews`: Disables directory listings and prevents arbitrary CGI execution.
   - `ErrorDocument 404 /index.html`: Routes missing non-asset requests to the React SPA error boundary.
2. **Access Control & Bot Protection (Sections 1–3):**
   - `<RequireAll>` block with 23 specific IP bans (malicious scanner & brute-force IPs).
   - `mod_rewrite` rules intercept webshell patterns (`alfacgiapi`, `ALFA_DATA`, `wp-admin`, `.env`, `.git`) with `[F,L]` (403 Forbidden).
   - Scanner User-Agent blocklist (e.g. `sqlmap`, `nikto`, `zgrab`).
     > [!NOTE]
     > Line 126 blocks user agents matching `(python-requests|python-urllib|python-httpx)`. Automated external monitoring bots using default Python library User-Agents will receive `403 Forbidden` unless configured with a legitimate browser User-Agent header (`Mozilla/5.0...`).
3. **Sensitive File Denials (Section 4):**
   - `<FilesMatch>` directives deny direct access to `.env`, `.sqlite`, `.sql`, `.bak`, and configuration PHP files (`career-config.php`, `masterdb_config.php`).
   - Supplemented by directory-level `.htaccess` guards in `apply-api/.htaccess` and `career-api/.htaccess`.
4. **HTTPS Redirection (Lines 207–213):**
   ```apache
   RewriteCond %{HTTPS} off
   RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/
   RewriteCond %{REQUEST_URI} !^/\.well-known/cpanel-dcv/
   RewriteCond %{REQUEST_URI} !^/\.well-known/pki-validation/
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```
   *Verification:* AutoSSL, Let's Encrypt, and Sectigo domain validation tokens are explicitly exempted from HTTPS redirection, preventing SSL renewal failures.
5. **Microsite Exceptions & Legacy Redirects (Lines 214–233):**
   - Legacy redirects for `/icchi/icchi.css` (301), `/mdfi/mdfi.js` (301), `/space-mission` (302), and `/labs.html` (301) execute before SPA fallback.
6. **cPanel Sub-Application Pass-Through (Line 235):**
   ```apache
   RewriteRule ^(webportal|agrifest|media|kalam)($|/) - [L]
   ```
   *Verification:* Existing legacy cPanel sub-applications (`webportal/`, `agrifest/`, `media/`, `kalam/`) are passed through without being intercepted by the React SPA router.
7. **Directory & File Fallback (Lines 240–250):**
   - `-f` serves real static files (images, CSS, JS, PDFs) directly.
   - `-d` + `index.html` serves directories with their own index files (`/icchi/`, `/mdfi/`, `/sssm/`, `/labs/`, and lab pages).
   - Catch-all `RewriteRule . /index.html [L]` directs remaining paths to the SPA dispatcher.

### 2.2 Potential Hosting Conflicts & Observations
- **LiteSpeed PHP Handler Directive (Lines 196–198):**
  ```apache
  <IfModule mime_module>
    AddHandler application/x-httpd-ea-php82___lsphp .php .php8 .phtml
  </IfModule>
  ```
  *Analysis:* This handler is configured specifically for cPanel EasyApache 4 LiteSpeed PHP 8.2 (`ea-php82___lsphp`). If the destination server uses standard Apache PHP-FPM without LiteSpeed, or if the cPanel account uses a different PHP version (e.g. `ea-php81`), this directive must be adjusted in cPanel MultiPHP Manager.
- **PHP Values in `.htaccess` (Lines 176–190):**
  - Directives inside `<IfModule mod_php.c>` (`php_value upload_max_filesize 5M`) are ignored by modern cPanel servers running PHP-FPM or LiteSpeed PHP. Upload limits must be confirmed in cPanel MultiPHP INI Editor or `.user.ini`.

---

## 3. PHP Compatibility Audit

A detailed source-level audit was conducted on all three production PHP files:
- `apply-api/apply-submit.php`
- `career-api/career-submit.php`
- `career-api/career-config.example.php`

### 3.1 Language & Syntax Compatibility (PHP 8.1 / PHP 8.2)

| Feature / Construct | Usage in Codebase | Minimum PHP Version | Compatibility Assessment |
| :--- | :--- | :---: | :---: |
| `declare(strict_types=1);` | Enforced at the top of all intake handlers | PHP 7.0+ | **Compatible** |
| `str_contains()` | Request Content-Type & magic byte verification | PHP 8.0+ | **Compatible** with PHP 8.1/8.2 |
| `str_starts_with()` | Magic byte & shebang script inspection | PHP 8.0+ | **Compatible** with PHP 8.1/8.2 |
| Arrow Functions (`fn()`) | Required field filtering in array helpers | PHP 7.4+ | **Compatible** |
| `DateTimeImmutable` | Date of birth validation & age calculation | PHP 5.5+ | **Compatible** |
| `random_bytes()` | Secure filename entropy generation | PHP 7.0+ | **Compatible** |
| `Throwable` Handling | Root exception catching in database transactions | PHP 7.0+ | **Compatible** |

### 3.2 PHP Extensions Required

| Extension | Purpose in Codebase | Criticality | Fallback / Behavior if Missing |
| :--- | :--- | :---: | :--- |
| **`mysqli`** | Database connection, prepared statements, parameter binding | **CRITICAL** | Endpoint fails with HTTP 500 (`"Admission enquiry database connection is unavailable"`). |
| **`mbstring`** | `mb_strlen()` UTF-8 boundary validation | Recommended | Code checks `function_exists('mb_strlen')` and falls back to standard `strlen()`. |
| **`curl`** | `career-api` mail notification webhook dispatch | Optional | Code checks `function_exists('curl_init')`. If missing, webhook is safely skipped; application remains saved. |
| **`json`** | Payload parsing & REST API response formatting | **CRITICAL** | Core extension in PHP 8.2; standard enabled. |

### 3.3 File Upload Security (`career-api/career-submit.php`)
The file upload workflow operates with multi-layered defenses:
1. **Size Enforcement:** Maximum 2,097,152 bytes (2 MB), minimum 100 bytes (anti-empty file guard).
2. **Double Extension Neutralization:** Regex blocks any executable extension anywhere in the filename (`resume.pdf.exe`).
3. **Deep Binary Magic Byte Verification:**
   - Reads the first 1,024 bytes directly from `$_FILES['resume']['tmp_name']`.
   - Rejects Windows PE binaries (`MZ` signature `0x4D, 0x5A`).
   - Rejects Linux ELF binaries (`0x7F, 0x45, 0x4C, 0x46`).
   - Rejects Mach-O binaries (`0xFE, 0xED, 0xFA, 0xCE`, etc.).
   - Rejects scripts (`#!`, `<?php`, `<script`, `@echo`).
   - Enforces positive signature whitelist: `%PDF-` for PDF, `PK` for DOCX, `\xD0\xCF\x11\xE0` for DOC, and `{\rtf` for RTF.
4. **Hashed Disk Storage:** Resumes are moved using non-guessable filenames: `career-YYYYMMDD-HHMMSS-<16-hex-random>.<ext>` into `public_html/webportal/resume/`.

---

## 4. MySQL Database Schema & Mapping Analysis

Because staging executes against SQLite, the schema mapping between staging tables and production MySQL tables was examined in detail.

### 4.1 Admissions Intake Mapping

| Conceptual Field | Staging SQLite Table: `applications` | Production MySQL Table: `application` | Mapping Status |
| :--- | :--- | :--- | :---: |
| Primary Key | `id INTEGER PRIMARY KEY AUTOINCREMENT` | `id INT AUTO_INCREMENT PRIMARY KEY` | **Compatible** |
| Candidate Name | `name VARCHAR(50) NOT NULL` | `name VARCHAR(50)` | **Compatible** |
| Phone Number | `mobile VARCHAR(20) NOT NULL` | `mobile VARCHAR(20)` | **Compatible** |
| Email Address | `email VARCHAR(50) NOT NULL` | `email VARCHAR(50)` | **Compatible** |
| Location | `location VARCHAR(50) NOT NULL` | `location VARCHAR(50)` (city, district, state joined) | **Compatible** |
| Degree Level | `course VARCHAR(30) NOT NULL` | `course VARCHAR(30)` (`UG`, `PG`, or `Ph.D`) | **Compatible** |
| Message / Query | `message TEXT NOT NULL` | `message TEXT` | **Compatible** |
| Intake Source | `other VARCHAR(30) NOT NULL` | `other VARCHAR(30)` (defaults to `Website`) | **Compatible** |
| Previous Qual. | `previous_qualification VARCHAR(150)` | `previous_qualification VARCHAR(150)` | **Compatible** |
| Course + Dept | `course_level VARCHAR(100)` | `course_level VARCHAR(100)` | **Compatible** |
| Academic Marks | `academic_qualification_marks VARCHAR(150)` | `academic_qualification_marks VARCHAR(150)` | **Compatible** |

*Admissions Query Analysis:*
In `apply-api/apply-submit.php`, the query is:
```sql
INSERT INTO `application` (`name`,`mobile`,`email`,`location`,`course`,`message`,`other`,`previous_qualification`,`course_level`,`academic_qualification_marks`) VALUES (?,?,?,?,?,?,?,?,?,?)
```
The production table is explicitly named **`application`** (singular). All 10 parameters are bound as strings (`ssssssssss`).

---

### 4.2 Career Applications Mapping

| Conceptual Field | Staging SQLite Table: `career_applications` | Production MySQL Table: `applicant` | Mapping Status |
| :--- | :--- | :--- | :---: |
| Primary Key | `id INTEGER PRIMARY KEY AUTOINCREMENT` | `id INT AUTO_INCREMENT PRIMARY KEY` | **Compatible** |
| Application Ref | `application_no TEXT UNIQUE` | Generated at runtime (`SIET-ENG-YYYYMMDD-000001`) | **Compatible** |
| Full Name | `name TEXT NOT NULL` | `fullname VARCHAR(255)` | **Field Name Differs (Handled)** |
| Department | `department TEXT NOT NULL` | `dept VARCHAR(100)` | **Field Name Differs (Handled)** |
| Position | `position TEXT NOT NULL` | `position VARCHAR(100)` | **Compatible** |
| Qualification | `qualification TEXT NOT NULL` | `high_qualification VARCHAR(100)` | **Field Name Differs (Handled)** |
| Social Category | `social_category TEXT NOT NULL` | `social_cat VARCHAR(50)` | **Field Name Differs (Handled)** |
| Current Inst. | `current_institution TEXT` | `current_institution VARCHAR(255)` | **Compatible** |
| Current Role | `current_position TEXT` | `current_position VARCHAR(100)` | **Compatible** |
| City / State / Country| `city`, `state`, `country` | `city`, `state`, `country` | **Compatible** |
| Contact Phone | `phone TEXT NOT NULL` | `mobile VARCHAR(20)` | **Field Name Differs (Handled)** |
| Email Address | `email TEXT NOT NULL` | `email VARCHAR(100)` | **Compatible** |
| Date of Birth | `date_of_birth TEXT NOT NULL` | `dob DATE` (formatted `Y-m-d`) | **Compatible** |
| Experience | `teaching_experience`, `industry`, `research` | `teaching`, `industry`, `research` | **Field Name Differs (Handled)** |
| Salary Details | `current_salary`, `expected_salary` | `current_salary_range`, `expected_salary_range` | **Field Name Differs (Handled)** |
| Notice Period | `notice_period TEXT` | `notice_period VARCHAR(50)` | **Compatible** |
| Resume Filename | `resume_stored_name TEXT` | `resume VARCHAR(255)` | **Field Name Differs (Handled)** |
| Reason for Change | `message TEXT` | `why_change TEXT` | **Field Name Differs (Handled)** |
| Lead Source | `opening_source TEXT` | `source VARCHAR(100)` | **Field Name Differs (Handled)** |
| Target Institute| `institution TEXT NOT NULL` | `institute VARCHAR(100)` | **Field Name Differs (Handled)** |
| Timestamp | `created_at DEFAULT CURRENT_TIMESTAMP` | `created_at DATETIME` (populated via `NOW()`) | **Compatible** |

*Career Query Analysis:*
In `career-api/career-submit.php`, the query is:
```sql
INSERT INTO `applicant` (`fullname`,`dept`,`position`,`high_qualification`,`social_cat`,`current_institution`,`current_position`,`city`,`state`,`country`,`mobile`,`email`,`dob`,`teaching`,`industry`,`research`,`current_salary_range`,`expected_salary_range`,`notice_period`,`resume`,`why_change`,`source`,`institute`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())
```
The production table is named **`applicant`** (singular). The PHP handler maps incoming form inputs (supporting both legacy names and modern camelCase names) directly to these 23 parameters.

---

## 5. Production Directory Compatibility & Path Analysis

The filesystem references in the PHP code were audited against standard cPanel directory structures:

```text
/home/<cpanel_user>/public_html/
│
├── .htaccess                                    # Root security & routing
├── index.html                                   # SPA root
├── apply-api/
│   ├── .htaccess                                # Subfolder protection
│   └── apply-submit.php                         # References dirname(__DIR__) -> public_html
│
├── career-api/
│   ├── .htaccess                                # Subfolder protection
│   ├── career-config.php                        # Config (if stored in web root)
│   ├── career-submit.php                        # References dirname(__DIR__) -> public_html
│   └── mail-automation/                         # Node.js service (optional)
│
└── webportal/                                   # Legacy cPanel Protected Subsystem
    ├── masterdb_config.php                      # Production MySQL connection
    └── resume/                                  # Upload destination (chmod 0755)
```

### Path Resolution Verification
1. **Admissions Database Config:**
   `apply-api/apply-submit.php` evaluates `$publicHtmlDirectory = dirname(__DIR__)`.
   When located at `/home/<user>/public_html/apply-api/apply-submit.php`, `$publicHtmlDirectory` evaluates to `/home/<user>/public_html`.
   `$legacyConfigPath = $publicHtmlDirectory . '/webportal/masterdb_config.php'` resolves accurately to `/home/<user>/public_html/webportal/masterdb_config.php`.
2. **Career Database Config:**
   `career-api/career-submit.php` performs the identical resolution for `$legacyConfigPath`.
3. **Resume Storage Directory:**
   Resolved to `$publicHtmlDirectory . '/webportal/resume'`.
   The PHP script includes an auto-creation fallback: `if (!is_dir($uploadDir) && !mkdir($uploadDir, 0750, true)) ...`.
   *Action Required:* The administrator must ensure `webportal/resume` exists with `0755` permissions so the web server process has write access.

---

## 6. Verified Findings vs. Unverified Assumptions

In strict compliance with audit standards, the operational status is categorized below:

### 6.1 Verified Findings (Confirmed Locally)
1. **Static Files & Routes:** All 34 clean URLs, 4 standalone portals, and 7 lab pages are 100% structurally complete and verified via 191 regression assertions.
2. **Apache Rules:** Rewrite directives, security headers, legacy aliases, and HTTPS exclusion rules are structurally sound.
3. **PHP Source Syntax:** All PHP source files conform strictly to PHP 8.1/8.2 syntax and modern security standards (magic byte filtering, parameterized SQL, origin verification).
4. **Defense-in-Depth:** Root `.htaccess` and subfolder `.htaccess` files protect sensitive configuration, schemas, and dotfiles.

### 6.2 Unverified Assumptions (Requiring Live cPanel Confirmation)
1. **Live MySQL Connection:** Direct execution of MySQL queries remains unverified because cPanel MySQL credentials and live database host are not accessible from this local Windows workstation.
2. **`webportal/masterdb_config.php` Existence:** The existence and active credentials of this legacy file must be confirmed by the cPanel administrator.
3. **Live Table Schemas:** Confirmation that the live MySQL database contains the tables `` `application` `` and `` `applicant` `` with the expected column types.
4. **PHP Extension Availability:** Confirmation that `mysqli` and `curl` are enabled in the cPanel MultiPHP configuration.
5. **Directory Permissions:** Confirmation that `public_html/webportal/resume/` has write permissions (`0755` or `0750`).

---

## 7. Required Administrator Actions Before Deployment

The cPanel administrator must execute the following non-destructive verification steps on the production server prior to cutting over:

1. **Verify PHP Version & Extensions:**
   - Log into cPanel &rarr; MultiPHP Manager &rarr; Ensure domain `siet.ac.in` is set to **PHP 8.2** (or PHP 8.1).
   - In MultiPHP INI Editor &rarr; Ensure `upload_max_filesize` is at least `5M` and `post_max_size` is at least `8M`.
   - Confirm `mysqli` and `curl` extensions are enabled.
2. **Verify Legacy Database File:**
   - Confirm file exists at: `public_html/webportal/masterdb_config.php`.
   - Verify it defines a valid `$masterdb_con` variable of type `mysqli`.
3. **Verify MySQL Database Tables:**
   - In phpMyAdmin &rarr; Check database `sietasru_masterdb` (or active database name).
   - Confirm table `application` exists with the columns listed in Section 4.1.
   - Confirm table `applicant` exists with the columns listed in Section 4.2.
4. **Verify Resume Directory:**
   - Confirm directory `public_html/webportal/resume` exists.
   - Ensure directory permissions are set to `0755` (owned by cPanel user).
5. **Synchronize Codebase Files:**
   - Upload all site files, ensuring `data/` (SQLite files) and `scratch/` are excluded.

---

## 8. Final Hosting Compatibility Verdict

**VERDICT: CONDITIONALLY COMPATIBLE / READY FOR STAGED HOSTING ONBOARDING**

The codebase architecture is completely aligned with Apache/LiteSpeed + PHP 8.2 + MySQL hosting standards. There are zero structural code blockers. Once the server administrator confirms the four prerequisites outlined in Section 7 (database config presence, table schemas, PHP extensions, and upload folder permissions), the website is fully prepared for successful live production operation.

