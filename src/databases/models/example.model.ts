'use strict '

import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Example'
const COLLECTION_NAME = 'Examples'

const exampleSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222']
    }
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

export const ExampleModel = model(DOCUMENT_NAME, exampleSchema)
