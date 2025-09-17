import api from './axios';

// Auth
export const loginAdmin = (payload) => api.post('/api/admin/login', payload);

// Doctors
export const fetchAllDoctors = () => api.post('/api/admin/all-doctors', {});
export const toggleDoctorAvailability = (docId) => api.post('/api/admin/change-availability', { docId });
export const addDoctor = (formData) => api.post('/api/admin/add-doctor', formData, { headers: { 'Content-Type': 'multipart/form-data' }});

// Appointments
export const fetchAllAppointments = () => api.get('/api/admin/appointments');
export const cancelAdminAppointment = (appointmentId) => api.post('/api/admin/cancel-appointment', { appointmentId });

// Dashboard
export const fetchAdminDashboard = () => api.get('/api/admin/dashboard');
