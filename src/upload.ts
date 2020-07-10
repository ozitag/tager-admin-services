import RequestError from './RequestError';
import { getAccessToken, getApiOrigin, getSearchString } from './utils';
import { ParsedResponseBody, QueryParams } from './common.types';

function parseResponse(response: string): ParsedResponseBody {
  try {
    return JSON.parse(response);
  } catch (error) {
    return response;
  }
}

function upload<T>({
  file,
  params,
  onProgress,
  xhr,
}: {
  file: File;
  params?: QueryParams;
  onProgress?: (progressData: {
    event: ProgressEvent;
    loaded: number;
    total: number;
    progress: number;
  }) => void;
  xhr?: XMLHttpRequest;
}): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = xhr ?? new XMLHttpRequest();

    const url = [
      getApiOrigin(),
      '/api/admin/upload',
      getSearchString(params),
    ].join('');

    request.upload.addEventListener('progress', (event) => {
      if (onProgress) {
        onProgress({
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
    formData.append('file', file);

    request.open('POST', url);

    const accessToken = getAccessToken();
    if (accessToken) {
      request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    request.setRequestHeader('Accept', 'application/json');

    request.send(formData);
  });
}

export default upload;
