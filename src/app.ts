import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './routes'
import { notFoundError, returnError } from './middleware/errorHandle.middleware'
import { instanceMongoDb } from './configs/mongose.config'
import openApi from './configs/swagger.config'

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(
  compression({
    level: 6, // level compress
    threshold: 100 * 1024, // > 100kb threshold to compress
    filter: (req) => {
      return !req.headers['x-no-compress']
    }
  })
)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

instanceMongoDb

// init swagger

openApi(app)

app.use('/api/v1', router)

app.use(notFoundError)

app.use(returnError)

export default app
