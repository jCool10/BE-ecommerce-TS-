import { Request } from 'express'
import { Types } from 'mongoose'
import { NotFoundError } from '~/core/error.response'
import { CartModel } from '~/databases/models/cart.model'
import { product } from '~/databases/models/product.model'
import { notFoundError } from '~/middleware/errorHandle.middleware'

class cartService {
  createUserCart = async ({ userId, product }: any) => {
    const query = {
      cart_user_id: userId,
      cart_state: 'active'
    }

    const updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      },
      options = { upsert: true, new: true }

    return await CartModel.findOneAndUpdate(query, updateOrInsert, options)
  }

  updateUserCartQuantity = async ({ userId, product }: any) => {
    const { productId, quantity } = product
    const query = {
        cart_user_id: userId,
        'cart_products.productId': productId,
        cart_state: 'active'
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity
        }
      },
      options = { upsert: true, new: true }
    return await CartModel.findOneAndUpdate(query, updateSet, options)
  }

  addToCart = async (req: Request) => {
    const { userId, product } = req.body

    const userCart = await CartModel.findOne({
      cart_user_id: userId
    })

    if (!userCart) {
      return await this.createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    return await this.updateUserCartQuantity({ userId, product })
  }

  addToCartV2 = async (req: Request) => {
    const { userId, shop_order_ids } = req.body

    const { productId, quantity, old_quantity } = shop_order_ids[0].item_products[0]

    const foundProduct = await product
      .findOne({
        _id: new Types.ObjectId(productId)
      })
      .lean()

    if (!foundProduct) throw new NotFoundError('Product not found')

    if (foundProduct.product_shop?.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product do not belong to the shop')

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  deleteItemInCart = async (req: Request) => {
    const { userId, productId } = req.body

    const query = {
      cart_user_id: userId,
      cart_state: 'active'
    }

    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    return await CartModel.updateOne(query, updateSet)
  }

  getListUserCart = async (req: Request) => {
    const { userId } = req.query

    if (!userId) throw new NotFoundError('User not found')

    return await CartModel.findOne({
      cart_user_id: +userId
    }).lean()
  }
}

export const CartService = new cartService()
