const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    addCart,
    getCart,
    removeCart,
} = require('../controllers/cartController')

router.get('/', auth.required, getCart)
router.post('/', auth.required, addCart)
router.delete('/', auth.required, removeCart)

module.exports = router
