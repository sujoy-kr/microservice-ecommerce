const amqp = require('amqplib')

const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel()
        await channel.assertQueue('NOTIFY')
        console.log('RabbitMQ Connected - Notification Service')

        await channel.consume('NOTIFY', async (data) => {
            console.log('Consuming orders to NOTIFY')

            const message = JSON.parse(data.content.toString())
            console.log(message)
            channel.ack(data)
        })
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(1)
    }
}

module.exports = { connectMQ }
