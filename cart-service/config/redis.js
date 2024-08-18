const redis = require('redis')
const redisClient = redis.createClient()

redisClient.on('error', (err) => {
    console.error('Redis error:', err)
})

redisClient.on('connect', () => {
    console.log('Connected to Redis - Cart Service')
})

module.exports = { redisClient }
