// services/earningsService.js
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const earningsService = {
  // Get earnings overview with filters
  getEarningsOverview: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      if (params.earning_type) queryParams.append('earning_type', params.earning_type);
      if (params.period) queryParams.append('period', params.period);
      if (params.search) queryParams.append('search', params.search);

      const endpoint = `${API_CONFIG.ENDPOINTS.EARNINGS_REPORTS_GET}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
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
        data: data.results || data.data || [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        wallet_summary: data.wallet_summary || {},
        filter_summary: data.filter_summary || {},
        message: data.message || 'Earnings retrieved successfully'
      };
    } catch (error) {
      console.error('getEarningsOverview error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve earnings'
      };
    }
  },

  // Get single transaction/order details
  getTransactionDetail: async (transactionId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Try order endpoint first
      let endpoint = API_CONFIG.ENDPOINTS.ORDERS_GET_DETAIL(transactionId);
      
      let response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      // If not found, try order items
      if (response.status === 404) {
        endpoint = API_CONFIG.ENDPOINTS.ORDER_ITEMS_GET_DETAIL(transactionId);
        response = await fetch(getApiUrl(endpoint), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
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
        message: data.message || 'Transaction retrieved successfully'
      };
    } catch (error) {
      console.error('getTransactionDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve transaction details'
      };
    }
  },

  // Get withdrawal requests
  getWithdrawalRequests: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);

      const endpoint = `${API_CONFIG.ENDPOINTS.WITHDRAWAL_REQUESTS_GET}?${queryParams.toString()}`;
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
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
        data: data.results || data.data || [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        message: data.message || 'Withdrawal requests retrieved successfully'
      };
    } catch (error) {
      console.error('getWithdrawalRequests error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve withdrawal requests'
      };
    }
  },

  // Create withdrawal request
  createWithdrawalRequest: async (amount) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WITHDRAWAL_REQUEST_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
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
        message: data.message || 'Withdrawal request created successfully'
      };
    } catch (error) {
      console.error('createWithdrawalRequest error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create withdrawal request'
      };
    }
  }
};