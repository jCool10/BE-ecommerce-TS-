import { model, Schema } from 'mongoose'

// hang ton kho
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new Schema(
  {
    inventory_product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    inventory_location: {
      type: String,
      default: 'unKnow'
    },
    inventory_stock: {
      type: Number,
      required: true
    },
    inventory_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    inventory_reservations: {
      type: Array,
      default: []
    }
    /*
        cardId: ,
        stock: 1,
        createdOn: ,
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

export const InventoryModel = model(DOCUMENT_NAME, inventorySchema)
