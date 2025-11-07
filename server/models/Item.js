import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['AVAILABLE', 'REQUESTED', 'OUT_OF_STOCK'], required: true, default: 'AVAILABLE' },
    vendorId: { type: String, required: true }
}, {
    timestamps: true
})

export const Item = mongoose.model('Item', itemSchema)

