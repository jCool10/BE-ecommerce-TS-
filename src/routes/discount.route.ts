import { Router } from 'express'
import { DiscountController } from '~/controllers/discount.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

/**
 * Route to get the discount amount.
 * @name POST /amount
 * @function
 */
router.post('/amount', DiscountController.getDiscountAmount)

/**
 * Route to get all discount codes with associated products.
 * @name GET /list-product-code
 * @function
 */
router.get('/list-product-code', DiscountController.getAllDiscountCodeWithProduct)

// authentication middleware
router.use(authentication)

/**
 * Route to create a new discount code.
 * @name POST /
 * @function
 */
router.post('', DiscountController.createDiscountCode)

/**
 * Route to get all discount codes by shop.
 * @name GET /
 * @function
 */
router.get('', DiscountController.getAllDiscountCodesByShop)

/**
 * Route to cancel a discount code by search key.
 * @name GET /search/:keySearch
 * @function
 */
router.get('/search/:keySearch', DiscountController.cancelDiscountCode)

/**
 * Route to cancel a discount code by search key.
 * @name GET /search/:keySearch
 * @function
 */
router.get('/search/:keySearch', DiscountController.cancelDiscountCode)

export default router
