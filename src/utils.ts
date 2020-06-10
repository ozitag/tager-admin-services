import { Nullable, QueryParams } from './common.types';
import { ACCESS_TOKEN_FIELD } from './constants';

export function getApiOrigin(): string {
  return process.env.VUE_APP_API_ORIGIN ?? '';
}

export function getAccessToken(): Nullable<string> {
  return localStorage.getItem(ACCESS_TOKEN_FIELD);
}

export function setAccessToken(token: string): void {
  return localStorage.setItem(ACCESS_TOKEN_FIELD, token);
}

export function removeAccessToken(): void {
  return localStorage.removeItem(ACCESS_TOKEN_FIELD);
}

export function getSearchString(queryParams?: QueryParams): string {
  if (!queryParams || Object.keys(queryParams).length === 0) return '';

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) =>
    searchParams.append(key, value)
  );

  return `?${searchParams.toString()}`;
}
