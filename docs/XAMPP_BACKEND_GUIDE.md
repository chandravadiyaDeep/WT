# StudentHub local backend implementation guide

This guide separates the requirements for the PHP/MySQL application from the static GitHub Pages edition. Pages cannot execute PHP or connect directly to MySQL.

## Recommended local structure

Add these directories for the XAMPP edition:

```text
backend/
  config/database.php
  includes/session.php
  includes/auth.php
  includes/csrf.php
  includes/response.php
  api/auth/{register,login,logout}.php
  api/events/{index,register}.php
  api/students/{index,update,delete}.php
  api/feedback/create.php
  api/contact/create.php
  admin/
uploads/
  profiles/
  event-posters/
  news/
  gallery/
database/database.sql
```

## Secure database connection

Use PDO with exceptions and native prepared statements. Keep credentials in a local config file that is excluded from Git. Example configuration keys: DB_HOST, DB_NAME, DB_USER and DB_PASS. Do not store a production password in a public repository.

Set connection options including PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION and PDO::ATTR_EMULATE_PREPARES => false.

## Secure authentication flow

1. Validate registration fields on the server.
2. Enforce unique username, email and student ID using unique database constraints as well as pre-checks.
3. Hash the password using password_hash($password, PASSWORD_DEFAULT).
4. Verify login with password_verify().
5. On successful login, call session_regenerate_id(true).
6. Set HTTP-only, Secure (on HTTPS), SameSite session cookies.
7. Enforce student/admin authorization on every protected endpoint.
8. Implement inactivity timeout and POST logout.
9. Use CSRF tokens for state-changing actions.

Do not reuse the static demo's localStorage user object as evidence of authentication.

## API response contract

Return JSON with a consistent shape such as:

```json
{"success":true,"data":{},"message":"Operation completed"}
```

For errors, return an appropriate HTTP status and a safe message. Never send password hashes, private tokens or server paths to the browser.

## File uploads

For profile photos, posters, news images and gallery files:
- Check the upload error code.
- Enforce a strict size limit.
- Use finfo_file() MIME verification, not only the filename extension or browser Content-Type.
- Allow only explicitly supported image MIME types.
- Generate a random server-side filename.
- Store outside executable code paths where possible.
- Prevent PHP/script execution in upload directories.
- Store only the generated relative file path in the database.

## Practical completion sequence

- P1–P3: requirements, sitemap, semantic pages and responsive design are represented in the Pages edition.
- P4–P6: expand the browser interactions with an accessible modal/slider and Fetch-based JSON endpoint; current event listing uses local JSON-shaped JavaScript data.
- P7–P8: implement PHP POST processing and the PDO/MySQL connection.
- P9–P10: implement password hashing and session-based, role-aware authentication.
- P11–P12: implement student/event CRUD and secure upload endpoints.
- P13–P14: implement JSON APIs, Fetch operations, admin-only endpoints, dashboard aggregates and audit logs.
- P15: run the full XAMPP test checklist, document screenshots and verify role boundaries.

## Local setup

1. Install XAMPP.
2. Start Apache and MySQL.
3. Place the PHP application in htdocs.
4. Import database/database.sql in phpMyAdmin.
5. Create an untracked local DB config file.
6. Configure Apache so uploaded assets cannot execute scripts.
7. Test every endpoint with valid and invalid inputs.
8. Never publish the XAMPP config or real student records to GitHub Pages.

The PHP code and the server execution tests are not included in this current static repository version.