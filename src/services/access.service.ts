import { Request } from 'express'
import { ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '~/core/error.response'
import { ShopModel } from '~/databases/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { KeyStoreService } from './keyStore.service'
import { createTokenPair } from '~/utils/auth.util'
import { ApiKeyModel } from '~/databases/models/apikey.model'
import { getInfoData } from '~/utils'
import { KeyStoreModel } from '~/databases/models/keyStore.model'

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '001',
  READ: '002',
  DELETE: '003',
  ADMIN: '000'
}

class accessService {
  login = async (req: Request) => {
    const { email, password } = req.body
    const foundShop = await ShopModel.findOne({ email: email })
      .select({ email: 1, password: 2, status: 3, roles: 4, name: 5 })
      .lean()

    if (!foundShop) throw new NotFoundError('Email not found')

    const matchPassword = bcrypt.compare(password, foundShop.password)
    if (!matchPassword) throw new InternalServerError('Login error')

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    })

    const { _id: userId } = foundShop

    const tokens = await createTokenPair({ userId: userId.toString(), email }, publicKey, privateKey)

    if (!tokens) throw new InternalServerError('Failed to create token')

    await KeyStoreService.createKeyToken({
      userId: userId,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString(),
      refreshToken: tokens.refreshToken
    })

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  signup = async (req: Request) => {
    const { name, email, password } = req.body

    const holderShop = await ShopModel.findOne({ email })
      .select({ email: 1, password: 2, status: 3, roles: 4, name: 5 })
      .lean()
    if (holderShop) {
      throw new ForbiddenError('Email already exists')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await ShopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP]
    })

    if (!newShop) throw new InternalServerError('Failed to create new shop')

    // create private and public key
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      }
    })

    const publicKeyString = await KeyStoreService.createKeyToken({
      userId: newShop._id,
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString()
    })

    if (!publicKeyString) throw new InternalServerError('Failed to create public key')

    const publicKeyObject = await crypto.createPublicKey(publicKeyString)

    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey)

    const newKey = await ApiKeyModel.create({
      key: crypto.randomBytes(64).toString('hex'),
      permission: ['0000']
    })

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: newShop
      }),
      tokens,
      key: getInfoData({
        fields: ['key'],
        object: newKey
      })
    }
  }

  logout = async (req: Request) => {
    const keyStore = req.keyStore
    const delKey = await KeyStoreModel.deleteOne(keyStore._id)

    return delKey
  }

  refreshToken = async (req: Request) => {
    const { user, refreshToken, keyStore } = req
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyStoreModel.findByIdAndDelete({ userId })
      throw new ForbiddenError('Something wrong happen!! Pls re-login')
    }

    if (refreshToken !== keyStore.refreshToken) throw new UnauthorizedError('Shop is not registered')

    const foundShop = await ShopModel.findOne({ email })
      .select({ email: 1, password: 2, status: 3, roles: 4, name: 5 })
      .lean()

    if (!foundShop) throw new NotFoundError('Shop not found')

    const tokens = await createTokenPair({ userId: userId.toString(), email }, keyStore.publicKey, keyStore.privateKey)

    if (!tokens) throw new InternalServerError('Failed to create token')

    await keyStore.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return { user, tokens }
  }
}

export const AccessService = new accessService()
