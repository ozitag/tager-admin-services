import { TFunction } from 'i18next';
import { ResponseWithValidationErrorsType } from './typeGuards';

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

export interface PaginationMeta {
  page: {
    number: number;
    size: number;
    count: number;
  };
  total: number;
}

export type ResponseBody<Data = any, M = any> = {
  data: Data;
  message?: string;
  meta?: M;
} & Partial<LaravelError> &
  Partial<ResponseWithValidationErrorsType>;

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

export interface TranslateFunction extends TFunction {}
