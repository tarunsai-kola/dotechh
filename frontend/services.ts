
import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for development
// If VITE_API_URL is set (production), append /api to the backend URL
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and not already retried
    // Note: Backend might return 401 for invalid token, and 403 for other issues. 
    // We'll check for 401 here as usually that means token expired.
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token (Cookie based)
        await api.post('/auth/refresh-token');

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear user and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  // We still store user info (name, role) in localStorage, but NOT the token
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const register = async (email, password, role) => {
  const { data } = await api.post('/auth/signup', { email, password, role });
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const registerCompany = async (email, password, companyName, phone) => {
  const { data } = await api.post('/auth/register-company', { email, password, companyName, phone });
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error("Logout error", error);
  } finally {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const fetchMyProfile = async () => {
  const { data } = await api.get('/profile/me');
  return data;
};

export const getCompanyProfile = async (companyId: string) => {
  const { data } = await api.get(`/companies/${companyId}`);
  return data;
};

export const updateCompanyProfile = async (companyId: string, companyData: any) => {
  const { data } = await api.put(`/companies/${companyId}`, companyData);
  return data;
};

export const uploadCompanyLogo = async (companyId: string, formData: FormData) => {
  const { data } = await api.post(`/companies/${companyId}/logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const fetchJobs = async (filters = {}) => {
  const { data } = await api.get('/jobs', { params: filters });
  return data;
};

export const createJob = async (jobData) => {
  const { data } = await api.post(`/companies/${jobData.companyId}/jobs`, jobData);
  return data;
};

export const updateJob = async (companyId: string, jobId: string, jobData: any) => {
  const { data } = await api.put(`/companies/${companyId}/jobs/${jobId}`, jobData);
  return data;
};

export const deleteJob = async (companyId: string, jobId: string) => {
  const { data } = await api.delete(`/companies/${companyId}/jobs/${jobId}`);
  return data;
};

export const getJobDetails = async (jobId: string) => {
  const { data } = await api.get(`/jobs/${jobId}`);
  return data;
};

export const getApplicationStats = async (companyId: string) => {
  const { data } = await api.get(`/companies/${companyId}/stats/applications`);
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.post('/profile', profileData);
  return data;
};

// Experience API
export const fetchExperience = async () => {
  const { data } = await api.get('/profile/experience');
  return data;
};

export const addExperience = async (experienceData) => {
  const { data } = await api.post('/profile/experience', experienceData);
  return data;
};

export const updateExperience = async (id, experienceData) => {
  const { data } = await api.post('/profile/experience', experienceData);
  return data;
};

export const deleteExperience = async (id) => {
  const { data } = await api.delete(`/profile/experience/${id}`);
  return data;
};

// Education API
export const fetchEducation = async () => {
  const { data } = await api.get('/profile/education');
  return data;
};

export const addEducation = async (educationData) => {
  const { data } = await api.post('/profile/education', educationData);
  return data;
};

export const deleteEducation = async (id) => {
  const { data } = await api.delete(`/profile/education/${id}`);
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

export const fetchSkillsSuggestions = async (query: string) => {
  const { data } = await api.get(`/skills/suggestions?q=${query}`);
  return data;
};

export const addSkillToProfile = async (name: string) => {
  const { data } = await api.post('/skills/profile/add', { name });
  return data;
};

export const removeSkillFromProfile = async (slug: string) => {
  const { data } = await api.delete(`/skills/profile/${slug}`);
  return data;
};

export const uploadAvatar = async (formData: FormData) => {
  const { data } = await api.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const getOnboardingStep = async () => {
  const { data } = await api.get('/profile/onboarding-step');
  return data;
};

export const updateOnboardingStep = async (step: number) => {
  const { data } = await api.put('/profile/onboarding-step', { step });
  return data;
};

export const getTrendingSkills = async (limit = 10, period = '30d') => {
  const { data } = await api.get(`/analytics/trending-skills?limit=${limit}&period=${period}`);
  return data;
};

export default api;
