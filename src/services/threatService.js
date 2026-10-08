import apiClient from '../utils/apiClient';

export const getThreats = async (filters = {}) => {
  const params = { ...filters };
  
  if (params.severity === 'ALL') {
    delete params.severity;
  }
  if (params.status === 'ALL') {
    delete params.status;
  }
  
  const response = await apiClient.get('/api/threats', { params });
  return response;
};

export const getThreatById = async (id) => {
  const response = await apiClient.get(`/api/threats/${id}`);
  return response;
};
