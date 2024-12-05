import { AxiosRequestConfig } from 'axios';
import { AuthorizationService } from '@/services/authorizationService';
import { authorizedApi } from './axiosInstance';

const addAuthToken = async (config: AxiosRequestConfig): Promise<void> => {
  try {
    const { access_token } = await AuthorizationService();
    if (access_token && config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  } catch (error) {
    console.error('Error adding auth token:', error);
    throw error;
  }
};

authorizedApi.interceptors.request.use(
  async (config) => {
    try {
      await addAuthToken(config);
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Request interceptor rejection:', error);
    return Promise.reject(error);
  }
);

authorizedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response interceptor error:', error);
    return Promise.reject(error);
  }
);

export { authorizedApi };
