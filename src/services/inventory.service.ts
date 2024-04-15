import { Types } from 'mongoose'
import { NotFoundError } from '~/core/error.response'
import { InventoryModel } from '~/databases/models/inventory.model'
import { product as ProductModel } from '~/databases/models/product.model'

class inventoryService {
  async addStockToInventory({ stock, productId, shopId, location }: any) {
    const product = await ProductModel.findOne({ _id: new Types.ObjectId(productId) }).lean()

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    const query = {
        inventory_shop_id: shopId,
        inventory_product_id: productId
      },
      update = {
        $inc: { inventory_stock: stock },
        $set: { inventory_location: location }
      },
      options = { upsert: true, new: true }

    return (await InventoryModel.findOneAndUpdate(query, update, options)) || {}
  }
}

export const InventoryService = new inventoryService()
