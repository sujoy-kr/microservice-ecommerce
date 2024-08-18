const Product = require('../models/Product')
const removeFile = require('../util/removeFile')
const { placeOrder } = require('../util/rabbitMQ')

const {
    indexAllIfNotExist,
    indexSingleProduct,
    deleteSingleProduct,
    searchProducts,
} = require('../util/elasticsearch')

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        let { id } = req.params

        if (!id) {
            return res.status(404).json({ message: 'No ID Found' })
        }

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'No Product Found' })
        }

        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const uploadProduct = async (req, res) => {
    try {
        console.log('req.data', req.data)

        const { name, description, price, category, stock } = req.body

        if (!(req.file && name && price)) {
            removeFile(req.file)
            return res.status(400).json({ message: 'Credentials Missing' })
        }

        const user = req.data
        const role = user.role

        const fileUrl = req.file.path

        if (role !== 'admin') {
            removeFile(req.file)
            return res
                .status(403)
                .json({ message: 'No Member Can Upload Products' })
        }

        const product = await new Product({
            name,
            description,
            price: parseInt(price, 10),
            category,
            stock: parseInt(stock, 10),
            image: fileUrl,
        })

        try {
            await product.save()

            // If product is successfully saved, index it
            await indexSingleProduct(product)
            res.status(201).json({ message: 'Product Uploaded' })
        } catch (saveErr) {
            // If saving fails, remove the file and return an error
            removeFile(req.file)
            throw new Error('Error saving product: ' + saveErr.message)
        }
    } catch (err) {
        removeFile(req.file)
        res.status(500).json({ message: err.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params

        if (!id) {
            return res.status(404).json({ message: 'No ID Found' })
        }

        const productToDelete = await Product.findById(id)

        if (!productToDelete) {
            return res.status(404).json({ message: 'No Product Found' })
        }

        removeFile(productToDelete.image)

        await Product.findByIdAndDelete(id)
        await deleteSingleProduct(id)

        res.status(200).json({ message: 'Successfully Deleted' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

const orderProduct = async (req, res) => {
    try {
        const { id } = req.params

        const userId = parseInt(req.data.userId, 10)

        let quantity = 1
        if (req.body && req.body.quantity) {
            quantity = parseInt(req.body.quantity, 10)
        }

        if (!id || !userId) {
            return res.status(404).json({ message: 'No ID Found' })
        }

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'No Product Found' })
        }

        if (product.stock <= 0 || product.stock < quantity) {
            return res.status(404).json({
                message: 'Product Out Of Stock or less than Required Quantity',
            })
        }

        await placeOrder(userId, product.name, id, quantity)

        res.status(200).json({ message: 'Order Placed' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

const getSearchResults = async (req, res) => {
    try {
        const keyword = req.params.keyword

        await indexAllIfNotExist()
        const products = await searchProducts(keyword)
        res.status(200).json({ products })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Unexpected Server Error' })
    }
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    uploadProduct,
    deleteProduct,
    orderProduct,
    getSearchResults,
}
