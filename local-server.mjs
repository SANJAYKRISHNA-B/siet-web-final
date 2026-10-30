import { createReadStream, existsSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { basename, extname, join, normalize } from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = import.meta.dirname || process.cwd();
const port = Number(process.env.PORT || 4173);
const MAX_BODY_SIZE = 100 * 1024; // 100 KB payload limit to prevent memory exhaustion DoS

const careerDataDir = join(root, "data");
const careerUploadDir = join(careerDataDir, "career-resumes");
mkdirSync(careerUploadDir, { recursive: true });
const careerDb = new DatabaseSync(join(careerDataDir, "career-applications.sqlite"));
careerDb.exec(readFileSync(join(root, "career-api", "local-career-schema.sql"), "utf8"));
const applyDb = new DatabaseSync(join(careerDataDir, "apply-applications.sqlite"));
applyDb.exec(readFileSync(join(root, "apply-api", "local-application-schema.sql"), "utf8"));
const insertApplyApplication = applyDb.prepare(`
  INSERT INTO applications (
    name, mobile, email, location, course, message, other,
    previous_qualification, course_level, academic_qualification_marks
  ) VALUES (
    @name, @mobile, @email, @location, @course, @message, @other,
    @previousQualification, @courseLevel, @academicMarks
  )
`);
const insertCareerApplication = careerDb.prepare(`
  INSERT INTO career_applications (
    application_no, name, phone, email, date_of_birth, country, state, city,
    institution, category, position, department, qualification, social_category,
    current_institution, current_position, current_salary, expected_salary,
    notice_period, teaching_experience, industrial_experience, research_experience,
    opening_source, message, resume_original_name, resume_stored_name,
    resume_mime_type, resume_size, ip_address
  ) VALUES (
    @applicationNo, @name, @phone, @email, @dateOfBirth, @country, @state, @city,
    @institution, @category, @position, @department, @qualification, @socialCategory,
    @currentInstitution, @currentPosition, @currentSalary, @expectedSalary,
    @noticePeriod, @teachingExperience, @industrialExperience, @researchExperience,
    @openingSource, @message, @resumeOriginalName, @resumeStoredName,
    @resumeMimeType, @resumeSize, @ipAddress
  )
`);

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  response.end(JSON.stringify(payload));
}

function containsControlCharacters(value, allowNewlines = false) {
  return (allowNewlines ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value);
}

function isSameOriginRequest(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host.toLowerCase() === String(request.headers.host || "").toLowerCase();
  } catch {
    return false;
  }
}

