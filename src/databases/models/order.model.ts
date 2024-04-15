'use strict '

import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema(
  {
    order_user_id: {
      type: Number,
      required: true
    },
    order_checkout: {
      type: Object,
      default: {}
    },
    oder_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
      type: Array,
      default: [],
      required: true
    },
    order_tracking_number: {
      type: String,
      default: ''
    },
    order_status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

export const OrderModel = model(DOCUMENT_NAME, orderSchema)
