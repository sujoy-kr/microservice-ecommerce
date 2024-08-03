const prisma = require('../config/db')

const createOrder = async (data) => {
    try {
        const { userId, productId, quantity } = JSON.parse(data.content)
        const order = await prisma.order.create({
            data: {
                userId,
                productId,
                quantity,
            },
        })

        console.log('new order:', order)
        return { message: 'New Order Placed' }
    } catch (err) {
        console.log(err)
        return { message: 'RabbitMQ Order Service Error' }
    }
}

module.exports = { createOrder }
