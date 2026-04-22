import api from './api';

// ── Camps ──────────────────────────────────────────────────────
export const getCamps    = ()        => api.get('/camps');
export const getCamp     = (id)      => api.get(`/camps/${id}`);
export const createCamp  = (data)    => api.post('/camps', data);
export const updateCamp  = (id, data) => api.put(`/camps/${id}`, data);
export const deleteCamp  = (id)      => api.delete(`/camps/${id}`);

// ── Rafting ────────────────────────────────────────────────────
export const getRaftings   = ()        => api.get('/rafting');
export const createRafting = (data)    => api.post('/rafting', data);
export const updateRafting = (id, data) => api.put(`/rafting/${id}`, data);
export const deleteRafting = (id)      => api.delete(`/rafting/${id}`);

// ── Rentals ────────────────────────────────────────────────────
export const getRentals   = ()        => api.get('/rentals');
export const createRental = (data)    => api.post('/rentals', data);
export const updateRental = (id, data) => api.put(`/rentals/${id}`, data);
export const deleteRental = (id)      => api.delete(`/rentals/${id}`);

// ── Helper: build FormData from plain object + optional images ──
export const buildFormData = (fields, imageFiles = []) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  imageFiles.forEach((file) => fd.append('images', file));
  return fd;
};
