import { Request } from 'express'
import { Types } from 'mongoose'
import { NotFoundError } from '~/core/error.response'
import { CommentModel } from '~/databases/models/comment.model'

class commentService {
  createComment = async (req: Request) => {
    const { productId, userId, content, parentCommentId = null } = req.body

    const comment = await CommentModel.create({
      comment_product_id: productId,
      comment_user_id: userId,
      comment_content: content,
      comment_parent_id: parentCommentId
    })

    let rightValue: number

    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId)

      if (!parentComment) throw new NotFoundError('Parent comment not found')

      rightValue = parentComment.comment_right

      await CommentModel.updateMany(
        {
          comment_product_id: new Types.ObjectId(productId),
          comment_right: { $gte: rightValue }
        },
        {
          $inc: { comment_right: 2 }
        }
      )

      await CommentModel.updateMany(
        {
          comment_product_id: new Types.ObjectId(productId),
          comment_left: { $gt: rightValue }
        },
        {
          $inc: { comment_left: 2 }
        }
      )
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_product_id: new Types.ObjectId(productId)
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      )

      if (!maxRightValue) {
        rightValue = 1
      } else {
        rightValue = maxRightValue.comment_right + 1
      }
    }

    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()

    return comment
  }

  getCommentByParentId = async (req: Request) => {
    const { parentCommentId = null, productId, limit = 50, offset = 0 } = req.query

    if (parentCommentId) {
      const parent = await CommentModel.findById(parentCommentId)

      if (!parent) throw new NotFoundError('Parent comment not found')

      const comments = await CommentModel.find({
        comment_product_id: new Types.ObjectId(productId as string),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right }
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_parent: 1,
          comment_content: 1
        })
        .sort({ comment_left: 1 })

      return comments
    }

    const comments = await CommentModel.find({
      comment_product_id: new Types.ObjectId(productId as string),
      comment_parent_id: parentCommentId
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_parent: 1,
        comment_content: 1
      })
      .sort({ comment_left: 1 })

    return comments
  }

  deleteComment = async (req: Request) => {
    const { commentId, productId } = req.query

    const comment = await CommentModel.findById(commentId)

    if (!comment) throw new NotFoundError('Comment not found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    const width = rightValue - leftValue + 1

    await CommentModel.deleteMany({
      comment_product_id: new Types.ObjectId(productId as string),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    // update value left and right
    await CommentModel.updateMany(
      {
        comment_product_id: new Types.ObjectId(productId as string),
        comment_right: { $gt: rightValue }
      },
      {
        $inc: { comment_right: -width }
      }
    )

    await CommentModel.updateMany(
      {
        comment_product_id: new Types.ObjectId(productId as string),
        comment_left: { $gt: leftValue }
      },
      {
        $inc: { comment_left: -width }
      }
    )

    return true
  }
}

export const CommentService = new commentService()
