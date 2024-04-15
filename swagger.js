const swaggerAutogen = require('swagger-autogen')()

const doc = {
  info: {
    version: '1.0.0', // by default: '1.0.0'
    title: 'eCommerce Restfull API', // by default: 'REST API'
    description: 'Web eCommerce restfull api' // by default: ''
  },
  host: 'http://localhost:5000', // by default: 'localhost:3000'
  basePath: '', // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    {
      name: '', // Tag name
      description: '' // Tag description
    }
    // { ... }
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {} // by default: empty object
}
const outputFile = './swagger-output.json'
const routes = [
  './src/routes/auth.route.ts',
  './src/routes/cart.route.ts',
  './src/routes/order.route.ts',
  './src/routes/product.route.ts',
  './src/routes/discount.route.ts',
  './src/routes/inventory.route.ts'
]

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)
