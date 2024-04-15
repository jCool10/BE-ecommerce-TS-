import { ProductService } from './../services/product.service'
import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'

class productController {
  createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Create new product successfully',
      data: await ProductService.createProduct(req)
    }).send(res)
  })

  updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update product successfully',
      data: await ProductService.updateProduct(req)
    }).send(res)
  })

  publishProductByShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Publish product successfully',
      data: await ProductService.publishProductByShop(req)
    }).send(res)
  })

  getAllDraftsForShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get all drafts for shop successfully',
      data: await ProductService.findAllDraftsForShop(req)
    }).send(res)
  })

  getAllPublishedForShop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get all published for shop successfully',
      data: await ProductService.findAllPublishedForShop(req)
    }).send(res)
  })

  findAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get all products successfully',
      data: await ProductService.findAllProducts(req)
    }).send(res)
  })

  findProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get product successfully',
      data: (await ProductService.findProduct(req)) || {}
    }).send(res)
  })

  searchProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Search products successfully',
      data: await ProductService.searchProducts(req)
    }).send(res)
  })
}

export const ProductController = new productController()
