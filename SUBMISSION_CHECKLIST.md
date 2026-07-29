# Submission Checklist

## Repository & URLs

| Item | Status |
|------|--------|
| Frontend GitHub Repo | [ADD YOUR REPO URL] |
| Live Frontend URL (Vercel) | [ADD DEPLOYED URL] |
| Backend API URL | https://rent-nest-b7a4.onrender.com or http://localhost:8000 |
| Demo Video (7-10 min) | [ADD VIDEO URL] |

## Admin Credentials

```text
Admin Email    : admin@rentnest.com
Admin Password : Admin@12345
```

## Mandatory Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| API Integration & `API_INTEGRATION.md` | Complete | `frontend/API_INTEGRATION.md` |
| Consistent UI Error Handling | Complete | toasts, inline errors, `error.tsx`, `ForbiddenState` |
| 20+ meaningful frontend commits | Complete | see git log |
| Form Validation (RHF + Zod) | Complete | auth, property, rental, review forms |
| Working admin credentials | Complete | seeded admin account |
| Real Stripe payment integration | Complete | Checkout redirect + success verification |

## Role Flow Verification

- [x] Tenant: browse → request → pay → review
- [x] Landlord: create/edit/delete property → approve/reject requests
- [x] Admin: stats → user ban/unban → moderation views

## Payment Flow Verification

- [x] Approved request shows Pay Now
- [x] Backend creates Stripe Checkout session
- [x] Redirect to Stripe gateway
- [x] Success page confirms with backend
- [x] Cancel page available

## Responsive Testing

- [x] Mobile layout
- [x] Tablet layout
- [x] Desktop layout

## Build Status

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`

## Commit Count

Run: `git -C frontend log --oneline | wc -l`
