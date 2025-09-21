import api from './axios';

export const listReportsForPatient = (patientId) => api.get(`/api/reports/patient/${patientId}`);
export const getReportById = (id) => api.get(`/api/reports/${id}`);
