// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://resolutions-responded-stages-prepare.trycloudflare.com",
  ENDPOINTS: {
    LOGIN: "/api/basicuser/login/",
    PASSWORD_RESET_REQUEST: "/api/basicuser/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/basicuser/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/basicuser/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/basicuser/password/change/",
    RESEND_OTP: "/api/basicuser/resend-otp/",
    VERIFY_OTP: "/api/basicuser/verify-otp/",
    BANK_DETAILS_CREATE: "/api/hospitality/bank-details/create/",
    BANK_DETAILS_GET: "/api/hospitality/bank-details/",
    BANK_DETAILS_UPDATE: "/api/hospitality/bank-details/update/",
    // Add other endpoints here as needed
  }
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};