import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

// Night Life Bookings API Service
export const nightlifeBookingsService = {
  
  // Get all bookings for the venue
getBookings: async () => {
  try {
    const token = tokenManager.getToken();
    if (!token) throw new Error('No authentication token found. Please login.');

    const venueId = await venueService.getMyVenueId();
    console.log('Fetching bookings for venueId:', venueId);
    
    const endpoint = API_CONFIG.ENDPOINTS.NIGHTLIFE_BOOKINGS_GET(venueId);
    console.log('Full endpoint:', getApiUrl(endpoint));
    
    const response = await fetch(getApiUrl(endpoint), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    console.log('Response status:', response.status);

    // Handle 404
    if (response.status === 404) {
      throw new Error('Bookings endpoint not found. Check your API configuration.');
    }

    // Only try to parse JSON once
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.removeToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data.results || data.data || [],
      message: 'Bookings retrieved successfully'
    };
  } catch (error) {
    console.error('getBookings error:', error);
    return {
      success: false,
      error: error.message || 'Failed to retrieve bookings'
    };
  }
},

  // Get single booking details
  getBookingDetail: async (bookingId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.NIGHTLIFE_BOOKINGS_GET_DETAIL(bookingId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: 'Booking retrieved successfully'
      };
    } catch (error) {
      console.error('getBookingDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve booking details'
      };
    }
  },

  // Confirm/Accept a booking
  confirmBooking: async (bookingId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.NIGHTLIFE_BOOKINGS_CONFIRM(bookingId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'confirm' })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: 'Booking confirmed successfully'
      };
    } catch (error) {
      console.error('confirmBooking error:', error);
      return {
        success: false,
        error: error.message || 'Failed to confirm booking'
      };
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
  try {
    const token = tokenManager.getToken();
    if (!token) throw new Error('No authentication token found. Please login.');

    const endpoint = API_CONFIG.ENDPOINTS.NIGHTLIFE_BOOKINGS_CANCEL(bookingId);
    const response = await fetch(getApiUrl(endpoint), {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'cancel'  // Keep this as is
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      if (response.status === 204) {
        return { success: true, message: 'Booking cancelled successfully' };
      }
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.removeToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data,
      message: 'Booking cancelled successfully'
    };
  } catch (error) {
    console.error('cancelBooking error:', error);
    return {
      success: false,
      error: error.message || 'Failed to cancel booking'
    };
  }
},

  // Mark booking as paid
 markAsPaid: async (bookingId) => {
  try {
    const token = tokenManager.getToken();
    if (!token) throw new Error('No authentication token found. Please login.');

    const endpoint = API_CONFIG.ENDPOINTS.NIGHTLIFE_BOOKINGS_MARK_PAID(bookingId);
    const response = await fetch(getApiUrl(endpoint), {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: 'paid'  // Change this - not 'confirmed'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.removeToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data,
      message: 'Booking marked as paid successfully'
    };
  } catch (error) {
    console.error('markAsPaid error:', error);
    return {
      success: false,
      error: error.message || 'Failed to mark booking as paid'
    };
  }
}
};