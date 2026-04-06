import type * as oak from "@oak/oak";

type ErrorBody = oak.Context["response"]["body"];

export class HttpError extends Error {
  status: number;
  body: ErrorBody;
  override cause?: unknown;

  constructor(
    status: number,
    body: ErrorBody,
    message = "HTTP error",
    options?: { cause?: unknown },
  ) {
    super(message);
    this.status = status;
    this.body = body;
    this.cause = options?.cause;
  }
}

export class BadRequestError extends HttpError {
  constructor(
    body: ErrorBody,
    message = "Bad request",
    options?: { cause?: unknown },
  ) {
    super(400, body, message, options);
  }
}

export class NotFoundError extends HttpError {
  constructor(
    body: ErrorBody = { error: "Not found" },
    message = "Not found",
    options?: { cause?: unknown },
  ) {
    super(404, body, message, options);
  }
}

export class InternalServerError extends HttpError {
  constructor(
    body: ErrorBody,
    message = "Internal server error",
      options?: { cause?: unknown },
  ) {
    super(500, body, message, options);
  }
}

export const internalServerError = (message: string, cause?: unknown) =>
  new InternalServerError({ error: message }, message, { cause });
