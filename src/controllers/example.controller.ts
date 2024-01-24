import { SuccessResponse } from '~/core/success.response'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '~/helpers/cathAsync'
import { ExampleService } from '~/services/example.service'

class exampleController {
  create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({ message: 'Create Success', data: await ExampleService.create(req) }).send(res)
  })

  read = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({ message: 'Create Success', data: await ExampleService.read(req) }).send(res)
  })

  update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({ message: 'Create Success', data: await ExampleService.update(req) }).send(res)
  })

  delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({ message: 'Create Success', data: await ExampleService.delete(req) }).send(res)
  })
}

export const ExampleController = new exampleController()
