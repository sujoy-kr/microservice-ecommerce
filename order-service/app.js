const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const env = require('dotenv')
const { redisClient } = require('./config/redis')
const { connectMQ } = require('./config/rabbitMQ')

connectMQ()

// routes
const orderRoutes = require('./routes/orderRoutes')

redisClient.connect()

env.config()

const app = express()
const port = process.env.PORT || 5000

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(morgan('dev'))

app.use('/api/order', orderRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Page Not Found' })
})

app.listen(port, () => {
    console.log(`Order Service running on port ${port}`)
})
