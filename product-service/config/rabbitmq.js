const amqp = require("amqplib")

let channel;

const connectMQ = async () => {
    try {
        const amqpServer = process.env.AMQP_SERVER
        const connection = await amqp.connect(amqpServer)
         channel = await connection.createChannel()
         channel.assertQueue("PRODUCT")
        console.log("RabbitMQ Connected")
    } catch (err){
        console.log("RabbitMQ error:", err)
        process.exit(0)
    }
}

const  getChannel = async () => {
    if (!channel) {
        await connectMQ()
    }
    return channel
}

module.exports = {connectMQ, getChannel}