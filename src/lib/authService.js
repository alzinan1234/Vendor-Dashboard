import { API_CONFIG, getApiUrl } from './config';

// Token management functions
export const tokenManager = {
  // Set token in cookie
  setToken: (token, rememberMe = false) => {
    localStorage.setItem('authToken', token);
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 30; // 30 days or 30 minutes
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  },

  // Get token from cookie
  getToken: () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  },

  // Remove token 
  removeToken: () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

// API Service for authentication
export const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return {
        success: true,
        data: data,
        token: data.token || data.access_token || data.authToken, // Handle different token field names
        user: data.user || data.userData || null
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  },

  // Logout function
  logout: async () => {
    try {
      // If you have a logout endpoint, call it here
      // const response = await fetch(getApiUrl('/api/logout'), {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${tokenManager.getToken()}`,
      //     'Content-Type': 'application/json',
      //   }
      // });

      // Clear local token
      tokenManager.removeToken();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return tokenManager.getToken() !== null;
  }
};