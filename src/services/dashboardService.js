import apiClient from '../utils/apiClient';

export const getDashboardData = async () => {
  const response = await apiClient.get('/api/dashboard');
  return response;
};
