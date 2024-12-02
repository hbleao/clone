import { http, HttpResponse } from 'msw';

import { mockAuthorizationService, mockCategoryService } from '../mocks';

const endpoint = '/undefined/hub-vendas-carbon/prestacao-servico/v1/produtos';

export const getCategoryHandler = [
	http.post(endpoint, () => {
		return HttpResponse.json(mockCategoryService);
	}),
];

const endpointAuth = '/undefined/oauth/v2/access-token';

export const getAuthorizationHandler = [
	http.post(endpointAuth, () => {
		return HttpResponse.json(mockAuthorizationService);
	}),
];
