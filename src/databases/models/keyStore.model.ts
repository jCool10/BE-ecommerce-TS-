'use strict '

import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyStoreSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      trim: true
    },
    privateKey: {
      type: String,
      trim: true
    },
    refreshTokensUsed: {
      type: Array,
      default: []
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

export const KeyStoreModel = model(DOCUMENT_NAME, keyStoreSchema)
