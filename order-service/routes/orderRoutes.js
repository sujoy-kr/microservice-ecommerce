const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    createOrder
} = require('../controllers/orderController')



module.exports = router
