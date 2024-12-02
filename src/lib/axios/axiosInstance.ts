import axios from 'axios';

const createAxiosInstance = () => {
    return axios.create({
        validateStatus: (status) => status >= 200 && status <= 404,
        headers: {
            'X-Content-Type-Options': 'nosniff',
            'Strict-Transport-Security': 'max-age=15724800',
        },
    });
};

export const api = createAxiosInstance();

export const authorizedApi = createAxiosInstance();