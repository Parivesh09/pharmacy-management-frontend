# ASR Pharmacy - Complete Project Summary & Documentation

## Overview
**ASR Pharmacy** is a full-featured pharmacy management system providing point-of-sale (POS), inventory, accounting, and reporting capabilities. It combines a modern React frontend with a robust Node.js + Express + PostgreSQL backend. The project emphasizes modularity, role/permission-driven access, and extensibility for future ERP-style features.

> Quick snapshot: **Frontend** built with React + Tailwind, **Backend** with Express + Sequelize (Postgres), **Auth** with JWT, and **API docs** via Swagger.

---

## 🎯 Goals & Scope
- Provide a fast POS flow for retail pharmacy operations.
- Maintain accurate accounting ledgers and tax calculations.
- Manage master data (items, companies, manufacturers, patients, doctors).
- Produce business reports (sales, purchases, ledger summaries) and export options (CSV, Excel, PDF).
- Support role-based access control and audit trails for financial operations.

---

## 🏗️ Technical Stack
- **Frontend**: React (>= 18), Vite, Tailwind CSS (v4)
- **State & Data**: Redux Toolkit, RTK Query, redux-persist
- **UI / Icons / Charts**: Lucide React, Recharts
- **Backend**: Node.js, Express, Sequelize ORM
- **Database**: PostgreSQL
- **Workers / Jobs**: `workers/` for background tasks (email, reconciliation, long-running exports)
- **Auth & Security**: JWT, express middleware (helmet, rate-limit, xss-clean)
- **Tests**: Jest (unit, integration, e2e) + Supertest for API tests
- **Docs**: Swagger (`swagger.js`, `swagger-endpoints.js`) and JSDoc for server code

---

## 🧭 Project Structure (high level)
- `asr-pharma/` - Backend
  - `src/` - controllers, models, services, routes, middleware, config
  - `scripts/init-db.js` - DB initialization (creates DB, runs migrations & seeders)
  - `defaultSeedData/` - initial seed payloads
  - `swagger.js`, `swagger-endpoints.js` - API documentation setup
  - `workers/` - background tasks
  - `tests/` - unit/integration/e2e tests
- `asr-pharmacy/` - Frontend
  - `src/` - components, pages, hooks, services, store
  - `public/`, `index.html`, `vite.config.js`
- `docs/` - design and system docs (business rules, calculation references)

---

## 📦 Major Modules & Features
- **Authentication & Access Control** (`src/pages/auth`, backend auth routes)
  - Multi-identifier login (username, phone, email)
  - Phone OTP registration flow
  - Refresh tokens and automatic refresh in RTK Query middleware
  - Role- and permission-based route & menu rendering

- **Sales & POS** (`src/pages/sales`)
  - Fast grid-based billing UI, multi-item lines, discounts, taxes
  - Cash/UPI/Bank split, receipts, printing-friendly bill templates
  - Outstanding tracking and settlement flows

- **Masters & Inventory** (`src/pages/masters`)
  - Item, Company, Manufacturer, Salt, Category management
  - Stock opening balances, adjustments, and expiry tracking
  - Import/export of master data

- **Accounting & Ledgers** (`src/pages/accounting`)
  - Hierarchical Groups & Ledgers, Journal entries, Payments & Receipts
  - Auto-posting from bills to ledger entries
  - Bank reconciliation workflows and cash summaries

- **Dashboard & Analytics** (`src/componets/DashboardComponenets`)
  - KPIs (Net Sale, Net Purchase, Gross Profit), charts with trend lines
  - Patient trends, prescription reminders, cash-in-hand split
  - Last sync time and sync status indicators

- **Theme & UX System** (`src/utils/themeManager.js`) 🔧
  - Global CSS variables, Light/Dark mode, color presets + custom picker
  - Live preview of theme changes, centralized theme tokens

- **Common UI Components** (`src/componets/common`)
  - `DataTable` with sticky headers & infinite scroll
  - `SearchableSelect` with keyboard shortcuts and create-on-F2
  - Form inputs, modals, standardized buttons, loaders

- **Exports & Reports**
  - CSV/Excel exports, PDF reports, printable receipts and summaries
  - Background export tasks via `workers/` to prevent blocking

- **API Documentation**
  - Swagger UI available from server (see `swagger.js`), plus auto-generated route summaries

---

## 🔧 Development Setup & Commands
Backend (in `asr-pharma`):
- Install: `npm install`
- Dev server: `npm run dev` (nodemon)
- Init DB (create DB, migrations, seeders): `npm run init` (calls `scripts/init-db.js`)
- Migrations: `npm run migrate`
- Seed: `npm run seed`
- Tests: `npm run test` | `npm run test:unit` | `npm run test:integration` | `npm run test:e2e`
- Lint & format: `npm run lint` | `npm run lint:fix` | `npm run format`

Frontend (in `asr-pharmacy`):
- Install: `npm install`
- Dev server: `npm run dev` (Vite)
- Build: `npm run build`
- Lint: `npm run lint`

Environment files / examples:
- Backend expects a `.env` (see `src/config/config.js` and `scripts/init-db.js` for variables like `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST`, `DB_PORT`, `JWT_SECRET`).

