import api from './axios';

// Auth
export const loginAdmin = (payload) => api.post('/api/admin/login', payload);

// Doctors
export const fetchAllDoctors = () => api.post('/api/admin/all-doctors', {});
export const toggleDoctorAvailability = (docId) => api.post('/api/admin/change-availability', { docId });
export const addDoctor = (formData) => api.post('/api/admin/add-doctor', formData, { headers: { 'Content-Type': 'multipart/form-data' }});

// Appointments
export const fetchAllAppointments = (search) => api.get(`/api/admin/appointments${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const cancelAdminAppointment = (appointmentId) => api.post('/api/admin/cancel-appointment', { appointmentId });

// Dashboard
export const fetchAdminDashboard = () => api.get('/api/admin/dashboard');

// Users
export const listUsers = () => api.get('/api/admin/users');
export const deleteUser = (userId) => api.delete(`/api/admin/users/${userId}`);

// Delete Doctor
export const deleteDoctor = (doctorId) => api.delete(`/api/admin/doctor/${doctorId}`);

// Reports (Admin)
export const fetchAllReports = () => api.get('/api/admin/reports');
export const getReportById = (reportId) => api.get(`/api/reports/${reportId}`);
