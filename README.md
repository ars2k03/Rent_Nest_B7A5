# RentNest Frontend

Modern Next.js rental marketplace frontend for the B7A5 assignment, integrated with the B7A4 RentNest backend API.

## Features

- Public property browsing with filters and property details
- JWT authentication with role-based dashboards (Tenant, Landlord, Admin)
- Rental request workflow with status badges
- Real Stripe Checkout payment flow
- Landlord property CRUD and request management
- Admin user moderation and platform statistics
- React Hook Form + Zod validation on all forms
- TanStack Query for server state
- Structured error handling with toasts, inline errors, and route-level error UI

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- TanStack Query
- Stripe Checkout redirect
- Next.js Middleware route protection

## Local Setup

### 1. Backend

```bash
cd ../backend
cp .env.example .env
# configure DATABASE_URL, JWT_SECRET, STRIPE keys
npm install
npm run db:push
npm run seed
npm run dev
```

Backend runs at `http://localhost:8000`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Seeded Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentnest.com | Admin@12345 |
| Landlord | landlord@rentnest.com | Landlord@12345 |
| Tenant | tenant@rentnest.com | Tenant@12345 |

## Payment Setup

1. Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in the backend `.env`
2. Set `FRONTEND_URL=http://localhost:3000` in backend `.env`
3. Tenant approves rental → clicks Pay Now → redirected to Stripe Checkout
4. Success returns to `/payment/success` for backend verification

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Deployment

Deploy frontend to Vercel and set:

- `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL
- Backend `CORS_ORIGIN` to your Vercel frontend URL
- Backend `FRONTEND_URL` to your Vercel frontend URL

## Documentation

- `API_INTEGRATION.md` — frontend-to-backend endpoint mapping
- `SUBMISSION_CHECKLIST.md` — submission verification
- `DEMO_VIDEO_SCRIPT.md` — demo walkthrough outline
