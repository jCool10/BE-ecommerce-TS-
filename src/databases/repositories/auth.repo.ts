import { ShopModel } from '../models/shop.model'

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    status: 3,
    roles: 4,
    name: 5
  }
}: {
  email: string
  select?: any
}) => {
  return await ShopModel.findOne({ email }).select(select).lean()
}

export { findByEmail }
