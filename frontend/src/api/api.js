import axios from 'axios';
import { API_URL } from './config';

const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
API.interceptors.request.use(
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

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle authentication errors
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add data validation helper
const validateTransactionData = (data) => {
  if (!data.description || !data.category_id || !data.amount) {
    throw new Error('Missing required fields: description, category_id, and amount are required');
  }

  return {
    description: data.description.trim(),
    amount: parseFloat(data.amount) || 0,
    category_id: parseInt(data.category_id, 10),
    type: data.type || 'expense'
  };
};

// API endpoints
export const auth = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout')
};

export const transactions = {
  getAll: () => API.get('/transactions'),
  create: (data) => {
    const validatedData = validateTransactionData(data);
    return API.post('/transactions', validatedData);
  },
  update: (id, data) => {
    const validatedData = validateTransactionData(data);
    return API.put(`/transactions/${id}`, validatedData);
  },
  delete: (id) => API.delete(`/transactions/${id}`)
};

export default API;
