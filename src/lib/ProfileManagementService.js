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
  createProfile: async (profileData, images = []) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const formData = new FormData();
      
      // Add basic text fields
      formData.append('name', profileData.name || '');
      formData.append('description', profileData.description || '');
      formData.append('address', profileData.address || '');
      formData.append('phone_number', profileData.phoneNumber || '');
      formData.append('email', profileData.email || '');
      
      // Add operating hours fields for each day
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      if (profileData.operatingHours && profileData.operatingHours.length > 0) {
        profileData.operatingHours.forEach((hour, index) => {
          const day = days[index];
          
          if (hour.isOpen) {
            // Add time with seconds if not present
            const openTime = hour.openTime ? 
              (hour.openTime.length === 5 ? `${hour.openTime}:00` : hour.openTime) : 
              '00:00:00';
            const closeTime = hour.closeTime ? 
              (hour.closeTime.length === 5 ? `${hour.closeTime}:00` : hour.closeTime) : 
              '00:00:00';
            
            formData.append(`${day}_open`, openTime);
            formData.append(`${day}_close`, closeTime);
            formData.append(`${day}_is_open`, 'true');
          } else {
            formData.append(`${day}_is_open`, 'false');
          }
        });
      } else {
        // If no operating hours provided, set all days as closed
        days.forEach(day => {
          formData.append(`${day}_is_open`, 'false');
        });
      }
      
      // Add images
      images.forEach((file) => {
        if (file) {
          formData.append('images', file);
        }
      });

      console.log('Creating profile with data:', {
        name: profileData.name,
        email: profileData.email,
        phone_number: profileData.phoneNumber,
        imageCount: images.filter(f => f).length
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
        
        // Handle validation errors
        if (response.status === 400 && data.error) {
          throw new Error(data.error);
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
  updateProfile: async (profileData, newImages = []) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const formData = new FormData();
      
      // Add basic text fields
      formData.append('name', profileData.name || '');
      formData.append('description', profileData.description || '');
      formData.append('address', profileData.address || '');
      formData.append('phone_number', profileData.phoneNumber || '');
      formData.append('email', profileData.email || '');
      
      // Add operating hours fields for each day
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      if (profileData.operatingHours && profileData.operatingHours.length > 0) {
        profileData.operatingHours.forEach((hour, index) => {
          const day = days[index];
          
          if (hour.isOpen) {
            // Add time with seconds if not present
            const openTime = hour.openTime ? 
              (hour.openTime.length === 5 ? `${hour.openTime}:00` : hour.openTime) : 
              '00:00:00';
            const closeTime = hour.closeTime ? 
              (hour.closeTime.length === 5 ? `${hour.closeTime}:00` : hour.closeTime) : 
              '00:00:00';
            
            formData.append(`${day}_open`, openTime);
            formData.append(`${day}_close`, closeTime);
            formData.append(`${day}_is_open`, 'true');
          } else {
            formData.append(`${day}_is_open`, 'false');
          }
        });
      }
      
      // Add new images only (file objects, not URLs)
      newImages.forEach((file) => {
        if (file && file instanceof File) {
          formData.append('images', file);
        }
      });

      console.log('Updating profile with data:', {
        name: profileData.name,
        email: profileData.email,
        phone_number: profileData.phoneNumber,
        newImageCount: newImages.filter(f => f instanceof File).length
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
        
        // Handle validation errors
        if (response.status === 400 && data.error) {
          throw new Error(data.error);
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