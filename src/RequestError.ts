import { ParsedResponseBody } from './common.types';

class RequestError extends Error {
  status: { code: number; text: string };
  body: ParsedResponseBody;

  constructor(
    status: { code: number; text: string },
    body: ParsedResponseBody
  ) {
    super(JSON.stringify({ status, body }, null, 2));

    this.status = status;
    this.body = body;

    console.error(this);
  }
}

export default RequestError;
