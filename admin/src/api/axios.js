import axios from 'axios';

// Normalize backend URL to avoid malformed values like ':8000' or 'localhost:8000'
function resolveBaseURL() {
  let raw = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  if (raw.endsWith('/')) raw = raw.slice(0, -1);

  // If missing protocol
  if (!/^https?:\/\//i.test(raw)) {
    // If starts with ':' treat as port only (e.g. ':8000')
    if (raw.startsWith(':')) {
      return window.location.protocol + '//' + window.location.hostname + raw;
    }
    // If starts with 'localhost' or an IP without protocol
    return 'http://' + raw;
  }
  return raw;
}

const baseURL = resolveBaseURL();
// Optional: quick debug log (can comment out later)
// console.log('API Base URL ->', baseURL);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const atoken = localStorage.getItem('atoken');
  const dtoken = localStorage.getItem('dtoken');
  if (atoken) config.headers['atoken'] = atoken;
  if (dtoken) config.headers['dtoken'] = dtoken;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error('Admin API Error:', err.response.status, err.response.data);
    } else {
      console.error('Admin API Network Error:', err.message);
    }
    return Promise.reject(err);
  }
);

export default api;
