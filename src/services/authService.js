import api from './api';

export const loginApi = (data) => api.post('/login', data);

export const signupApi = (data) => api.post('/register', data);
