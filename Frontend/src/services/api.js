import axios from 'axios';

// ─── BASE CONFIG ─────────────────────────────────────────────
// Change this to your Spring Boot server URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally (expired token → redirect to login)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ─────────────────────────────────────────────────────
// POST /api/auth/signup   Body: { name, email, password }
// POST /api/auth/login    Body: { email, password }  → { token, user }
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/users/me'),
};

// ─── PROJECTS ─────────────────────────────────────────────────
// GET    /api/projects            → list user's projects
// POST   /api/projects            Body: { name, description }
// GET    /api/projects/:id        → single project
// PUT    /api/projects/:id        Body: { name, description }
// DELETE /api/projects/:id
// POST   /api/projects/:id/members  Body: { userId }
// DELETE /api/projects/:id/members/:userId
export const projectsAPI = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  get: (id) => api.get(`/projects/${id}`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, userId) => {
    console.log('📤 API: Adding member to project', id, 'userId:', userId);
    return api.post(`/projects/${id}/members`, { userId: parseInt(userId), role: 'MEMBER' });
  },
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
  getMembers: (id) => api.get(`/projects/${id}/members`),
};

// ─── TASKS ────────────────────────────────────────────────────
// GET    /api/projects/:projectId/tasks
// POST   /api/projects/:projectId/tasks  Body: { title, description, dueDate, priority, assigneeId }
// GET    /api/tasks/:id
// PUT    /api/tasks/:id   Body: { title, description, dueDate, priority, status, assigneeId }
// DELETE /api/tasks/:id
// PATCH  /api/tasks/:id/status  Body: { status }  ("TODO"|"IN_PROGRESS"|"DONE")
export const tasksAPI = {
  list: (projectId) => api.get(`/projects/${projectId}/tasks`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  get: (projectId, id) => api.get(`/projects/${projectId}/tasks/${id}`),
  update: (projectId, id, data) => api.put(`/projects/${projectId}/tasks/${id}`, data),
  delete: (projectId, id) => api.delete(`/projects/${projectId}/tasks/${id}`),
  updateStatus: (projectId, id, status) => api.patch(`/projects/${projectId}/tasks/${id}/status`, { status }),
  myTasks: () => api.get('/users/me/tasks'),
};

// ─── DASHBOARD ────────────────────────────────────────────────
// GET /api/dashboard  → { totalTasks, byStatus: {TODO,IN_PROGRESS,DONE}, byUser: [...], overdue: [...] }
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

// ─── USERS ────────────────────────────────────────────────────
// GET /api/users  → list all users (admin)
export const usersAPI = {
  list: () => api.get('/users'),
  get: (id) => api.get(`/users/${id}`),
};

export default api;
