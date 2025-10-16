import { tokenManager } from "./authService";
import { API_CONFIG, getApiUrl } from "./config";

export const qrService = {
  downloadQRCode: async () => {
    try {
      const token = tokenManager.getToken();
      console.log(token)
      if (!token) throw new Error('No auth token');

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VENUE_QR_CODE), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          tokenManager.removeToken();
          window.location.href = '/';
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();
      
      if (!data.data || !data.data.qr_code_url) {
        throw new Error('QR code URL not found in response');
      }

      let qrCodeUrl = data.data.qr_code_url;
      
      // Convert http to https if needed (since the cloudflare tunnel supports both)
      qrCodeUrl = qrCodeUrl.replace('http://', 'https://');

      // Fetch the image with credentials
      const imageResponse = await fetch(qrCodeUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!imageResponse.ok) {
        throw new Error('Failed to fetch QR code image');
      }

      const blob = await imageResponse.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `venue-qr-code-${data.data.venue_id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

      return true;
    } catch (error) {
      console.error('QR Code download error:', error);
      alert('Failed to download QR code. Please try again.');
      throw error;
    }
  }
};