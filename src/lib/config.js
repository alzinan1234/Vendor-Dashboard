// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://donation-furthermore-shame-quiz.trycloudflare.com",
  ENDPOINTS: {
    // Authentication
    LOGIN: "/api/hospitality/login/",
    
    // Password Management
    PASSWORD_RESET_REQUEST: "/api/basicuser/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/basicuser/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/basicuser/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/basicuser/password/change/",
    RESEND_OTP: "/api/basicuser/resend-otp/",
    VERIFY_OTP: "/api/basicuser/verify-otp/",
    
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
    
    // Reviews - All Dynamic Endpoints (Based on API Response Structure)
    // Public endpoint - Get all reviews for a specific venue
    REVIEWS_GET: (venueId) => `/api/hospitality/venues/${venueId}/reviews/`,
    
    // User creates a review for a venue
    REVIEWS_CREATE: (venueId) => `/api/hospitality/venues/${venueId}/reviews/create/`,
    
    // Dashboard endpoint - Get reviews for the authenticated venue owner (DYNAMIC)
    REVIEWS_DASHBOARD_GET: (venueId) => `/api/hospitality/venues/${venueId}/dashboard/reviews/`,
    
    // Venue owner replies to a review (DYNAMIC - uses venue ID from auth)
    REVIEWS_REPLY: (venueId, reviewId) => `/api/hospitality/venues/${venueId}/reviews/${reviewId}/reply/`,
    
    
    // Delete review (if needed)
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