export type ConstantMap<C extends string> = Readonly<Record<C, C>>;
export type Nullable<T> = T | null;
export type Nullish<T> = T | null | undefined;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

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
