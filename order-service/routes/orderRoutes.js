const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { getAllOrders, updateOrder } = require('../controllers/orderController')

router.get('/', auth.required, getAllOrders)
router.put('/:id', auth.required, updateOrder)

module.exports = router
