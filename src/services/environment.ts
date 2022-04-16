let isInitialized = false;

export interface AppEnvironment {
  // VUE_APP_PUBLIC_PATH
  publicPath: string;
  // VUE_APP_ENV
  appEnv: string;
  // VUE_APP_API_URL
  apiUrl: string;
  // VUE_APP_ACCESS_TOKEN
  accessToken: string;
  // VUE_APP_WEBSITE_URL
  websiteUrl: string;
  // VUE_APP_WEBSITE_BUTTON_URL
  websiteButtonUrl: string;
  // VUE_APP_SENTRY_DSN
  sentryDsn: string;
  // VUE_APP_SENTRY_ENVIRONMENT
  sentryEnv: string;
  // BASE_URL
  baseUrl: string;
  // NODE_ENV
  nodeEnv: string;
  // VUE_APP_VERSION
  version: string;
}

const INITIAL_ENVIRONMENT: AppEnvironment = {
  baseUrl: "",
  nodeEnv: "",
  publicPath: "",
  appEnv: "",
  apiUrl: "",
  accessToken: "",
  websiteUrl: "",
  websiteButtonUrl: "",
  sentryDsn: "",
  sentryEnv: "",
  version: "",
};

export let environment = Object.freeze<AppEnvironment>({
  ...INITIAL_ENVIRONMENT,
});

export function initializeEnvironment(env: Partial<AppEnvironment>) {
  if (isInitialized) {
    throw new Error("Environment is already initialized");
  }

  const newEnvironment = { ...environment, ...env };

  const envProps = Object.keys(INITIAL_ENVIRONMENT) as Array<
    keyof AppEnvironment
  >;

  for (const envProp of envProps) {
    if (newEnvironment[envProp] === undefined) {
      newEnvironment[envProp] = INITIAL_ENVIRONMENT[envProp];
    }
  }

  environment = Object.freeze(newEnvironment);
  isInitialized = true;
}
