import { API_CONFIG, getApiUrl } from './config';
import { tokenManager } from './authService';
import { venueService } from './venueService';

export const reviewService = {
  // Get all reviews for a specific venue (Public endpoint)
  getVenueReviews: async (venueId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS_GET(venueId);
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

      // Handle paginated response structure
      return {
        success: true,
        data: data.results || [],
        count: data.count || 0,
        statistics: data.statistics || null,
        next: data.next,
        previous: data.previous,
        message: 'Reviews retrieved successfully'
      };
    } catch (error) {
      console.error('getVenueReviews error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve reviews',
        data: [],
        count: 0
      };
    }
  },

  // Get reviews from dashboard (venue's own reviews) - FULLY DYNAMIC
  getDashboardReviews: async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Get the venue ID dynamically
      const venueId = await venueService.getMyVenueId();
      if (!venueId) throw new Error('Could not retrieve venue ID');

      // Use dynamic endpoint with venue ID
      const endpoint = `/api/hospitality/venues/${venueId}/dashboard/reviews/`;
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

      // Extract statistics if available
      const statistics = data.statistics || {
        total_reviews: data.count || 0,
        average_rating: 0
      };

      // Calculate average rating if not provided
      if (!data.statistics && data.results && data.results.length > 0) {
        const totalRating = data.results.reduce((sum, review) => {
          const rate = review.rate?.rate || 0;
          return sum + rate;
        }, 0);
        statistics.average_rating = (totalRating / data.results.length).toFixed(1);
      }

      return {
        success: true,
        data: data.results || [],
        count: data.count || 0,
        statistics: statistics,
        next: data.next,
        previous: data.previous,
        message: 'Dashboard reviews retrieved successfully'
      };
    } catch (error) {
      console.error('getDashboardReviews error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve dashboard reviews',
        data: [],
        count: 0,
        statistics: { total_reviews: 0, average_rating: 0 }
      };
    }
  },

  // Create a review (User creates review for venue)
  createReview: async (reviewData) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Validate input
      if (!reviewData.venueId) {
        throw new Error('Venue ID is required');
      }
      if (!reviewData.text || reviewData.text.trim().length === 0) {
        throw new Error('Review text is required');
      }
      if (!reviewData.rateValue || reviewData.rateValue < 1 || reviewData.rateValue > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const payload = {
        text: reviewData.text.trim(),
        rate_value: parseInt(reviewData.rateValue)
      };

      const endpoint = API_CONFIG.ENDPOINTS.REVIEWS_CREATE(reviewData.venueId);
      const response = await fetch(getApiUrl(endpoint), {
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
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Review created successfully'
      };
    } catch (error) {
      console.error('createReview error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create review'
      };
    }
  },

  // Reply to a review (Venue replies to user review) - FULLY DYNAMIC
  replyToReview: async (reviewId, replyText) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      // Validate input
      if (!reviewId) {
        throw new Error('Review ID is required');
      }
      if (!replyText || replyText.trim().length < 10) {
        throw new Error('Reply must be at least 10 characters long');
      }

      // Get the venue ID dynamically
      const venueId = await venueService.getMyVenueId();
      if (!venueId) throw new Error('Could not retrieve venue ID');

      const payload = {
        venue_reply: replyText.trim()
      };

      // Use dynamic endpoint with venue ID
      const endpoint = `/api/hospitality/venues/${venueId}/reviews/${reviewId}/reply/`;
      const response = await fetch(getApiUrl(endpoint), {
        method: 'PATCH',
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
        if (response.status === 404) {
          throw new Error('Review not found');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to reply to this review');
        }
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Reply sent successfully'
      };
    } catch (error) {
      console.error('replyToReview error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reply'
      };
    }
  },

  // Delete a review (if needed)
  deleteReview: async (reviewId) => {
    try {
      const token = tokenManager.getToken();
      if (!token) throw new Error('No authentication token found. Please login.');

      const venueId = await venueService.getMyVenueId();
      if (!venueId) throw new Error('Could not retrieve venue ID');

      const endpoint = `/api/hospitality/venues/${venueId}/reviews/${reviewId}/delete/`;
      const response = await fetch(getApiUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('Review not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Review deleted successfully'
      };
    } catch (error) {
      console.error('deleteReview error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete review'
      };
    }
  }
};