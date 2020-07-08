import { PluginFunction } from 'vue';
import i18next from 'i18next';

import configService from './configuration';

type I18nextResourceBundleArgs = Parameters<typeof i18next.addResourceBundle>;

const resourceBundleArgs: Array<I18nextResourceBundleArgs> = [];

export function addTranslations(...args: I18nextResourceBundleArgs) {
  if (i18next.isInitialized) {
    i18next.addResourceBundle(...args);
  } else {
    resourceBundleArgs.push(args);
  }
}

export const TranslationPlugin: PluginFunction<any> = (VueConstructor) => {
  const lang = configService.getConfig().LANGUAGE ?? 'en';

  i18next.init(
    {
      lng: lang.toLowerCase(),
      defaultNS: 'main',
    },
    (error, t) => {
      if (error) {
        console.error('TranslationPlugin Error: ', error);
      } else {
        if (resourceBundleArgs.length > 0) {
          resourceBundleArgs.forEach((args) => {
            i18next.addResourceBundle(...args);
          });
        }

        VueConstructor.prototype.$t = t;
        VueConstructor.$t = t;
      }
    }
  );
};
