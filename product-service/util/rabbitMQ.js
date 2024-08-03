const { getChannel } = require('../config/rabbitMQ')

const placeOrder = async (userId, productId, quantity) => {
    const channel = await getChannel()
    channel.sendToQueue(
        'ORDER',
        Buffer.from(
            JSON.stringify({
                userId,
                productId,
                quantity,
            })
        )
    )
}

module.exports = { placeOrder }
