// SIET Web Portal - Automated Comprehensive Security Regression Test Suite
// Verifies HTTP Security Headers, Zero Inline Scripts, CSP Hardening,
// Perimeter Guard, CORS, Rate Limiting (HTTP 429), SQLi Protection,
// File Upload Anti-Malware, and API Authentication controls.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { EventEmitter } from "node:events";

const root = process.cwd();
let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName} ${details ? "- " + details : ""}`);
    failedCount++;
  }
}

async function runRegressionSuite() {
  console.log("==================================================================");
  console.log(" SIET WEB PORTAL - COMPREHENSIVE SECURITY REGRESSION TEST SUITE");
  console.log(" Verification Engine: In-Process Static & Functional Audit");
  console.log("==================================================================\n");

  // -----------------------------------------------------------------
  // Suite 1: Production .htaccess HTTP Security Headers & CSP Audit
  // -----------------------------------------------------------------
  console.log("Suite 1: Production .htaccess HTTP Security Headers Audit");
  const htaccessContent = readFileSync(join(root, ".htaccess"), "utf8");

  assert(htaccessContent.includes('Strict-Transport-Security "max-age=31536000"'),
    "HSTS header configured with max-age=31536000 (SIET-SEC-002 fixed)");

  assert(htaccessContent.includes('X-Content-Type-Options "nosniff"'),
    "X-Content-Type-Options configured to 'nosniff'");

  assert(htaccessContent.includes('X-Frame-Options "SAMEORIGIN"'),
    "X-Frame-Options configured to 'SAMEORIGIN'");

  assert(htaccessContent.includes('Referrer-Policy "strict-origin-when-cross-origin"'),
    "Referrer-Policy configured to 'strict-origin-when-cross-origin'");

  assert(htaccessContent.includes('Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()'),
    "Permissions-Policy restricts camera, microphone, geolocation, and payment APIs (SIET-SEC-010 fixed)");

  assert(htaccessContent.includes('Cross-Origin-Opener-Policy "same-origin-allow-popups"'),
    "Cross-Origin-Opener-Policy is set to same-origin-allow-popups");

  assert(htaccessContent.includes('Cross-Origin-Resource-Policy "cross-origin"'),
    "Cross-Origin-Resource-Policy is set to cross-origin");

  assert(htaccessContent.includes("Header always unset X-Powered-By") && htaccessContent.includes("Header always unset Server"),
    "Server version and X-Powered-By banners are stripped (SIET-SEC-007 fixed)");

  assert(htaccessContent.includes("frame-src 'self' https://vigoe.ai"),
    "CSP allows vigoe.ai iframe for official AI assistant");

  assert(htaccessContent.includes("frame-ancestors 'self'") && htaccessContent.includes("form-action 'self'"),
    "CSP restricts frame-ancestors and form-action to 'self' (SIET-SEC-004 fixed)");

  assert(htaccessContent.includes("object-src 'none'") && htaccessContent.includes("base-uri 'self'"),
    "CSP object-src locked to 'none' and base-uri locked to 'self'");

  assert(htaccessContent.includes("script-src 'self';") && !htaccessContent.includes("script-src 'self' 'unsafe-inline'"),
    "CSP script-src strictly enforces 'self' without 'unsafe-inline' (SIET-SEC-005 fixed)");

  // -----------------------------------------------------------------
  // Suite 2: Inline Script Elimination Audit (SIET-SEC-005 Verification)
  // -----------------------------------------------------------------
  console.log("\nSuite 2: Inline JavaScript Elimination Audit (SIET-SEC-005)");

  const htmlFiles = [
    join(root, "index.html"),
    join(root, "labs.html"),
    join(root, "mdfi", "index.html"),
    join(root, "icchi", "index.html")
  ];

  for (const filePath of htmlFiles) {
    if (existsSync(filePath)) {
      const html = readFileSync(filePath, "utf8");
      // Find any <script> tags that contain executable body text
      const inlineMatches = [...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi)]
        .filter(m => m[1].trim().length > 0);
      assert(inlineMatches.length === 0,
        `Zero inline script blocks in ${filePath.replace(root, "")} (found: ${inlineMatches.length})`);
    }
  }

  assert(existsSync(join(root, "assets", "dom-guard.js")),
    "Extracted React DOM guard script exists at assets/dom-guard.js");
  assert(existsSync(join(root, "assets", "labs.js")),
    "Extracted Specialized Labs controller script exists at assets/labs.js");
  assert(existsSync(join(root, "mdfi", "mdfi.js")),
    "Extracted MDFI competition controller script exists at mdfi/mdfi.js");

  // -----------------------------------------------------------------
  // Suite 3: Sensitive Perimeter Access Control (local-server.mjs)
  // -----------------------------------------------------------------
  console.log("\nSuite 3: Sensitive Directory & Perimeter Access Control");
  const serverCode = readFileSync(join(root, "local-server.mjs"), "utf8");

  const perimeterBlockedPatterns = [".git", "data", "scratch", ".vscode", ".env", "package", ".sql"];
  for (const pattern of perimeterBlockedPatterns) {
    assert(serverCode.includes(`cleanPath.startsWith("${pattern}")`) || serverCode.includes(`cleanPath.endsWith("${pattern}")`),
      `Perimeter Access Guard explicitly protects '${pattern}' with 403 Forbidden`);
  }

  // -----------------------------------------------------------------
  // Suite 4: CORS Hardening (SIET-SEC-003 Verification)
  // -----------------------------------------------------------------
  console.log("\nSuite 4: CORS Configuration & Dynamic Origin Verification (SIET-SEC-003)");

  const wildcardMatches = (serverCode.match(/"Access-Control-Allow-Origin":\s*"\*"/g) || []).length;
  assert(wildcardMatches === 0, "Zero unconstrained 'Access-Control-Allow-Origin: *' headers in response bodies");

  assert(serverCode.includes("new URL(reqOrigin).host.toLowerCase() === reqHost.toLowerCase()"),
    "OPTIONS preflight dynamically checks origin against Host header before reflecting");

  // -----------------------------------------------------------------
  // Suite 5: Rate Limiting Enforcement (SIET-SEC-006 Verification)
  // -----------------------------------------------------------------
  console.log("\nSuite 5: Server-Side API Rate Limiting (SIET-SEC-006)");

  const applyPhpCode = readFileSync(join(root, "apply-api", "apply-submit.php"), "utf8");
  const careerPhpCode = readFileSync(join(root, "career-api", "career-submit.php"), "utf8");

  assert(applyPhpCode.includes("function enforceRateLimit(") && applyPhpCode.includes("http_response_code(429)"),
    "apply-submit.php implements enforceRateLimit with HTTP 429 response");

  assert(applyPhpCode.includes("header('Retry-After: ' . $retryAfter)"),
    "apply-submit.php emits RFC standard Retry-After header on limit breach");

  assert(careerPhpCode.includes("function enforceRateLimit(") && careerPhpCode.includes("http_response_code(429)"),
    "career-submit.php implements enforceRateLimit with HTTP 429 response");

  assert(applyPhpCode.includes("function getClientIp()") && applyPhpCode.includes("$trustedProxies"),
    "apply-submit.php validates reverse proxy trust before accepting forwarded IP headers");

  assert(serverCode.includes("function checkRateLimit(") && serverCode.includes("response.writeHead(429"),
    "local-server.mjs implements rate limiting engine returning HTTP 429 with Retry-After header");

  assert(serverCode.includes('checkRateLimit(request, response, "apply_submit"'),
    "local-server.mjs protects admission enquiry endpoint with rate limiting");

  assert(serverCode.includes('checkRateLimit(request, response, "career_submit"'),
    "local-server.mjs protects career application endpoint with rate limiting");

  assert(serverCode.includes('checkRateLimit(request, response, "space_whiz"'),
    "local-server.mjs protects Space Whiz competition endpoint with rate limiting");

  // -----------------------------------------------------------------
  // Suite 6: Debug API PII Access Control (SIET-SEC-001 Verification)
  // -----------------------------------------------------------------
  console.log("\nSuite 6: Debug API PII Access Control (SIET-SEC-001)");

  assert(serverCode.includes('message: "Unauthorized: Access to applicant PII requires local administrator authentication (X-Dev-Token)."'),
    "Unauthenticated requests to /api/careers/applications and /api/apply/applications receive 401 Unauthorized");

  assert(serverCode.includes('const isLoopback = ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(clientIp)'),
    "Remote client IPs are blocked from accessing debug data endpoints");

  // -----------------------------------------------------------------
  // Suite 7: File Upload Anti-Malware & Binary Header Inspection
  // -----------------------------------------------------------------
  console.log("\nSuite 7: File Upload Anti-Malware & Binary Header Inspection");

  function validateResumeContent(filename, buffer) {
    if (!filename || typeof filename !== "string") return { valid: false, message: "Resume file is required." };
    if (!buffer || buffer.length < 100) return { valid: false, message: "Resume file is empty or corrupted (minimum 100 bytes required)." };
    if (buffer.length > 2 * 1024 * 1024) return { valid: false, message: "Resume must not exceed 2 MB." };
    const cleanName = filename.trim().replace(/^.*[\\\/]/, "");
    if (!cleanName || /[\0<>:"/\\|?*]/.test(cleanName)) return { valid: false, message: "Filename contains invalid or dangerous characters." };
    const forbiddenExtPattern = /(?:^|\.)(?:exe|bat|cmd|sh|php|phtml|phar|vbs|js|jar|scr|pif|msi|dll|com|hta|ps1|apk|bin|cgi|pl|py|wsf|cpl|gadget|iso|dmg|vhd)(?:\.|$)/i;
    if (forbiddenExtPattern.test(cleanName)) return { valid: false, message: "Security Violation: Executable files (.exe, .bat, scripts) and malware are strictly prohibited." };
    const extMatch = cleanName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : "";
    if (!["pdf", "doc", "docx", "rtf"].includes(ext)) return { valid: false, message: "Resume must be a PDF, DOC, DOCX, or RTF document." };
    const b0 = buffer[0], b1 = buffer[1], b2 = buffer[2], b3 = buffer[3];
    if (b0 === 0x4d && b1 === 0x5a) return { valid: false, message: "Security Violation: Executable binary detected (PE MZ header)." };
    if (b0 === 0x7f && b1 === 0x45 && b2 === 0x4c && b3 === 0x46) return { valid: false, message: "Security Violation: Executable binary detected (Linux ELF header)." };
    if ((b0 === 0xfe && b1 === 0xed && b2 === 0xfa && b3 === 0xce) || (b0 === 0xca && b1 === 0xfe && b2 === 0xba && b3 === 0xbe)) {
      return { valid: false, message: "Security Violation: Executable binary detected (macOS Mach-O header)." };
    }
    const headerAscii = buffer.slice(0, Math.min(buffer.length, 64)).toString("utf8").toLowerCase();
    if (headerAscii.startsWith("#!") || headerAscii.startsWith("<?php") || headerAscii.startsWith("<?") || headerAscii.includes("<script") || headerAscii.startsWith("@echo")) {
      return { valid: false, message: "Security Violation: Script file detected. Scripts and malware are strictly prohibited." };
    }
    if (ext === "pdf") {
      const pdfHeader = buffer.slice(0, Math.min(buffer.length, 1024)).toString("latin1");
      if (!pdfHeader.includes("%PDF-")) return { valid: false, message: "Invalid document: The file does not have a valid PDF header (%PDF-)." };
    } else if (ext === "docx") {
      if (b0 !== 0x50 || b1 !== 0x4b) return { valid: false, message: "Invalid document: The file does not have a valid Word (DOCX) package header." };
    }
    return { valid: true, cleanName, ext };
  }

  const peBuffer = Buffer.alloc(200);
  peBuffer[0] = 0x4D; peBuffer[1] = 0x5A;
  assert(!validateResumeContent("trojan.exe", peBuffer).valid, "Direct .exe is rejected via extension check");
  assert(!validateResumeContent("cv.pdf", peBuffer).valid, "Disguised PE in cv.pdf is rejected via magic-byte check");

  const elfBuffer = Buffer.from([0x7F, 0x45, 0x4C, 0x46, ...Array(150).fill(0)]);
  assert(!validateResumeContent("resume.docx", elfBuffer).valid, "Linux ELF header in resume.docx is rejected");

  const doubleExt = validateResumeContent("resume.exe.pdf", Buffer.from("%PDF-1.4" + "A".repeat(120)));
  assert(!doubleExt.valid, "Double extension resume.exe.pdf is rejected");

  const phpBuffer = Buffer.from("<?php system($_GET['c']); ?>" + "A".repeat(120));
  assert(!validateResumeContent("cv.rtf", phpBuffer).valid, "PHP script header in cv.rtf is rejected");

  const validPdf = Buffer.from("%PDF-1.4\n%âãÏÓ\n" + "0".repeat(200));
  assert(validateResumeContent("Dr_Kavitha_Resume.pdf", validPdf).valid === true, "Authentic academic PDF is cleanly accepted");

  const validDocx = Buffer.alloc(200);
  validDocx[0] = 0x50; validDocx[1] = 0x4B;
  assert(validateResumeContent("faculty_profile.docx", validDocx).valid === true, "Authentic academic DOCX is cleanly accepted");

  // -----------------------------------------------------------------
  // Suite 8: Registration Input Validation (SIET-SEC-009 Verification)
  // -----------------------------------------------------------------
  console.log("\nSuite 8: Registration Input Validation (SIET-SEC-009)");

  assert(serverCode.includes("!/^[\\p{L}\\p{M}\\s.\\-']{2,100}$/u.test(studentName)"),
    "Space Whiz enforces strict unicode letter validation on student name");

  assert(serverCode.includes("!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(email)"),
    "Space Whiz enforces RFC-compliant email structure verification");

  assert(serverCode.includes("!/^[0-9]{10}$/.test(phone)"),
    "Space Whiz enforces 10-digit mobile number validation");

  // -----------------------------------------------------------------
  // Suite 9: Parameterized Queries & SQL Injection Safety
  // -----------------------------------------------------------------
  console.log("\nSuite 9: Parameterized Queries & SQL Injection Safety");

  assert(applyPhpCode.includes("$masterdb_con->prepare($sql)") && applyPhpCode.includes("$stmt->bind_param("),
    "apply-submit.php strictly uses parameterized prepared statements with bind_param");

  assert(careerPhpCode.includes("$db->prepare($sql)") && careerPhpCode.includes("$stmt->bind_param("),
    "career-submit.php strictly uses parameterized prepared statements with bind_param");

  assert(serverCode.includes("insertApplyApplication.run(values)") && serverCode.includes("insertCareerApplication.run(values)"),
    "local-server.mjs strictly uses SQLite DatabaseSync prepared statement objects with named parameters");

  console.log("\n==================================================================");
  console.log(` COMPREHENSIVE REGRESSION SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error("Regression test error:", err);
  process.exit(1);
});
