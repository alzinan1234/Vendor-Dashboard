import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

// Menu API Service
export const myMenuService = {
  // ==================== CATEGORIES ====================
  
  // Get all menu categories
  getCategories: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const venueId = await venueService.getMyVenueId();
      
      const endpoint = API_CONFIG.ENDPOINTS.MENU_CATEGORIES_GET(venueId);
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
        data: data.data || [],
        message: data.message || 'Categories retrieved successfully'
      };
    } catch (error) {
      console.error('getCategories error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve categories'
      };
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const venueId = await venueService.getMyVenueId();

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('hospitality_venue', venueId);
      
      // Append image file if exists
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MENU_CATEGORIES_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it automatically with boundary
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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Category created successfully'
      };
    } catch (error) {
      console.error('createCategory error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create category'
      };
    }
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      console.log('Updating category ID:', categoryId);
      console.log('Category data:', categoryData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('name', categoryData.name);
      
      // ONLY append image if a new file is uploaded
      if (categoryData.image && categoryData.image instanceof File) {
        formData.append('image', categoryData.image);
        console.log('New image file attached');
      } else {
        console.log('No new image file, keeping existing image');
      }

      const endpoint = API_CONFIG.ENDPOINTS.MENU_CATEGORIES_UPDATE(categoryId);
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
        message: data.message || 'Category updated successfully'
      };
    } catch (error) {
      console.error('updateCategory error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update category'
      };
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.MENU_CATEGORIES_DELETE(categoryId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Handle non-JSON responses
        if (response.status === 204) {
          // No content but successful deletion
          return {
            success: true,
            message: 'Category deleted successfully'
          };
        }
        const textResponse = await response.text();
        throw new Error(textResponse || 'Server returned non-JSON response.');
      }

      // Handle various response cases
      if (!response.ok) {
        // Authentication error
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        // Handle "Category not found" error
        if (response.status === 404 || 
            (data.message && data.message.includes('not found'))) {
          return {
            success: true,
            message: 'Category has already been deleted'
          };
        }

        // Other errors
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Category deleted successfully'
      };
    } catch (error) {
      console.error('deleteCategory error:', error);
      
      // If the error indicates the category doesn't exist, treat it as a success
      if (error.message && (
          error.message.includes('not found') ||
          error.message.includes('already been deleted')
      )) {
        return {
          success: true,
          message: 'Category has already been deleted'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to delete category'
      };
    }
  },

  // ==================== MENU ITEMS ====================
  
  // Get all menu items
  getMenuItems: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const venueId = await venueService.getMyVenueId();
      
      const endpoint = API_CONFIG.ENDPOINTS.MENU_ITEMS_GET(venueId);
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
        data: data.data || [],
        message: data.message || 'Menu items retrieved successfully'
      };
    } catch (error) {
      console.error('getMenuItems error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve menu items'
      };
    }
  },

  // Create new menu item
  createMenuItem: async (itemData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('item_name', itemData.name);
      formData.append('item_details', itemData.description);
      formData.append('hospitality_venue_menu_category_id', itemData.categoryId);
    formData.append('price', parseFloat(itemData.price) || 0);
    formData.append('discount', parseFloat(itemData.discountPercentage || '0'));
    formData.append('calories', parseInt(itemData.calories || '0'));
    formData.append('serving_size', parseInt(itemData.servingSize || '1'));
      formData.append('availability', itemData.availability || 'available');
      
      // Append image file if exists
      if (itemData.image) {
        formData.append('image', itemData.image);
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MENU_ITEMS_CREATE), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, browser will set it automatically with boundary
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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message || 'Menu item created successfully'
      };
    } catch (error) {
      console.error('createMenuItem error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create menu item'
      };
    }
  },

  // Update menu item
  updateMenuItem: async (itemId, itemData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      console.log('Updating menu item ID:', itemId);
      console.log('Menu item data:', itemData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      formData.append('item_name', itemData.name);
      formData.append('item_details', itemData.description);
      formData.append('hospitality_venue_menu_category_id', itemData.categoryId);
      formData.append('price', itemData.price);
      formData.append('calories', parseInt(itemData.calories || '0'));
      formData.append('serving_size', parseInt(itemData.servingSize || '1'));
      formData.append('discount', parseFloat(itemData.discountPercentage || '0'));
      formData.append('availability', itemData.availability || 'available');
      
      // ONLY append image if a new file is uploaded
      if (itemData.image && itemData.image instanceof File) {
        formData.append('image', itemData.image);
        console.log('New image file attached');
      } else {
        console.log('No new image file, keeping existing image');
      }

      const endpoint = API_CONFIG.ENDPOINTS.MENU_ITEMS_UPDATE(itemId);
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
        message: data.message || 'Menu item updated successfully'
      };
    } catch (error) {
      console.error('updateMenuItem error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update menu item'
      };
    }
  },

  // Delete menu item
  deleteMenuItem: async (itemId) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = API_CONFIG.ENDPOINTS.MENU_ITEMS_DELETE(itemId);
      
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Handle non-JSON responses
        if (response.status === 204) {
          // No content but successful deletion
          return {
            success: true,
            message: 'Menu item deleted successfully'
          };
        }
        const textResponse = await response.text();
        throw new Error(textResponse || 'Server returned non-JSON response.');
      }

      // Handle various response cases
      if (!response.ok) {
        // Authentication error
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        // Handle "Menu item not found" error
        if (response.status === 404 || 
            (data.message && data.message.includes('not found'))) {
          return {
            success: true,
            message: 'Menu item has already been deleted'
          };
        }

        // Other errors
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Menu item deleted successfully'
      };
    } catch (error) {
      console.error('deleteMenuItem error:', error);
      
      // If the error indicates the menu item doesn't exist, treat it as a success
      if (error.message && (
          error.message.includes('not found') ||
          error.message.includes('already been deleted')
      )) {
        return {
          success: true,
          message: 'Menu item has already been deleted'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to delete menu item'
      };
    }
  }
};