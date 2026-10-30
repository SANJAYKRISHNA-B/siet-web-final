import { createServer } from "node:http";
import { sendCareerEmails, validateApplication } from "./mailer-lib.mjs";

const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

function json(response, status, payload) {
  response.writeHead(status, {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"});
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", chunk => {
      size += chunk.length;
      if (size > 256 * 1024) reject(new Error("Payload too large"));
      else chunks.push(chunk);
    });
    request.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new Error("Invalid JSON")); }
    });
    request.on("error", reject);
  });
}

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === "GET" && url.pathname === "/health") return json(response, 200, {success:true,service:"siet-career-mailer"});
  if (request.method !== "POST" || url.pathname !== "/career-submission") return json(response, 404, {success:false,message:"Not found"});
  if (!process.env.CAREER_MAIL_WEBHOOK_TOKEN || request.headers["x-career-mail-token"] !== process.env.CAREER_MAIL_WEBHOOK_TOKEN) {
    return json(response, 401, {success:false,message:"Unauthorized"});
  }
  try {
    const application = await readJson(request);
    validateApplication(application);
    const delivery = await sendCareerEmails(application);
    return json(response, 202, {success:true,message:"Career emails sent",delivery});
  } catch (error) {
    console.error("Career mail error:", error);
    return json(response, 500, {success:false,message:"Email delivery failed"});
  }
}).listen(port, host, () => console.log(`SIET career mailer listening on ${host}:${port}`));
