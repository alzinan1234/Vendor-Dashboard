// config.js - Complete API Configuration

export const API_CONFIG = {
  BASE_URL: "https://heaven-produce-hanging-mainland.trycloudflare.com",
  
  ENDPOINTS: {
    // ==================== AUTHENTICATION ====================
    LOGIN: "/api/hospitality/login/",
    
    // ==================== PASSWORD MANAGEMENT ====================
    PASSWORD_RESET_REQUEST: "/api/accounts/password/reset-request/",
    PASSWORD_RESET_VERIFY_OTP: "/api/accounts/password/reset-verify-otp/",
    PASSWORD_RESET_CONFIRM: "/api/accounts/password/reset-confirm/",
    PASSWORD_CHANGE: "/api/accounts/password/change/",
    RESEND_OTP: "/api/accounts/resend-otp/",
    VERIFY_OTP: "/api/accounts/verify-otp/",
    
    // ==================== VENDOR CHAT (NEW) ====================
    CONVERSATIONS: "/api/vendorchat/conversations/",
    // MESSAGES: (conversationId) => `/api/vendorchat/messages/${conversationId}/`,
    MESSAGES: (cusotmerId) => `/api/vendorchat/vendor/messages/${cusotmerId}/`,

    SEND_MESSAGE: "/api/vendorchat/send-message/",
    UPLOAD_FILE: "/api/vendorchat/upload-file/",
    MARK_READ: (conversationId) => `/api/vendorchat/conversations/${conversationId}/mark-read/`,
    
    // ==================== VENUE MANAGEMENT ====================
    MY_VENUE: "/api/hospitality/my-venue/",
    
    // ==================== BANK DETAILS ====================
    BANK_DETAILS_CREATE: "/api/hospitality/bank-details/create/",
    BANK_DETAILS_GET: "/api/hospitality/bank-details/",
    BANK_DETAILS_UPDATE: "/api/hospitality/bank-details/update/",
    
    // ==================== ORDERS ====================
    ORDERS_GET: "/api/hospitality/orders/",
    ORDERS_CREATE: "/api/hospitality/orders/create/",
    ORDERS_GET_DETAIL: (orderId) => `/api/hospitality/orders/${orderId}/`,
    ORDERS_UPDATE: (orderId) => `/api/hospitality/orders/${orderId}/update/`,
    ORDERS_UPDATE_STATUS: (orderId) => `/api/hospitality/orders/${orderId}/status/`,
    MY_ORDERS: "/api/hospitality/my-orders/",
    
    // ==================== ORDER ITEMS ====================
    ORDER_ITEMS_GET: "/api/hospitality/order-items/",
    ORDER_ITEMS_GET_DETAIL: (itemId) => `/api/hospitality/order-items/${itemId}/`,
    ORDER_ITEMS_ACCEPT: (itemId) => `/api/hospitality/order-items/${itemId}/accept/`,
    ORDER_ITEMS_CANCEL: (itemId) => `/api/hospitality/order-items/${itemId}/cancel/`,
    ORDER_ITEMS_MARK_PAID: (itemId) => `/api/hospitality/order-items/${itemId}/mark-paid/`,
    ORDER_ITEMS_UPDATE: (itemId) => `/api/hospitality/order-items/${itemId}/update/`,
    
    // ==================== RESERVATIONS ====================
    RESERVATIONS_GET: "/api/hospitality/reservations/",
    RESERVATIONS_GET_DETAIL: (reservationId) => `/api/hospitality/reservations/${reservationId}/`,
    RESERVATIONS_CREATE: "/api/hospitality/reservations/create/",
    RESERVATIONS_UPDATE: (reservationId) => `/api/hospitality/reservations/${reservationId}/update/`,
    RESERVATIONS_UPDATE_STATUS: (reservationId) => `/api/hospitality/reservations/${reservationId}/status/`,
    
    // ==================== BANNERS ====================
    BANNERS_GET: (venueId) => `/api/hospitality/venues/${venueId}/banners/`,
    BANNERS_CREATE: "/api/hospitality/banners/create/",
    BANNERS_UPDATE: (bannerId) => `/api/hospitality/banners/${bannerId}/update/`,
    BANNERS_DELETE: (bannerId) => `/api/hospitality/banners/${bannerId}/delete/`,
    
    // ==================== PROMOTIONS ====================
    PROMOTIONS_GET: (venueId) => `/api/hospitality/venues/${venueId}/promotions/`,
    PROMOTIONS_CREATE: "/api/hospitality/promotions/create/",
    PROMOTIONS_UPDATE: (promotionId) => `/api/hospitality/promotions/${promotionId}/update/`,
    PROMOTIONS_DELETE: (promotionId) => `/api/hospitality/promotions/${promotionId}/delete/`,
    
    // ==================== NIGHTLIFE EVENTS ====================
    NIGHTLIFE_EVENTS_GET: (venueId) => `/api/hospitality/venues/${venueId}/nightlife-events/`,
    NIGHTLIFE_EVENTS_CREATE: "/api/hospitality/nightlife-events/create/",
    NIGHTLIFE_EVENTS_UPDATE: (eventId) => `/api/hospitality/nightlife-events/${eventId}/update/`,
    NIGHTLIFE_EVENTS_DELETE: (eventId) => `/api/hospitality/nightlife-events/${eventId}/delete/`,
    
    // ==================== ENTRY TYPES ====================
    ENTRY_TYPES_GET: "/api/hospitality/entry-types/",
    ENTRY_TYPES_CREATE: "/api/hospitality/entry-types/create/",
    
    // ==================== TIME SLOTS ====================
    TIME_SLOTS_GET: (venueId) => `/api/hospitality/venues/${venueId}/time-slots/`,
    TIME_SLOTS_CREATE: "/api/hospitality/time-slots/create/",
    
    // ==================== PROFILE MANAGEMENT ====================
    PROFILE_GET: "/api/hospitality/profile-management/",
    PROFILE_CREATE: "/api/hospitality/profile-management/create/",
    PROFILE_UPDATE: "/api/hospitality/profile-management/update/",
    
    // ==================== OPERATING HOURS ====================
    OPERATING_HOURS_GET: (venueId) => `/api/hospitality/venues/${venueId}/operating-hours/`,
    OPERATING_HOURS_CREATE: "/api/hospitality/operating-hours/create/",
    OPERATING_HOURS_UPDATE: (hoursId) => `/api/hospitality/operating-hours/${hoursId}/update/`,
    
    // ==================== WEEKLY DATA ====================
    WEEKLY_GET: "/api/hospitality/weekly/",
    
    // ==================== WITHDRAWAL REQUESTS ====================
    WITHDRAWAL_REQUESTS_GET: "/api/hospitality/withdrawal-requests/",
    WITHDRAWAL_REQUEST_CREATE: "/api/hospitality/withdrawal-requests/create/",
    WITHDRAWAL_REQUEST_DETAIL: (withdrawalId) => `/api/hospitality/withdrawal-requests/${withdrawalId}/`,
    
    // ==================== EARNINGS REPORTS ====================
    EARNINGS_REPORTS_GET: "/api/hospitality/earnings-reports/",
    
    // ==================== REVIEWS ====================
    REVIEWS_GET: (venueId) => `/api/hospitality/venues/${venueId}/reviews/`,
    REVIEWS_CREATE: (venueId) => `/api/hospitality/venues/${venueId}/reviews/create/`,
    REVIEWS_DASHBOARD_GET: (venueId) => `/api/hospitality/venues/${venueId}/dashboard/reviews/`,
    REVIEWS_REPLY: (venueId, reviewId) => `/api/hospitality/venues/${venueId}/reviews/${reviewId}/reply/`,
    REVIEWS_DELETE: (venueId, reviewId) => `/api/hospitality/venues/${venueId}/reviews/${reviewId}/delete/`,
    
    // ==================== QR CODE ====================
    VENUE_QR_CODE: "/api/hospitality/venue-profile/qr-code/",
    
    // ==================== MENU CATEGORIES ====================
    MENU_CATEGORIES_GET: (venueId) => `/api/hospitality/venues/${venueId}/menu-categories/`,
    MENU_CATEGORIES_CREATE: "/api/hospitality/menu-categories/create/",
    MENU_CATEGORIES_UPDATE: (categoryId) => `/api/hospitality/menu-categories/${categoryId}/update/`,
    MENU_CATEGORIES_DELETE: (categoryId) => `/api/hospitality/menu-categories/${categoryId}/delete/`,
    
    // ==================== MENU ITEMS ====================
    MENU_ITEMS_GET: (venueId) => `/api/hospitality/venues/${venueId}/menu-items/`,
    MENU_ITEMS_CREATE: "/api/hospitality/menu-items/create/",
    MENU_ITEMS_UPDATE: (itemId) => `/api/hospitality/menu-items/${itemId}/update/`,
    MENU_ITEMS_DELETE: (itemId) => `/api/hospitality/menu-items/${itemId}/delete/`,
    
    // ==================== NIGHTLIFE BOOKINGS ====================
    NIGHTLIFE_BOOKINGS_GET: (venueId) => `/api/hospitality/my-nightlife-bookings/`,
    NIGHTLIFE_BOOKINGS_GET_DETAIL: (bookingId) => `/api/hospitality/nightlife-bookings/${bookingId}/`,
    NIGHTLIFE_BOOKINGS_CONFIRM: (bookingId) => `/api/hospitality/nightlife-bookings/${bookingId}/accept/`,
    NIGHTLIFE_BOOKINGS_CANCEL: (bookingId) => `/api/hospitality/bookings/${bookingId}/cancel/`,
    NIGHTLIFE_BOOKINGS_MARK_PAID: (bookingId) => `/api/hospitality/nightlife-bookings/${bookingId}/mark-paid/`,
  }
};

// Get full API URL
export const getApiUrl = (endpoint) => {
  if (typeof endpoint === 'function') {
    console.error('Error: Endpoint is a function. Call it with parameters first.');
    return null;
  }
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

// Helper to log API calls (useful for debugging)
export const logApiCall = (method, endpoint, data = null) => {
  console.log(`[API] ${method} ${getApiUrl(endpoint)}`, data ? data : '');
};