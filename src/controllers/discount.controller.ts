import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { DiscountService } from '~/services/discount.service'

class discountControllers {
  createDiscountCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Create Discount Code Success',
      data: await DiscountService.createDiscountCode(req)
    }).send(res)
  })

  updateDiscountCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update Discount Code Success',
      data: await DiscountService.updateDiscountCode(req)
    }).send(res)
  })

  getAllDiscountCodeWithProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get All Discount Code Success',
      data: await DiscountService.getAllDiscountCodeWithProduct(req)
    }).send(res)
  })

  getAllDiscountCodesByShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get All Discount Code Success',
      data: await DiscountService.getAllDiscountCodesByShop(req)
    }).send(res)
  })

  getDiscountAmount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get Discount Amount Success',
      data: await DiscountService.getDiscountAmount({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  })

  deleteDiscountCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Delete Discount Code Success',
      data: (await DiscountService.deleteDiscountCode(req)) || {}
    }).send(res)
  })

  cancelDiscountCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Cancel Discount Code Success',
      data: (await DiscountService.cancelDiscountCode(req)) || {}
    }).send(res)
  })
}

export const DiscountController = new discountControllers()
