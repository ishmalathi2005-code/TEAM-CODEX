import axios from 'axios';

// Create configured Axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token from storage to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codex_token') || sessionStorage.getItem('codex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g. 401 Unauthorized token expiry)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid/expired session data
      localStorage.removeItem('codex_token');
      localStorage.removeItem('codex_user');
      sessionStorage.removeItem('codex_token');
      sessionStorage.removeItem('codex_user');
      
      // Dispatch custom event for AuthContext to update UI state smoothly
      window.dispatchEvent(new CustomEvent('codex:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
