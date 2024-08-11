const esClient = require('../config/elasticsearch')
const Product = require('../models/Product')

// Check if the index exists, if not, create and index all products
const indexAllIfNotExist = async () => {
    try {
        const exists = await esClient.indices.exists({ index: 'products' })

        if (!exists.body) {
            console.log('Index not found. Indexing all products...')
            await indexAllProducts()
        }
    } catch (error) {
        console.error('Error checking or creating index:', error)
    }
}

// Index a single product
const indexSingleProduct = async (product) => {
    try {
        await esClient.index({
            index: 'products', // Consistent index name
            id: product._id.toString(),
            body: {
                name: product.name,
                description: product.description,
                category: product.category,
            },
        })

        console.log('Indexed single product:', product._id)
    } catch (error) {
        console.error('Error indexing single product:', error)
    }
}

// Delete a single product from the index
const deleteSingleProduct = async (id) => {
    try {
        await esClient.delete({
            index: 'products', // Consistent index name
            id: id.toString(),
        })

        console.log('Deleted product:', id)
    } catch (error) {
        console.error('Error deleting product:', error)
    }
}

// Search for products by keyword
const searchProducts = async (keyword) => {
    try {
        const result = await esClient.search({
            index: 'products', // Consistent index name
            body: {
                query: {
                    multi_match: {
                        query: keyword,
                        fields: ['name', 'description', 'category'],
                    },
                },
            },
        })

        return result.hits.hits.map((hit) => hit._source)
    } catch (error) {
        console.error('Error searching products:', error)
    }
}

// Index all products
const indexAllProducts = async () => {
    try {
        const products = await Product.find()
        for (const product of products) {
            await indexSingleProduct(product)
        }
        console.log('Indexed all products')
    } catch (error) {
        console.error('Error indexing all products:', error)
    }
}

module.exports = {
    indexAllIfNotExist,
    indexSingleProduct,
    deleteSingleProduct,
    searchProducts,
    indexAllProducts,
}
