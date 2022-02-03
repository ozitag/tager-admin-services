let isInitialized = false;

export interface AppEnvironment {
  publicPath: string | undefined;
  appEnv: string | undefined;
  apiUrl: string | undefined;
  accessToken: string | undefined;
  websiteUrl: string | undefined;
  sentryDsn: string | undefined;
  sentryEnv: string | undefined;
}

export let environment = Object.freeze<AppEnvironment>({
  publicPath: undefined,
  appEnv: undefined,
  apiUrl: undefined,
  accessToken: undefined,
  websiteUrl: undefined,
  sentryDsn: undefined,
  sentryEnv: undefined,
});

export function initializeEnvironment(env: AppEnvironment) {
  if (isInitialized) {
    throw new Error("Environment is already initialized");
  }

  environment = Object.freeze({ ...environment, ...env });
  isInitialized = true;
}
