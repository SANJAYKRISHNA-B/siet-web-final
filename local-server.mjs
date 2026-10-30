import { createReadStream, existsSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
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
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
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

function handleLocalCareerSubmission(request, response) {
  const contentType = request.headers["content-type"] || "";
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.slice(1).find(Boolean);
  if (!boundary) return sendJson(response, 415, { success: false, message: "multipart/form-data is required" });
  const chunks = [];
  let requestSize = 0;
  request.on("data", chunk => {
    requestSize += chunk.length;
    if (requestSize > 3 * 1024 * 1024) request.destroy();
    else chunks.push(chunk);
  });
  request.on("end", async () => {
    try {
      const { fields, files } = parseMultipart(Buffer.concat(chunks), boundary);
      const resume = files.resume;
      const required = ["name", "phone", "email", "dateOfBirth", "country", "institution", "category", "position", "department", "qualification", "socialCategory", "expectedSalary"];
      const missing = required.filter(key => !String(fields[key] || "").trim());
      if (missing.length) return sendJson(response, 400, { success: false, message: `Missing required fields: ${missing.join(", ")}` });
      if (!/^\S+@\S+\.\S+$/.test(fields.email)) return sendJson(response, 400, { success: false, message: "Enter a valid email address" });
      if (!resume) return sendJson(response, 400, { success: false, message: "Resume is required" });
      if (resume.content.length > 2 * 1024 * 1024) return sendJson(response, 413, { success: false, message: "Resume must not exceed 2 MB" });
      const extension = extname(resume.filename).toLowerCase();
      if (![".pdf", ".doc", ".docx", ".rtf"].includes(extension)) return sendJson(response, 400, { success: false, message: "Resume must be PDF, DOC, DOCX, or RTF" });
      const applicationNo = `SIET-CAR-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;
      const storedName = `${applicationNo}${extension}`;
      writeFileSync(join(careerUploadDir, storedName), resume.content, { flag: "wx" });
      const values = {
        applicationNo, name: fields.name.trim(), phone: fields.phone.trim(), email: fields.email.trim().toLowerCase(),
        dateOfBirth: fields.dateOfBirth, country: fields.country, state: fields.state || "", city: fields.city || "",
        institution: fields.institution, category: fields.category, position: fields.position, department: fields.department,
        qualification: fields.qualification, socialCategory: fields.socialCategory, currentInstitution: fields.currentInstitution || "",
        currentPosition: fields.currentPosition || "", currentSalary: fields.currentSalary || "", expectedSalary: fields.expectedSalary,
        noticePeriod: fields.noticePeriod || "", teachingExperience: fields.teachingExperience || "0",
        industrialExperience: fields.industrialExperience || "0", researchExperience: fields.researchExperience || "0",
        openingSource: fields.openingSource || "", message: fields.message || "", resumeOriginalName: resume.filename,
        resumeStoredName: storedName, resumeMimeType: resume.type, resumeSize: resume.content.length,
        ipAddress: request.socket.remoteAddress || ""
      };
      const result = insertCareerApplication.run(values);
      let mailQueued = false;
      const mailWebhookUrl = process.env.CAREER_MAIL_WEBHOOK_URL;
      const mailWebhookToken = process.env.CAREER_MAIL_WEBHOOK_TOKEN;
      if (mailWebhookUrl && mailWebhookToken) {
        try {
          const mailResponse = await fetch(mailWebhookUrl, {
            method: "POST",
            headers: {"Content-Type":"application/json","X-Career-Mail-Token":mailWebhookToken},
            body: JSON.stringify({
              applicationNo, fullname: values.name, email: values.email, mobile: values.phone,
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
      return sendJson(response, 201, { success: true, message: "Your application has been saved successfully.", applicationNo, id: Number(result.lastInsertRowid), mailQueued });
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
  const localApiPath = requestUrl.pathname.replace(/^\/new-site(?=\/)/, "");
  if (localApiPath === "/career-api/career-submit.php") {
    if (request.method === "POST") {
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
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      response.end(JSON.stringify({
        success: true,
        message: "Thank you! Your admission enquiry has been recorded successfully. Our academic counseling team will contact you shortly.",
        data: {
          id: Date.now(),
          studentName: "Applicant",
          course: "UG",
          department: "Engineering"
        }
      }));
    });
    return;
  }

  // 3. Static File & Path Routing
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath.replace(/^\/new-site\/?/, "");
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
    "superstars.jpg": "/new-site/brand/placement-superstars-2025-26.webp",
    "superstars.webp": "/new-site/brand/placement-superstars-2025-26.webp",
    "sietlogo.png": "/new-site/brand/siet-logo.png",
    "sietlogo.webp": "/new-site/brand/siet-logo.webp",
    "naac logo.jpg": "/new-site/brand/naac-grade-logo.webp",
    "naac logo.webp": "/new-site/brand/naac-grade-logo.webp",
    "nba logo.png": "/new-site/brand/nba-logo.webp",
    "nba logo.webp": "/new-site/brand/nba-logo.webp"
  };

  if (legacyAliases[cleanPath]) {
    response.writeHead(301, { Location: legacyAliases[cleanPath] });
    response.end();
    return;
  }

  if (cleanPath === "mydreamindia" || cleanPath === "my-dream-india") {
    response.writeHead(302, { Location: "/new-site/mdfi/" });
    response.end();
    return;
  }

  if (cleanPath === "labs" || cleanPath === "special-labs") {
    response.writeHead(302, { Location: "/new-site/labs.html" });
    response.end();
    return;
  }

  if (cleanPath === "sri-shakthi-space-mission" || cleanPath === "sri shakthi space mission" || cleanPath === "space-mission" || cleanPath === "ssm") {
    response.writeHead(302, { Location: "/new-site/sssm/" });
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
  console.log(`SIET local site: http://localhost:${port}/new-site/`);
  console.log(`SIET local site: http://127.0.0.1:${port}/new-site/`);
  console.log(`DCS Summary:    http://localhost:${port}/new-site/dcs-summary`);
});
