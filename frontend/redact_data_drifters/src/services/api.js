import axios from 'axios';

// Backend API base URL - update this if your backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiService = {
  // Auth endpoints (for future use when MongoDB is running)
  signup: async (data) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  // Forecast endpoint (protected)
  getForecast: async () => {
    const response = await api.get('/api/auth/forecast');
    return response.data;
  },

  // RFM endpoint (protected)
  getRFM: async () => {
    const response = await api.get('/api/auth/rfm');
    return response.data;
  },

  // Discounts endpoint
  getDiscounts: async () => {
    const response = await api.get('/api/auth/discounts');
    return response.data;
  },

  // Run all endpoint (forecast + rfm + discounts)
  runAll: async () => {
    const response = await api.get('/api/auth/run-all');
    return response.data;
  },

  // Explain forecast endpoint
  explainForecast: async () => {
    const response = await api.get('/api/auth/explain_forecast');
    return response.data;
  },

  // Home endpoint
  getHome: async () => {
    const response = await api.get('/api/auth/');
    return response.data;
  },
};

export default api;

