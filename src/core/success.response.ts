import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from '../constants/httpStatusCode'

class SuccessResponse {
  [x: string]: any

  constructor({ message = '', status = StatusCodes.OK, data = {}, options = {} }) {
    this.message = message
    this.status = status
    this.data = data
    this.options = options
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this)
  }
}

export { SuccessResponse }
