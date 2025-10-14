import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const profileService = {
  // Get venue profile data
  getMyVenue: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MY_VENUE), {
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
        data: data.data || data,
        message: 'Venue retrieved successfully'
      };
    } catch (error) {
      console.error('getMyVenue error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve venue'
      };
    }
  },

  // Get profile management data
  getProfile: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE_GET), {
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
          return {
            success: true,
            data: null,
            message: 'No profile found'
          };
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('getProfile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve profile'
      };
    }
  },

  // Create profile management
  createProfile: async (profileData, images = [], operatingHoursId = null) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const formData = new FormData();
      
      // Add text fields
      formData.append('name', profileData.name || '');
      formData.append('description', profileData.description || '');
      formData.append('address', profileData.address || '');
      formData.append('phone_number', profileData.phoneNumber || '');
      formData.append('email', profileData.email || '');
      
      // Operating hours is required, throw error if not provided
      if (!operatingHoursId) {
        throw new Error('Operating hours must be set before creating profile');
      }
      
      formData.append('hospitality_venue_operating_hours', operatingHoursId);
      
      // Add images
      images.forEach((file) => {
        if (file) {
          formData.append('images', file);
        }
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE_CREATE), {
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
        data: data.data || data,
        message: data.message || 'Profile created successfully'
      };
    } catch (error) {
      console.error('createProfile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create profile'
      };
    }
  },

  // Update profile management
  updateProfile: async (profileData, newImages = [], operatingHoursId = null) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const formData = new FormData();
      
      // Add text fields
      formData.append('name', profileData.name || '');
      formData.append('description', profileData.description || '');
      formData.append('address', profileData.address || '');
      formData.append('phone_number', profileData.phoneNumber || '');
      formData.append('email', profileData.email || '');
      
      if (operatingHoursId) {
        formData.append('hospitality_venue_operating_hours', operatingHoursId);
      }
      
      // Add new images
      newImages.forEach((file) => {
        if (file) {
          formData.append('images', file);
        }
      });

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE_UPDATE), {
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
        data: data.data || data,
        message: data.message || 'Profile updated successfully'
      };
    } catch (error) {
      console.error('updateProfile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }
};

export const operatingHoursService = {
  // Get all weekly data (days of the week)
  getWeeklyData: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WEEKLY_GET), {
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
        data: data.data || data,
        message: 'Weekly data retrieved successfully'
      };
    } catch (error) {
      console.error('getWeeklyData error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve weekly data'
      };
    }
  },

  // Create operating hours for a venue
  createOperatingHours: async (venueId, operatingHours) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // First check if operating hours already exist
      const existingHours = await operatingHoursService.getOperatingHours(venueId);
      if (existingHours.success && existingHours.data && existingHours.data.length > 0) {
        // Use the existing operating hours ID
        return {
          success: true,
          data: existingHours.data[0].id,
          message: 'Using existing operating hours'
        };
      }

      const results = [];
      
      for (const hours of operatingHours) {
        if (!hours.isOpen && !hours.openTime && !hours.closeTime) {
          continue; // Skip if day is closed and no times set
        }

      const payload = {
        open_time: hours.openTime || '00:00:00',
        close_time: hours.closeTime || '00:00:00',
        weekly_id: hours.weeklyId, // Adding required weekly_id field
      };        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.OPERATING_HOURS_CREATE), {
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
          results.push({
            success: false,
            error: 'Server returned non-JSON response',
            day: hours.day,
          });
          continue;
        }

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            tokenManager.removeToken();
            window.location.href = '/';
            throw new Error('Session expired. Please login again.');
          }
          results.push({
            success: false,
            error: data.message || data.error,
            day: hours.day,
          });
        } else {
          results.push({
            success: true,
            data: data.data || data,
            day: hours.day,
          });
        }
      }

      // Check if all succeeded
      const allSucceeded = results.every(r => r.success);

      return {
        success: allSucceeded,
        data: results,
        message: allSucceeded 
          ? 'Operating hours created successfully' 
          : 'Some operating hours failed to create',
      };
    } catch (error) {
      console.error('createOperatingHours error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create operating hours'
      };
    }
  },

  // Get operating hours for a venue
  getOperatingHours: async (venueId) => { 
       try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.OPERATING_HOURS_GET(venueId);
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
          return {
            success: true,
            data: [],
            message: 'No operating hours found'
          };
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: 'Operating hours retrieved successfully'
      };
    } catch (error) {
      console.error('getOperatingHours error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve operating hours'
      };
    }
  },

  // Update operating hours
  updateOperatingHours: async (hoursId, hoursData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const payload = {
        open_time: hoursData.openTime || hoursData.open_time,
        close_time: hoursData.closeTime || hoursData.close_time,
        is_open: hoursData.isOpen !== undefined ? hoursData.isOpen : hoursData.is_open
      };

      const endpoint = API_CONFIG.ENDPOINTS.OPERATING_HOURS_UPDATE(hoursId);
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
        data: data.data || data,
        message: data.message || 'Operating hours updated successfully'
      };
    } catch (error) {
      console.error('updateOperatingHours error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update operating hours'
      };
    }
  }
};