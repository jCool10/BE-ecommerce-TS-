import { Router } from 'express'
import { ProductController } from '~/controllers/product.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

/**
 * Route to get all products
 * @route GET /
 */
router.get('/', ProductController.findAllProducts)

/**
 * Route to search products by key search
 * @route GET /search/:keySearch
 * @param {string} keySearch - The search keyword
 */
router.get('/search/:keySearch', ProductController.searchProducts)

/**
 * Route to get a product by ID
 * @route GET /:product_id
 * @param {string} product_id - The ID of the product
 */
router.get('/:product_id', ProductController.findProduct)

// authentication
router.use(authentication)

/**
 * Route to create a new product
 * @route POST /
 */
router.post('', ProductController.createProduct)

/**
 * Route to update a product by ID
 * @route PATCH /:productId
 * @param {string} productId - The ID of the product
 */
router.patch('/:productId', ProductController.updateProduct)

/**
 * Route to publish a product by shop
 * @route PUT /publish/:id
 * @param {string} id - The ID of the product
 */
router.put('/publish/:id', ProductController.publishProductByShop)

/**
 * Route to get all drafts for a shop
 * @route GET /drafts/all
 */
router.get('/drafts/all', ProductController.getAllDraftsForShop)

/**
 * Route to get all published products for a shop
 * @route GET /published/all
 */
router.get('/published/all', ProductController.getAllPublishedForShop)

export default router