---

## 🧪 Testing & Quality
- **Unit Tests**: Jest for utility functions and services (`tests/unit/`)
- **Integration Tests**: DB-backed tests (use test DB, transactional rollback) (`tests/integration/`)
- **E2E Tests**: Simulate common user flows (billing, ledger posting) in `tests/e2e/`
- **CI Guidance**: use a matrix job that runs `npm ci`, `npm test`, `npm run lint` and a job to run DB migrations & seeders in a disposable Postgres instance (Docker) for integration tests.

---

## 🔐 Security & Compliance Notes
- Uses `helmet`, `rate-limit`, `xss-clean` and other express middlewares to reduce common web risks.
- **Caution**: There are hard-coded defaults and example credentials in `src/config/config.js` and `scripts/init-db.js` (e.g., `Parivesh@09`, `Admin@123`). These should be removed and enforced via environment variables and secret management in CI/CD.
- Ensure `JWT_SECRET` and DB credentials are stored in a secret store (Azure Key Vault / GitHub Secrets / environment variables) in production.

> ⚠️ **Immediate Action**: Remove hard-coded passwords, rotate default admin credentials, and add checks to CI that `.env` with production secrets is not committed.

---

## 📈 Performance & Scalability Considerations
- **Data tables & infinite scroll**: Use server-side pagination for large datasets (items, bills).
- **Charts**: Recharts rendering large datasets can be slow — use sampled/aggregated data or virtualized charts for long timespans.
- **Workers**: Offload heavy exports, ledger recalculations, and reconciliation to `workers/` to keep API latency low.
- **DB Indexing**: Add indexes to common filters (`bills.created_at`, `ledger.account_id`, `items.sku`) and monitor slow queries.

---

## ⚠️ Known Issues & Workarounds
- **Dark mode inconsistencies**: Some hardcoded `bg-white` or `text-gray-900` classes still exist. Replace with theme variables for consistent dark mode behavior. (Fix scheduled: component audit)
- **API error handling granularity**: Global toasts are used; field-level validation messages can be improved using `Zod` or explicit form error mapping.
- **Mobile layout**: Dense tables and dual sidebars are cramped on very small screens. Recommend collapsible filters and mobile-specific flows for billing.
- **Token refresh edge cases**: Rare race condition when multiple requests refresh at once — ensure refresh token locking mechanism on client-side.
- **Precision & rounding**: Financial rounding rules (GST, discounts) must be validated against business rules; add centralized rounding util.
- **DB migrations & seeds**: Seeds may conflict if run repeatedly in CI—make seeders idempotent.
- **Flaky tests in CI due to timing/seed order**: Use DB transactions and deterministic seed data for integration/e2e tests.
- **Hardcoded credentials**: `Parivesh@09` and `Admin@123` appear in config or scripts — replace immediately.
- **Large data exports**: Exports can time out; use background jobs with progress tracking and notify via email when ready.

---

## ✅ Recommendations & Next Steps (prioritized)
1. **Security**: Remove hard-coded credentials, force env-based secrets, rotate default admin, add secret-linting in CI. ✅
2. **Dark Mode Audit**: Replace hard-coded colors with theme tokens across the codebase. ✅
3. **Make Seeders Idempotent**: Ensure `npm run seed` is safe to run multiple times. ✅
4. **Add Field-Level Validation**: Use `Zod`/`Yup` for forms and map API validation errors to fields. ✅
5. **Add Docker Compose for Dev**: `postgres`, `redis` (if used), and backend/frontend for reproducible local dev. 💡
6. **CI Pipeline Enhancements**: Add testing matrix (unit + integration + lint + security scans). 💡
7. **PWA & Offline**: Progressive enhancement for offline sales & local sync conflict resolution. 💡
8. **Reports & Exports**: Background queued exports with email notification and progress bar. ✅

---

## 🧭 Operational Notes
- **Logs**: API logger is configured (see `docs/API_LOGGER_SUMMARY.md`) — forward to a centralized system (ELK / Datadog) for production.
- **Monitoring**: Add basic metrics (request latency, error rates, queue lengths) and alerting for high error rates.
- **Backups**: Schedule daily DB backups and test restores regularly.

---

## 📚 References & Helpful Files
- `scripts/init-db.js` — DB init with migrations & seeds
- `default.data.json` — default data / example payloads
- `swagger.js` / `swagger-endpoints.js` — API docs bootstrapping
- `docs/` folder — contains security, audit, calculation, and integration guides
- `tests/` — unit/integration/e2e test suites

---

## ✍️ Contributors & Conventions
- **Branching**: `main` is protected; use feature branches and PRs with descriptive titles.
- **Commits**: Use conventional commits (feat|fix|chore|docs|refactor|test) for changelog generation.
- **PRs**: Include testing notes, screenshots (if UI), and mention any DB migrations.
- **Code Style**: ESLint & Prettier rules are enforced (`npm run lint`, `npm run format`)

---

If you'd like, I can:
1. Run a quick scan for hard-coded secrets and prepare a small patch to remove them. ✅
2. Add a checklist-based `TODO` section in repository to track the prioritized recommendations above. ✅

---

_Last updated: Feb 01, 2026_
