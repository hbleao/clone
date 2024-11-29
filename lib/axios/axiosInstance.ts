import axios from 'axios';

const createAxiosInstance = () => {
	return axios.create({
		validateStatus: (status) => status >= 200 && status <= 404,
	});
};

export const api = createAxiosInstance();
api.defaults.headers['X-Content-Type-Options'] = 'nosniff';
api.defaults.headers['Strict-Transport-Security'] = 'max-age=15724800';

export const authorizedApi = createAxiosInstance();
