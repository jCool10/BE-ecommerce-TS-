import { Router } from 'express'
import { AccessController } from '~/controllers/access.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

/**
 * @swagger
 *   /api/v1/auth/login:
 *     post:
 *       summary: Shop login
 *       tags: [Auth]
 *       security: [{apiKey: []}]
 *       requestBody:
 *          description: Request login info
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/RequestLogin'
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Login successfully
 *           contents:
 *             application/json
 */
router.post('/login', AccessController.login)

router.post('/signup', AccessController.signup)

router.use(authentication)

router.post('/logout', AccessController.logout)

router.post('/refresh-token', AccessController.refreshToken)

export default router
