import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, logout } = useAuthStore.getState();

      if (refreshToken) {
        try {
          // TODO: Implement token refresh endpoint when available
          // const response = await axios.post(`${API_BASE_URL}/authentication/refresh`, {
          //   refreshToken,
          // });
          // const { accessToken, expiresAt } = response.data;
          // useAuthStore.getState().setAuth(accessToken, refreshToken, userId, expiresAt);
          // return apiClient(originalRequest);

          // For now, just logout on 401
          logout();
          window.location.href = '/loading';
        } catch (refreshError) {
          logout();
          window.location.href = '/loading';
          return Promise.reject(refreshError);
        }
      } else {
        logout();
        window.location.href = '/loading';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
