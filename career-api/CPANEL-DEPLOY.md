# cPanel deployment

1. Upload the complete `career-api` directory to `public_html/career-api`.
2. Keep your existing database connection at `public_html/webportal/masterdb_config.php`. The new handler automatically includes it and uses its `$masterdb_con` connection.
3. Keep or create `public_html/webportal/resume`. The handler automatically stores resumes there. Recommended directory permission is `0755` or the lowest permission that allows your cPanel PHP process to write; avoid `0777`.
4. Upload `career.html` to `public_html/career.html`. The main website Careers page already posts to `/career-api/career-submit.php` as well.
5. Your existing `applicant` table can be used directly when it contains the listed legacy columns. Only import `applicant-table.sql` when the table does not already exist.
6. Open `https://YOUR-DOMAIN/career.html`, submit one application, and verify the new row in phpMyAdmin under `applicant` and the resume in `webportal/resume`.

If `webportal/masterdb_config.php` is unavailable on a different server, use the fallback: copy `career-config.example.php` to `career-config.php`, enter the database values, and rely on the included `.htaccess` rule to block direct web access. Storing it outside `public_html` through `CAREER_CONFIG_PATH` remains the most secure option.

The handler accepts both the new field names and the legacy names. It uses a parameterized query, validates the real uploaded MIME type, generates non-guessable filenames, limits resumes to 2 MB, and returns JSON to the form.

## Optional automated email

If the cPanel plan supports Node.js applications, deploy `mail-automation` by following its `README.md`. Configure `CAREER_MAIL_WEBHOOK_URL` and `CAREER_MAIL_WEBHOOK_TOKEN` for PHP. Database submission does not depend on email delivery: if the mail service is unavailable, the application remains saved successfully.

The SMTP password found in the legacy pasted file has intentionally not been copied. Rotate that exposed password in the mail provider and store any replacement outside `public_html`.
