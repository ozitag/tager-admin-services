import { inject } from "vue";
import { i18nInjectionKey } from "../services/i18n.js";

export function useI18n() {
  const i18nContext = inject(i18nInjectionKey);

  if (i18nContext === undefined) {
    throw new Error("i18nPlugin is not used!");
  }

  return i18nContext;
}
