import apiClient from '../utils/apiClient';

export const getNotifications = async () => {
  const response = await apiClient.get('/api/notifications');
  return response;
};

export const markAsRead = async (id) => {
  const response = await apiClient.patch(`/api/notifications/${id}/read`);
  return response;
};

export const markAllAsRead = async () => {
  const response = await getNotifications();
  if (response.success && response.data) {
    const unread = response.data.filter(n => !n.read);
    // Promise.all to mark each as read concurrently
    await Promise.allSettled(unread.map(n => markAsRead(n.id)));
  }
  return { success: true };
};