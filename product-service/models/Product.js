const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
        },
        stock: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            required: true,
        },
        times_ordered: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id,
            delete ret.stock,
            delete ret.updatedAt,
            delete order_count
    },
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
