import { Types } from 'mongoose'
import { KeyStoreModel } from '~/databases/models/keyStore.model'
// import { KeyStore } from '~/@types/keyStore.type'
// import { KeyStoreModel } from '~/database/models/keyStore.model'

class keyStoreService {
  createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: any) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken
        },
        options = { upsert: true, new: true }

      const tokens = await KeyStoreModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      console.error('createKeyToken::error::', error)
      throw error
    }
  }
}

export const KeyStoreService = new keyStoreService()
