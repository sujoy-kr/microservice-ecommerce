const { getChannel } = require('../config/rabbitMQ')

const notifyUser = async (userId, messageToSend) => {
    try {
        const channel = await getChannel()
        channel.sendToQueue(
            'NOTIFY',
            Buffer.from(
                JSON.stringify({
                    userId,
                    messageToSend,
                })
            )
        )
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(1)
    }
}

module.exports = { notifyUser }
