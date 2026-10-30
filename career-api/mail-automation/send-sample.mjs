import { readFileSync } from "node:fs";
import { sendCareerEmails } from "./mailer-lib.mjs";

const application = JSON.parse(readFileSync(new URL("./sample-career-payload.json", import.meta.url), "utf8"));
const recipient = process.env.TEST_RECIPIENT_EMAIL;
if (!recipient) throw new Error("Set TEST_RECIPIENT_EMAIL before running npm run test:mail");
application.email = recipient;
const delivery = await sendCareerEmails(application, {hrEmail: recipient, applicantEmail: recipient});
console.log(JSON.stringify({success:true,delivery}, null, 2));
