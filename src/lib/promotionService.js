import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

// Promotion API Service
export const promotionService = {
  // Get all promotions for a venue
  getPromotions: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const venueId = await venueService.getMyVenueId();
      
      const endpoint = API_CONFIG.ENDPOINTS.PROMOTIONS_GET(venueId);
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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || [],
        message: data.message || 'Promotions retrieved successfully'
      };
    } catch (error) {
      console.error('getPromotions error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve promotions'
      };
    }
  },

  // Create a new promotion
  createPromotion: async (promotionData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const formData = new FormData();
      formData.append('title', promotionData.title);
      formData.append('description', promotionData.description);
      formData.append('start_date', promotionData.startDate);
      formData.append('end_date', promotionData.endDate);
      formData.append('is_active', 'true');
      formData.append('is_featured', 'true');
      
      if (promotionData.imageFile) {
        formData.append('image', promotionData.imageFile);
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROMOTIONS_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData
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
        message: data.message || 'Promotion created successfully'
      };
    } catch (error) {
      console.error('createPromotion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create promotion'
      };
    }
  },

  // Update a promotion
  updatePromotion: async (promotionId, promotionData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const formData = new FormData();
      formData.append('title', promotionData.title);
      formData.append('description', promotionData.description);
      formData.append('start_date', promotionData.startDate);
      formData.append('end_date', promotionData.endDate);
      formData.append('is_active', 'true');
      formData.append('is_featured', 'true');
      
      if (promotionData.imageFile && promotionData.imageFile instanceof File) {
        formData.append('image', promotionData.imageFile);
      }

      const endpoint = API_CONFIG.ENDPOINTS.PROMOTIONS_UPDATE(promotionId);

      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: formData
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
        message: data.message || 'Promotion updated successfully'
      };
    } catch (error) {
      console.error('updatePromotion error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update promotion'
      };
    }
  },

  // Delete a promotion
  deletePromotion: async (promotionId) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.PROMOTIONS_DELETE(promotionId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        if (response.status === 204) {
          return {
            success: true,
            message: 'Promotion deleted successfully'
          };
        }
        const textResponse = await response.text();
        throw new Error(textResponse || 'Server returned non-JSON response.');
      }

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        if (response.status === 404 || 
            (data.message && data.message.includes('No HospitalityVenuePromotion matches'))) {
          return {
            success: true,
            message: 'Promotion has already been deleted'
          };
        }

        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Promotion deleted successfully'
      };
    } catch (error) {
      console.error('deletePromotion error:', error);
      
      if (error.message && (
          error.message.includes('No HospitalityVenuePromotion matches') ||
          error.message.includes('Promotion not found')
      )) {
        return {
          success: true,
          message: 'Promotion has already been deleted'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to delete promotion'
      };
    }
  }
};