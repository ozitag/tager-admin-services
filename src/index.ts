import { HTTP_METHODS } from './constants';
import { bindHttpMethod } from './request';

export { default as RequestError } from './RequestError';
export { default as configStore } from './configuration';
export { default as upload } from './upload';
export * from './common.types';
export * from './constants';
export * from './utils';

export const request = {
  get: bindHttpMethod(HTTP_METHODS.GET),
  post: bindHttpMethod(HTTP_METHODS.POST),
  put: bindHttpMethod(HTTP_METHODS.PUT),
  delete: bindHttpMethod(HTTP_METHODS.DELETE),
  patch: bindHttpMethod(HTTP_METHODS.PATCH),
};
