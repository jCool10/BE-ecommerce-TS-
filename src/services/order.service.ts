import { Request } from 'express'
import { Types } from 'mongoose'
import { BadeRequestError, InternalServerError, NotFoundError } from '~/core/error.response'
import { CartModel } from '~/databases/models/cart.model'
import { product as ProductModel } from '~/databases/models/product.model'
import { DiscountService } from './discount.service'
// import { acquireLock, releaseLock } from './redis.service'
import { OrderModel } from '~/databases/models/order.model'

class orderService {
  checkoutReview = async ({ cartId, userId, shop_order_ids }: any) => {
    // const { cartId, userId, shop_order_ids } = req.body

    const foundCart = await CartModel.findOne({
      _id: new Types.ObjectId(cartId),
      cart_state: 'active'
    })

    if (!foundCart) {
      throw new NotFoundError('Cart not found')
    }

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0
      },
      shop_order_ids_new = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], itemProducts = [] } = shop_order_ids[i]

      const checkProductServer = await Promise.all(
        itemProducts.map(async (product: any) => {
          const foundProduct = await ProductModel.findOne({ _id: new Types.ObjectId(product.productId) }).lean()
          if (foundProduct) {
            return {
              price: foundProduct.product_price,
              quantity: product.quantity,
              productId: product.productId
            }
          }
        })
      )

      // if (!checkout_order[0]) throw new InternalServerError('Order invalid')

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      checkout_order.totalPrice = +checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRow: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      if (shop_discounts.length > 0) {
        const { discount, totalPrice } = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0].discount_code,
          userId,
          shopId,
          products: checkProductServer
        })

        checkout_order.totalDiscount += discount
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  orderByUser = async (req: Request) => {
    const { cartId, userId, shop_order_ids, user_address, user_payment } = req.body

    const { checkout_order, shop_order_ids_new } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    const products = shop_order_ids_new.flatMap((order) => order.item_products)

    // const acquireProduct = []

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]

      // const keyLock = await acquireLock(productId, quantity, cartId)

      // acquireProduct.push(keyLock ? true : false)

      // if (keyLock) {
      //   await releaseLock(keyLock)
      // }
    }

    // if (acquireProduct.includes(false)) {
    //   throw new BadeRequestError('Product not enough')
    // }

    const newOrder = OrderModel.create({
      order_user_id: userId,
      order_checkout: checkout_order,
      oder_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })

    // if (newOrder) {
    // }

    return {}
  }

  getOrdersByUser = async (req: Request) => {}

  getOneOrderByUser = async (req: Request) => {}

  cancelOrderByUser = async (req: Request) => {}

  updateOrderStatusByShop = async (req: Request) => {}
}

export const OrderService = new orderService()
