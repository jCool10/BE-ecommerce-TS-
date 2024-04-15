import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { CartService } from '~/services/cart.service'

class cartController {
  addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Add to cart success',
      data: (await CartService.addToCart(req)) || {}
    }).send(res)
  })

  update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update cart success',
      data: (await CartService.addToCartV2(req)) || {}
    }).send(res)
  })

  delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Delete cart success',
      data: (await CartService.deleteItemInCart(req)) || {}
    }).send(res)
  })

  listToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'List cart success',
      data: (await CartService.getListUserCart(req)) || {}
    }).send(res)
  })
}

export const CartController = new cartController()
