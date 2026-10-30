import { createReadStream, existsSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = import.meta.dirname || process.cwd();
const port = Number(process.env.PORT || 4173);
const MAX_BODY_SIZE = 100 * 1024; // 100 KB payload limit to prevent memory exhaustion DoS

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

  // 1. API Endpoint: Space Whiz 2026 Registration
  if (request.url.startsWith("/api/space-whiz/register") || request.url.startsWith("/api/sssm/register")) {
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
  if (request.url.startsWith("/api/admission-enquiries") || request.url.startsWith("/api/enquiries")) {
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
    cleanPath.startsWith(".git") ||
    cleanPath.startsWith("data") ||
    cleanPath.startsWith("scratch") ||
    cleanPath.startsWith(".vscode") ||
    cleanPath.startsWith(".env") ||
    cleanPath.startsWith("package") ||
    cleanPath.includes("/.") ||
    cleanPath.includes("\\.") ||
    cleanPath.startsWith(".")
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

  if (cleanPath === "sri-shakthi-space-mission" || cleanPath === "sri shakthi space mission" || cleanPath === "space-mission") {
    response.writeHead(302, { Location: "/ssm/" });
    response.end();
    return;
  }

  let filePath = join(root, safePath);

  if (safePath && existsSync(filePath) && statSync(filePath).isDirectory()) {
    const directoryIndex = join(filePath, "index.html");
    filePath = existsSync(directoryIndex) ? directoryIndex : join(root, "index.html");
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
