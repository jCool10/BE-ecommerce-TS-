import { Request } from 'express'
import { Types } from 'mongoose'
import { InternalServerError } from '~/core/error.response'
import { DiscountModel } from '~/databases/models/discount.model'
import { findAllDiscountCodesUnSelect } from '~/databases/repositories/discount.repo'
import { findAllProducts } from '~/databases/repositories/product.repo'

class discountService {
  createDiscountCode = async (req: Request) => {
    const payload = { ...req.body, shopId: req.user.userId }
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_users,
      users_count,
      max_uses_per_user
    } = payload

    if (new Date() > new Date(start_date) || new Date() > new Date(end_date))
      throw new InternalServerError('Discount code has expired')

    if (new Date(end_date) < new Date(start_date)) {
      throw new InternalServerError('End date more than start date')
    }

    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shop_id: new Types.ObjectId(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new InternalServerError('Discount code already exists')
    }

    return await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_users,
      discount_uses_count: users_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
  }

  updateDiscountCode = async (req: Request) => {
    return {}
  }

  getAllDiscountCodeWithProduct = async (req: Request) => {
    const payload = { ...req.body, shopId: req.user.userId }

    const { code, shopId, userId, limit, page } = payload

    const foundDiscount = await DiscountModel.findOne({
      discount_code: code,
      discount_shop_id: new Types.ObjectId(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new InternalServerError('Discount not exists')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let filter

    if (discount_applies_to === 'all') {
      // get all
      filter = {
        product_shop: new Types.ObjectId(shopId),
        isPublished: true
      }
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = {
        _id: { $in: discount_product_ids },
        isPublished: true
      }
    }

    return await findAllProducts({ filter, limit: +limit, page: +page, sort: 'ctime', select: ['product_name'] })
  }

  getAllDiscountCodesByShop = async (req: Request) => {
    const payload = { ...req.body, shopId: req.user.userId }

    const { shopId, limit, page } = payload

    return await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: new Types.ObjectId(shopId),
        discount_is_active: true
      },
      unSelect: ['__v', 'discount_shop_id']
    })
  }

  getDiscountAmount = async ({ codeId, userId, shopId, products }: any) => {
    const foundDiscount = await DiscountModel.findOne({
      discount_code: codeId,
      discount_shop_id: new Types.ObjectId(shopId)
    }).lean()

    if (!foundDiscount) throw new InternalServerError('Discount not exists')

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_day,
      discount_end_day,
      discount_min_order_value,
      // discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new InternalServerError('Discount expired')

    if (discount_max_uses === 0) throw new InternalServerError('Discount are out')

    if (new Date() < new Date(discount_start_day) || new Date() > new Date(discount_end_day))
      throw new InternalServerError('Discount expired')

    let totalOrder = 0

    if (discount_min_order_value > 0) {
      totalOrder = products.reduce(
        (acc: number, product: { quantity: number; price: number }) => acc + product.quantity * product.price,
        0
      )

      if (totalOrder < discount_min_order_value) {
        throw new InternalServerError(`Discount requires a minium order value of ${discount_min_order_value}`)
      }
    }

    const amount =
      discount_type === 'fixed_amount' ? Number(discount_value) : totalOrder * (Number(discount_value) / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  deleteDiscountCode = async (req: Request) => {
    const payload = { ...req.body, shopId: req.user.userId }
    const { shopId, codeId } = payload

    return await DiscountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: new Types.ObjectId(shopId)
    })
  }

  cancelDiscountCode = async (req: Request) => {
    const payload = { ...req.body, shopId: req.user.userId }

    const { codeId, shopId, userId } = payload

    const foundDiscount = await DiscountModel.findOne({
      discount_code: codeId,
      discount_shop_id: new Types.ObjectId(shopId)
    }).lean()

    if (!foundDiscount) throw new InternalServerError('Discount not exists')

    return await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1
      }
    })
  }
}

export const DiscountService = new discountService()
