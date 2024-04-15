import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { InventoryService } from '~/services/inventory.service'

class inventoryController {
  addStockToInventory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Add Stock to Inventory Success',
      data: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  })
}

export const InventoryController = new inventoryController()
