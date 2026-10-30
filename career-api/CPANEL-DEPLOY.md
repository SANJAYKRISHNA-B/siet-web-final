# cPanel deployment

1. Upload the complete `career-api` directory to `public_html/new-site/career-api` so the careers form at `/new-site/careers` can reach `/new-site/career-api/career-submit.php`.
2. Keep your existing database connection at `public_html/webportal/masterdb_config.php`. The new handler automatically includes it and uses its `$masterdb_con` connection.
3. Keep or create `public_html/webportal/resume`. The handler automatically stores resumes there. Recommended directory permission is `0755` or the lowest permission that allows your cPanel PHP process to write; avoid `0777`.
4. The main website Careers page is served by `/new-site/` and posts to `/new-site/career-api/career-submit.php`. If you maintain the legacy standalone `career.html` page, configure it separately to use the deployed API path.
5. Your existing `applicant` table can be used directly when it contains the listed legacy columns. Only import `applicant-table.sql` when the table does not already exist.
6. The Career API writes only to the existing columns in `applicant` (`city`, `state`, and `country` included); no database column changes or migrations are required.
7. Open `https://YOUR-DOMAIN/new-site/careers`, submit one application, and verify the new row in phpMyAdmin under `applicant` and the resume in `webportal/resume`.

Create `public_html/new-site/career-api/career-config.php` from `career-config.example.php` and set `mail_webhook_url` and `mail_webhook_token` even when the database comes from `webportal/masterdb_config.php`. The file is blocked from direct web access by `.htaccess`. If the legacy database file is unavailable, also fill in the database settings. If you store the config outside `public_html`, set `CAREER_CONFIG_PATH` in PHP and set `upload_dir` to the absolute `public_html/webportal/resume` path.

The handler accepts both the new field names and the legacy names. It uses a parameterized query, validates the real uploaded MIME type, generates non-guessable filenames, limits resumes to 2 MB, and returns JSON to the form.

## Optional automated email

If the cPanel plan supports Node.js applications, deploy `mail-automation` by following its `README.md`. The Node app's `.env` configures SMTP and the webhook token; PHP does not read that file, so repeat the webhook URL and matching token in `career-config.php` (or PHP environment variables). Database submission does not depend on email delivery: if the mail service is unavailable, the application remains saved successfully.

The SMTP password found in the legacy pasted file has intentionally not been copied. Rotate that exposed password in the mail provider and store any replacement outside `public_html`.

### Email troubleshooting

- Confirm the Node app's `.env` is inside `public_html/new-site/career-api/mail-automation/`, not in cPanel Trash. Restart the Node app after restoring or editing it.
- Open the Node app's `/health` URL. `ready` must be `true` and `missing` must be empty.
- Check the careers submission response for `mailQueued: true`. If it is false, verify `mail_webhook_url` and the matching `mail_webhook_token` in `career-config.php`, and confirm PHP cURL is enabled.
- If `/health` is ready but delivery still fails, inspect the Node app's cPanel error log for the SMTP error. Verify the SMTP host, port, TLS setting, mailbox username/password, sender address, and HR recipient.
