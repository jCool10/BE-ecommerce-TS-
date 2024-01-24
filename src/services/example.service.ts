import { Request } from 'express'
import { createExample, findExampleById, updateExampleById } from '~/databases/repositories/example.repo'

class exampleService {
  create = async (req: Request) => {
    const { data } = req.body
    return await createExample({ data })
  }
  read = async (req: Request) => {
    const { id } = req.body
    await findExampleById({ id })
    return {}
  }
  update = async (req: Request) => {
    const query = {},
      update = {},
      options = { upsert: true, new: true }
    await updateExampleById({ query, update, options })
    return {}
  }
  delete = async (req: Request) => {
    return {}
  }
}

export const ExampleService = new exampleService()
