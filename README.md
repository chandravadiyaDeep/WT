# StudentHub — CHARUSAT Student Portal

**Learn · Connect · Share · Grow**

StudentHub is an integrated AIUE203 Web Technology project concept. This repository currently contains the **GitHub Pages static demonstration edition**.

- Live static site: https://chandravadiyadeep.github.io/WT/
- Repository: https://github.com/chandravadiyaDeep/WT
- Local static preview: open `index.html` with a local static server.

## Important deployment distinction

GitHub Pages serves static HTML, CSS, JavaScript and assets. It does **not** execute PHP, provide a MySQL database, run PHP sessions, accept server-side uploads or run PHP JSON APIs.

Therefore this deployment is a functional **front-end demonstration**:
- Navigation, responsive layouts, JavaScript form checks, event filtering/sorting/pagination, FAQ accordion, theme switching, local demo profile, event registration, community posts and browser-stored feedback/contact entries work in the browser.
- Demo data is in `assets/js/data.js`.
- Demo state uses browser `localStorage`; it is not secure authentication, shared database storage or a substitute for a backend.
- The login page identifies a previously created local demo profile, but does not validate a password. The admin preview is intentionally not secure.
- No real student PII or passwords should be entered into this public demo.

The PHP 8+ / MySQL / PDO-or-MySQLi backend required for the full practical set should be run locally using XAMPP (or deployed to a PHP-capable host). A full backend is not part of the GitHub Pages deployment yet. The guide below describes how that backend should be added without pretending Pages can run it.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Landing page and event/news previews |
| `about.html` | Vision, mission and project objectives |
| `register.html` | Client-side validated demo registration |
| `login.html` | Local demo session entry |
| `dashboard.html` | Student overview and event registrations |
| `profile.html` | Local demo profile editing |
| `events.html` | Event search, category filtering, sorting and pagination |
| `news.html` | Announcements |
| `discussion.html` | Search and create local discussion posts |
| `gallery.html` | Responsive campus-theme gallery placeholders |
| `contact.html` | Validated local contact form demo |
| `feedback.html` | Rating and local feedback demo |
| `faq.html` | Searchable accordion and theme switch |
| `admin-login.html` | Admin demo entry |
| `admin.html` | Local demo statistics and student list |

## Project structure

```text
WT/
├── index.html
├── about.html
├── register.html
├── login.html
├── dashboard.html
├── events.html
├── profile.html
├── contact.html
├── feedback.html
├── faq.html
├── news.html
├── discussion.html
├── gallery.html
├── admin-login.html
├── admin.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── data.js
│       └── main.js
├── database/
│   └── database.sql
├── docs/
│   └── XAMPP_BACKEND_GUIDE.md
├── .github/workflows/pages.yml
├── .nojekyll
└── README.md
```

## Technology

- HTML5 semantic elements, accessibility landmarks and forms
- CSS3, custom properties, Grid, Flexbox, responsive media queries
- Vanilla JavaScript, DOM events, regular expressions, browser storage
- JSON-shaped demonstration datasets and Fetch API concepts (the current sample data is local JavaScript, not a server API)
- GitHub Pages for static publishing
- PHP 8+, MySQL, PDO/MySQLi and PHP Sessions are the target local backend stack described in the guide

## GitHub Pages setup

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch** or GitHub Actions. The included workflow supports GitHub Actions.
3. For branch publishing, select `main` and `/(root)`, then Save.
4. For GitHub Actions publishing, the workflow `.github/workflows/pages.yml` deploys the repository root when changes are pushed to `main`.
5. Wait for the Pages deployment workflow to complete. The public URL is:
   https://chandravadiyadeep.github.io/WT/

The first deploy can take a little time. Check **Actions → Deploy static content to Pages** for the build status.

## Run the full PHP/MySQL version locally

