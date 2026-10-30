import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const templateDirectory = join(currentDirectory, "..", "mail-templates");
const styles = readFileSync(join(templateDirectory, "career-email.css"), "utf8");
const applicantTemplate = readFileSync(join(templateDirectory, "applicant-confirmation.html"), "utf8");
const hrTemplate = readFileSync(join(templateDirectory, "hr-notification.html"), "utf8");

const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);

function required(name) {
  if (!process.env[name]) throw new Error(`Missing required environment variable: ${name}`);
  return process.env[name];
}

function render(template, replacements) {
  const common = {
    STYLES: styles,
    LOGO_URL: escapeHtml(process.env.INSTITUTION_LOGO_URL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLrUdm2N8eIhn1CqDrTwZX0vtRZ2qnXP1LGGt-y6f2TA&s"),
    WEBSITE_URL: escapeHtml(process.env.INSTITUTION_WEBSITE_URL || "https://siet.ac.in"),
    WEBSITE_LABEL: escapeHtml(process.env.INSTITUTION_WEBSITE_LABEL || "siet.ac.in")
  };
  return Object.entries({...common, ...replacements}).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, String(value ?? "")),
    template
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(required("SMTP_PORT")),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") },
    pool: true,
    maxConnections: 3,
    maxMessages: 100
  });
}

function buildHrHtml(application) {
  const rows = [
    ["Application reference", application.applicationNo], ["Applicant", application.fullname],
    ["Email", application.email], ["Mobile", application.mobile], ["Institute", application.institute],
    ["Department", application.dept], ["Position", application.position],
    ["Qualification", application.highQualification],
    ["Location", [application.city, application.state, application.country].filter(Boolean).join(", ")],
    ["Teaching experience", application.teaching], ["Industry experience", application.industry],
    ["Research experience", application.research], ["Expected salary", application.expectedSalary],
    ["Notice period", application.noticePeriod], ["Source", application.source]
  ];
  const resumeBase = String(process.env.CAREER_RESUME_BASE_URL || "").replace(/\/$/, "");
  const resumeUrl = resumeBase && application.resume ? `${resumeBase}/${encodeURIComponent(application.resume)}` : "";
  return render(hrTemplate, {
    FULLNAME: escapeHtml(application.fullname), POSITION: escapeHtml(application.position),
    DEPARTMENT: escapeHtml(application.dept), APPLICATION_NO: escapeHtml(application.applicationNo),
    EMAIL: escapeHtml(application.email),
    DETAIL_ROWS: rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "—")}</td></tr>`).join(""),
    MESSAGE_BLOCK: application.message ? `<div class="message-box"><strong>Reason for change</strong><br>${escapeHtml(application.message)}</div>` : "",
    RESUME_BLOCK: resumeUrl ? `<div class="button-wrap"><a class="email-button" href="${escapeHtml(resumeUrl)}">Download submitted resume</a></div>` : ""
  });
}

function buildApplicantHtml(application) {
  return render(applicantTemplate, {
    FULLNAME: escapeHtml(application.fullname), POSITION: escapeHtml(application.position),
    DEPARTMENT: escapeHtml(application.dept), APPLICATION_NO: escapeHtml(application.applicationNo),
    INSTITUTE: escapeHtml(application.institute || "Sri Shakthi Institutions"), EMAIL: escapeHtml(application.email)
  });
}

export function validateApplication(application) {
  const requiredFields = ["applicationNo", "fullname", "email", "position", "dept"];
  const missing = requiredFields.filter(field => !application?.[field]);
  if (missing.length) throw new Error(`Missing application fields: ${missing.join(", ")}`);
}

export async function sendCareerEmails(application, options = {}) {
  validateApplication(application);
  const transporter = createTransporter();
  const from = { name: process.env.MAIL_FROM_NAME || "Sri Shakthi Careers", address: process.env.MAIL_FROM_EMAIL || required("SMTP_USER") };
  const hrEmail = options.hrEmail || required("CAREER_HR_EMAIL");
  const applicantEmail = options.applicantEmail || application.email;
  const hrResult = await transporter.sendMail({
    from, to: hrEmail, cc: process.env.CAREER_CC_EMAIL || undefined,
    replyTo: application.email,
    subject: `New career application · ${application.applicationNo} · ${application.position}`,
    html: buildHrHtml(application),
    text: `New career application ${application.applicationNo} from ${application.fullname} for ${application.position}, ${application.dept}.`
  });
  const applicantResult = await transporter.sendMail({
    from, to: applicantEmail,
    subject: `Sri Shakthi career application received · ${application.applicationNo}`,
    html: buildApplicantHtml(application),
    text: `Your Sri Shakthi career application was received. Reference: ${application.applicationNo}.`
  });
  transporter.close();
  return { hrMessageId: hrResult.messageId, applicantMessageId: applicantResult.messageId };
}
