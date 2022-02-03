import i18next, { InitOptions, TFunction } from "i18next";

import configService from "../configuration.js";

type I18nextResourceBundleArgs = Parameters<typeof i18next.addResourceBundle>;

const resourceBundleArgs: Array<I18nextResourceBundleArgs> = [];

function addTranslations(...args: I18nextResourceBundleArgs) {
  if (i18next.isInitialized) {
    i18next.addResourceBundle(...args);
  } else {
    resourceBundleArgs.push(args);
  }
}

function initI18n(params?: InitOptions): Promise<TFunction> {
  const lang = configService.getConfig().LANGUAGE ?? "en";

  return i18next
    .init({
      lng: lang.toLowerCase(),
      defaultNS: "main",
      ...params,
    })
    .then(() => {
      if (resourceBundleArgs.length > 0) {
        resourceBundleArgs.forEach((args) => {
          i18next.addResourceBundle(...args);
        });
      }

      return i18next.t;
    });
}

export const i18n = Object.freeze({
  init: initI18n,
  addTranslations,
});
