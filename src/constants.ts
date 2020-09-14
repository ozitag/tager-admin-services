import { ConstantMap, FetchStatus, HttpMethod, Nullable } from './common.types';

export const ACCESS_TOKEN_FIELD = 'admin_access_token';
export const REFRESH_TOKEN_FIELD = 'admin_refresh_token';

export const HTTP_METHODS: ConstantMap<HttpMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};
export const FETCH_STATUSES: ConstantMap<FetchStatus> = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};
export type LoadableData<T, E = string> = {
  data: T;
  status: FetchStatus;
  error: Nullable<E>;
};
