let isInitialized = false;

export interface AppEnvironment {
  publicPath: string | undefined;
  appEnv: string | undefined;
  apiUrl: string | undefined;
  accessToken: string | undefined;
  websiteUrl: string | undefined;
  sentryDsn: string | undefined;
  sentryEnv: string | undefined;
  baseUrl: string | undefined;
  nodeEnv: string | undefined;
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
