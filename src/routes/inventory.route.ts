import { Router } from 'express'
import { InventoryController } from '~/controllers/inventory.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

router.use(authentication)

router.post('', InventoryController.addStockToInventory)

export default router
