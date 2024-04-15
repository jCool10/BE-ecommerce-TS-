import redis from 'redis'
import { promisify } from 'util'
import { reservationInventory } from '~/databases/repositories/inventory.repo'

const redisClient = redis.createClient()

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setNXAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId: any, quantity: any, cartId: any) => {
  const key = `lock_v2023_${productId}`

  const retryTimes = 10
  const expireTime = 3000

  for (let i = 0; i < retryTimes; i++) {
    const result = await setNXAsync(key, expireTime)
    console.log(`result::`, result)

    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({ productId, quantity, cartId })

      if (isReservation.modifiedCount) {
        await pExpire(key, expireTime)
        return key
      }

      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock: any) => {
  const delAsync = promisify(redisClient.del).bind(redisClient)

  return await delAsync(keyLock)
}

export { acquireLock, releaseLock }
