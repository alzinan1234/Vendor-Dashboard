import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

// Banner API Service
export const bannerService = {
  // Get all banners for a venue
getBanners: async () => {
  try {
    const token = tokenManager.getToken();
    if (!token) throw new Error('No authentication token found. Please login.');

    const venueId = await venueService.getMyVenueId();
    
    const endpoint = API_CONFIG.ENDPOINTS.BANNERS_GET(venueId);
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
        message: data.message || 'Banners retrieved successfully'
      };
    } catch (error) {
      console.error('getBanners error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve banners'
      };
    }
  },

  // Create a new banner
  createBanner: async (bannerData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('banner_title', bannerData.bannerTitle);
      formData.append('banner_description', bannerData.description);
      formData.append('start_date', bannerData.startDate);
      formData.append('end_date', bannerData.endDate);
      formData.append('start_time', bannerData.startTime);
      formData.append('end_time', bannerData.endTime);
      formData.append('link', bannerData.link || '');
      formData.append('is_active', 'true');
      formData.append('is_featured', 'true');
      formData.append('location', bannerData.location || '');
      
      // Append image file if exists
      if (bannerData.imageFile) {
        formData.append('image', bannerData.imageFile);
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANNERS_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it automatically with boundary
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
        message: data.message || 'Banner created successfully'
      };
    } catch (error) {
      console.error('createBanner error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create banner'
      };
    }
  },

  // Update a banner
  updateBanner: async (bannerId, bannerData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      console.log('Updating banner ID:', bannerId);
      console.log('Banner data:', bannerData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('banner_title', bannerData.bannerTitle);
      formData.append('banner_description', bannerData.description);
      formData.append('start_date', bannerData.startDate);
      formData.append('end_date', bannerData.endDate);
      formData.append('start_time', bannerData.startTime);
      formData.append('end_time', bannerData.endTime);
      formData.append('link', bannerData.link || '');
      formData.append('is_active', 'true');
      formData.append('is_featured', 'true');
      formData.append('location', bannerData.location || '');
      
      // ONLY append image if a new file is uploaded
      if (bannerData.imageFile && bannerData.imageFile instanceof File) {
        formData.append('image', bannerData.imageFile);
        console.log('New image file attached');
      } else {
        console.log('No new image file, keeping existing image');
      }

      const endpoint = `/api/hospitality/banners/${bannerId}/update/`;
      console.log('Update endpoint:', getApiUrl(endpoint));

      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // DON'T set Content-Type for FormData
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
      console.log('Update response:', data);

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
        message: data.message || 'Banner updated successfully'
      };
    } catch (error) {
      console.error('updateBanner error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update banner'
      };
    }
  },

  // Delete a banner
  deleteBanner: async (bannerId) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = `/api/hospitality/banners/${bannerId}/delete/`;
      
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
        // Handle non-JSON responses
        if (response.status === 204) {
          // No content but successful deletion
          return {
            success: true,
            message: 'Banner deleted successfully'
          };
        }
        const textResponse = await response.text();
        throw new Error(textResponse || 'Server returned non-JSON response.');
      }

      // Handle various response cases
      if (!response.ok) {
        // Authentication error
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        // Handle "No HospitalityVenueBanner matches" error
        if (response.status === 404 || 
            (data.message && data.message.includes('No HospitalityVenueBanner matches'))) {
          return {
            success: true,
            message: 'Banner has already been deleted'
          };
        }

        // Other errors
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Banner deleted successfully'
      };
    } catch (error) {
      console.error('deleteBanner error:', error);
      
      // If the error indicates the banner doesn't exist, treat it as a success
      if (error.message && (
          error.message.includes('No HospitalityVenueBanner matches') ||
          error.message.includes('Banner not found')
      )) {
        return {
          success: true,
          message: 'Banner has already been deleted'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to delete banner'
      };
    }
  }
};