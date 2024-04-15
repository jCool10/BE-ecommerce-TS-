import { SortOrder, Types } from 'mongoose'
import { product } from '../models/product.model'

export const findAllDraftsForShop = async ({ query, limit, skip }: any) => {
  return await queryProduct({ query, limit, skip })
}

export const publishProductByShop = async ({ product_shop, product_id }: any) => {
  const { modifiedCount } = await product.updateOne(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id)
    },
    {
      isDraft: false,
      isPublished: true
    }
  )

  return modifiedCount
}

export const findById = async ({ product_id, unSelect }: any) => {
  return await product.findById(product_id).select(unSelect).lean()
}

export const searchProductByUser = async ({ keySearch }: any) => {
  const regexSearch = new RegExp(keySearch)

  return await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch.toString() } // Convert regexSearch to string
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()
}

export const findAllProducts = async ({ limit, sort, page, filter, select }: any) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder | { $meta: any } } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(select).lean()
}

const queryProduct = async ({ query, limit, skip }: any) =>
  await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
