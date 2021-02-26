import RequestError from './RequestError';
import { getAccessToken, getApiUrl, getSearchString } from './utils';
import { ParsedResponseBody, QueryParams } from './common.types';
import configService from './configuration';

function parseResponse(response: string): ParsedResponseBody {
  try {
    return JSON.parse(response);
  } catch (error) {
    return response;
  }
}

function upload<T>(options: {
  file: File;
  params?: QueryParams;
  onProgress?: (progressData: {
    event: ProgressEvent;
    loaded: number;
    total: number;
    progress: number;
  }) => void;
  xhr?: XMLHttpRequest;
  path?: string;
}): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = options.xhr ?? new XMLHttpRequest();

    const url = [
      getApiUrl(),
      options.path ?? '/admin/upload',
      getSearchString(options.params),
    ].join('');

    request.upload.addEventListener('progress', (event) => {
      if (options.onProgress) {
        options.onProgress({
          event,
          loaded: event.loaded,
          total: event.total,
          progress: event.loaded / event.total,
        });
      }
    });

    request.addEventListener('loadend', () => {
      const isOk = request.status >= 200 && request.status < 300;

      if (isOk) {
        try {
          const responseBody = JSON.parse(request.response);
          resolve(responseBody);
        } catch (error) {
          resolve(request.response);
        }
      } else {
        reject(
          new RequestError({
            status: request.status,
            statusText: request.statusText,
            url: url,
            body: parseResponse(request.response),
          })
        );
      }
    });

    const formData = new FormData();
    formData.append('file', options.file);

    request.open('POST', url);

    const accessToken = getAccessToken();
    if (accessToken) {
      request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    const language: string = configService.getConfig().LANGUAGE ?? 'en';
    request.setRequestHeader('Accept-Language', language);


    request.setRequestHeader('Accept', 'application/json');

    request.send(formData);
  });
}

export default upload;
