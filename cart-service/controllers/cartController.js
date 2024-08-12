const { redisClient } = require('../config/redis')

const REDIS_EXP = 3600

const addCart = async (req, res) => {
    try {
        if (!req.data.userId) {
            return res.status(400).json({ message: 'Not a Valid Token' })
        }
        const userId = req.data.userId.toString()

        const productId = req.body.productId
        const quantity = req.body.quantity

        if (!productId || !quantity) {
            return res.status(400).json({
                message: 'Product ID or Quantity Missing',
            })
        }

        const savedUser = await redisClient.get(userId)

        let userCart = savedUser ? JSON.parse(savedUser) : {}

        if (parseInt(quantity) > 0) {
            userCart[productId] = quantity
        } else {
            delete userCart[productId]
        }

        if (Object.keys(userCart).length > 0) {
            await redisClient.setEx(userId, REDIS_EXP, JSON.stringify(userCart)) // exp time 1h in secs
        } else {
            await redisClient.del(userId)
        }

        res.status(200).json(userCart)
    } catch (err) {
        console.log(err)

        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

const getCart = async (req, res) => {
    try {
        if (!req.data.userId) {
            return res.status(400).json({ message: 'Not a Valid Token' })
        }
        const userId = req.data.userId.toString()

        const savedUser = await redisClient.get(userId)

        let userCart = savedUser ? JSON.parse(savedUser) : {}
        res.status(200).json(userCart)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

const removeCart = async (req, res) => {
    try {
        if (!req.data.userId) {
            return res.status(400).json({ message: 'Not a Valid Token' })
        }
        const userId = req.data.userId.toString()

        const productId = req.body.productId

        if (!productId) {
            return res.status(400).json({
                message: 'Product ID Missing',
            })
        }

        const savedUser = await redisClient.get(userId)

        let userCart = savedUser ? JSON.parse(savedUser) : {}

        if (userCart[productId]) {
            delete userCart[productId]

            if (Object.keys(userCart).length > 0) {
                await redisClient.setEx(
                    userId,
                    REDIS_EXP,
                    JSON.stringify(userCart)
                ) // exp time 1h in secs
            } else {
                await redisClient.del(userId)
            }
        }

        res.status(200).json(userCart)
    } catch (err) {
        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

module.exports = { addCart, getCart, removeCart }
