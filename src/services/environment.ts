let isInitialized = false;

export interface AppEnvironment {
  // VUE_APP_PUBLIC_PATH
  publicPath: string | undefined;
  // VUE_APP_ENV
  appEnv: string | undefined;
  // VUE_APP_API_URL
  apiUrl: string | undefined;
  // VUE_APP_ACCESS_TOKEN
  accessToken: string | undefined;
  // VUE_APP_WEBSITE_URL
  websiteUrl: string | undefined;
  // VUE_APP_WEBSITE_BUTTON_URL
  websiteButtonUrl: string | undefined;
  // VUE_APP_SENTRY_DSN
  sentryDsn: string | undefined;
  // VUE_APP_SENTRY_ENVIRONMENT
  sentryEnv: string | undefined;
  // BASE_URL
  baseUrl: string | undefined;
  // NODE_ENV
  nodeEnv: string | undefined;
  // VUE_APP_VERSION
  version: string | undefined;
}

export let environment = Object.freeze<AppEnvironment>({
  baseUrl: undefined,
  nodeEnv: undefined,
  publicPath: undefined,
  appEnv: undefined,
  apiUrl: undefined,
  accessToken: undefined,
  websiteUrl: undefined,
  websiteButtonUrl: undefined,
  sentryDsn: undefined,
  sentryEnv: undefined,
  version: undefined,
});

export function initializeEnvironment(env: Partial<AppEnvironment>) {
  if (isInitialized) {
    throw new Error("Environment is already initialized");
  }

  environment = Object.freeze({ ...environment, ...env });
  isInitialized = true;
}
