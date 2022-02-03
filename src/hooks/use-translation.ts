import { inject } from "vue";
import { i18nInjectionKey } from "../services/i18n/i18n-vue-plugin.js";

export function useTranslation() {
  const i18nContext = inject(i18nInjectionKey);

  if (i18nContext === undefined) {
    throw new Error("Translate function is not defined");
  }

  return i18nContext;
}