1. Install XAMPP with Apache, PHP and MySQL.
2. Start Apache and MySQL from XAMPP Control Panel.
3. Clone this repository into `C:\\xampp\\htdocs\\WT` (Windows example).
4. Open phpMyAdmin at `http://localhost/phpmyadmin`.
5. Import `database/database.sql`.
6. Copy the PHP backend implementation into the documented `backend/` and PHP page structure described in `docs/XAMPP_BACKEND_GUIDE.md`.
7. Configure database credentials in a local, untracked config file. Never commit credentials.
8. Visit `http://localhost/WT/`.

**Note:** This repository does not yet contain the PHP backend implementation. The guide describes the database and backend build plan; the pages on GitHub Pages will remain static.

## 15 practical coverage map

| Practical | Requirements | Current repository coverage |
|---|---|---|
| 1 | Initiation, analysis, sitemap, structure, README, GitHub | README, pages and documented structure |
| 2 | Semantic HTML5, accessible navigation, 10+ pages | 15 linked pages, skip link, semantic landmarks |
| 3 | Responsive CSS, Grid, Flexbox, media queries | Implemented in `assets/css/style.css` |
| 4 | DOM, events, FAQ, modal/notifications, menu, theme | Navigation, FAQ, toast, theme, dynamic UI; no carousel/modal feature yet |
| 5 | Registration, validation, regex, password strength | Browser validation and strength feedback; not server validation |
| 6 | JSON, search/filter/sort/pagination, Fetch | Event search/filter/sort/pagination; sample data is local, no remote Fetch endpoint yet |
| 7 | PHP POST, sanitization, CSV/JSON storage | Not implemented; see backend guide |
| 8 | PHP/MySQL, MySQLi/PDO and database display | SQL schema planned; PHP connector not implemented |
| 9 | PHP/MySQL registration, unique checking, password hashing | Demo-only browser registration; secure backend not implemented |
| 10 | Sessions, password verification, roles, timeout | Demo-only local state; secure session auth not implemented |
| 11 | Student CRUD | Admin browser preview is read-only; server CRUD not implemented |
| 12 | Event CRUD and secure uploads | Event sample cards only; backend CRUD/uploads not implemented |
| 13 | PHP JSON API and async Fetch CRUD | Not implemented; no server/API on Pages |
| 14 | Admin dashboard and audit logging | Demo statistics only; secure dynamic admin/audit backend not implemented |
| 15 | Integration, testing, docs, GitHub, XAMPP | Static edition committed; backend testing/XAMPP deployment remains |

This is a coverage tracker, not a claim that all 15 backend practicals are complete. The exact PHP/MySQL requirements need the local backend phase.

## Quality and security notes

- Never trust browser-only validation. Validate again on the server.
- Production passwords must be hashed with PHP `password_hash()` and checked with `password_verify()`; passwords must never be stored in localStorage.
- Use prepared SQL statements, CSRF tokens, role checks, secure session cookies and session ID regeneration.
- Validate upload MIME types and file size on the server; randomize stored names.
- Store secrets outside the public repository and outside the Pages static build.
- Replace demo localStorage actions with authenticated server requests before real use.
- Sample event data and metrics are static demonstration data, not live institutional information.
- Do not upload real student information or images without consent.

## Browser smoke test

- Open every navigation link and confirm the page loads.
- Test event search, category filter, sort and pagination.
- Register a demo student using fictional details and test the dashboard.
- Register for an event and verify it appears in the dashboard; test duplicate prevention.
- Edit demo profile details.
- Search and expand FAQ; toggle the theme.
- Create a community post after demo login.
- Submit contact and feedback forms.
- Open admin preview and inspect browser-stored demo account list.
- Test on desktop and mobile viewport widths.

## Next backend milestone

Implement the complete PHP/MySQL layer in a separate XAMPP-compatible path/build, preserving the Pages edition as a static preview. Start with database schema, secure session/auth helpers, registration and login APIs, then student/event CRUD, uploads, audit logging and final integration tests.