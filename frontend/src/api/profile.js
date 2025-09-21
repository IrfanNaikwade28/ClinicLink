import api from './axios';

export const getProfile = () => api.get('/api/profile');
export const updateProfile = (payloadOrFormData, isMultipart = false) =>
  api.put('/api/profile', payloadOrFormData, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
