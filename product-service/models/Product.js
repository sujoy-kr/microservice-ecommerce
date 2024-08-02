const mongoose = require('mongoose')
const removeFile = require("../util/removeFile")


const productSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String
        },
        stock: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

productSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id ,delete ret.stock, delete ret.updatedAt}
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product