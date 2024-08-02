const Product = require("../models/Product")
const removeFile = require("../util/removeFile")

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

const getSingleProduct = async (req, res) => {
    try {
        let {id} = req.params

        if(!id) {
            return res.status(404).json({message: "No ID Found"})
        }

        const product = await Product.findById(id)

        if(!product){
            return res.status(404).json({message: "No Product Found"})
        }

        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

const uploadProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock} = req.body;

        if (!(req.file && name && price)) {
            removeFile(req.file)
            return res.status(400).json({message: "Credentials Missing"})
        }
        const user = req.data
        const role = user.role

        const fileUrl = req.file.path

        // if (role !== "admin") {
        //     removeFile(req.file)
        //     return res.status(403).json({message: "No Member Can Upload Products"})
        // }

        const product = await new Product({
            name,
            description,
            price: parseInt(price, 10),
            category,
            stock: parseInt(stock, 10),
            image: fileUrl
        })

        await product.save()

        if (product) {
            res.status(201).json({message: "Product Uploaded"})
        }

    } catch (err) {
        removeFile(req.file)
        res.status(500).json({message: err.message})
    }
}

const deleteProduct = async (req, res) => {
    try {
        let {id} = req.params

        if(!id) {
            return res.status(404).json({message: "No ID Found"})
        }

        const productToDelete = await Product.findById(id)

        if(!productToDelete){
            return res.status(404).json({message: "No Product Found"})
        }

        removeFile(productToDelete.image);

         await Product.findByIdAndDelete(id);

        res.status(200).json({message: "Successfully Deleted"})
    } catch (err) {
        console.log(err)
        res.status(400).json({message: "Unexpected Server Error"})
    }
}

const orderProduct = async (req, res) => {

}

module.exports = {
    getAllProducts,
    getSingleProduct,
    uploadProduct,
    orderProduct,
    deleteProduct
}