import { ImageType, Nullable, Nullish, QueryParams, ResponseBody, ValidationError } from './common.types';
import { ACCESS_TOKEN_FIELD } from './constants';
import RequestError from './RequestError';

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

export function isValidationError(value: any): value is ValidationError {
  return (
    typeof value === 'object' &&
    typeof value.code === 'string' &&
    typeof value.message === 'string'
  );
}

export function convertRequestErrorToMap(error: Error): Record<string, string> {
  if (error instanceof RequestError) {
    const responseBody = error.body as ResponseBody;

    if (responseBody.errors) {
      return Object.keys(responseBody.errors).reduce<Record<string, string>>(
        (result, key) => {
          if (responseBody.errors) {
            result[key] = responseBody.errors[key].message;
          }
          return result;
        },
        {}
      );
    }
  }

  return {};
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
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

export function getImageUrl(image: Nullish<ImageType>): Nullable<string> {
  return image ? image.url : null;
}

