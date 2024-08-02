const {getChannel} = require("../config/rabbitmq")

const placeOrder = async (userId, productId, quantity) => {
    const channel = await getChannel()
    channel.sendToQueue(
        'ORDER',
        Buffer.from(
            JSON.stringify({
                userId, productId, quantity
            })
        )
    )

    console.log("Order Placed")
}

module.exports = {placeOrder}