import api from './axios';

// Auth
export const loginDoctor = (payload) => api.post('/api/doctor/login', payload);

// Appointments
export const fetchDoctorAppointments = (search) => api.get(`/api/doctor/appointments${search ? `?search=${encodeURIComponent(search)}` : ''}`);
export const completeDoctorAppointment = (appointmentId) => api.post('/api/doctor/complete-appointment', { appointmentId });
export const cancelDoctorAppointment = (appointmentId) => api.post('/api/doctor/cancel-appointment', { appointmentId });

// Dashboard
export const fetchDoctorDashboard = () => api.get('/api/doctor/dashboard');

// Unified Profile
export const fetchProfile = () => api.get('/api/profile');
export const updateProfile = (payloadOrFormData, isMultipart = false) =>
	api.put('/api/profile', payloadOrFormData, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);

// Admin doctor management (RESTful)
export const adminListDoctors = () => api.get('/api/doctors');
export const adminCreateDoctor = (formData) => api.post('/api/doctors', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateDoctor = (id, formData) => api.put(`/api/doctors/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteDoctor = (id) => api.delete(`/api/doctors/${id}`);

// Reports (doctor)
export const createReport = (payload) => api.post('/api/reports', payload);
export const updateReport = (id, payload) => api.put(`/api/reports/${id}`, payload);
export const listReportsForPatient = (patientId) => api.get(`/api/reports/patient/${patientId}`);
export const getReportForEditing = (patientId, appointmentId) => api.get(`/api/reports/comprehensive/${patientId}/${appointmentId}`);
