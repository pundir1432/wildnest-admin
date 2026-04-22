// ── Auth ──────────────────────────────────────────
export const AUTH_REGISTER  = '/api/auth/register';
export const AUTH_LOGIN     = '/api/auth/login';
export const AUTH_PROFILE   = '/api/auth/profile';   // GET + PUT

// ── Camps ─────────────────────────────────────────
export const CAMPS_LIST     = '/api/camps';
export const CAMP_DETAIL    = (id) => `/api/camps/${id}`;

// ── Rafting ───────────────────────────────────────
export const RAFTING_LIST   = '/api/rafting';
export const RAFTING_DETAIL = (id) => `/api/rafting/${id}`;

// ── Rentals ───────────────────────────────────────
export const RENTALS_LIST   = '/api/rentals';
export const RENTAL_DETAIL  = (id) => `/api/rentals/${id}`;

// ── Bookings (🔒 JWT) ─────────────────────────────
export const BOOKINGS_CREATE = '/api/bookings';
export const BOOKINGS_LIST   = '/api/bookings';       // GET ?status=draft
export const BOOKING_DETAIL  = (id) => `/api/bookings/${id}`;
export const BOOKING_CANCEL  = (id) => `/api/bookings/${id}/cancel`;

// ── Payment (🔒 JWT) ──────────────────────────────
export const PAYMENT_CREATE_ORDER = '/api/payment/create-order';
export const PAYMENT_VERIFY       = '/api/payment/verify';
