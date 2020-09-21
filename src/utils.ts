import { nanoid } from 'nanoid';

import { Nullable, QueryParams, ResponseBody } from './common.types';
import { ACCESS_TOKEN_FIELD, REFRESH_TOKEN_FIELD } from './constants';
import RequestError from './RequestError';
import { isValidationErrorsBody } from './typeGuards';

export function getApiUrl(): string {
  return process.env.VUE_APP_API_URL ?? '';
}

export function getAccessToken(): Nullable<string> {
  const predefinedAccessToken = process.env.VUE_APP_ACCESS_TOKEN ?? '';

  const shouldUsePredefinedAccessToken =
    predefinedAccessToken.length > 0 && process.env.VUE_APP_ENV === 'local';

  if (shouldUsePredefinedAccessToken) {
    console.warn(
      'API service uses predefined access token from env "VUE_APP_ACCESS_TOKEN".'
    );
  }
  return shouldUsePredefinedAccessToken
    ? predefinedAccessToken
    : localStorage.getItem(ACCESS_TOKEN_FIELD);
}

export function setAccessToken(token: string): void {
  return localStorage.setItem(ACCESS_TOKEN_FIELD, token);
}

export function removeAccessToken(): void {
  return localStorage.removeItem(ACCESS_TOKEN_FIELD);
}

export function removeRefreshToken(): void {
  return localStorage.removeItem(REFRESH_TOKEN_FIELD);
}

export function getSearchString(queryParams?: QueryParams): string {
  if (!queryParams || Object.keys(queryParams).length === 0) return '';

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) =>
    searchParams.append(key, value)
  );

  return `?${searchParams.toString()}`;
}

export function convertRequestErrorToMap(error: Error): Record<string, string> {
  if (error instanceof RequestError && isValidationErrorsBody(error.body)) {
    const errorBody = error.body;

    return Object.keys(errorBody.errors).reduce<Record<string, string>>(
      (result, key) => {
        const validationError = errorBody.errors[key];

        result[key] = validationError.message;
        return result;
      },
      {}
    );
  }

  return {};
}

export function getMessageByStatusCode(error: RequestError): string {
  switch (error.status) {
    case 401:
      return 'User is not authorized';
    case 403:
      return 'Forbidden';
    case 404:
      return `Server endpoint "${error.url}" is not found`;
    case 500:
      return 'Server error';
    case 502:
      return 'Server is not available';

    default:
      return error.statusText ?? 'Request error';
  }
}

export function getMessageFromRequestError(error: RequestError): string {
  const simpleMessage = getMessageByStatusCode(error);

  if (error.body && typeof error.body === 'object') {
    const responseBody = error.body as ResponseBody;

    return responseBody.message || responseBody.exception || simpleMessage;
  }

  return simpleMessage;
}

export function getMessageFromError(error: unknown): string {
  if (error instanceof RequestError) {
    return getMessageFromRequestError(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

export function convertStringToNumberIfValid(value: string): number | string {
  const parsedNumber = Number(value.trim());

  return Number.isNaN(parsedNumber) ? value : parsedNumber;
}

export function trimTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function isAbsoluteUrl(url: string): boolean {
  return ['https:', 'http:'].some((protocol) => url.startsWith(protocol));
}

export function getAuthPageUrl(): string {
  const baseUrl =
    process.env.VUE_APP_PUBLIC_PATH === '/'
      ? ''
      : process.env.VUE_APP_PUBLIC_PATH;
  return baseUrl + '/auth';
}

export function removeAuthTokensAndRedirectToAuthPage(): void {
  removeAccessToken();
  removeRefreshToken();

  window.location.href = getAuthPageUrl();
}

export function generateNumberArray(length: number): Array<number> {
  return Array.from({ length }, (_, index) => index);
}

export function isNotNullish<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const notEmpty = isNotNullish;

export function isNotFalsy<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return Boolean(value);
}

export function createId(): string {
  return nanoid();
}
