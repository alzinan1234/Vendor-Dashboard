// services/orderService.js
import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';

export const orderService = {
  // Get all orders with optional filters
  getAllOrders: async (params = {}) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      if (params.page) queryParams.append('page', params.page);

      const endpoint = `${API_CONFIG.ENDPOINTS.ORDERS_GET}?${queryParams.toString()}`;
      
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

      // Transform API response to match your frontend structure
      const transformedData = data.results.map(order => ({
        id: order.id,
        orderId: order.order_id,
        customerName: order.customer?.name || 'Guest',
        email: order.customer?.email || '',
        table: order.table_number,
        status: order.status_display?.toLowerCase() || order.status,
        amount: `$${order.total_amount}`,
        quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        date: new Date(order.created_at).toLocaleDateString(),
        time: new Date(order.created_at).toLocaleTimeString(),
        items: order.items || [],
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        hospitalityVenue: order.hospitality_venue
      }));

      return {
        success: true,
        data: transformedData,
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
        message: 'Orders retrieved successfully'
      };
    } catch (error) {
      console.error('getAllOrders error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve orders',
        data: []
      };
    }
  },

  // Get single order detail by ID
  getOrderDetail: async (orderId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ORDERS_GET_DETAIL(orderId);
      
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

      const order = data.data || data;
      
      // Transform the order data
      const transformedOrder = {
        id: order.id,
        orderId: order.order_id,
        customerName: order.customer?.name || 'Guest',
        email: order.customer?.email || '',
        table: order.table_number,
        status: order.status_display?.toLowerCase() || order.status,
        amount: `$${order.total_amount}`,
        quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        date: new Date(order.created_at).toLocaleDateString(),
        time: new Date(order.created_at).toLocaleTimeString(),
        items: order.items || [],
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        hospitalityVenue: order.hospitality_venue,
        // For the image in details page - use first item's image or venue image
        imageUrl: order.items?.[0]?.menu_item?.image || 
                 order.hospitality_venue?.profile_picture ||
                 'https://placehold.co/150x150/6c757d/ffffff?text=No+Image'
      };

      return {
        success: true,
        data: transformedOrder,
        message: 'Order detail retrieved successfully'
      };
    } catch (error) {
      console.error('getOrderDetail error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve order detail'
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ORDERS_UPDATE_STATUS(orderId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status })
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
        message: data.message || 'Order status updated successfully'
      };
    } catch (error) {
      console.error('updateOrderStatus error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      };
    }
  },

  // Accept order item
  acceptOrderItem: async (itemId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ORDER_ITEMS_ACCEPT(itemId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'accept' })
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
        message: data.message || 'Order item accepted successfully'
      };
    } catch (error) {
      console.error('acceptOrderItem error:', error);
      return {
        success: false,
        error: error.message || 'Failed to accept order item'
      };
    }
  },

  // Cancel order item
  cancelOrderItem: async (itemId, reason = 'Out of stock') => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.ORDER_ITEMS_CANCEL(itemId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'cancel',
          cancellation_reason: reason
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
        message: data.message || 'Order item cancelled successfully'
      };
    } catch (error) {
      console.error('cancelOrderItem error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel order item'
      };
    }
  }
};

export default orderService;