import { Router } from 'express'
import { CommentController } from '~/controllers/comment.controller'
import { authentication } from '~/utils/auth.util'

const router: Router = Router()

router.use(authentication)

router.post('', CommentController.createComment)
router.get('/', CommentController.getCommentByParentId)
router.delete('/', CommentController.deleteComment)

export default router
