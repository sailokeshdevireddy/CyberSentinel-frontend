import apiClient from '../utils/apiClient';

export const getAuditLogs = async () => {
  const response = await apiClient.get('/api/audit-logs');
  return response;
};
