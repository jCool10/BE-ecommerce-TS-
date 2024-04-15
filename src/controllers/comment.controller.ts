import { NextFunction, Request, Response } from 'express'
import { SuccessResponse } from '~/core/success.response'
import catchAsync from '~/helpers/cathAsync'
import { CommentService } from '~/services/comment.service'

class commentController {
  createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update cart success',
      data: await CommentService.createComment(req)
    }).send(res)
  })

  getCommentByParentId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get comment success',
      data: await CommentService.getCommentByParentId(req)
    }).send(res)
  })

  deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Delete comment success',
      data: await CommentService.deleteComment(req)
    }).send(res)
  })
}

export const CommentController = new commentController()
