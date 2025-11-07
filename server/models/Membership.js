import mongoose from 'mongoose'

const membershipSchema = new mongoose.Schema({
    vendorId: { type: String, required: true },
    level: { type: String, enum: ['Basic', 'Pro', 'Enterprise'], required: true },
    expiresAt: { type: Date, required: true }
}, {
    timestamps: true
})

export const Membership = mongoose.model('Membership', membershipSchema)

