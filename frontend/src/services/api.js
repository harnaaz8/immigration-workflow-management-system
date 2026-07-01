import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, // Required to send cookies (auth)
});

export const superadminAPI = {
  // Franchises
  getFranchises: () => api.get('/superadmin/franchises'),

  // Institutes
  getInstitutes: () => api.get('/superadmin/institutes'),

  // Expenses
  getExpenses: () => api.get('/superadmin/expenses'),

  // Notifications - Matches backend
  getNotifications: () => api.get('/superadmin/notifications'),
  createNotification: (data) => api.post('/superadmin/notifications', data),
  deleteNotification: (id) => api.delete(`/superadmin/notifications/${id}`),

  // Tasks - Fixed paths to match prefix
  getTasks: () => api.get('/superadmin/tasks'),
  createTask: (data) => api.post('/superadmin/tasks', data),
  updateTaskStatus: (id, status) => api.patch(`/superadmin/tasks/${id}/status?status=${status}`),
  deleteTask: (id) => api.delete(`/superadmin/tasks/${id}`),

  // Users
  getAllUsers: () => api.get('/users'),
};

export default api;