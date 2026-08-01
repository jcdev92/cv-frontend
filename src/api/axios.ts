import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Tu API de backend (Docker)
});

// Interceptor para inyectar el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
