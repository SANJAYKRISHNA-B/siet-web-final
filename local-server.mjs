import { createReadStream, existsSync, statSync } from "node:fs";
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
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath.replace(/^\/new-site\/?/, "");
  const safePath = normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = join(root, safePath);

  if (!safePath || !existsSync(filePath) || statSync(filePath).isDirectory()) {
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
