import axios from 'axios';

const API_BASE = '/api/auth';

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/login`, { email, password });
  return response.data;
};

export const signUp = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/signup`, { email, password });
  return response.data;
};
