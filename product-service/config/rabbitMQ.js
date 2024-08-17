const amqp = require('amqplib')
const Product = require('../models/Product')

let channel

const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
        channel = await connection.createChannel()
        channel.assertQueue('PRODUCT')
        console.log('RabbitMQ Connected - Product Service')

        channel.consume('PRODUCT', async (data) => {
            console.log('Consuming order results')
            console.log(JSON.parse(data.content.toString()))
            const response = JSON.parse(data.content.toString())

            if (response.message === 'New Order Placed') {
                let product = await Product.findById(response.productId)
                if (product) {
                    product.times_ordered += 1
                    product.save()
                    console.log('product updated')
                }
            }

            channel.ack(data)
        })
    } catch (err) {
        console.log('RabbitMQ error:', err)
        process.exit(1)
    }
}

const getChannel = async () => {
    if (!channel) {
        await connectMQ()
    }
    return channel
}

module.exports = { connectMQ, getChannel }