function handleLocalApplySubmission(request, response) {
  const chunks = [];
  let requestSize = 0;
  request.on("data", chunk => {
    requestSize += chunk.length;
    if (requestSize > MAX_BODY_SIZE) request.destroy();
    else chunks.push(chunk);
  });
  request.on("end", () => {
    try {
      const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!input || typeof input !== "object" || Array.isArray(input)) return sendJson(response, 400, { success: false, message: "Invalid JSON request." });
      const location = [input.city, input.district, input.state, input.country]
        .map(value => String(value || "").trim()).filter(Boolean).join(", ");
      const level = String(input.course || "").trim();
      const department = String(input.department || "").trim();
      const values = {
        name: String(input.studentName || input.name || "").trim(),
        mobile: String(input.mobileNumber || input.mobile || "").trim(),
        email: String(input.email || "").trim().toLowerCase(),
        location,
        course: level,
        message: String(input.remarks || input.message || "").trim(),
        other: String(input.other || input.source || "Website").trim(),
        previousQualification: String(input.previousQualification || "").trim(),
        courseLevel: `${level} - ${department}`.trim().replace(/^ - | - $/g, ""),
        academicMarks: String(input.academicQualificationMarks || "").trim(),
        district: String(input.district || "").trim(), state: String(input.state || "").trim(), country: String(input.country || "").trim()
      };
      const required = ["name", "mobile", "email", "location", "course", "message", "other", "previousQualification", "department", "academicMarks", "district", "state", "country"];
      const missing = required.filter(key => !values[key]);
      if (missing.length) return sendJson(response, 422, { success: false, message: "Please complete all required fields.", fields: missing });
      if (!/^\S+@\S+\.\S+$/.test(values.email)) return sendJson(response, 422, { success: false, message: "Enter a valid email address." });
      if (!/^[0-9]{10}$/.test(values.mobile)) return sendJson(response, 422, { success: false, message: "Enter a 10-digit mobile number using numbers only." });
      if (!/^[\p{L}\p{M} .'’-]{2,50}$/u.test(values.name)) return sendJson(response, 422, { success: false, message: "Enter a valid name using letters only." });
      if (!["UG", "PG", "Ph.D"].includes(level)) return sendJson(response, 422, { success: false, message: "Select a valid course level." });
      if (!["12th", "Diploma"].includes(values.previousQualification)) return sendJson(response, 422, { success: false, message: "Select a valid previous qualification." });
      if ([...values.message].length < 5 || [...values.message].length > 5000 || containsControlCharacters(values.message, true)) return sendJson(response, 422, { success: false, message: "Enter a query between 5 and 5,000 characters." });
      if (Object.entries(values).some(([key, value]) => key !== "message" && containsControlCharacters(value))) return sendJson(response, 422, { success: false, message: "Remove control characters from the form fields." });
      const limits = { name: 50, mobile: 20, email: 50, location: 50, course: 30, other: 30, previousQualification: 150, courseLevel: 100, academicMarks: 150 };
      const tooLong = Object.entries(limits).filter(([key, max]) => [...values[key]].length > max).map(([key]) => key);
      if (tooLong.length) return sendJson(response, 422, { success: false, message: "Some answers exceed the database field limits. Please shorten them and try again.", fields: tooLong });
      if (input.consent !== true) return sendJson(response, 422, { success: false, message: "Please provide consent to submit your enquiry." });
      const result = insertApplyApplication.run(values);
      const id = Number(result.lastInsertRowid);
      return sendJson(response, 201, {
        success: true,
        message: "Your admission enquiry has been submitted successfully. Our admissions team will contact you shortly.",
        id,
        data: { id, studentName: values.name, mobileNumber: values.mobile, course: level, department }
      });
    } catch (error) {
      if (error instanceof SyntaxError) return sendJson(response, 400, { success: false, message: "Invalid JSON request." });
      console.error("Admission enquiry error:", error);
      return sendJson(response, 500, { success: false, message: "Unable to save your admission enquiry." });
    }
  });
}

function institutionCode(institution) {
  const normalized = String(institution || "").trim().toLowerCase();
  if (normalized.includes("food") || normalized.includes("lab")) return "FTL";
  if (normalized.includes("school")) return "SCH";
  return "ENG";
}

function indiaDateStamp() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const dateParts = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${dateParts.year}${dateParts.month}${dateParts.day}`;
}

function parseMultipart(buffer, boundary) {
  const fields = {};
  const files = {};
  const marker = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(marker) + marker.length + 2;
  while (start > marker.length + 1) {
    const next = buffer.indexOf(marker, start);
    if (next < 0) break;
    const part = buffer.subarray(start, Math.max(start, next - 2));
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd < 0) break;
    const headers = part.subarray(0, headerEnd).toString("utf8");
    const content = part.subarray(headerEnd + 4);
    const name = headers.match(/name="([^"]+)"/i)?.[1];
    const filename = headers.match(/filename="([^"]*)"/i)?.[1];
    if (name && filename) {
      files[name] = { filename: basename(filename), type: headers.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || "application/octet-stream", content };
    } else if (name) fields[name] = content.toString("utf8");
    start = next + marker.length + 2;
  }
  return { fields, files };
}

function validateResumeContent(filename, buffer) {
  if (!filename || typeof filename !== "string") {
    return { valid: false, message: "Resume file is required." };
  }
  if (!buffer || buffer.length < 100) {
    return { valid: false, message: "Resume file is empty or corrupted (minimum 100 bytes required)." };
  }
  if (buffer.length > 2 * 1024 * 1024) {
    return { valid: false, message: "Resume must not exceed 2 MB." };
  }
  const cleanName = filename.trim().replace(/^.*[\\\/]/, "");
  if (!cleanName || /[\0<>:"/\\|?*]/.test(cleanName)) {
    return { valid: false, message: "Filename contains invalid or dangerous characters." };
  }
  const forbiddenExtPattern = /(?:^|\.)(?:exe|bat|cmd|sh|php|phtml|phar|vbs|js|jar|scr|pif|msi|dll|com|hta|ps1|apk|bin|cgi|pl|py|wsf|cpl|gadget|iso|dmg|vhd)(?:\.|$)/i;
  if (forbiddenExtPattern.test(cleanName)) {
    return { valid: false, message: "Security Violation: Executable files (.exe, .bat, scripts) and malware are strictly prohibited." };
  }
  const extMatch = cleanName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  if (!["pdf", "doc", "docx", "rtf"].includes(ext)) {
    return { valid: false, message: "Resume must be a PDF, DOC, DOCX, or RTF document." };
  }
  const b0 = buffer[0], b1 = buffer[1], b2 = buffer[2], b3 = buffer[3];
  // Reject Windows / DOS PE Executable ('MZ')
  if (b0 === 0x4d && b1 === 0x5a) {
    return { valid: false, message: "Security Violation: Executable (.exe) binary detected. Executable files and malware are strictly prohibited." };
  }
  // Reject Linux ELF Executable
  if (b0 === 0x7f && b1 === 0x45 && b2 === 0x4c && b3 === 0x46) {
    return { valid: false, message: "Security Violation: Binary executable detected. Executables and malware are strictly prohibited." };
  }
  // Reject Mach-O
  if ((b0 === 0xfe && b1 === 0xed && b2 === 0xfa) || (b0 === 0xcf && b1 === 0xfa && b2 === 0xed) || (b0 === 0xca && b1 === 0xfe && b2 === 0xba)) {
    return { valid: false, message: "Security Violation: Mach-O executable binary detected." };
  }
  // Reject Scripts
  const headerAscii = buffer.slice(0, Math.min(buffer.length, 64)).toString("utf8").toLowerCase();
  if (headerAscii.startsWith("#!") || headerAscii.startsWith("<?php") || headerAscii.startsWith("<?") || headerAscii.includes("<script") || headerAscii.startsWith("@echo")) {
    return { valid: false, message: "Security Violation: Script file detected. Scripts and malware are strictly prohibited." };
  }
  // Whitelist signature verification
  if (ext === "pdf") {
    const pdfHeader = buffer.slice(0, Math.min(buffer.length, 1024)).toString("latin1");
    if (!pdfHeader.includes("%PDF-")) {
      return { valid: false, message: "Invalid document: The file does not have a valid PDF header (%PDF-)." };
    }
  } else if (ext === "docx") {
    if (b0 !== 0x50 || b1 !== 0x4b) {
      return { valid: false, message: "Invalid document: The file does not have a valid Word (DOCX) package header." };
    }
  } else if (ext === "doc") {
    if (b0 !== 0xd0 || b1 !== 0xcf || b2 !== 0x11 || b3 !== 0xe0) {
      return { valid: false, message: "Invalid document: The file does not have a valid Word (DOC) binary header." };
    }
  } else if (ext === "rtf") {
    if (!headerAscii.startsWith("{\\rtf")) {
      return { valid: false, message: "Invalid document: The file does not have a valid RTF header." };
    }
  }
  return { valid: true, cleanName, ext };
}

function handleLocalCareerSubmission(request, response) {
  const contentType = request.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.slice(1).find(Boolean);
  if (!boundary) return sendJson(response, 415, { success: false, message: "multipart/form-data is required" });
  const chunks = [];
  let requestSize = 0;
  let oversized = false;
  request.on("data", chunk => {
    requestSize += chunk.length;
    if (requestSize > 3 * 1024 * 1024) oversized = true;
    else chunks.push(chunk);
  });
  request.on("end", async () => {
    if (oversized) return sendJson(response, 413, { success: false, message: "Upload request is too large." });
    try {
      const { fields, files } = parseMultipart(Buffer.concat(chunks), boundary);
      const resume = files.resume;

      // 1. Mandatory fields
      const required = ["name", "phone", "email", "dateOfBirth", "country", "state", "city", "institution", "category", "position", "department", "qualification", "socialCategory", "expectedSalary"];
      const missing = required.filter(key => !String(fields[key] || "").trim());
      if (missing.length) return sendJson(response, 422, { success: false, message: `Please complete all required fields: ${missing.join(", ")}` });

      // 2. Name validation
      const name = String(fields.name || "").trim();
      if ([...name].length < 2 || [...name].length > 100 || !/^[\p{L}\p{M}\s.\-']+$/u.test(name)) {
        return sendJson(response, 422, { success: false, message: "Enter a valid full name (letters only, minimum 2 characters)." });
      }

      // 3. Contact number validation
      const phoneDigits = String(fields.phone || "").trim();
      if (!/^[0-9]{10}$/.test(phoneDigits)) {
        return sendJson(response, 422, { success: false, message: "Enter a 10-digit contact number using numbers only." });
      }

      // 4. Email validation
      const email = String(fields.email || "").trim().toLowerCase();
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return sendJson(response, 422, { success: false, message: "Enter a valid email address." });
      }

      const message = String(fields.message || "").trim();
      if ([...message].length > 2000 || containsControlCharacters(message, true)) {
        return sendJson(response, 422, { success: false, message: "The reason for changing position must be 2,000 characters or fewer." });
      }
      const boundedFields = ["department", "position", "qualification", "socialCategory", "country", "state", "city", "institution", "category", "currentInstitution", "currentPosition", "currentSalary", "expectedSalary", "noticePeriod", "openingSource"];
      if (boundedFields.some(key => [...String(fields[key] || "")].length > 200 || containsControlCharacters(String(fields[key] || "")))) {
        return sendJson(response, 422, { success: false, message: "One or more fields are too long or contain invalid control characters." });
      }

      // 5. Date of Birth & Age validation (must be 18 to 75 years old)
      const bday = new Date(fields.dateOfBirth);
      if (isNaN(bday.getTime())) {
        return sendJson(response, 422, { success: false, message: "Enter a valid Date of Birth (YYYY-MM-DD)." });
      }
      const today = new Date();
      let age = today.getFullYear() - bday.getFullYear();
      const m = today.getMonth() - bday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--;
      if (age < 18) {
        return sendJson(response, 422, { success: false, message: "Applicant must be at least 18 years of age to apply." });
      }

      // 6. Resume file & anti-malware verification
      if (!resume) {
        return sendJson(response, 422, { success: false, message: "Resume document is required." });
      }
      const resumeCheck = validateResumeContent(resume.filename, resume.content);
      if (!resumeCheck.valid) {
        return sendJson(response, 422, { success: false, message: resumeCheck.message });
      }

      const extension = "." + resumeCheck.ext;
      const applicationNo = `SIET-CAR-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const storedName = `${applicationNo}${extension}`;
      writeFileSync(join(careerUploadDir, storedName), resume.content, { flag: "wx" });

      const values = {
        applicationNo, name, phone: fields.phone.trim(), email,
        dateOfBirth: fields.dateOfBirth, country: fields.country.trim(), state: fields.state.trim(), city: fields.city.trim(),
        institution: fields.institution, category: fields.category, position: fields.position, department: fields.department,
        qualification: fields.qualification, socialCategory: fields.socialCategory, currentInstitution: fields.currentInstitution || "",
        currentPosition: fields.currentPosition || "", currentSalary: fields.currentSalary || "", expectedSalary: fields.expectedSalary,
        noticePeriod: fields.noticePeriod || "", teachingExperience: fields.teachingExperience || "0",
        industrialExperience: fields.industrialExperience || "0", researchExperience: fields.researchExperience || "0",
        openingSource: fields.openingSource || "", message, resumeOriginalName: resume.filename,
        resumeStoredName: storedName, resumeMimeType: resume.type, resumeSize: resume.content.length,
        ipAddress: request.socket.remoteAddress || ""
      };
      const result = insertCareerApplication.run(values);
      const applicationId = Number(result.lastInsertRowid);
      const finalApplicationNo = `SIET-${institutionCode(values.institution)}-${indiaDateStamp()}-${String(applicationId).padStart(6, "0")}`;
      careerDb.prepare("UPDATE career_applications SET application_no = ? WHERE id = ?").run(finalApplicationNo, applicationId);
      let mailQueued = false;
      const mailWebhookUrl = process.env.CAREER_MAIL_WEBHOOK_URL;
      const mailWebhookToken = process.env.CAREER_MAIL_WEBHOOK_TOKEN;
      if (mailWebhookUrl && mailWebhookToken) {
        try {
          const mailResponse = await fetch(mailWebhookUrl, {
            method: "POST",
            headers: {"Content-Type":"application/json","X-Career-Mail-Token":mailWebhookToken},
            body: JSON.stringify({
              applicationNo: finalApplicationNo, fullname: values.name, email: values.email, mobile: values.phone,
              institute: values.institution, dept: values.department, position: values.position,
              highQualification: values.qualification, city: values.city, state: values.state,
              country: values.country, teaching: values.teachingExperience,
              industry: values.industrialExperience, research: values.researchExperience,
              expectedSalary: values.expectedSalary, noticePeriod: values.noticePeriod,
              source: values.openingSource, message: values.message, resume: storedName
            })
          });
          mailQueued = mailResponse.ok;
          if (!mailResponse.ok) console.error("Career mail webhook returned", mailResponse.status);
        } catch (mailError) {
          console.error("Career mail webhook error:", mailError.message);
        }
      }
      return sendJson(response, 201, { success: true, message: "Your application has been saved successfully.", applicationNo: finalApplicationNo, id: applicationId, mailQueued });
    } catch (error) {
      console.error("Career application error:", error);
      return sendJson(response, 500, { success: false, message: "Unable to save the application" });
    }
  });
}

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

