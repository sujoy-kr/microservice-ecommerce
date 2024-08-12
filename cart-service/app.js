const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const env = require('dotenv')
const { redisClient } = require('./config/redis')
env.config()

// routes
const cartRoutes = require('./routes/cartRoutes')

const app = express()

redisClient.connect()
const port = process.env.PORT || 7000

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(morgan('dev'))

app.use('/api/cart', cartRoutes)

app.use((req, res) => {
    res.status(404).json({ message: 'Page Not Found' })
})

app.listen(port, () => {
    console.log(`Cart Service running on port ${port}`)
})
