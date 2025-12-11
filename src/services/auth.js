import API from './api';

export const login = async (username, password) => {
  const response = await API.post('/auth/login', { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};