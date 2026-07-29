# Demo Video Script (7-10 minutes)

## 1. Project Overview (1 min)

- Introduce RentNest as a rental marketplace built with Next.js App Router
- Mention integration with the B7A4 Express + Prisma backend
- Highlight three roles: Tenant, Landlord, Admin

## 2. Architecture & Folder Structure (1 min)

- Show `app/` routes for public pages, auth, dashboards, and payment result pages
- Mention `lib/` for API client and services
- Mention `components/` for UI and feature components
- Mention `middleware.ts` for route protection

## 3. Tenant Flow (2 min)

- Register or login as tenant
- Browse `/properties` with filters
- Open property details and submit rental request with validation
- Show tenant dashboard statuses
- Demonstrate Pay Now on approved request
- Walk through Stripe Checkout redirect
- Show `/payment/success` verification

## 4. Landlord Flow (1.5 min)

- Login as landlord
- Create a property with form validation
- Toggle availability or edit listing
- Approve/reject incoming requests from `/dashboard/landlord/requests`

## 5. Admin Flow (1 min)

- Login as admin
- Show platform stats dashboard
- Search users and ban/unban
- Open moderation views for properties and rentals

## 6. Validation & Error Handling (1 min)

- Trigger a form validation error (empty required field)
- Show inline error messages
- Trigger an API error (e.g., invalid login) and show toast/alert UI

## 7. Technical Challenge (1 min)

Explain one solved challenge, for example:

- Stripe Checkout redirect + backend session verification
- Middleware role-based route protection with JWT cookies
- TanStack Query cache invalidation after rental status changes

## Closing

- Mention responsive design, loading states, and documentation files
- Provide live URLs and admin credentials
