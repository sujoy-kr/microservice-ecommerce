const { getChannel } = require('../config/rabbitMQ')

const placeOrder = async (userId, productName, productId, quantity) => {
    const channel = await getChannel()
    channel.sendToQueue(
        'ORDER',
        Buffer.from(
            JSON.stringify({
                userId,
                productName,
                productId,
                quantity,
            })
        )
    )
}

module.exports = { placeOrder }
