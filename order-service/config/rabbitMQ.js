const amqp = require('amqplib')
const { createOrder } = require('../controllers/orderController')

let channel
const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
        channel = await connection.createChannel()
        await channel.assertQueue('ORDER')
        console.log('RabbitMQ Connected - Order Service')

        await channel.consume('ORDER', async (data) => {
            console.log('Consuming ORDER')

            const result = await createOrder(data)
            const productName = JSON.parse(data.content).productName

            channel.sendToQueue(
                'PRODUCT',
                Buffer.from(
                    JSON.stringify({
                        message: 'New Order Placed',
                        productId: result.productId,
                    })
                )
            )

            channel.sendToQueue(
                'NOTIFY',
                Buffer.from(
                    JSON.stringify({
                        userId: result.userId,
                        messageToSend: `Your order of ${result.quantity} ${productName} has been placed successfully. Thank you for shopping with us!`,
                    })
                )
            )

            channel.ack(data)
        })
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(1)
    }
}

module.exports = { connectMQ }
