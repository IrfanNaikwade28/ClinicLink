import api from './axios';

// User appointment APIs
export const bookAppointment = (payload) => api.post('/api/user/book-appointment', payload);
export const listUserAppointments = () => api.get('/api/user/appointments');
export const cancelUserAppointment = (payload) => api.post('/api/user/cancel-appointment', payload);

// Doctor appointment APIs
export const listDoctorAppointments = () => api.get('/api/doctor/appointments');
export const completeDoctorAppointment = (payload) => api.post('/api/doctor/complete-appointment', payload);
export const cancelDoctorAppointment = (payload) => api.post('/api/doctor/cancel-appointment', payload);

// Admin appointment APIs
export const listAdminAppointments = () => api.get('/api/admin/appointments');
export const cancelAdminAppointment = (payload) => api.post('/api/admin/cancel-appointment', payload);
