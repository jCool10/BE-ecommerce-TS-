export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'eCommerce Restfull API',
      version: '1.0.0',
      description: 'Web eCommerce restfull api'
    },
    servers: [
      {
        url: 'http://localhost:5000/'
      }
    ],
    components: {
      schemas: {
        // Define your models here
        Product: {
          type: 'object',
          required: [
            'product_name',
            'product_thumb',
            'product_price',
            'product_quality',
            'product_type',
            'product_attributes'
          ],
          properties: {
            product_name: {
              type: 'string',
              description: 'The name of the product'
            },
            product_thumb: {
              type: 'string',
              description: 'The thumb of the product'
            },
            product_price: {
              type: 'integer',
              description: 'The price of the product'
            },
            product_quality: {
              type: 'integer',
              description: 'The quality of the product'
            },
            product_type: {
              type: 'string',
              description: 'The type of the product'
            },
            product_attributes: {
              type: 'Array',
              description: 'The attributes of the product'
            }
          },
          example: {
            product_name: 'Quấn áo Nam siêu mát giày',
            product_description: 'Quần áo Nam gray',
            product_price: 12345.0,
            product_type: 'Clothing',
            product_thumb: 'https://tiger01042023.s5.ap-southeast-1.amazonaws.com/PNG+image.png',
            product_quality: 23,
            product_attributes: {
              brand: 'TTF',
              size: 'XL',
              material: 'Thun'
            }
          }
        },
        RequestRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the shop'
            },
            email: {
              type: 'string',
              description: 'The email of the shop'
            },
            password: {
              type: 'string',
              description: 'The password of the shop'
            }
          },
          example: {
            name: 'Hoang Ngoc Loc',
            email: 'hngloc10@gmail.com',
            password: '123123a@'
          }
        },
        RequestLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              description: 'The email of the shop'
            },
            password: {
              type: 'string',
              description: 'The password of the shop'
            }
          },
          example: {
            email: 'hngloc10@gmail.com',
            password: '123123a@'
          }
        }
        // other schemas...
      },
      responses: {
        400: {
          description: 'Bad request',
          contents: 'application/json'
        },
        401: {
          description: 'Unauthorized',
          contents: 'application/json'
        },
        403: {
          description: 'Forbidden',
          contents: 'application/json'
        },
        404: {
          description: 'Not found',
          contents: 'application/json'
        },
        500: {
          description: 'Server error',
          contents: 'application/json'
        },
        200: {
          description: 'Success',
          contents: 'application/json'
        },
        201: {
          description: 'Created',
          contents: 'application/json'
        }

        // other responses...
      }
    }
  },
  // other options...
  apis: ['./src/routes/*.ts']
}
