import { sleep } from "@/services/utils";
import {
  APIErrorCode,
  ClientErrorCode,
  isNotionClientError,
  NotionClientError,
} from "@notionhq/client";

const notionAPIError = "Notion_API_ERROR";
const errorType = Object.freeze({
  NotFound: "NotFound",
  InvalidRequest: "InvalidRequest",
  Server: "Server",
  Permission: "Permission",
  NotHandled: "NotHandled",
  Client: "Client",
});

type HandledError =
  | NotFoundError
  | InvalidRequestError
  | ServerError
  | PermissionError
  | ClientError;
export type NotionAPIError = HandledError | NotHandledError;

class BaseError extends Error {
  notionAPIError: string = notionAPIError;
  constructor() {
    super();
  }
}

class BaseHandledError extends BaseError {
  message: string;
  stack?: string;
  constructor(error: NotionClientError) {
    super();
    this.message = error.message;
    this.stack = error.stack;
  }
}

class NotFoundError extends BaseHandledError {
  type: string = errorType.NotFound;
  constructor(error: NotionClientError) {
    super(error);
  }
}

class InvalidRequestError extends BaseHandledError {
  type: string = errorType.InvalidRequest;
  constructor(error: NotionClientError) {
    super(error);
  }
}

class ServerError extends BaseHandledError {
  type: string = errorType.Server;
  constructor(error: NotionClientError) {
    super(error);
  }
}

class PermissionError extends BaseHandledError {
  type: string = errorType.Permission;
  constructor(error: NotionClientError) {
    super(error);
  }
}

class ClientError extends BaseHandledError {
  type: string = errorType.Client;
  constructor(error: NotionClientError) {
    super(error);
  }
}

class NotHandledError extends BaseError {
  type: string = errorType.NotHandled;
  constructor() {
    super();
  }
}

export const notionErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
): T => {
  return <T>(async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (isNotionClientError(error)) {
        switch (error.code) {
          case APIErrorCode.RateLimited:
            {
              const headers = error.headers as Headers | undefined;
              const retryAfterVal = headers?.get("Retry-After");
              const retryAfter = retryAfterVal
                ? Number(retryAfterVal)
                : Number.NaN;
              if (Number.isNaN(retryAfter)) {
                throw new NotHandledError();
              }
              const F = notionErrorHandler(fn);
              await sleep(retryAfter.valueOf() * 1000);
              return await F(...args);
            }
            break;

          case APIErrorCode.ObjectNotFound:
            throw new NotFoundError(error);
            break;

          case APIErrorCode.InvalidJSON:
          case APIErrorCode.InvalidRequest:
          case APIErrorCode.InvalidRequestURL:
          case APIErrorCode.ValidationError:
            throw new InvalidRequestError(error);
            break;

          case APIErrorCode.InternalServerError:
          case APIErrorCode.ServiceUnavailable:
            throw new ServerError(error);
            break;

          case APIErrorCode.RestrictedResource:
          case APIErrorCode.Unauthorized:
            throw new PermissionError(error);
            break;

          case ClientErrorCode.RequestTimeout:
          case ClientErrorCode.ResponseError:
            throw new ClientError(error);
            break;

          default:
            break;
        }
      }
      throw new NotHandledError();
    }
  });
};

export const isNotionAPIError = (error: any): error is NotionAPIError => {
  return (<NotionAPIError>error).notionAPIError === notionAPIError;
};

export const isHandledError = (error: any): error is HandledError => {
  return isNotionAPIError(error) && (<HandledError>error).message !== undefined;
};

export const isNotFoundError = (error: any): error is NotFoundError => {
  return isNotionAPIError(error) && error.type === errorType.NotFound;
};

export const isInvalidRequestError = (
  error: any,
): error is InvalidRequestError => {
  return isNotionAPIError(error) && error.type === errorType.InvalidRequest;
};

export const isServerError = (error: any): error is ServerError => {
  return isNotionAPIError(error) && error.type === errorType.Server;
};

export const isPermissionError = (error: any): error is PermissionError => {
  return isNotionAPIError(error) && error.type === errorType.Permission;
};

export const isClientError = (error: any): error is ClientError => {
  return isNotionAPIError(error) && error.type === errorType.Client;
};
