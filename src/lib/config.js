// API Configuration config.js
export const API_CONFIG = {
  BASE_URL: "https://donation-furthermore-shame-quiz.trycloudflare.com",
  ENDPOINTS: {
    LOGIN: "/api/hospitality/login/",
    PASSWORD_RESET_REQUEST: "/api/basicuser/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/basicuser/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/basicuser/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/basicuser/password/change/",
    RESEND_OTP: "/api/basicuser/resend-otp/",
    VERIFY_OTP: "/api/basicuser/verify-otp/",
    MY_VENUE: "/api/hospitality/my-venue/",
    BANK_DETAILS_CREATE: "/api/hospitality/bank-details/create/",
    BANK_DETAILS_GET: "/api/hospitality/bank-details/",
    BANK_DETAILS_UPDATE: "/api/hospitality/bank-details/update/",
    RESERVATIONS_GET: "/api/hospitality/reservations/",
    // Dynamic endpoints - ID will be inserted by service functions
    RESERVATIONS_GET_DETAIL: (reservationId) => `/api/hospitality/reservations/${reservationId}/`,
    RESERVATIONS_CREATE: "/api/hospitality/reservations/create/",
    RESERVATIONS_UPDATE: (reservationId) => `/api/hospitality/reservations/${reservationId}/update/`,
    RESERVATIONS_UPDATE_STATUS: (reservationId) => `/api/hospitality/reservations/${reservationId}/status/`,
    BANNERS_GET: (venueId) => `/api/hospitality/venues/${venueId}/banners/`,
    BANNERS_CREATE: "/api/hospitality/banners/create/",
    BANNERS_UPDATE: (bannerId) => `/api/hospitality/banners/${bannerId}/update/`,
    BANNERS_DELETE: (bannerId) => `/api/hospitality/banners/${bannerId}/delete/`,
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
  }
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};