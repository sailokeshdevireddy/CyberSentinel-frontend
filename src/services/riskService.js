import apiClient from '../utils/apiClient';

export const getRiskAssessment = async (subjectType, subjectId) => {
  try {
    const response = await apiClient.get(`/api/risk-assessments/${subjectType}/${subjectId}`);
    return response;
  } catch (error) {
    // If it's a 404, we just return null data to match previous behavior
    if (error.code === 'NOT_FOUND') {
      return { success: true, data: null };
    }
    throw error;
  }
};