import { tokenManager } from './authService';
import { getApiUrl } from './config';

// Generic API request function with token management
export const apiRequest = async (endpoint, options = {}) => {
  const token = tokenManager.getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(getApiUrl(endpoint), config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401) {
        tokenManager.removeToken();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: data,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error occurred',
      status: error.status || 500
    };
  }
};

// HTTP Methods helpers
export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
  
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};