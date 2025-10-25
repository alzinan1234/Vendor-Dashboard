import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

// Profile API Service
export const profileService = {
  // Get profile details
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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('getProfile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve profile'
      };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      console.log('Updating profile with data:', profileData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Add all profile fields
      if (profileData.venueName) formData.append('venue_name', profileData.venueName);
      if (profileData.mobileNumber) formData.append('mobile_number', profileData.mobileNumber);
      if (profileData.location) formData.append('location', profileData.location);
      if (profileData.hoursOfOperation) formData.append('hours_of_operation', profileData.hoursOfOperation);
      if (profileData.capacity) formData.append('capacity', profileData.capacity);
      if (profileData.hospitalityVenueType) formData.append('hospitality_venue_type', profileData.hospitalityVenueType);
      
      // ONLY append profile picture if a new file is uploaded
      if (profileData.profilePicture && profileData.profilePicture instanceof File) {
        formData.append('profile_picture', profileData.profilePicture);
        console.log('New profile picture attached');
      } else {
        console.log('No new profile picture, keeping existing image');
      }

      // ONLY append resume if a new file is uploaded
      if (profileData.resume && profileData.resume instanceof File) {
        formData.append('resume', profileData.resume);
        console.log('New resume attached');
      }

      const endpoint = API_CONFIG.ENDPOINTS.PROFILE_UPDATE;
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
        message: data.message || 'Profile updated successfully'
      };
    } catch (error) {
      console.error('updateProfile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      console.log('Changing password');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_CHANGE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
          new_password2: passwordData.newPassword2
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();
      console.log('Password change response:', data);

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
        message: data.message || 'Password changed successfully'
      };
    } catch (error) {
      console.error('changePassword error:', error);
      return {
        success: false,
        error: error.message || 'Failed to change password'
      };
    }
  }
};