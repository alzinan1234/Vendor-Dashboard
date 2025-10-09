import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const withdrawalService = {
  // Get all withdrawal requests
  getWithdrawalRequests: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WITHDRAWAL_REQUESTS_GET), {
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
        statistics: data.statistics || null,
        message: 'Withdrawal requests retrieved successfully'
      };
    } catch (error) {
      console.error('getWithdrawalRequests error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve withdrawal requests'
      };
    }
  },

  // Get single withdrawal request detail
  getWithdrawalDetail: async (withdrawalId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.WITHDRAWAL_REQUEST_DETAIL(withdrawalId);
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
          throw new Error('Withdrawal request not found');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: 'Withdrawal request retrieved successfully'
      };
    } catch (error) {
      console.error('getWithdrawalDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve withdrawal request'
      };
    }
  },

  // Create withdrawal request
  createWithdrawalRequest: async (withdrawalData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const payload = {
        amount: parseFloat(withdrawalData.amount),
        region: withdrawalData.region
      };

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.WITHDRAWAL_REQUEST_CREATE), {
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
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 400) {
          throw new Error(data.message || 'Invalid withdrawal request data');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
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

export const earningsService = {
  // Get earnings reports
  getEarningsReports: async (startDate, endDate) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      let endpoint = API_CONFIG.ENDPOINTS.EARNINGS_REPORTS_GET;
      
      // Add query parameters if dates are provided
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

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
        data: data.data || data,
        summary: data.summary || null,
        message: 'Earnings reports retrieved successfully'
      };
    } catch (error) {
      console.error('getEarningsReports error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve earnings reports'
      };
    }
  }
};