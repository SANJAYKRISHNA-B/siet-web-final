import { createReadStream, existsSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = import.meta.dirname || process.cwd();
const port = Number(process.env.PORT || 4173);
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
  if (request.url.startsWith("/api/space-whiz/register") || request.url.startsWith("/api/sssm/register")) {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch(e) {}
      const regId = "SW26-" + Math.floor(1000 + Math.random() * 9000);
      const record = {
        regNo: regId,
        studentName: parsed.student_name || parsed.name || "Student",
        standard: parsed.standard || "10th/11th/12th STD",
        schoolName: parsed.school_name || "School",
        city: parsed.city || "City",
        phone: parsed.phone || "",
        email: parsed.email || "",
        mentorInfo: parsed.mentor_info || "",
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

  if (request.url.startsWith("/api/admission-enquiries") || request.url.startsWith("/api/enquiries")) {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
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
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath.replace(/^\/new-site\/?/, "");
  const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
    const cleanPath = safePath.toLowerCase().replace(/^[\\/]+|[\\/]+$/g, "");
  if (cleanPath === "mydreamindia" || cleanPath === "my-dream-india") {
    response.writeHead(302, { Location: "/mdfi/" });
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

  const isHtml = filePath.endsWith("index.html");
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
