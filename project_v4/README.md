# EmbedPrep Control Deck

EmbedPrep is a Next.js interview-prep workspace for embedded systems and hardware roles. It combines guided lessons, a large technical question bank, company/interview tracking, an MCU comparison lab, career planning, industry trend analysis, and a final readiness checklist in one demoable app.

## Shipped Features

- Dashboard with progress telemetry across questions, companies, lessons, and checklist readiness.
- 500+ embedded systems practice questions with categories, difficulty, status tracking, detail pages, editing, and custom question creation.
- Study guide modules for embedded C/C++, RTOS, digital logic, communication protocols, microcontrollers, hardware design, automation, signal processing, power electronics, and system design.
- Chip Lab for comparing MCUs by use case, price, stock, memory, connectivity, power draw, and selected side-by-side specs.
- Industry Intel dashboard with company profiles, real interview prompts, trend feeds, and forecasting views.
- Career roadmap, company pipeline, saved items area, and final prep checklist.
- Playwright e2e coverage for the full public demo flow.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

## Auth And Saved Items

The public demo works without environment variables. If Clerk keys are not configured, the app runs in local demo mode and skips Clerk keyless redirects so lessons, questions, Chip Lab, industry intel, career pages, companies, and checklist are all accessible.

To enable accounts and saved study items, configure Clerk and Supabase:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Apply `supabase-schema.sql` to create the saved repos and saved questions tables.

## Chip Lab Pricing Feed

The Chip Lab page uses `/api/chips/pricing` for price and availability data. By default it serves catalog snapshots so the comparison engine works offline.

To merge in live supplier data, set `CHIP_PRICING_ENDPOINT` to a JSON endpoint that returns either an array of quotes or `{ "quotes": [...] }`. Each quote can include `partNumber`, `distributor`, `unitPriceUsd`, `stock`, `leadTimeWeeks`, `packaging`, `source`, and `updatedAt`. If the endpoint needs auth, set `CHIP_PRICING_TOKEN` and the app will send it as a bearer token.
