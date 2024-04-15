import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { OrderService } from '~/services/order.service'

class orderController {
  checkoutReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Checkout Review Success',
      data: await OrderService.checkoutReview(req.body)
    }).send(res)
  })
}

export const OrderController = new orderController()
