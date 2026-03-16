# Nutri-Plan

Smart meal planner and nutrition tracker built with Next.js (App Router).

![Hero image](./public/hero.png)

## What This App Does

Nutri-Plan has 2 main areas:

- **Admin dashboard**: Manage the food catalog used by everyone.
- **Client dashboard**: Track meals for a day and see nutrition totals (calories, macros, and more).

## Key Features (Current)

### Admin Dashboard (Food Catalog)

- **Foods**: List + search + pagination, and edit/delete actions.
- **Categories**: Create/edit/delete categories.
- **Serving units**: Create/edit/delete serving units (g, cup, piece, etc.).
- **Food nutrition data**: Calories, protein, carbs, fat, sugar, fiber.
- **Per-food serving unit mapping** (data model): Each food can have multiple serving units with a grams conversion.

### Client Dashboard (Meals)

- **Daily meal list** with a date filter.
- **Nutrition summary cards**: total calories, macros (protein/carbs/fat), plus sugar/fiber totals.

## Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui (Radix primitives) + lucide icons
- **Auth**: Better Auth (email/password) with Prisma adapter + admin plugin
- **API**: oRPC (typed RPC) + TanStack Query client utilities
- **API Docs**: OpenAPI reference endpoint generated from Zod schemas
- **DB/ORM**: Postgres + Prisma (client generated to `prisma/generated/prisma`)
- **Tooling**: Biome (lint/format) + Ultracite (check/fix)

## Architecture Notes

- `app/` uses Next.js App Router.
- Auth routes are served via `app/api/auth/[...all]/route.ts`.
- RPC + OpenAPI reference are served via `app/api/rpc/[[...rest]]/route.ts`:
  - RPC base URL: `/api/rpc`
  - OpenAPI reference: `/api/rpc/api-reference`

## Getting Started (Local Development)

### Prerequisites

- Node.js 20+
- Bun (required for the Prisma scripts in `package.json`)
- A running Postgres database (Docker Compose is provided)

### 1) Start Postgres (Docker)

```bash
docker compose -f infra/docker-compose.yml up -d
```

This matches the default `DATABASE_URL` in `.env.example`.

### 2) Install Dependencies

```bash
bun install
```

### 3) Configure Environment Variables

```bash
cp .env.example .env
```

Fill at least:

- `DATABASE_URL`
- `BETTER_AUTH_URL` (usually `http://localhost:3000`)
- `BETTER_AUTH_SECRET` (generate a random string; do not commit it)

Optional (used by the seed script):

- `ADMIN_EMAIL` (defaults to `super@admin.com`)
- `ADMIN_PASSWORD`

### 4) Migrate + Seed

```bash
bun run db:migrate
bun run db:seed
```

### 5) Run The App

```bash
bun run dev
```

Open `http://localhost:3000`.

## Useful Scripts

- `bun run dev`: Start Next.js dev server
- `bun run build`: Production build
- `bun run start`: Start production server
- `bun run lint`: `biome check`
- `bun run format`: `biome format --write`
- `bun run db:migrate`: Prisma migrate (dev)
- `bun run db:generate`: Prisma client generate
- `bun run db:pull`: Prisma db pull
- `bun run db:studio`: Prisma Studio
- `bun run db:seed`: Prisma seed
- `bun run check`: `ultracite check`
- `bun run fix`: `ultracite fix`

## Updates So Far (High-Level)

Last code update: **2026-03-15**

- **2026-03**: Added meals module (router/service/schema), seeded meals, and shipped the first client dashboard meal list + nutrition summary UI.
- **2026-03**: Improved foods module: pagination/filters, CRUD wiring, schema validation (unique serving units per food), and protected API procedures.
- **2026-02**: Introduced the dashboard layout (sidebar + breadcrumb) and CRUD flows for categories and serving units.
- **2025-09**: Migrated authentication to Better Auth and improved sign-in/sign-up flow + env templates.
- **2025-07**: Initial Next.js app scaffold + Prisma + basic auth setup.

## Known Gaps / Work In Progress

- **Meal create/edit/delete UI** is not finished yet (the dialog is currently a placeholder).
- **Food serving unit editor in the UI** is not finished yet (backend + schema support exists; seeded foods include serving units).
- **Admin route guarding** is currently not enforced at the layout level (role checks are present but commented out).

## Authors

- **Davi Pereira**
