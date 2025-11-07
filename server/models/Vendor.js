import mongoose from 'mongoose'

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['VENDOR'], required: true, default: 'VENDOR' }
}, {
    timestamps: true,
    toJSON: { transform: (doc, ret) => { delete ret.password; return ret } }
})

export const Vendor = mongoose.model('Vendor', vendorSchema)

