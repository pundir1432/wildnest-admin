import api from './api';

export const getUsers      = ()   => api.get('/users');
export const toggleUser    = (id) => api.put(`/users/${id}/toggle`);
