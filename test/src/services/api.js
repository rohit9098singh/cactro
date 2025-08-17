import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Video API calls
export const videoAPI = {
  getVideo: (videoId) => api.get(`/videos/${videoId}`),
  updateVideo: (videoId, data) => api.put(`/videos/${videoId}`, data),
  getComments: (videoId) => api.get(`/videos/${videoId}/comments`),
  addComment: (videoId, text) => api.post(`/videos/${videoId}/comments`, { text }),
  replyToComment: (videoId, commentId, text) => 
    api.post(`/videos/${videoId}/comments/${commentId}/reply`, { text }),
  deleteComment: (videoId, commentId) => 
    api.delete(`/videos/${videoId}/comments/${commentId}`),
};

// Notes API calls
export const notesAPI = {
  getNotes: (videoId) => api.get(`/notes/video/${videoId}`),
  createNote: (data) => api.post('/notes', data),
  updateNote: (noteId, data) => api.put(`/notes/${noteId}`, data),
  deleteNote: (noteId) => api.delete(`/notes/${noteId}`),
  getNote: (noteId) => api.get(`/notes/${noteId}`),
};

// Event logs API calls
export const eventLogsAPI = {
  getLogs: (params) => api.get('/event-logs', { params }),
  getStats: (params) => api.get('/event-logs/stats', { params }),
  getRecentActivity: (videoId, limit = 10) => 
    api.get(`/event-logs/recent/${videoId}?limit=${limit}`),
};

export default api;
