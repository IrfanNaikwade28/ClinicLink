import axios from 'axios';

// Base URL from Vite env (define VITE_BACKEND_URL in .env.local)
const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
});

// Request interceptor to append tokens based on role if present
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('token');
  const doctorToken = localStorage.getItem('dtoken');
  const adminToken = localStorage.getItem('atoken');
  if (userToken) config.headers['token'] = userToken;
  if (doctorToken) config.headers['dtoken'] = doctorToken;
  if (adminToken) config.headers['atoken'] = adminToken;
  return config;
});

// Response error logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('API Network/Error:', err.message);
    }
    return Promise.reject(err);
  }
);

export default api;