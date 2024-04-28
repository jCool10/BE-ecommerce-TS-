import { ReasonPhrases, StatusCodes } from '../constants/httpStatusCode'

class ErrorResponse extends Error {
  [x: string]: any
  constructor(message: string | undefined, status: any, errors: any, isOperationalL: boolean) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.status = status
    this.errors = errors
    this.isOperationalL = isOperationalL
    Error.captureStackTrace(this, this.constructor)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, errors = [], status = StatusCodes.NOT_FOUND, isOperational = true) {
    super(message, status, errors, isOperational)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    errors = [],
    status = StatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, errors = [], status = StatusCodes.FORBIDDEN, isOperational = true) {
    super(message, status, errors, isOperational)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    errors = [],
    status = StatusCodes.BAD_REQUEST,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    errors = [],
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

// 401 error
class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    errors = [],
    status = StatusCodes.UNAUTHORIZED,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

class BadGateWayError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_GATEWAY,
    errors = [],
    status = StatusCodes.BAD_GATEWAY,
    isOperational = true
  ) {
    super(message, status, errors, isOperational)
  }
}

export {
  ErrorResponse,
  NotFoundError,
  AuthFailureError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
  BadRequestError,
  BadGateWayError
}
