import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiCore = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ── Request: attach JWT token + handle FormData content-type ── */
apiCore.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // If body is FormData let axios set multipart/form-data with boundary automatically
    // Otherwise default to JSON
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response: global error handling ── */
apiCore.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject({ type: 'NETWORK_ERROR', message: 'No internet connection.' });
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoggedIn');
      window.location.href = '/admin/login';
    }

    return Promise.reject({
      type: 'API_ERROR',
      status,
      message: data?.message || 'Something went wrong.',
    });
  }
);

export default apiCore;
