// Create new file: venueService.js
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

let cachedVenueId = null;
let cachedVenueUserId = null;

export const venueService = {
  getMyVenueId: async () => {
    // Return cached ID if available
    if (cachedVenueId) return cachedVenueId;
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MY_VENUE), {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
        }
        throw new Error('Failed to get venue');
      }
      const data = await response.json();

      console.log("xxxxxxxxxxxx data", data)

      cachedVenueId = data.data.id;
      cachedVenueUserId = data?.data?.user?.id
      return cachedVenueId;
    } catch (error) {
      console.error('getMyVenueId error:', error);
      throw error;
    }
  },
  clearCache: () => {
    cachedVenueId = null;
  }
};


export const venueServiceUserID = {
  getMyVenueUserId: async () => {
    // Return cached ID if available
    if (cachedVenueUserId) return cachedVenueUserId;
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MY_VENUE), {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
        }
        throw new Error('Failed to get venue');
      }
      const data = await response.json();

      console.log("xxxxxxxxxxxx data", data)

      cachedVenueUserId = data?.data?.user?.id
      return cachedVenueUserId;
    } catch (error) {
      console.error('getMyVenueId error:', error);
      throw error;
    }
  },
  clearCache: () => {
    cachedVenueId = null;
  }
};

