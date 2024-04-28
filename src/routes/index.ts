import { Router } from 'express'
import AuthRouter from './auth.route'
import ProductRouter from './product.route'
import DiscountRouter from './discount.route'
import CartRouter from './cart.route'
import OrderRouter from './order.route'
import InventoryRouter from './inventory.route'
import CommentRouter from './comment.route'
import { apiKey, permission } from '~/utils/auth.util'

const router: Router = Router()

router.use(apiKey)

router.use(permission('0000'))

router.use('/auth', AuthRouter)
router.use('/product', ProductRouter)
router.use('/discount', DiscountRouter)
router.use('/cart', CartRouter)
router.use('/checkout', OrderRouter)
router.use('/inventory', InventoryRouter)
router.use('/comment', CommentRouter)
router.get('/', (req, res) => {
  res.send('Hello world!')
})

export default router
