import { API_CONFIG, getApiUrl } from './config';

// Forgot Password API Service
export const forgotPasswordService = {
  // Step 1: Send password reset request (sends OTP to email)
  sendOTP: async (email) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_REQUEST), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Please check the API endpoint.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: data.message || 'OTP sent successfully'
      };
    } catch (error) {
      console.error('sendOTP error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  },

  // Step 2: Verify OTP for password reset
  verifyOTP: async (email, otp) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_VERIFY_OTP), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          otp: otp 
        })
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Please check the API endpoint.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: data.message || 'OTP verified successfully'
      };
    } catch (error) {
      console.error('verifyOTP error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  },

  // Step 3: Confirm password reset with new password
  setNewPassword: async (email, otp, newPassword, newPassword2) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_CONFIRM), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          otp: otp,
          new_password: newPassword,
          new_password2: newPassword2
        })
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response. Please check the API endpoint.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: data.message || 'Password reset successfully'
      };
    } catch (error) {
      console.error('setNewPassword error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  }
};