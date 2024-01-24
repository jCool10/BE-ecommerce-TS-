import { Router } from 'express'
import { ExampleController } from '~/controllers/example.controller'

const router: Router = Router()

router.get('', ExampleController.read)
router.post('', ExampleController.create)
router.put('', ExampleController.update)
router.delete('', ExampleController.delete)

export default router
