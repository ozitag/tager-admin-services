import { App, InjectionKey } from "vue";
import i18next, { TFunction } from "i18next";

export interface I18nContext {
  t: TFunction;
}

export const i18nInjectionKey: InjectionKey<I18nContext> = Symbol("i18n");

export function i18nPlugin(app: App) {
  if (!i18next.isInitialized) {
    throw new Error(
      "You're trying to use i18nPlugin, but `i18next` has not initialized yet"
    );
  } else {
    const translate = i18next.t.bind(i18next);
    app.provide(i18nInjectionKey, { t: translate });
    /**
     * Reference: {@link https://v3.vuejs.org/api/application-config.html#globalproperties}
     */
    app.config.globalProperties.$t = translate;
  }
}
