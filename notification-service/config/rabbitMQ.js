const amqp = require('amqplib')
const { sendEmail } = require('../util/mailService')

const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel()
        await channel.assertQueue('NOTIFY')
        await channel.assertQueue('USERINFO')
        console.log('RabbitMQ Connected - Notification Service')

        await channel.consume('NOTIFY', async (data) => {
            console.log('Consuming orders to NOTIFY')

            const message = JSON.parse(data.content.toString())
            console.log(message)

            channel.sendToQueue(
                'USER',
                Buffer.from(
                    JSON.stringify({
                        userId: message.userId,
                    })
                )
            )

            await channel.consume('USERINFO', async (userinfo) => {
                console.log('Consuming user info')

                const returnedData = JSON.parse(userinfo.content.toString())
                console.log(returnedData)

                if (message.userId === returnedData.id) {
                    const messageToSend =
                        `Hello ${returnedData.name},\n` + message.messageToSend

                    await sendEmail(returnedData.email, messageToSend)
                }

                channel.ack(userinfo)
            })

            channel.ack(data)
        })
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(1)
    }
}

module.exports = { connectMQ }
