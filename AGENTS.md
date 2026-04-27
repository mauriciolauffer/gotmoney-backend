# Instructions for AI Agents (gotmoney-backend)

This document provides project-specific guidance for working on the gotmoney-backend Cloudflare Worker. It intentionally excludes files and folders listed in .gitignore (e.g., environment files, local caches, build artifacts, and any ignored legacy code). Follow these instructions to develop, test, lint, and extend the backend safely.

- Scope: Cloudflare Workers + Hono (tiny) framework + Cloudflare D1 database
- Base API path: /api
- Workspace manager: pnpm
- TypeScript: enabled
- Observability: enabled via Wrangler

## Quick Start

- Install dependencies: `pnpm install`
- Development:
  - Seed the local D1 database: `pnpm db:start`
  - Start the worker: `pnpm dev` (runs `pnpm db:start & pnpm start`)
  - Local URL: http://localhost:8787/
- Type generation for Worker Env bindings (optional but recommended): `pnpm cf-typegen`

## Project Scripts (package.json)

- `pnpm dev`: Starts local DB and the dev server
- `pnpm start`: Runs `wrangler dev`
- `pnpm deploy`: Deploys using Wrangler
- `pnpm db:start`: Executes test/data/schema.sql against the local D1 database (binding dev-gotmoney-db)
- `pnpm test`: Runs Vitest tests
- `pnpm lint`: Runs Prettier (check) and ESLint
- `pnpm pretty`: Runs Prettier write
- `pnpm cf-typegen`: Regenerates Env types from wrangler.jsonc

## Runtime, Config, and Bindings

- Entry point: `src/index.ts`
- Wrangler config: `wrangler.jsonc`
  - Name: my-first-worker
  - Main: src/index.ts
  - D1 binding: `DEV_GOTMONEY_DB` maps to database `dev-gotmoney-db`
  - Observability: `"observability": { "enabled": true }`
- Env typings: `worker-configuration.d.ts` and `src/types.d.ts` (use `pnpm cf-typegen` after changing `wrangler.jsonc`)

## Environment and Secrets

- Do not commit secrets. Environment files are ignored:
  - .dev.vars, .env, and related files are ignored; use `.dev.vars.example` and `.env.example` for templates
- Use Wrangler secrets for production values:
  - https://developers.cloudflare.com/workers/configuration/secrets/

## Data Model (from src/types.d.ts)

- Bindings: `{ DEV_GOTMONEY_DB: D1Database }`
- Account:
  - Keys: `idaccount (UUID)`, `iduser`, `idtype (AccountType.idtype)`
  - Optional: `description`, `creditlimit`, `balance`, `openingdate`, `duedate`
  - Audit: `createdat`, `updatedat` (ISO datetime strings)
- AccountType:
  - `idtype (UUID)`, `description`, `icon`, `inactive (boolean)`
- Category:
  - `idcategory (UUID)`, `iduser`, `description`, `budget`, `createdat`, `updatedat`
- Transaction:
  - `idtransaction (UUID)`, `iduser`, `idaccount`, `idparent (UUID)`, `idstatus (TransactionStatus.idstatus)`, `idtype (TransactionType.idtype)`
  - `description`, `idinstalmentgroup (UUID?)`, `instalment (number?)`, `amount`, `startdate`, `duedate`, `tag (string[])`, `origin`
  - Audit: `createdat`, `updatedat`
- TransactionStatus:
  - `idstatus (number)`, `description`
- TransactionType:
  - `idtype (number)`, `description`
- User:
  - `iduser (UUID)`, `email`, `name`, `passwd`, `alert (boolean)`, `active (boolean)`
  - Optional: `facebook`, `google`, `twitter`
  - Audit: `createdat`, `updatedat`

## API Surface

- Base path: `/api` (configured in `src/index.ts` via `new Hono().basePath("/api")`)
- Shared behavior:
  - `app.onError`: returns `{ message, cause }` with HTTP 500
  - `app.notFound`: returns `{ message: "Not Found", ok: false }` with HTTP 404
