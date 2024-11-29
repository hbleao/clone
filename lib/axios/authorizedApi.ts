import { AuthorizationService } from '@/services/authorizationService';
import { authorizedApi } from './axiosInstance';
import { AxiosRequestConfig, AxiosError } from 'axios';

const addAuthToken = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    try {
        const { access_token } = await AuthorizationService();
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
    } catch (error) {
        console.error('Failed to retrieve access token:', error);
        // Aqui você pode decidir como lidar com o erro, como redirecionar o usuário ou lançar um erro.
    }
    return config;
};

// Interceptor de requisição
authorizedApi.interceptors.request.use(
    async (config) => {
        await addAuthToken(config);
        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    },
);

// Interceptor de resposta
authorizedApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    },
);

export { authorizedApi };