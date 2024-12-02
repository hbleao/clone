import { getAuthorizationHandler, getCategoryHandler } from './handler';

export const handlers = [...getCategoryHandler, ...getAuthorizationHandler];