- Routes:
  - `/api/accounts` (src/routes/accounts.ts)
    - POST `/` — expects JSON payload; inserts into `accounts`; returns inserted rows; sets status 201
    - GET `/` — lists `accounts`
    - GET `/:id` — fetches single account by `idaccount`
    - PUT `/:id` — updates account fields for `idaccount`
    - DELETE `/:id` — deletes by `idaccount`
    - Notes: Route uses `ctx.env.DEV_GOTMONEY_DB.prepare(...).bind(...).run()/first()`
  - `/api/categories` (src/routes/categories.ts)
    - CRUD endpoints (`POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`)
    - Implementation currently mirrors `accounts` queries; adjust to target `categories`
  - `/api/session` (src/routes/session.ts)
    - CRUD endpoints echo `limit` and `offset` query parameters as `{ posts }`
  - `/api/transactions` (src/routes/transactions.ts)
    - CRUD endpoints echo `limit` and `offset` query parameters as `{ posts }`
  - `/api/users` (src/routes/users.ts)
    - CRUD endpoints echo `limit` and `offset` query parameters as `{ posts }`

### Example curl

- List accounts:
  - `curl http://localhost:8787/api/accounts`
- Create account:
  - `curl -X POST http://localhost:8787/api/accounts -H "Content-Type: application/json" -d '{ "idaccount": "uuid", "iduser": "uuid", "idtype": "uuid", "description": "My Account" }'`
- Get one:
  - `curl http://localhost:8787/api/accounts/00000000-0000-0000-0000-000000000000`

## Database and Local Data

- Local schema/seeding file: `test/data/schema.sql`
- Bootstrap local DB: `pnpm db:start` (executes schema against `dev-gotmoney-db`)
- D1 query usage (pattern):
  - `const stmt = ctx.env.DEV_GOTMONEY_DB.prepare('SQL HERE');`
  - `const res = await stmt.bind(...params).run();` or `.first();`

## Middleware and Security

- Imported but currently disabled in `src/index.ts`:
  - `csrf`, `secureHeaders`, `cors`, `basicAuth`
- Enable as needed:
  - `app.use(csrf());`
  - `app.use(secureHeaders());`
  - Configure CORS and Basic Auth appropriately for your environment

## Testing

- Framework: Vitest with `@cloudflare/vitest-pool-workers`
- Run full suite: `pnpm test` (non-watch, CI-friendly)
- Focused run by test name: `pnpm vitest run -t "<test name>"`
- Ensure tests remain green before merging changes

## Linting and Formatting

- Lint: `pnpm lint` (Prettier check + ESLint)
- Format: `pnpm pretty` (Prettier write)
- ESLint config: `eslint.config.js`
- TypeScript config: `tsconfig.json`
- Fix type or lint errors before committing

## Pull Requests

- Title format: `[my-first-worker] <Title>`
- Always run `pnpm lint` and `pnpm test` before committing/pushing

## Adding a New Route

1. Create `src/routes/<resource>.ts` using Hono; prefer typing `new Hono<{ Bindings: Bindings }>()` when using DB.
2. Implement handlers (`GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`) as appropriate.
3. Import and register in `src/index.ts` via `app.route("/<resource>", <module>)`.
4. If the route needs DB access, ensure queries use `ctx.env.DEV_GOTMONEY_DB.prepare().bind().run()/first()`.
5. Add tests in `test/` covering route behavior.
6. Run `pnpm cf-typegen` if you updated `wrangler.jsonc` bindings.
7. `pnpm lint` and `pnpm test` must pass.

## Deployment

- Deploy to Cloudflare Workers: `pnpm deploy`
- Review Wrangler output and dashboard for logs and metrics (observability is enabled).

## Notes

- This document excludes any references to files/folders ignored by `.gitignore`. Operate only on tracked project files.
- Keep this AGENTS.md synchronized with code changes, particularly new routes, DB schema updates, and Wrangler bindings.
