import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5238/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chemwatch_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and redirect to login
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/forgot-password') {
        localStorage.removeItem('chemwatch_token');
        localStorage.removeItem('chemwatch_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
