import apiClient from '../utils/apiClient';

export const getEvents = async (filters = {}) => {
  const params = { ...filters };
  
  if (params.severity === 'ALL') {
    delete params.severity;
  }
  if (params.status === 'ALL') {
    delete params.status;
  }
  
  // The backend supports page, pageSize, searchTerm, severity, status, applicationId, from, to, sortBy
  const response = await apiClient.get('/api/events', { params });
  return response;
};

export const getEventById = async (id) => {
  const response = await apiClient.get(`/api/events/${id}`);
  return response;
};
