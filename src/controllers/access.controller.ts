import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { AccessService } from '~/services/access.service'

class accessController {
  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Login success',
      data: await AccessService.login(req)
    }).send(res)
  })

  signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Register Success',
      data: await AccessService.signup(req)
    }).send(res)
  })

  logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Logout Success',
      data: await AccessService.logout(req)
    }).send(res)
  })

  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get token Success',
      data: await AccessService.refreshToken(req)
    }).send(res)
  })
}

export const AccessController = new accessController()
