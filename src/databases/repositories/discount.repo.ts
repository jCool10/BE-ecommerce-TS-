import { getSelectData, unGetSelectData } from '~/utils'
import { DiscountModel } from '../models/discount.model'
import { SortOrder } from 'mongoose'

const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect }: any) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder | { $meta: any } } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await DiscountModel.find(filter)
    .sort(sortBy as any)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
}

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select }: any) => {
  const skip = (page - 1) * limit
  const sortBy: { [key: string]: SortOrder | { $meta: any } } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  return await DiscountModel.find(filter)
    .sort(sortBy as any)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}

export { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect }
