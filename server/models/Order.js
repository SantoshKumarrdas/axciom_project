import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED', 'SHIPPED'], required: true, default: 'PENDING' }
}, {
    timestamps: true
})

export const Order = mongoose.model('Order', orderSchema)

