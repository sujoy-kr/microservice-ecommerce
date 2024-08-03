const amqp = require('amqplib')
const { createOrder } = require('../controllers/orderController')

const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel()
        await channel.assertQueue('ORDER')
        console.log('RabbitMQ Connected - Order Service')

        await channel.consume('ORDER', async (data) => {
            console.log('Consuming ORDER')
            const result = await createOrder(data)
            channel.sendToQueue(
                'PRODUCT',
                Buffer.from(JSON.stringify({ result }))
            )
            channel.ack(data)
        })
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(0)
    }
}

module.exports = { connectMQ }
