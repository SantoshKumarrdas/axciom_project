import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['USER', 'ADMIN'], required: true, default: 'USER' }
}, {
    timestamps: true,
    toJSON: { transform: (doc, ret) => { delete ret.password; return ret } }
})

export const User = mongoose.model('User', userSchema)

