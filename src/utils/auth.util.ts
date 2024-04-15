/* eslint-disable no-useless-catch */
import { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import { Types } from 'mongoose'
import { AuthFailureError, ForbiddenError, NotFoundError } from '~/core/error.response'
import { ApiKeyModel } from '~/databases/models/apikey.model'
import { KeyStoreModel } from '~/databases/models/keyStore.model'
import asyncCatch from '~/helpers/cathAsync'
// import { KeyStoreService } from '~/services/keyStore.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'refresh-token',
  X_CLIENT_ID: 'x-client-id',
  BEARER: 'Bearer '
}

export const createTokenPair = async (payload: any, publicKey: any, privateKey: string) => {
  try {
    // auth token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1 days'
    })

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    })

    // verify key
    verifyJwt(accessToken, publicKey, (err: any, decode: any) => {
      if (err) {
        console.error(`error verify:: `, err)
      } else {
        console.log('decode verify::', decode)
      }
    })

    return {
      accessToken,
      refreshToken
    }
  } catch (error) {
    console.error(`createTokenPair error:: `, error)
  }
}

const verifyJwt = (token: string, keySecret: string, options = {}) => JWT.verify(token, keySecret, options)

export const authentication = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.headers[HEADER.X_CLIENT_ID]
  const accessToken = extractToken(req.headers[HEADER.AUTHORIZATION] as string)
  const refreshToken = extractToken(req.headers[HEADER.REFRESH_TOKEN] as string)

  const obj = parseJwt(accessToken || refreshToken)
  if (!obj.userId) throw new ForbiddenError('Token invalid')

  const userId = clientId || obj.userId
  if (!userId) throw new ForbiddenError('Invalid request')

  const keyStore = await KeyStoreModel.findOne({ user: new Types.ObjectId(userId) })
  if (!keyStore) throw new NotFoundError('Resource not found')

  if (refreshToken) {
    try {
      const decodeUser: any = verifyJwt(refreshToken, keyStore.privateKey!)
      console.log(decodeUser)
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')

      req.user = decodeUser
      req.keyStore = keyStore
      req.refreshToken = refreshToken

      return next()
    } catch (error) {
      throw error
    }
  }

  if (!accessToken) throw new AuthFailureError('Invalid request')
  try {
    const decodeUser: any = verifyJwt(accessToken, keyStore.publicKey!)
    console.log(decodeUser)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')

    req.user = decodeUser
    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

const extractToken = (tokenHeader: string | undefined) => {
  if (!tokenHeader) return ''

  return tokenHeader.replace(HEADER.BEARER, '')
}

const parseJwt = (token: any) => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

export const apiKey = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers[HEADER.API_KEY]?.toString()
  if (!apiKey) throw new ForbiddenError('Invalid request')

  const objKey = await ApiKeyModel.findOne({ key: apiKey, status: true }).lean()

  if (!objKey) throw new NotFoundError('Resource not found')

  req.objKey = objKey

  return next()
})

export const permission = (roles: any) => async (req: Request, res: Response, next: NextFunction) => {
  if (!req.objKey.permission) throw new ForbiddenError('Permission denied')

  console.log('permission::', req.objKey.permission)

  const validPermission = req.objKey.permissions.includes(roles)

  if (!validPermission) throw new ForbiddenError('Permission denied')

  return next()
}
