const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { multerMiddleware } = require('../middlewares/multer')
const {
    getAllProducts,
    uploadProduct,
    getSingleProduct,
    orderProduct,
    deleteProduct,
    getSearchResults,
} = require('../controllers/productController')

router.get('/', auth.required, getAllProducts)
router.post('/', auth.required, multerMiddleware, uploadProduct)
router.get('/:id', auth.required, getSingleProduct)
router.delete('/:id', auth.required, deleteProduct)
router.post('/:id/order', auth.required, orderProduct)
router.get('/search/:keyword', auth.required, getSearchResults)

module.exports = router
