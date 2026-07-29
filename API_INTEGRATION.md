# API Integration Map

| Frontend Route | Component | Role | Method | Backend Endpoint | Request Payload | Important Response Fields | Auth | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | HomePage | Public | GET | `/api/properties` | `limit`, `isAvailable` | `properties[]`, `meta` | No | Integrated |
| `/properties` | PropertiesPage | Public | GET | `/api/properties` | filters: `search`, `location`, `minPrice`, `maxPrice`, `categoryId`, `amenities`, `page` | `properties[]`, `meta` | No | Integrated |
| `/properties` | PropertiesPage | Public | GET | `/api/categories` | — | `id`, `name` | No | Integrated |
| `/properties/[id]` | PropertyDetail | Public | GET | `/api/properties/:id` | — | property, landlord, reviews | No | Integrated |
| `/properties/[id]` | RentalRequestForm | Tenant | POST | `/api/rentals` | `propertyId`, `moveInDate`, `message?` | rental request | Bearer | Integrated |
| `/auth/register` | RegisterPage | Public | POST | `/api/auth/register` | `name`, `email`, `password`, `role`, `phone?` | user | No | Integrated |
| `/auth/register` | RegisterPage | Public | POST | `/api/auth/login` | `email`, `password` | `token`, `user` | No | Integrated |
| `/auth/login` | LoginPage | Public | POST | `/api/auth/login` | `email`, `password` | `token`, `user` | No | Integrated |
| Navbar / AuthProvider | AuthProvider | All | GET | `/api/auth/me` | — | user profile | Bearer | Integrated |
| `/dashboard/tenant` | TenantDashboard | Tenant | GET | `/api/rentals` | `status?`, `page?` | `rentals[]`, `meta` | Bearer | Integrated |
| `/dashboard/tenant` | TenantDashboard | Tenant | GET | `/api/payments` | — | `payments[]`, `meta` | Bearer | Integrated |
| `/dashboard/tenant/requests/[id]/pay` | TenantPaymentPage | Tenant | GET | `/api/rentals/:id` | — | rental, property, payment | Bearer | Integrated |
| `/dashboard/tenant/requests/[id]/pay` | TenantPaymentPage | Tenant | POST | `/api/payments/create` | `rentalRequestId`, `provider: STRIPE` | `checkoutUrl`, `sessionId`, `payment` | Bearer | Integrated |
| `/payment/success` | PaymentSuccessContent | Tenant | POST | `/api/payments/confirm` | `rentalRequestId`, `transactionId`, `sessionId`, `provider` | payment status | Bearer | Integrated |
| `/payment/cancel` | PaymentCancelPage | Tenant | — | — | — | UI only | Optional | Integrated |
| `/dashboard/tenant` | ReviewForm | Tenant | POST | `/api/reviews` | `propertyId`, `rating`, `comment` | review | Bearer | Integrated |
| `/dashboard/landlord` | LandlordDashboard | Landlord | GET | `/api/landlord/properties` | — | `properties[]`, `meta` | Bearer | Integrated |
| `/dashboard/landlord` | LandlordDashboard | Landlord | GET | `/api/landlord/requests` | — | `rentals[]`, `meta` | Bearer | Integrated |
| `/dashboard/landlord/properties` | LandlordPropertiesPage | Landlord | GET | `/api/landlord/properties` | — | `properties[]` | Bearer | Integrated |
| `/dashboard/landlord/properties` | LandlordPropertiesPage | Landlord | PUT | `/api/landlord/properties/:id` | property fields / `isAvailable` | property | Bearer | Integrated |
| `/dashboard/landlord/properties` | LandlordPropertiesPage | Landlord | DELETE | `/api/landlord/properties/:id` | — | — | Bearer | Integrated |
| `/dashboard/landlord/properties/new` | NewPropertyPage | Landlord | POST | `/api/landlord/properties` | property create payload | property | Bearer | Integrated |
| `/dashboard/landlord/properties/[id]/edit` | EditPropertyPage | Landlord | GET | `/api/properties/:id` | — | property | No | Integrated |
| `/dashboard/landlord/properties/[id]/edit` | EditPropertyPage | Landlord | PUT | `/api/landlord/properties/:id` | property update payload | property | Bearer | Integrated |
| `/dashboard/landlord/requests` | LandlordRequestsPage | Landlord | GET | `/api/landlord/requests` | `status?` | `rentals[]` | Bearer | Integrated |
| `/dashboard/landlord/requests` | LandlordRequestsPage | Landlord | PATCH | `/api/landlord/requests/:id` | `status` | rental request | Bearer | Integrated |
| `/dashboard/admin` | AdminDashboard | Admin | GET | `/api/admin/stats` | — | platform stats | Bearer | Integrated |
| `/dashboard/admin/users` | AdminUsersPage | Admin | GET | `/api/admin/users` | `search`, `page`, `limit` | `users[]`, `meta` | Bearer | Integrated |
| `/dashboard/admin/users` | AdminUsersPage | Admin | PATCH | `/api/admin/users/:id` | `isDeleted` | user | Bearer | Integrated |
| `/dashboard/admin/properties` | AdminPropertiesPage | Admin | GET | `/api/admin/properties` | `page?` | `properties[]` | Bearer | Integrated |
| `/dashboard/admin/rentals` | AdminRentalsPage | Admin | GET | `/api/admin/rentals` | `page?` | `rentals[]` | Bearer | Integrated |

## Notes

- Authentication uses Bearer JWT stored in cookies (`rentnest_token`, `rentnest_role`).
- Stripe Checkout session is created by the backend; frontend redirects to `checkoutUrl`.
- Payment success is verified through `/api/payments/confirm`, not URL params alone.
- Reviews are allowed only after rental status becomes `COMPLETED`.
