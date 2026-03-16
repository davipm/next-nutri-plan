# Nutri Plan

Full-stack meal planning and nutrition tracking app built with Next.js 16, React 19, TypeScript, Better Auth, oRPC, Prisma, and PostgreSQL.

![Hero image](./public/hero.png)

## Overview

Nutri Plan is organized around two main product areas:

- **Admin dashboard** for maintaining the shared food catalog.
- **Client dashboard** for logging meals and reviewing daily nutrition totals.

The current codebase ships with authentication, protected dashboards, a typed RPC layer, generated API reference docs, Prisma-backed persistence, and seed data for local development.

## Features

### Authentication and access control

- Email/password authentication with Better Auth
- Protected dashboard routes
- Admin-only access to food management routes
- Session-aware redirects for admin and user roles

### Admin dashboard

- Category CRUD
- Serving unit CRUD
- Food CRUD
- Nutrition fields per food: calories, protein, carbohydrates, fat, sugar, fiber
- Multiple serving units per food with gram conversion values
- Food list filtering by search term, category, calories, and protein
- Sorting and pagination on the food catalog

### Client dashboard

- Daily meal list with date-based filtering
- Meal creation and editing with multiple food entries
- Per-meal food breakdown with serving units and calorie badges
- Daily nutrition summary cards for calories, macros, fiber, and sugar

### API and developer experience

- Typed oRPC procedures for categories, foods, meals, and serving units
- OpenAPI reference generated from Zod schemas
- Prisma client generated into `prisma/generated/prisma`
- TanStack Query integration for client-side data fetching and cache invalidation

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI, lucide-react
- **Auth:** Better Auth with Prisma adapter and admin plugin
- **API:** oRPC, OpenAPI, Zod, TanStack Query
- **Database:** PostgreSQL, Prisma ORM
- **Forms and state:** React Hook Form, Zustand
- **Tooling:** Biome, Ultracite, Bun

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/sign-in` | Sign in screen |
| `/sign-up` | Sign up screen |
| `/client` | Meal tracking dashboard |
| `/admin/food-management/foods` | Food catalog management |
| `/admin/food-management/categories` | Category management |
| `/admin/food-management/serving-units` | Serving unit management |
| `/api/auth/[...all]` | Better Auth handlers |
| `/api/rpc` | oRPC endpoint |
| `/api/rpc/api-reference` | Generated OpenAPI reference |

## Project Structure

```text
.
|-- app/
|   |-- (auth)/
|   |   |-- sign-in/
|   |   `-- sign-up/
|   |-- (dashboard)/
|   |   |-- _components/
|   |   |-- admin/
|   |   |   `-- food-management/
|   |   |       |-- categories/
|   |   |       |-- foods/
|   |   |       `-- serving-units/
|   |   `-- client/
|   |       |-- _components/
|   |       `-- _utils/
|   `-- api/
|       |-- auth/[...all]/route.ts
|       `-- rpc/[[...rest]]/route.ts
|-- components/
|   |-- ui/
|   `-- *.tsx shared presentation components
|-- hooks/
|-- infra/
|   `-- docker-compose.yml
|-- lib/
|   |-- auth-client.ts
|   |-- orpc.ts
|   `-- utils.ts
|-- prisma/
|   |-- generated/prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- providers/
|-- server/
|   |-- auth.ts
|   |-- prisma.ts
|   |-- modules/
|   |   |-- category/
|   |   |-- food/
|   |   |-- meal/
|   |   `-- serving-units/
|   `-- orpc/
|-- store/
|-- public/
|-- package.json
`-- README.md
```

## Data Model

Core entities:

- `User`, `Session`, `Account`, `Verification` for authentication
- `Category` for grouping foods
- `ServingUnit` for reusable measurement units
- `Food` for nutrition data
- `FoodServingUnit` as the conversion layer between foods and serving units
- `Meal` for dated meal records
- `MealFood` for foods attached to a meal with serving unit and amount

## Local Development

### Prerequisites

- Node.js 20+
- Bun
- Docker Desktop or a local PostgreSQL instance

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Required values:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `DATABASE_URL`

Default local values from `.env.example`:

```env
BETTER_AUTH_URL="http://localhost:3000"
DATABASE_URL=postgresql://postgres:password@localhost:5432/next-db?schema=public
ADMIN_EMAIL="super@admin.com"
ADMIN_PASSWORD="1234"
```

Note:

- `BETTER_AUTH_SECRET` is intentionally empty in `.env.example`. Set it to a long random string before running the app.
- The current auth client is configured for `http://localhost:3000`. If you change the app URL or port, update both `.env` and [`lib/auth-client.ts`](./lib/auth-client.ts).

### 3. Start PostgreSQL

```bash
docker compose -f infra/docker-compose.yml up -d
```

### 4. Generate Prisma client and apply migrations

```bash
bun run db:generate
bun run db:migrate
```

### 5. Seed the database

```bash
bun run db:seed
```

The seed script creates:

- 12 food categories
- 12 serving units
- 50 foods with nutrition values and serving-unit conversions
- 50 meals per eligible user account (`user` or `client` role)
- An admin user when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set

### 6. Start the app

```bash
bun run dev
```

Open `http://localhost:3000`.

## Seeded Access

If you keep the default `.env.example` values, you can sign in with:

- **Admin email:** `super@admin.com`
- **Admin password:** `1234`

If you want meal data associated with a regular user account, create a user via `/sign-up` and run `bun run db:seed` again. The seed script prefers accounts with the `user` or `client` role and falls back to the first available account only when none exist.

## RPC Modules

The server exposes protected procedures for:

- `categories`
- `foods`
- `meals`
- `servingUnits`

There is also a public `healthCheck` procedure and a protected `privateData` procedure defined in the root router.

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Build the application for production |
| `bun run start` | Start the production server |
| `bun run lint` | Run `biome check` |
| `bun run format` | Run `biome format --write` |
| `bun run check` | Run `ultracite check` |
| `bun run fix` | Run `ultracite fix` |
| `bun run db:migrate` | Apply Prisma development migrations |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:pull` | Pull schema from the database |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:seed` | Seed the database |

## Notes

- This repository currently does **not** define a dedicated automated test script in `package.json`.
- Next.js typed routes and the React Compiler are enabled in [`next.config.ts`](./next.config.ts).
- React Query Devtools and Sonner toasts are wired globally through [`providers/providers.tsx`](./providers/providers.tsx).

## Author

- Davi Pereira
