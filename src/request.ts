import RequestError from './RequestError';
import {
  BodyParam,
  HttpMethod,
  HttpRequestFunction,
  ParsedResponseBody,
  QueryParams,
  RequestOptions,
} from './common.types';
import { getAccessToken, getApiOrigin, getSearchString } from './utils';

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
  return [getApiOrigin(), '/api/admin', path, searchParams]
    .filter(Boolean)
    .join('');
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

function getResponseContent(response: Response): Promise<ParsedResponseBody> {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.startsWith('application/json')) {
    return response.json().catch((error) => {
      /** Throws a SyntaxError exception if the string to parse is not valid JSON */
      if (error instanceof SyntaxError) {
        return response.text();
      } else {
        console.error(
          `Unknown error while parsing response body: ${error.toString()}`
        );

        return null;
      }
    });
  }

  return response.text();
}

function handleErrors(response: Response): Promise<ParsedResponseBody> {
  return getResponseContent(response).then((content) => {
    if (response.ok) {
      return content;
    }

    return Promise.reject(
      new RequestError(
        {
          code: response.status,
          text: response.statusText,
        },
        content
      )
    );
  });
}

function logRequest(res: Response, options: RequestInit): Response {
  const formattedLog = `${options.method} ${res.status} ${res.url}`;
  console.log(`%c ${formattedLog}`, 'color: green');
  return res;
}

async function makeRequest(
  method: HttpMethod,
  { path, body, params, absoluteUrl, fetchOptions }: RequestOptions
): Promise<ParsedResponseBody> {
  const url = absoluteUrl || getRequestUrl(path, params);
  const options = configureOptions({ method, body, fetchOptions });

  return fetch(url, options)
    .then((response) => logRequest(response, options))
    .then(handleErrors);
}

export function bindHttpMethod(method: HttpMethod): HttpRequestFunction {
  return makeRequest.bind(null, method);
}
