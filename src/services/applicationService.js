import apiClient from '../utils/apiClient';

export const getApplications = async (filters = {}) => {
  const response = await apiClient.get('/api/applications');
  let apps = response.data || [];

  if (filters.searchTerm) {
    const search = filters.searchTerm.toLowerCase();
    apps = apps.filter(a => 
      (a.name && a.name.toLowerCase().includes(search)) ||
      (a.description && a.description.toLowerCase().includes(search))
    );
  }
  
  if (filters.status && filters.status !== 'ALL') {
    apps = apps.filter(a => a.status === filters.status);
  }
  
  return { success: true, data: apps };
};

export const getApplicationById = async (id) => {
  const response = await apiClient.get(`/api/applications/${id}`);
  return { success: true, data: response.data };
};

export const createApplication = async (appData) => {
  const response = await apiClient.post('/api/applications', appData);
  // Backend returns CreateApplicationResponse which has { application, apiSecret }
  // We need to return this so the component can show the secret
  return { success: true, data: response.data };
};
