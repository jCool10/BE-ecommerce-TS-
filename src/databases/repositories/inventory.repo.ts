import { Types } from 'mongoose'
import { InventoryModel } from '../models/inventory.model'

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }: any) => {
  return await InventoryModel.create({
    inventory_product_id: new Types.ObjectId(productId),
    inventory_location: location,
    inventory_shop_id: new Types.ObjectId(shopId),
    inventory_stock: stock
  })
}

const reservationInventory = async ({ productId, quantity, cartId }: any) => {
  const query = {
      inventory_product_id: new Types.ObjectId(productId),
      inventory_stock: { $gte: quantity }
    },
    update = {
      $inc: { inventory_stock: -quantity },
      $push: { inven_reservation: { cartId, quantity, createOn: new Date() } }
    },
    options = { new: true, upsert: true }

  return await InventoryModel.updateOne(query, update)
}

export { insertInventory, reservationInventory }
