import api from './api';

export const getDashboard = () => api.get('/dashboard');

export const getPaymentDashboard = () => api.get('/payment-dashboard');
