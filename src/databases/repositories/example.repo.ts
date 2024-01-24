import { ExampleModel } from '../models/example.model'

export const findExampleById = async ({ id }: any) => await ExampleModel.findById(id).lean()

export const createExample = async ({ data }: any) => await ExampleModel.create({ data })

export const updateExampleById = async ({ query, update, options }: any) =>
  await ExampleModel.findByIdAndUpdate(query, update, options).lean()
