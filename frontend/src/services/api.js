import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  googleLogin: async (idToken) => {
    const response = await api.post('/auth/google-login', { idToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Resume Service
export const resumeService = {
  uploadResume: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },
  getUserResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  getResumeById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },
  deleteResume: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
  updateResume: async (id, updatedData) => {
    const response = await api.put(`/resumes/${id}`, updatedData);
    return response.data;
  },
  matchJob: async (resumeId, jobDescription) => {
    const response = await api.post('/resumes/match-job', { resumeId, jobDescription });
    return response.data;
  },
  generateCoverLetter: async (resumeId, jobTitle, companyName, jobDescription) => {
    const response = await api.post('/resumes/cover-letter', { resumeId, jobTitle, companyName, jobDescription });
    return response.data;
  },
  generateInterviewQuestions: async (resumeId, jobTitle) => {
    const response = await api.post('/resumes/interview-questions', { resumeId, jobTitle });
    return response.data;
  },
  fixSection: async (resumeId, sectionName, itemIndex, instruction) => {
    const response = await api.post(`/resumes/${resumeId}/fix`, { sectionName, itemIndex, instruction });
    return response.data;
  },
  agentChat: async (resumeId, message, chatHistory) => {
    const response = await api.post(`/resumes/${resumeId}/chat`, { message, chatHistory });
    return response.data;
  },
  reanalyzeResume: async (resumeId) => {
    const response = await api.post(`/resumes/${resumeId}/reanalyze`);
    return response.data;
  }
};

export default api;
