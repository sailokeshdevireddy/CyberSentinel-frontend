import axios from 'axios';

// Get base URL from environment or fallback to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    // Don't attach to auth endpoints to avoid stale tokens messing with public routes
    if (token && !config.url.startsWith('/api/auth/login') && !config.url.startsWith('/api/auth/register')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors and envelopes
apiClient.interceptors.response.use(
  (response) => {
    // If the backend returns our standard envelope (success: true), just return it
    return response.data;
  },
  (error) => {
    if (!error.response) {
      // Network Error
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your connection.',
      });
    }

    const { status, data } = error.response;
    
    // Extract backend error envelope if present
    const backendError = data?.error || {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred.',
    };

    // Handle 401 Unauthorized globally
    if (status === 401) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      // If we are not already on the login page, redirect
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }

    // 403 Forbidden is preserved in the envelope, the UI can show a denied state
    // 404, 400, 409 are just returned as standard rejected promises with the envelope
    
    return Promise.reject(backendError);
  }
);

export default apiClient;
