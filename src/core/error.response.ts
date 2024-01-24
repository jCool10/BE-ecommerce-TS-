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

export { ErrorResponse, NotFoundError }
