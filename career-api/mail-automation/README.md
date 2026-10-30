# Nodemailer setup for career submissions

This is an optional Node.js email service. The PHP career endpoint saves the database row and resume, then calls this service using a protected webhook. Email failure does not delete the saved application.

## Required details

Ask your cPanel/email administrator for:

| Value | Example | Purpose |
|---|---|---|
| SMTP host | `mail.your-domain.com` | Outgoing mail server |
| SMTP port | `465` or `587` | `465` normally uses secure `true`; `587` normally uses `false` with STARTTLS |
| SMTP username | `no-reply@your-domain.com` | Mailbox login |
| SMTP password | App/mailbox password | Authentication; never commit it |
| From email/name | `no-reply@...`, `Sri Shakthi Careers` | Visible sender |
| HR recipient | `hr@your-domain.com` | Detailed recruitment notification |
| Optional CC | Another authorized mailbox | Copy of HR notification |
| Public website/logo URLs | HTTPS URLs | Branding inside the HTML email |
| Resume base URL | HTTPS resume directory URL | HR resume-download button |
| Webhook token | Long random secret | Protects the mail endpoint |

Every configurable value is documented in `.env.example`.

The real `.env` is ignored by Git so SMTP passwords and webhook tokens are not included in GitHub ZIPs. The ZIP includes `.env.example`; after extracting it in cPanel, copy `.env.example` to `.env`, enter the real values, and restart the Node.js application. `server.mjs` loads `.env` automatically, while values set in cPanel's environment-variable panel take precedence.

## Local setup

```bash
cd career-api/mail-automation
npm install
cp .env.example .env
```

Node does not automatically read `.env` in all versions. For a simple local test, export the values in the terminal or start Node with its environment-file option:

```bash
node --env-file=.env send-sample.mjs
```

The test sends both HR and applicant templates to `TEST_RECIPIENT_EMAIL` using `sample-career-payload.json`.

### Full local `/careers` flow

Use two terminal windows after creating `.env` with real rotated test credentials.

Terminal 1 — mail service:

```bash
node --env-file=career-api/mail-automation/.env career-api/mail-automation/server.mjs
```

Terminal 2 — website, SQLite and webhook caller:

```bash
node --env-file=career-api/mail-automation/.env local-server.mjs
```

Then open `http://127.0.0.1:4173/careers`, submit the form and verify:

1. Success modal and application reference appear.
2. `http://127.0.0.1:4173/api/careers/applications` contains the row.
3. The resume exists in `data/career-resumes/`.
4. HR and applicant/test recipient inboxes receive the messages.
5. The form API response contains `mailQueued: true` in browser Network tools.

To test the webhook service:

```bash
node --env-file=.env server.mjs
```

Health check:

```text
http://127.0.0.1:3000/health
```

Sample webhook request:

```bash
curl -X POST http://127.0.0.1:3000/career-submission \
  -H "Content-Type: application/json" \
  -H "X-Career-Mail-Token: YOUR_TOKEN" \
  --data @sample-career-payload.json
```

## Connect PHP to Nodemailer

In the private `career-api/career-config.php` file, set:

```php
'mail_webhook_url' => 'https://YOUR-NODE-APP-URL/career-submission',
'mail_webhook_token' => 'THE_SAME_LONG_RANDOM_SECRET',
```

These keys already match `career-submit.php`.

## cPanel Setup Node.js App

1. Confirm your hosting plan includes **Setup Node.js App**. Without that feature, use PHPMailer instead.
2. Upload `mail-automation` and the sibling `mail-templates` directory under `public_html/career-api`.
3. Create a Node.js 20+ application.
4. Set Application Root to `career-api/mail-automation` (relative to `public_html`).
5. Set Startup File to `server.mjs`.
6. Run **NPM Install** in cPanel.
7. Copy `.env.example` to `.env` in the application directory and replace all placeholders. Alternatively, enter the values in cPanel's environment-variable interface. Never upload real SMTP passwords or webhook tokens to GitHub.
8. Restart the application and open its `/health` URL.
9. Check `/health`; its `ready` field should be `true` and `missing` should be empty. It never returns secret values.
10. In `public_html/career-api/career-config.php`, set `mail_webhook_url` to the Node application's assigned URL ending in `/career-submission` and `mail_webhook_token` to the same token as the Node app. PHP cannot read the Node app's `.env` file.
11. Submit a test application and verify the HR email, applicant email, database record and resume.

## Payload fields

The PHP handler sends the structure shown in `sample-career-payload.json`. Required fields are:

- `applicationNo`
- `fullname`
- `email`
- `position`
- `dept`

The remaining fields populate the HR detail table. HTML values are escaped before rendering.

## Templates

- `../mail-templates/hr-notification.html`
- `../mail-templates/applicant-confirmation.html`
- `../mail-templates/career-email.css`

Restart the Node application after editing templates because they are loaded when the service starts.
