import api from './axios';

// User auth APIs
export const registerUser = (payload) => api.post('/api/user/register', payload);
export const loginUser = (payload) => api.post('/api/user/login', payload);
export const getUserProfile = () => api.get('/api/profile');
export const updateUserProfile = (formData) => api.put('/api/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' }});

// Doctor auth APIs
export const loginDoctor = (payload) => api.post('/api/doctor/login', payload);
export const listDoctors = () => api.get('/api/doctors');

// Admin auth APIs
export const loginAdmin = (payload) => api.post('/api/admin/login', payload);
