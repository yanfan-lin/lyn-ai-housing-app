import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/auth/';

export const authService = {
  register: (userData) => {
    return axios.post(API_URL + 'register/', userData);
  },

  login: (credentials) => {
    return axios.post(API_URL + 'login/', credentials)
      .then(response => {
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAuthHeader: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// Configured axios instance
export const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request interceptor
authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
authAxios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(API_URL + 'token/refresh/', {
          refresh: localStorage.getItem('refresh_token')
        });

        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);