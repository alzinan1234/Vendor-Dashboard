// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://twist-steps-ideal-antonio.trycloudflare.com",
  ENDPOINTS: {
    // Authentication
    LOGIN: "/api/hospitality/login/",
    
    // Password Management
    PASSWORD_RESET_REQUEST: "/api/accounts/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/accounts/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/accounts/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/accounts/password/change/",
    RESEND_OTP: "/api/accounts/resend-otp/",
    VERIFY_OTP: "/api/accounts/verify-otp/",
    
    // Venue Management
    MY_VENUE: "/api/hospitality/my-venue/",
    
    // Bank Details
    BANK_DETAILS_CREATE: "/api/hospitality/bank-details/create/",
    BANK_DETAILS_GET: "/api/hospitality/bank-details/",
    BANK_DETAILS_UPDATE: "/api/hospitality/bank-details/update/",
    
    // Reservations
    RESERVATIONS_GET: "/api/hospitality/reservations/",
    RESERVATIONS_GET_DETAIL: (reservationId) => `/api/hospitality/reservations/${reservationId}/`,
    RESERVATIONS_CREATE: "/api/hospitality/reservations/create/",
    RESERVATIONS_UPDATE: (reservationId) => `/api/hospitality/reservations/${reservationId}/update/`,
    RESERVATIONS_UPDATE_STATUS: (reservationId) => `/api/hospitality/reservations/${reservationId}/status/`,
    
    // Banners
    BANNERS_GET: (venueId) => `/api/hospitality/venues/${venueId}/banners/`,
    BANNERS_CREATE: "/api/hospitality/banners/create/",
    BANNERS_UPDATE: (bannerId) => `/api/hospitality/banners/${bannerId}/update/`,
    BANNERS_DELETE: (bannerId) => `/api/hospitality/banners/${bannerId}/delete/`,
    
    // Promotions
    PROMOTIONS_GET: (venueId) => `/api/hospitality/venues/${venueId}/promotions/`,
    PROMOTIONS_CREATE: "/api/hospitality/promotions/create/",
    PROMOTIONS_UPDATE: (promotionId) => `/api/hospitality/promotions/${promotionId}/update/`,
    PROMOTIONS_DELETE: (promotionId) => `/api/hospitality/promotions/${promotionId}/delete/`,
    
    // Nightlife Events
    NIGHTLIFE_EVENTS_GET: (venueId) => `/api/hospitality/venues/${venueId}/nightlife-events/`,
    NIGHTLIFE_EVENTS_CREATE: "/api/hospitality/nightlife-events/create/",
    NIGHTLIFE_EVENTS_UPDATE: (eventId) => `/api/hospitality/nightlife-events/${eventId}/update/`,
    NIGHTLIFE_EVENTS_DELETE: (eventId) => `/api/hospitality/nightlife-events/${eventId}/delete/`,
    
    // Entry Types
    ENTRY_TYPES_GET: "/api/hospitality/entry-types/",
    ENTRY_TYPES_CREATE: "/api/hospitality/entry-types/create/",
    
    // Time Slots
    TIME_SLOTS_GET: (venueId) => `/api/hospitality/venues/${venueId}/time-slots/`,
    TIME_SLOTS_CREATE: "/api/hospitality/time-slots/create/",
    
    // Profile Management
    PROFILE_GET: "/api/hospitality/profile-management/",
    PROFILE_CREATE: "/api/hospitality/profile-management/create/",
    PROFILE_UPDATE: "/api/hospitality/profile-management/update/",
    
    // Operating Hours
    OPERATING_HOURS_CREATE: "/api/hospitality/operating-hours/create/",
    OPERATING_HOURS_GET: (venueId) => `/api/hospitality/venues/${venueId}/operating-hours/`,
    OPERATING_HOURS_UPDATE: (hoursId) => `/api/hospitality/operating-hours/${hoursId}/update/`,
    
    // Weekly Data
    WEEKLY_GET: "/api/hospitality/weekly/",
    
    // Withdrawal Requests
    WITHDRAWAL_REQUESTS_GET: "/api/hospitality/withdrawal-requests/",
    WITHDRAWAL_REQUEST_CREATE: "/api/hospitality/withdrawal-requests/create/",
    WITHDRAWAL_REQUEST_DETAIL: (withdrawalId) => `/api/hospitality/withdrawal-requests/${withdrawalId}/`,
    
    // Earnings Reports
    EARNINGS_REPORTS_GET: "/api/hospitality/earnings-reports/",
    
    // Reviews
    REVIEWS_GET: (venueId) => `/api/hospitality/venues/${venueId}/reviews/`,
    REVIEWS_CREATE: (venueId) => `/api/hospitality/venues/${venueId}/reviews/create/`,
    REVIEWS_DASHBOARD_GET: (venueId) => `/api/hospitality/venues/${venueId}/dashboard/reviews/`,
    REVIEWS_REPLY: (venueId, reviewId) => `/api/hospitality/venues/${venueId}/reviews/${reviewId}/reply/`,
    REVIEWS_DELETE: (venueId, reviewId) => `/api/hospitality/venues/${venueId}/reviews/${reviewId}/delete/`,
  }
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to validate URL structure
export const validateEndpoint = (endpoint) => {
  if (typeof endpoint !== 'string' || !endpoint.startsWith('/')) {
    console.error('Invalid endpoint format:', endpoint);
    return false;
  }
  return true;
};