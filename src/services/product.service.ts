import { Request } from 'express'
import { InternalServerError } from '~/core/error.response'
import { clothing, electronic, furniture, product } from '~/databases/models/product.model'
import { insertInventory } from '~/databases/repositories/inventory.repo'
import {
  findAllDraftsForShop,
  findAllProducts,
  findById,
  publishProductByShop,
  searchProductByUser
} from '~/databases/repositories/product.repo'
import { getSelectData, unGetSelectData } from '~/utils'

class ProductFactory {
  static productRegistry: { [key: string]: any } = {}

  static registerProductType(type: string, classRef: any) {
    ProductFactory.productRegistry[type] = classRef
  }

  static createProduct = async (req: Request) => {
    const payload = { ...req.body, product_shop: req.user.userId }
    const { product_type } = payload

    const productClass = ProductService.productRegistry[product_type]
    if (!productClass) throw new InternalServerError('Product type not found')

    return new productClass(payload).createProduct()
  }

  static updateProduct = async (req: Request) => {
    const { productId } = req.params

    const payload = { ...req.body, product_shop: req.user.userId }
    const { product_type } = payload

    const productClass = ProductService.productRegistry[product_type]
    if (!productClass) throw new InternalServerError('Product type not found')

    return new productClass(payload).updateProduct(productId)
  }

  static publishProductByShop = async (req: Request) => {
    const { product_id } = req.params
    const product_shop = req.user.userId

    return await publishProductByShop({ product_shop, product_id })
  }

  static findAllDraftsForShop = async (req: Request) => {
    const { limit, skip } = req.query
    const product_shop = req.user.userId

    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static findAllPublishedForShop = async (req: Request) => {
    const { limit, skip } = req.query
    const product_shop = req.user.userId

    const query = { product_shop, isDraft: false }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static findAllProducts = async (req: Request) => {
    const { limit, sort, page, ...filter } = req.query

    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: getSelectData(['product_name', 'product_price', 'product_thumb', 'product_shop'])
    })
  }

  static findProduct = async (req: Request) => {
    const { product_id } = req.params

    return await findById({ product_id, unSelect: unGetSelectData(['__v', 'variations']) })
  }

  static searchProducts = async (req: Request) => {
    const { keySearch } = req.params

    return searchProductByUser({ keySearch })
  }
}

class Product {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_type: string
  product_shop: string
  product_attributes: any
  product_quality: number

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quality
  }: any) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quality = product_quality
  }

  async createProduct(product_id?: string) {
    const newProduct = await product.create({ ...this, _id: product_id })

    if (newProduct) {
      await insertInventory({
        productId: product_id,
        shopId: this.product_shop,
        stock: this.product_quality
      })
    }

    return newProduct
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) {
      throw new InternalServerError('Create new clothing error')
    }

    const newProduct = await super.createProduct(newClothing._id.toString()) // Convert ObjectId to string
    if (!newProduct) {
      throw new InternalServerError('Create new product error')
    }
    return newProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) {
      throw new InternalServerError('Create new electronic error')
    }

    const newProduct = await super.createProduct(newElectronic._id.toString()) // Convert ObjectId to string
    if (!newProduct) {
      throw new InternalServerError('Create new product error')
    }
    return newProduct
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) {
      throw new InternalServerError('Create new furniture error')
    }

    const newProduct = await super.createProduct(newFurniture._id.toString()) // Convert ObjectId to string
    if (!newProduct) {
      throw new InternalServerError('Create new product error')
    }
    return newProduct
  }
}

ProductFactory.registerProductType('clothing', Clothing)
ProductFactory.registerProductType('electronic', Electronic)
ProductFactory.registerProductType('furniture', Furniture)

export const ProductService = ProductFactory
