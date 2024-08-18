const prisma = require('../config/db')
const { redisClient } = require('../config/redis')
const { notifyUser } = require('../util/rabbitMQ')

const getAllOrders = async (req, res) => {
    try {
        console.log('req.data', req.data)

        const user = req.data
        const role = user.role

        const SSEinterval = 5000 // ms

        if (role !== 'admin') {
            return res
                .status(403)
                .json({ message: 'No Member Can Upload Products' })
        }

        let pendingOrders = await redisClient.get('pendingOrders')

        if (!pendingOrders) {
            pendingOrders = await prisma.order.findMany({
                where: {
                    status: 'Pending',
                },
            })
            console.log('not found in redis')

            await redisClient.set(
                'pendingOrders',
                JSON.stringify(pendingOrders)
            )
        } else {
            console.log('found in redis')
            pendingOrders = JSON.parse(pendingOrders)
        }

        // Server-Sent Events (SSE) headers
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        // Function to send data to the client
        const sendEvent = async () => {
            try {
                let latestPendingOrders = await redisClient.get('pendingOrders')
                latestPendingOrders = JSON.parse(latestPendingOrders)
                res.write(
                    `data: ${JSON.stringify({ latestPendingOrders })}\n\n`
                )
            } catch (err) {
                console.log(err)
                res.write(
                    `data: ${JSON.stringify({
                        error: 'Error retrieving orders',
                    })}\n\n`
                )
                clearInterval(intervalId)
                console.log('SSE Connection Closed')
            }
        }

        // Send the initial orders data
        sendEvent()

        // Send a new message every 5 seconds with the current time (or other data)
        const intervalId = setInterval(() => {
            sendEvent()
        }, SSEinterval)

        // Handle client disconnect
        req.on('close', () => {
            clearInterval(intervalId)
            console.log('SSE Connection Closed')
            res.end()
        })

        // res.status(201).json({ orders })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

const updateOrder = async (req, res) => {
    try {
        console.log('req.data', req.data)

        const user = req.data
        const role = user.role

        if (role !== 'admin') {
            return res
                .status(403)
                .json({ message: 'No Member Can Upload Products' })
        }

        const id = req.params.id

        if (!id) {
            return res.status(404).json({ message: 'ID Missing' })
        }

        const status = req.body.status

        if (!status) {
            return res.status(404).json({ message: 'Order Status Missing' })
        }

        const order = await prisma.order.update({
            where: {
                id: parseInt(id),
            },
            data: {
                status,
            },
        })

        if (!order) {
            return res.status(404).json({ message: 'error' })
        }

        notifyUser(
            order.userId,
            `Your order has been ${status}. Thank you for shopping with us!`
        )

        res.status(201).json({ order })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getAllOrders, updateOrder }
