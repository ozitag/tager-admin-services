import { HTTP_METHODS } from "./constants/common";
import { bindHttpMethod } from "./services/request";
import * as z from "zod";

export { default as RequestError } from "./utils/request-error";
export { default as configStore } from "./services/configuration";
export { default as upload } from "./utils/upload";
export * from "./services/i18n/i18n.js";
export * from "./services/i18n/i18n-vue-plugin.js";
export * from "./typings/common";
export * from "./constants/common.js";
export * from "./utils/common";
export * from "./utils/type-guards";
export { z };

export const request = {
  get: bindHttpMethod(HTTP_METHODS.GET),
  post: bindHttpMethod(HTTP_METHODS.POST),
  put: bindHttpMethod(HTTP_METHODS.PUT),
  delete: bindHttpMethod(HTTP_METHODS.DELETE),
  patch: bindHttpMethod(HTTP_METHODS.PATCH),
};

export * from "./hooks/use-resource.js";
export { useResourceDelete } from "./hooks/use-resource-delete.js";
export { useResourceMove } from "./hooks/use-resource-move.js";
export { useResourceClone } from "./hooks/use-resource-clone.js";
export { useTranslation } from "./hooks/use-translation.js";
export { useToast } from "./hooks/use-toast.js";
export { useToastList } from "./hooks/use-toast-list.js";
