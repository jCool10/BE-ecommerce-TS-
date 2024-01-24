import { Router } from 'express'
import ExampleRouter from './example.route'

const router: Router = Router()

router.use('example', ExampleRouter)

export default router
