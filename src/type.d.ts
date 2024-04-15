declare namespace Express {
  interface Request {
    keyStore: any
    user: any
    refreshToken: any
    objKey: any

    // apikey: {
    //   key: string
    //   status: boolean
    //   permissions: Array<string>
    // }
    // keyStore: object
    // user: {
    //   userId: string
    // }
    // refreshToken: string | string[]
  }

  interface Response {
    io: any
  }
}
