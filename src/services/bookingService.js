import api from './api';

export const getBookings = (params = {}) => api.get('/bookings', { params });

export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status });
