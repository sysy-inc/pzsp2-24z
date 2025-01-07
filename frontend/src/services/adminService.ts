import axios from 'axios';

const API_BASE = '/api/admin';

export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE}/users`);
  return response.data;
};

export const fetchPlatforms = async () => {
  const response = await axios.get(`${API_BASE}/platforms`);
  return response.data;
};

export const addUserAccess = async (email: string, role: string) => {
  const response = await axios.post(`${API_BASE}/users/access`, { email, role });
  return response.data;
};

export const integratePlatform = async (name: string, apiKey: string) => {
  const response = await axios.post(`${API_BASE}/platforms/integrate`, { name, apiKey });
  return response.data;
};
