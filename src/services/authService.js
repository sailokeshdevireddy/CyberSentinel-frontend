import apiClient from '../utils/apiClient';

let cachedUser = null;

// Initialize cached user from localStorage if it exists
try {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    cachedUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error("Failed to parse cached user", e);
}

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', { email, password });
    if (response.success && response.data) {
      const { token, user } = response.data;
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', JSON.stringify(user));
      cachedUser = user;
      return { user };
    }
  } catch (err) {
    // The apiClient already shapes errors to { code, message, details }
    throw err;
  }
};

export const logout = async () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  cachedUser = null;
  return Promise.resolve();
};

export const register = async (userData) => {
  try {
    const { confirmPassword, ...validPayload } = userData;
    const response = await apiClient.post('/api/auth/register', validPayload);
    return response;
  } catch (err) {
    throw err;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/auth/me');
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      cachedUser = response.data;
      return response.data;
    }
  } catch (err) {
    // Let caller or interceptor handle 401
    console.error("Failed to fetch current user", err);
    throw err;
  }
};

export const updateCurrentUser = async (data) => {
  try {
    const response = await apiClient.patch('/api/auth/me', data);
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      cachedUser = response.data;
      return response.data;
    }
  } catch (err) {
    throw err;
  }
}

export const checkAuth = () => {
  return !!localStorage.getItem('jwt');
};

export const getUser = () => {
  // Try to return the cached user first
  if (cachedUser) return cachedUser;
  
  // Fallback to localStorage parsing in case cachedUser was lost
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};
