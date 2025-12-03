
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const register = async (email, password, role) => {
  const { data } = await api.post('/auth/register', { email, password, role });
  localStorage.setItem('user', JSON.stringify(data));
  return data;
};

export const fetchJobs = async (filters = {}) => {
  const { data } = await api.get('/jobs', { params: filters });
  return data;
};

export const createJob = async (jobData) => {
  const { data } = await api.post('/jobs', jobData);
  return data;
};

export const fetchMyProfile = async () => {
  const { data } = await api.get('/profiles/me');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.post('/profiles', profileData);
  return data;
};

export const applyToJob = async (jobId) => {
  const { data } = await api.post(`/applications/${jobId}`);
  return data;
};

export const fetchStudentApplications = async () => {
  const { data } = await api.get('/applications/my-applications');
  return data;
};

export default api;
