import { Router } from 'express'
import { CartController } from '~/controllers/cart.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

router.post('', CartController.addToCart)

router.delete('', CartController.delete)

router.put('', CartController.update)

router.get('', CartController.listToCart)

export default router
