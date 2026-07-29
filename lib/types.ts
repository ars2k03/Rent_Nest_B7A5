export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image?: string | null;
  amenities: string[];
  isAvailable: boolean;
  categoryId: string;
  landlordId: string;
  category?: Category;
  landlord?: User;
  reviews?: Review[];
  createdAt?: string;
}

export interface RentalRequest {
  id: string;
  moveInDate: string;
  message?: string | null;
  status: RentalStatus;
  tenantId: string;
  propertyId: string;
  property?: Property;
  tenant?: User;
  payment?: Payment | null;
  createdAt?: string;
}

export interface Payment {
  id: string;
  amount: number;
  method?: string | null;
  transactionId: string;
  provider: "STRIPE" | "SSLCOMMERZ";
  status: PaymentStatus;
  paidAt?: string | null;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
  createdAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  tenantId: string;
  propertyId: string;
  tenant?: User;
  createdAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorDetails: unknown;
  data?: T;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePaymentResponse {
  payment: Payment;
  checkoutUrl?: string;
  sessionId?: string;
  redirectUrl?: string;
  provider: "STRIPE" | "SSLCOMMERZ";
}

export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingRentals: number;
  activeRentals: number;
  completedPayments: number;
}
