import { ParsedResponseBody } from './common.types';

class RequestError extends Error {
  status: number;
  statusText: string;
  url: string;
  body: ParsedResponseBody;

  constructor(params: {
    status: number;
    statusText: string;
    url: string;
    body: ParsedResponseBody;
  }) {
    super(JSON.stringify(params, null, 2));

    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
    this.body = params.body;

    console.error(this);
  }
}

export default RequestError;
