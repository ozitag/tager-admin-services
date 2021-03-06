/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VUE_APP_API_URL: string | undefined;
    readonly VUE_APP_PUBLIC_PATH: string | undefined;
  }
}
