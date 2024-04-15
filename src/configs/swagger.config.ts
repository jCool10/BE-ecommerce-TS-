import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { options } from './openapi.config'
import { Express } from 'express'

const specs = swaggerJsdoc(options)

const openApi = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

  routeDefault(app)
}

const routeDefault = (app: Express) => {
  // setting router default
  app.use((req, res, next) => {
    if (req.url === '/') {
      res.redirect('/api-docs')
      return
    }
    next()
  })
}

export default openApi
