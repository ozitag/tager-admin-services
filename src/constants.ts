import { ConstantMap, HttpMethod } from './common.types';

export const ACCESS_TOKEN_FIELD = 'accessToken';
export const REFRESH_TOKEN_FIELD = 'refreshToken';
export const HTTP_METHODS: ConstantMap<HttpMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};
