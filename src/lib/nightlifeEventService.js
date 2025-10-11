import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

// Nightlife Event API Service
export const nightlifeEventService = {
  // Get all events for a venue
  getEvents: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const venueId = await venueService.getMyVenueId();
      
      const endpoint = `/api/hospitality/venues/${venueId}/nightlife-events/`;
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
        message: data.message || 'Events retrieved successfully'
      };
    } catch (error) {
      console.error('getEvents error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve events'
      };
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const formData = new FormData();
      formData.append('name', eventData.name);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('time', eventData.time);
      formData.append('max_number_of_guests', eventData.maxGuests);
      formData.append('price_per_person', eventData.pricePerPerson);
      formData.append('address', eventData.address);
      formData.append('phone_number', eventData.phoneNumber);
      formData.append('email', eventData.email);
      formData.append('website', eventData.website || '');
      formData.append('is_active', 'true');
      formData.append('is_featured', eventData.isFeatured ? 'true' : 'false');
      
      // Optional fields
      if (eventData.entryTypeId) {
        formData.append('entry_type', eventData.entryTypeId);
      }
      if (eventData.timeSlotId) {
        formData.append('time_slot', eventData.timeSlotId);
      }
      
      if (eventData.coverImage && eventData.coverImage instanceof File) {
        formData.append('cover_image', eventData.coverImage);
      }

      const response = await fetch(getApiUrl('/api/hospitality/nightlife-events/create/'), {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
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
        message: data.message || 'Event created successfully'
      };
    } catch (error) {
      console.error('createEvent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create event'
      };
    }
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const formData = new FormData();
      formData.append('name', eventData.name);
      formData.append('description', eventData.description);
      formData.append('date', eventData.date);
      formData.append('time', eventData.time);
      formData.append('max_number_of_guests', eventData.maxGuests);
      formData.append('price_per_person', eventData.pricePerPerson);
      formData.append('address', eventData.address);
      formData.append('phone_number', eventData.phoneNumber);
      formData.append('email', eventData.email);
      formData.append('website', eventData.website || '');
      formData.append('is_active', 'true');
      formData.append('is_featured', eventData.isFeatured ? 'true' : 'false');
      
      // Optional fields
      if (eventData.entryTypeId) {
        formData.append('entry_type', eventData.entryTypeId);
      }
      if (eventData.timeSlotId) {
        formData.append('time_slot', eventData.timeSlotId);
      }
      
      if (eventData.coverImage && eventData.coverImage instanceof File) {
        formData.append('cover_image', eventData.coverImage);
      }

      const endpoint = `/api/hospitality/nightlife-events/${eventId}/update/`;

      const response = await fetch(getApiUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
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
        message: data.message || 'Event updated successfully'
      };
    } catch (error) {
      console.error('updateEvent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update event'
      };
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login.');
      }

      const endpoint = `/api/hospitality/nightlife-events/${eventId}/delete/`;
      
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
        if (response.status === 204) {
          return {
            success: true,
            message: 'Event deleted successfully'
          };
        }
        const textResponse = await response.text();
        throw new Error(textResponse || 'Server returned non-JSON response.');
      }

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        
        if (response.status === 404) {
          return {
            success: true,
            message: 'Event has already been deleted'
          };
        }

        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: data.message || 'Event deleted successfully'
      };
    } catch (error) {
      console.error('deleteEvent error:', error);
      
      if (error.message && error.message.includes('not found')) {
        return {
          success: true,
          message: 'Event has already been deleted'
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to delete event'
      };
    }
  },

  // Get entry types
  getEntryTypes: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl('/api/hospitality/entry-types/'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch entry types');
      }

      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('getEntryTypes error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Create entry type
  createEntryType: async (type) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl('/api/hospitality/entry-types/create/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create entry type');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('createEntryType error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get time slots for a venue
  getTimeSlots: async (venueId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl(`/api/hospitality/venues/${venueId}/time-slots/`), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch time slots');
      }

      return {
        success: true,
        data: data.data || []
      };
    } catch (error) {
      console.error('getTimeSlots error:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Create time slot
  createTimeSlot: async (startTime, endTime) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const response = await fetch(getApiUrl('/api/hospitality/time-slots/create/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          start_time: startTime,
          end_time: endTime 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create time slot');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('createTimeSlot error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};