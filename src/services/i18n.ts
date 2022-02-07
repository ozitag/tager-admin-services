import { App, InjectionKey, reactive } from "vue";
import i18next, { InitOptions, TFunction } from "i18next";

import configService from "./configuration.js";

type I18nextResourceBundleArgs = Parameters<typeof i18next.addResourceBundle>;

const resourceBundleArgs: Array<I18nextResourceBundleArgs> = [];

function addTranslations(...args: I18nextResourceBundleArgs) {
  if (i18next.isInitialized) {
    i18next.addResourceBundle(...args);
  } else {
    resourceBundleArgs.push(args);
  }
}

export interface I18nContext {
  t: TFunction;
  language: string;
  changeLanguage(language: string): Promise<TFunction>;
}

const i18nContext = reactive<I18nContext>({
  t: (key: string) => key,
  language: "unknown",
  changeLanguage(lang: string) {
    return i18next.changeLanguage(lang);
  },
});

function updateI18nContext() {
  function translate(...args: Parameters<TFunction>) {
    return i18next.t(...args);
  }

  i18nContext.t = translate;
  i18nContext.language = i18next.language;
}

function initI18n(params?: InitOptions) {
  const lang = configService.getConfig().LANGUAGE ?? "en";

  i18next.on("added", updateI18nContext);
  i18next.on("removed", updateI18nContext);
  i18next.on("languageChanged", updateI18nContext);
  i18next.on("loaded", updateI18nContext);
  i18next.on("initialized", () => {
    if (resourceBundleArgs.length > 0) {
      resourceBundleArgs.forEach((args) => {
        i18next.addResourceBundle(...args);
      });
    }

    updateI18nContext();
  });

  return i18next.init({
    lng: lang.toLowerCase(),
    defaultNS: "main",
    ...params,
  });
}

export const i18nInjectionKey: InjectionKey<I18nContext> = Symbol("i18n");

export function i18nPlugin(app: App) {
  app.provide(i18nInjectionKey, i18nContext);
  app.config.globalProperties.$i18n = i18nContext;
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $i18n: I18nContext;
  }
}

export const i18n = Object.freeze({
  init: initI18n,
  addTranslations,
  changeLanguage(lang: string) {
    return i18next.changeLanguage(lang);
  },
});