createServer((request, response) => {
  // Apply baseline security headers
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "SAMEORIGIN");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Handle CORS Preflight OPTIONS
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    response.end();
    return;
  }

  // Career Application Submissions
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const localApiPath = requestUrl.pathname;
  if (localApiPath === "/apply-api/apply-submit.php") {
    if (!isSameOriginRequest(request)) sendJson(response, 403, { success: false, message: "Cross-origin form submissions are not allowed." });
    else if (request.method === "POST") handleLocalApplySubmission(request, response);
    else sendJson(response, 405, { success: false, message: "POST method required." });
    return;
  }
  if (localApiPath === "/career-api/career-submit.php") {
    if (!isSameOriginRequest(request)) sendJson(response, 403, { success: false, message: "Cross-origin form submissions are not allowed." });
    else if (request.method === "POST") {
      handleLocalCareerSubmission(request, response);
    } else {
      sendJson(response, 405, { success: false, message: "POST method required" });
    }
    return;
  }

  if (request.method === "GET" && localApiPath === "/api/careers/applications") {
    const applications = careerDb.prepare("SELECT id, application_no, name, email, phone, institution, category, position, department, qualification, resume_original_name, created_at FROM career_applications ORDER BY id DESC LIMIT 100").all();
    sendJson(response, 200, { success: true, count: applications.length, applications });
    return;
  }

  // 1. API Endpoint: Space Whiz 2026 Registration
  if (localApiPath.startsWith("/api/space-whiz/register") || localApiPath.startsWith("/api/sssm/register")) {
    if (request.method !== "POST") {
      response.writeHead(405, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }));
      return;
    }

    let body = "";
    let bodyLength = 0;
    let destroyed = false;

    request.on("data", chunk => {
      bodyLength += chunk.length;
      if (bodyLength > MAX_BODY_SIZE) {
        destroyed = true;
        response.writeHead(413, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, error: "Payload too large. Maximum 100 KB permitted." }));
        request.destroy();
        return;
      }
      body += chunk;
    });

    request.on("end", () => {
      if (destroyed) return;
      let parsed = {};
      try { parsed = JSON.parse(body); } catch(e) {}
      const regId = "SW26-" + Math.floor(1000 + Math.random() * 9000);
      const record = {
        regNo: regId,
        studentName: String(parsed.student_name || parsed.name || "Student").slice(0, 100),
        standard: String(parsed.standard || "10th/11th/12th STD").slice(0, 50),
        schoolName: String(parsed.school_name || "School").slice(0, 150),
        city: String(parsed.city || "City").slice(0, 80),
        phone: String(parsed.phone || "").slice(0, 25),
        email: String(parsed.email || "").slice(0, 100),
        mentorInfo: String(parsed.mentor_info || "").slice(0, 200),
        timestamp: new Date().toISOString()
      };
      try {
        if (!existsSync("data")) mkdirSync("data");
        let all = [];
        if (existsSync("data/space-whiz-registrations.json")) {
          all = JSON.parse(readFileSync("data/space-whiz-registrations.json", "utf8"));
        }
        all.push(record);
        writeFileSync("data/space-whiz-registrations.json", JSON.stringify(all, null, 2), "utf8");
      } catch(err) {
        console.error("Failed to save space whiz registration:", err);
      }
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      response.end(JSON.stringify({
        success: true,
        regNo: regId,
        message: "Registration successful for Space Whiz 2026",
        record: record
      }));
    });
    return;
  }

  // 2. API Endpoint: Admissions Enquiries
  if (localApiPath.startsWith("/api/admission-enquiries") || localApiPath.startsWith("/api/enquiries")) {
    if (request.method !== "POST") {
      response.writeHead(405, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }));
      return;
    }

    let body = "";
    let bodyLength = 0;
    let destroyed = false;

    request.on("data", chunk => {
      bodyLength += chunk.length;
      if (bodyLength > MAX_BODY_SIZE) {
        destroyed = true;
        response.writeHead(413, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, error: "Payload too large. Maximum 100 KB permitted." }));
        request.destroy();
        return;
      }
      body += chunk;
    });

    request.on("end", () => {
      if (destroyed) return;
      let parsed = {};
      try { parsed = JSON.parse(body); } catch(e) {}

      // Validation for Admission Enquiries
      const sName = String(parsed.studentName || parsed.name || "").trim();
      const sPhone = String(parsed.mobileNumber || parsed.phone || "").replace(/\D/g, "");
      const sEmail = String(parsed.email || "").trim().toLowerCase();
      const sCourse = String(parsed.course || "").trim();
      const sDept = String(parsed.department || "").trim();
      const sConsent = parsed.consent === true || parsed.consent === "true" || parsed.consent === "on" || parsed.consent === 1;

      if (!sName || sName.length < 2 || !/^[a-zA-Z\s\.\-']{2,100}$/.test(sName)) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please enter your full name (minimum 2 characters, letters only)." }));
        return;
      }
      if (sPhone.length !== 10) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please enter a valid 10-digit mobile number." }));
        return;
      }
      if (!sEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(sEmail)) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please enter a valid email address." }));
        return;
      }
      if (!sCourse) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please select your preferred course level (UG, PG, or Ph.D)." }));
        return;
      }
      if (!sDept) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please select your preferred department." }));
        return;
      }
      if (!sConsent) {
        response.writeHead(422, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
        response.end(JSON.stringify({ success: false, message: "Please provide contact consent to submit your application." }));
        return;
      }

      const enquiryId = Date.now();
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      response.end(JSON.stringify({
        success: true,
        message: "Thank you! Your admission enquiry has been recorded successfully. Our academic counseling team will contact you shortly.",
        data: {
          id: enquiryId,
          studentName: sName,
          mobileNumber: sPhone,
          course: sCourse,
          department: sDept
        }
      }));
    });
    return;
  }

  // 3. Static File & Path Routing
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath.replace(/^\/+/, "");
  const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const cleanPath = safePath.toLowerCase().replace(/^[\\/]+|[\\/]+$/g, "");

  // Intrusion & Sensitive Data Exposure Guard
  // Blocks access to .git, .gitignore, .vscode, data directory, scratch scripts, .env, and hidden dotfiles
  if (
    cleanPath &&
    cleanPath !== "." &&
    (
      cleanPath.startsWith(".git") ||
    cleanPath.startsWith("data") ||
    cleanPath.startsWith("scratch") ||
    cleanPath.startsWith(".vscode") ||
    cleanPath.startsWith(".env") ||
    cleanPath.startsWith("package") ||
      cleanPath.endsWith(".sql") ||
    cleanPath.includes("/.") ||
    cleanPath.includes("\\.") ||
    cleanPath.startsWith(".")
    )
  ) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("403 Forbidden: Access to sensitive path denied.");
    return;
  }

  // Legacy Aliases & Domain Redirections
  const legacyAliases = {
    "superstars.jpg": "/brand/placement-superstars-2025-26.webp",
    "superstars.webp": "/brand/placement-superstars-2025-26.webp",
    "sietlogo.png": "/brand/siet-logo.png",
    "sietlogo.webp": "/brand/siet-logo.webp",
    "naac logo.jpg": "/brand/naac-grade-logo.webp",
    "naac logo.webp": "/brand/naac-grade-logo.webp",
    "nba logo.png": "/brand/nba-logo.webp",
    "nba logo.webp": "/brand/nba-logo.webp"
  };

  if (legacyAliases[cleanPath]) {
    response.writeHead(301, { Location: legacyAliases[cleanPath] });
    response.end();
    return;
  }

  if (cleanPath === "mydreamindia" || cleanPath === "my-dream-india") {
    response.writeHead(302, { Location: "/mdfi/" });
    response.end();
    return;
  }

  if (cleanPath === "labs" || cleanPath === "special-labs") {
    response.writeHead(302, { Location: "/labs.html" });
    response.end();
    return;
  }

  if (["sri-shakthi-space-mission", "sri shakthi space mission", "sri-shakthi-space-mission.php", "space-mission", "space-whiz", "spacewhiz", "shakthisat", "srishakthisat", "space", "ssm"].includes(cleanPath)) {
    response.writeHead(302, { Location: "/sssm/" });
    response.end();
    return;
  }

  let filePath = join(root, safePath);

  if (safePath && existsSync(filePath) && statSync(filePath).isDirectory()) {
    const directoryIndex = join(filePath, "index.html");
    filePath = existsSync(directoryIndex) ? directoryIndex : join(root, "index.html");
  } else if (safePath && !existsSync(filePath) && extname(safePath)) {
    // Never serve the SPA HTML fallback for a missing JS/CSS/image request.
    response.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    response.end("Asset not found");
    return;
  } else if (!safePath || !existsSync(filePath)) {
    filePath = join(root, "index.html");
  } else {
    // Transparent WebP negotiation for compatible clients
    const ext = extname(filePath).toLowerCase();
    const acceptHeader = request.headers.accept || "";
    if (
      (ext === ".png" || ext === ".jpg" || ext === ".jpeg") &&
      acceptHeader.includes("image/webp")
    ) {
      const webpPath = filePath.slice(0, -ext.length) + ".webp";
      if (existsSync(webpPath)) {
        filePath = webpPath;
      }
    }
  }

  const isHtml = filePath.endsWith("index.html") || filePath.endsWith("labs.html");
  const ext = extname(filePath).toLowerCase();

  response.writeHead(200, {
    "Content-Type": contentTypes[ext] || "application/octet-stream",
    "Cache-Control": (isHtml || ext === ".js" || ext === ".css" || ext === ".mjs") ? "no-cache, no-store, must-revalidate" : "public, max-age=31536000, immutable",
    "Vary": "Accept",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`SIET local site: http://localhost:${port}/`);
  console.log(`SIET local site: http://127.0.0.1:${port}/`);
  console.log(`DCS Summary:    http://localhost:${port}/dcs-summary`);
});
