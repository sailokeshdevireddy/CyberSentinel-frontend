import apiClient from '../utils/apiClient';

export const getOrganizationById = async (id) => {
  const response = await apiClient.get(`/api/organizations/${id}`);
  return response;
};
