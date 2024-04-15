import { Router } from 'express'
import { OrderController } from '~/controllers/order.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

router.post('review', OrderController.checkoutReview)

export default router
