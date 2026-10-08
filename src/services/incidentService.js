import apiClient from '../utils/apiClient';

export const getIncidents = async (filters = {}) => {
  const params = { ...filters };
  
  if (params.severity === 'ALL') delete params.severity;
  if (params.status === 'ALL') delete params.status;
  
  const response = await apiClient.get('/api/incidents', { params });
  return response;
};

export const getIncidentById = async (id) => {
  const response = await apiClient.get(`/api/incidents/${id}`);
  return response;
};

export const updateIncidentStatus = async (id, statusData) => {
  // statusData is { status, resolution }
  const response = await apiClient.patch(`/api/incidents/${id}/status`, statusData);
  return response;
};

export const getIncidentTimeline = async (incidentId) => {
  const response = await apiClient.get(`/api/incidents/${incidentId}/timeline`);
  return response;
};
