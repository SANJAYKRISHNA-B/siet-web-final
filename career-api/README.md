# Careers form: local and cPanel

The actual form is rendered at `/careers`. It submits multipart data to the same URL in both environments:

```text
POST /career-api/career-submit.php
```

## Local

Run `node local-server.mjs`, open `http://127.0.0.1:4173/careers`, and submit the form. The local server intercepts the endpoint and saves to:

- SQLite: `data/career-applications.sqlite`
- Resumes: `data/career-resumes/`
- Record viewer: `http://127.0.0.1:4173/api/careers/applications`

## cPanel

Upload this `career-api` directory, the updated `index.html`, and the updated assets bundle while preserving paths. `career-submit.php` reuses:

- Connection: `public_html/webportal/masterdb_config.php` (`$masterdb_con`)
- MySQL table: `applicant`
- Resume directory: `public_html/webportal/resume/`

Use `applicant-table.sql` only if the production table does not already exist. Full steps are in `CPANEL-DEPLOY.md`.
