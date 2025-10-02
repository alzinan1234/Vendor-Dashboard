import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

// Bank Details API Service
export const bankDetailsService = {
  // Create bank details
  createBankDetails: async (bankData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANK_DETAILS_CREATE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_number: bankData.accountNumber,
          routing_number: bankData.routingNumber,
          bank_name: bankData.bankName,
          bankholder_name: bankData.bankholderName,
          bank_address: bankData.bankAddress
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          tokenManager.removeToken();
        //   window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Bank details created successfully'
      };
    } catch (error) {
      console.error('createBankDetails error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create bank details'
      };
    }
  },

  // Get bank details
  getBankDetails: async () => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANK_DETAILS_GET), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        // Handle 401 Unauthorized
        if (response.status === 401) {
          tokenManager.removeToken();
        //   window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        // Handle 404 - No bank details found
        if (response.status === 404) {
          return {
            success: false,
            notFound: true,
            error: 'No bank details found'
          };
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Bank details retrieved successfully'
      };
    } catch (error) {
      console.error('getBankDetails error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve bank details'
      };
    }
  },

  // Update bank details
  updateBankDetails: async (bankData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.BANK_DETAILS_UPDATE), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_number: bankData.accountNumber,
          routing_number: bankData.routingNumber,
          bank_name: bankData.bankName,
          bankholder_name: bankData.bankholderName,
          bank_address: bankData.bankAddress
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          tokenManager.removeToken();
        //   window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Bank details updated successfully'
      };
    } catch (error) {
      console.error('updateBankDetails error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update bank details'
      };
    }
  }
};