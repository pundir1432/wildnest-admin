// ── Admin Auth ────────────────────────────────────
export const ADMIN_LOGIN    = '/api/admin/login';
export const ADMIN_REGISTER = '/api/admin/register';
export const ADMIN_PROFILE  = '/api/admin/profile';

// ── Admin Dashboard ───────────────────────────────
export const ADMIN_DASHBOARD         = '/api/admin/dashboard';
export const ADMIN_PAYMENT_DASHBOARD = '/api/admin/payment-dashboard';

// ── Admin Bookings ────────────────────────────────
export const ADMIN_BOOKINGS          = '/api/admin/bookings';
export const ADMIN_BOOKING_STATUS    = (id) => `/api/admin/bookings/${id}/status`;
export const ADMIN_BOOKING_PDF       = (id) => `/api/admin/bookings/${id}/pdf`;

// ── Admin Users ───────────────────────────────────
export const ADMIN_USERS             = '/api/admin/users';
export const ADMIN_USER_TOGGLE       = (id) => `/api/admin/users/${id}/toggle`;
export const ADMIN_USER_STATUS       = (id) => `/api/admin/users/${id}/status`;

// ── Admin Camps ───────────────────────────────────
export const ADMIN_CAMPS             = '/api/admin/camps';
export const ADMIN_CAMP              = (id) => `/api/admin/camps/${id}`;

// ── Admin Rafting ─────────────────────────────────
export const ADMIN_RAFTING           = '/api/admin/rafting';
export const ADMIN_RAFTING_ITEM      = (id) => `/api/admin/rafting/${id}`;

// ── Admin Rentals ─────────────────────────────────
export const ADMIN_RENTALS           = '/api/admin/rentals';
export const ADMIN_RENTAL            = (id) => `/api/admin/rentals/${id}`;

// ── Admin Gallery ─────────────────────────────────
export const ADMIN_GALLERY           = '/api/admin/gallery';
export const ADMIN_GALLERY_ITEM      = (id) => `/api/admin/gallery/${id}`;

// ── Admin Ratings ────────────────────────────────
export const ADMIN_RATINGS           = '/api/admin/ratings';
export const ADMIN_RATING            = (id) => `/api/admin/ratings/${id}`;

// ── User Bookings (user token) ────────────────────
export const USER_BOOKINGS           = '/api/bookings';
