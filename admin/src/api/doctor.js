import api from './axios';

// Auth
export const loginDoctor = (payload) => api.post('/api/doctor/login', payload);

// Appointments
export const fetchDoctorAppointments = () => api.get('/api/doctor/appointments');
export const completeDoctorAppointment = (appointmentId) => api.post('/api/doctor/complete-appointment', { appointmentId });
export const cancelDoctorAppointment = (appointmentId) => api.post('/api/doctor/cancel-appointment', { appointmentId });

// Dashboard
export const fetchDoctorDashboard = () => api.get('/api/doctor/dashboard');

// Profile
export const fetchDoctorProfile = () => api.get('/api/doctor/profile');
export const updateDoctorProfile = (payload) => api.post('/api/doctor/update-profile', payload);

// Admin doctor management (RESTful)
export const adminListDoctors = () => api.get('/api/doctors');
export const adminCreateDoctor = (formData) => api.post('/api/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateDoctor = (id, formData) => api.put(`/api/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteDoctor = (id) => api.delete(`/api/doctors/${id}`);
