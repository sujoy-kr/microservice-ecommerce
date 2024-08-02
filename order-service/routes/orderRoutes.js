const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const {
    register,
    login,
    profile,
    deleteUser,
} = require('../controllers/orderController')

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth.required, profile)
router.delete('/delete', auth.required, deleteUser)

module.exports = router
