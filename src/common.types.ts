import { TFunction } from 'i18next';

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

export type ValidationError = { code?: string; message: string };

export type LaravelError = {
  message: string;
  exception: string;
  file: string;
  line: number;
  trace: Array<{
    class: string;
    file: string;
    function: string;
    line: number;
    type: string;
  }>;
};

export type ResponseBody<Data = any> = {
  data: Data;
  errors?: Record<string, ValidationError>;
  message?: string;
} & Partial<LaravelError>;

export type LogoConfig = {
  logo?: Nullable<string>;
  label?: Nullable<string>;
  'label-color'?: Nullable<string>;
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

export type FileType = {
  id: number;
  mime: string;
  name: string;
  size: number;
  url: string;
};

export interface TranslateFunction extends TFunction {}
