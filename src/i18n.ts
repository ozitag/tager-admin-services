import { PluginFunction } from 'vue';
import i18next, { InitOptions, TFunction } from 'i18next';

import configService from './configuration';

type I18nextResourceBundleArgs = Parameters<typeof i18next.addResourceBundle>;

const resourceBundleArgs: Array<I18nextResourceBundleArgs> = [];

const i18n = {
  addTranslations(...args: I18nextResourceBundleArgs) {
    if (i18next.isInitialized) {
      i18next.addResourceBundle(...args);
    } else {
      resourceBundleArgs.push(args);
    }
  },
  init(params: InitOptions): Promise<TFunction> {
    const lang = configService.getConfig().LANGUAGE ?? 'en';

    return i18next
      .init({
        lng: lang.toLowerCase(),
        defaultNS: 'main',
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
  },
  getPlugin(): PluginFunction<any> {
    return (VueConstructor) => {
      if (!i18next.isInitialized) {
        console.error(
          "You're trying to get I18nPlugin, but i18n has not initialized yet"
        );
      } else {
        const translate: TFunction = (...args: Parameters<TFunction>) =>
          i18next.t(...args);

        VueConstructor.prototype.$t = translate;
        VueConstructor.$t = translate;
      }
    };
  },
} as const;

export default i18n;
