import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Erro inesperado ao comunicar com a API.';

    return Promise.reject({
      ...error,
      friendlyMessage: message,
      errors: error.response?.data?.errors ?? [],
      status: error.response?.status,
    });
  },
);

export default api;
