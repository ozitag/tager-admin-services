export type ConstantMap<C extends string> = Readonly<Record<C, C>>;
export type Nullable<T> = T | null;
export type Nullish<T> = T | null | undefined;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type FetchStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'FAILURE';

export type QueryParams = { [key: string]: any };
export type BodyParam = { [key: string]: any } | BodyInit;

export type JsonParseResult =
  | { [key: string]: any }
  | Array<any>
  | number
  | boolean
  | null;

export type ParsedResponseBody = JsonParseResult | string | null;

export type RequestOptions = {
  path?: string;
  body?: BodyParam;
  params?: QueryParams;
  absoluteUrl?: string;
  fetchOptions?: RequestInit;
};

export type HttpRequestFunction = <T = ParsedResponseBody>(
  options: RequestOptions
) => Promise<T>;

export type ValidationError = { code: string; message: string };

export type ResponseBody<Data = any> = {
  data: Data;
  errors?: Record<string, ValidationError>;
  message?: string;
};

export type LogoConfig = {
  logo: Nullish<string>;
  label: Nullish<string>;
  'label-color': Nullish<string>;
};

export type AppConfigType = {
  APP_NAME: string;
  TITLE_TEMPLATE: string;
  LANGUAGE: string;
  BRAND: {
    small: LogoConfig;
    large: LogoConfig;
  };
  SPLASH_SCREEN: {
    enabled: boolean;
    logo: string;
    background: string;
  };
};

export type ImageType = {
  id: number;
  url: string;
};
