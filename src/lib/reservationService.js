import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const reservationService = {
  // Get all reservations
  getReservations: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.RESERVATIONS_GET), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
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
        data: data.results || [],
        count: data.count || 0,
        message: 'Reservations retrieved successfully'
      };
    } catch (error) {
      console.error('getReservations error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve reservations'
      };
    }
  },

  // Get single reservation detail
  getReservationDetail: async (reservationId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.RESERVATIONS_GET_DETAIL(reservationId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('Reservation not found');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: 'Reservation retrieved successfully'
      };
    } catch (error) {
      console.error('getReservationDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve reservation'
      };
    }
  },

  // Create reservation
  createReservation: async (reservationData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const payload = {
        guest_name: reservationData.guestName,
        party_size: parseInt(reservationData.partySize),
        booking_time: reservationData.bookingTime,
        booking_date: reservationData.bookingDate,
        hospitality_venue: reservationData.hospitalityVenue,
        special_requests: reservationData.specialRequests || ''
      };

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.RESERVATIONS_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
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
        data: data.data,
        message: data.message || 'Reservation created successfully'
      };
    } catch (error) {
      console.error('createReservation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create reservation'
      };
    }
  },

  // Update reservation
  updateReservation: async (reservationId, reservationData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const payload = {
        guest_name: reservationData.guestName,
        party_size: parseInt(reservationData.partySize),
        booking_time: reservationData.bookingTime,
        booking_date: reservationData.bookingDate,
        hospitality_venue: reservationData.hospitalityVenue,
        special_requests: reservationData.specialRequests || ''
      };

      const endpoint = API_CONFIG.ENDPOINTS.RESERVATIONS_UPDATE(reservationId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
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
        data: data.data,
        message: data.message || 'Reservation updated successfully'
      };
    } catch (error) {
      console.error('updateReservation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update reservation'
      };
    }
  },

  // Update reservation status (PATCH)
  updateReservationStatus: async (reservationId, status) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const payload = { status };

      const endpoint = API_CONFIG.ENDPOINTS.RESERVATIONS_UPDATE_STATUS(reservationId);
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
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
        data: data.data,
        message: data.message || 'Reservation status updated successfully'
      };
    } catch (error) {
      console.error('updateReservationStatus error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update reservation status'
      };
    }
  }
};