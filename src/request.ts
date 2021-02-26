import RequestError from './RequestError';
import {
  BodyParam,
  HttpMethod,
  HttpRequestFunction,
  ParsedResponseBody,
  QueryParams,
  RequestOptions,
} from './common.types';
import {
  getAccessToken,
  getApiUrl,
  getSearchString,
  removeAuthTokensAndRedirectToAuthPage,
} from './utils';
import configService from './configuration';

function configureHeaders(body?: BodyParam): Headers {
  const headers = new Headers();

  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const language: string = configService.getConfig().LANGUAGE ?? 'en';
  headers.set('Accept-Language', language);

  headers.set('Accept', 'application/json');

  return headers;
}

function configureBody(body?: BodyParam): BodyInit | null {
  if (!body) return null;

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

function getRequestUrl(path = '', params?: QueryParams): string {
  const searchParams = getSearchString(params);
  return [getApiUrl(), path, searchParams].filter(Boolean).join('');
}

function configureOptions({
  method,
  body,
  fetchOptions,
}: {
  method: HttpMethod;
  body?: BodyParam;
  fetchOptions?: RequestInit;
}): RequestInit {
  return {
    headers: configureHeaders(body),
    method,
    mode: 'cors',
    body: configureBody(body),
    ...fetchOptions,
  };
}

function parseResponseBody(response: Response): Promise<ParsedResponseBody> {
  const contentType = response.headers.get('content-type');
  const isJson = Boolean(contentType?.startsWith('application/json'));
  return isJson ? response.json() : response.text();
}

function handleErrors(response: Response): Promise<ParsedResponseBody> {
  const errorParams = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
  };

  if (response.status === 401 && process.env.VUE_APP_ENV !== 'local') {
    removeAuthTokensAndRedirectToAuthPage();
  }

  return parseResponseBody(response).then(
    (parsedResponseBody) => {
      if (response.ok) {
        return parsedResponseBody;
      }

      return Promise.reject(
        new RequestError({ ...errorParams, body: parsedResponseBody })
      );
    },
    () =>
      response.text().then((responseBodyText) => {
        return Promise.reject(
          new RequestError({ ...errorParams, body: responseBodyText })
        );
      })
  );
}

function logRequest(res: Response, options: RequestInit): Response {
  const formattedLog = `${options.method} ${res.status} ${res.url}`;
  console.log(`%c ${formattedLog}`, 'color: green');
  return res;
}

async function makeRequest(
  method: HttpMethod,
  { path, body, params, absoluteUrl, fetchOptions }: RequestOptions
): Promise<any> {
  const url = absoluteUrl || getRequestUrl(path, params);
  const options = configureOptions({ method, body, fetchOptions });

  return fetch(url, options)
    .then((response) => logRequest(response, options))
    .then(handleErrors);
}

export function bindHttpMethod(method: HttpMethod): HttpRequestFunction {
  return makeRequest.bind(null, method);
}
