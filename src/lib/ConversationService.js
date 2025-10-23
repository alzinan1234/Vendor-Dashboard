// services/conversationService.js
import { API_CONFIG, getApiUrl } from './config';
import { venueServiceUserID } from './venueService';

/**
 * Token Manager - handles authentication token storage and retrieval
 */
const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  },

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
};

/**
 * Main Conversation Service
 * Handles all vendor-customer chat operations
 */
export const conversationService = {
  /**
   * Get all conversations for the vendor
   * @param {Object} params - Optional query parameters (search, page)
   * @returns {Object} Success/error response with conversations array
   */
  getConversations: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);

      const endpoint = `${API_CONFIG.ENDPOINTS.CONVERSATIONS}?${queryParams.toString()}`;

      console.log('Fetching conversations from:', getApiUrl(endpoint));

      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Response received mmmmmmmmmmmmmmmmmmmm:', response);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        conversations: data.conversations || data.results || [],
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        message: data.message || 'Conversations retrieved successfully'
      };
    } catch (error) {
      console.error('getConversations error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve conversations',
        conversations: []
      };
    }
  },

  /**
   * Get messages between vendor and specific customer
   * @param {number} customerId - The customer user ID
   * @returns {Object} Success/error response with messages array
   */
  getMessages: async (customerId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      if (!customerId) throw new Error('Customer ID is required.');

      const venueId = await venueServiceUserID.getMyVenueUserId();

      console.log("xxxxxxxxxxxx kkkk", customerId)

      const endpoint = API_CONFIG.ENDPOINTS.MESSAGES(customerId);

      console.log('Fetching messages from oooooooooooooo:', getApiUrl(endpoint));

      const response = await fetch(getApiUrl(endpoint), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Response received mmmmmmmmmmmmmmmmmmmm:', response);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      // Extract messages from nested structure
      const messages = data.results?.messages || data.messages || [];

      return {
        success: true,
        messages: messages,
        count: data.count || messages.length,
        message: data.message || 'Messages retrieved successfully'
      };
    } catch (error) {
      console.error('getMessages error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve messages',
        messages: []
      };
    }
  },

  /**
   * Send a text message to a customer
   * @param {number} customerId - The customer user ID (receiver)
   * @param {string} messageText - The message content
   * @param {number} replyToId - Optional message ID to reply to
   * @returns {Object} Success/error response with sent message data
   */
  sendMessage: async (customerId, messageText, replyToId = null) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      if (!customerId) throw new Error('Customer ID is required.');
      if (!messageText || messageText.trim().length === 0) throw new Error('Message text is required.');

      const payload = {
        receiver_id: customerId, // This is the CUSTOMER USER ID
        message: messageText.trim(),
      };

      if (replyToId) {
        payload.reply_to = replyToId;
      }

      console.log('Sending message to customer:', customerId, 'Payload:', payload);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SEND_MESSAGE), {
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
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Message sent successfully'
      };
    } catch (error) {
      console.error('sendMessage error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send message'
      };
    }
  },

  /**
   * Upload file and send as message
   * @param {number} customerId - The customer user ID (receiver)
   * @param {File} file - The file to upload
   * @param {string} messageText - Optional message text to accompany the file
   * @param {number} vendorId - The vendor ID (your ID)
   * @returns {Object} Success/error response with uploaded file data
   */
  uploadFile: async (customerId, file, messageText = null, vendorId = null) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      if (!customerId) throw new Error('Customer ID is required.');
      if (!file) throw new Error('File is required.');

     const formData = new FormData();
formData.append('file', file);
formData.append('receiver_id', customerId);
      
 
      
      if (messageText) {
        formData.append('text', messageText);
      }

      console.log('Uploading file to customer:', customerId, 'Vendor ID:', vendorId, 'File:', file.name);

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_FILE), {
        method: 'POST',
        headers: {
          // Don't set Content-Type - browser will set it automatically with boundary
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response.');
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'File uploaded successfully'
      };
    } catch (error) {
      console.error('uploadFile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload file'
      };
    }
  },

  /**
   * Mark a conversation as read
   * @param {number} conversationId - The conversation ID
   * @returns {Object} Success/error response
   */
  markConversationAsRead: async (conversationId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      if (!conversationId) throw new Error('Conversation ID is required.');

      const endpoint = API_CONFIG.ENDPOINTS.MARK_READ(conversationId);

      console.log('Marking conversation as read:', conversationId);

      const response = await fetch(getApiUrl(endpoint), {
        method: 'POST',
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
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Conversation marked as read successfully'
      };
    } catch (error) {
      console.error('markConversationAsRead error:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark conversation as read'
      };
    }
  },

  /**
   * Get a single conversation detail
   * @param {number} conversationId - The conversation ID
   * @returns {Object} Success/error response with conversation details
   */
  getConversationDetail: async (conversationId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      if (!conversationId) throw new Error('Conversation ID is required.');

      const endpoint = `${API_CONFIG.ENDPOINTS.CONVERSATIONS}${conversationId}/`;

      console.log('Fetching conversation detail:', getApiUrl(endpoint));

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
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data,
        message: data.message || 'Conversation detail retrieved successfully'
      };
    } catch (error) {
      console.error('getConversationDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve conversation detail'
      };
    }
  }
};

// Export token manager for external use if needed
export { tokenManager };