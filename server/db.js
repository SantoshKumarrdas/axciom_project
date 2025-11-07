import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/axciom'

export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('MongoDB connection error:', error)
        process.exit(1)
    }
}

export async function seedData() {
    const { User } = await import('./models/User.js')
    const { Vendor } = await import('./models/Vendor.js')
    const { Item } = await import('./models/Item.js')
    const bcrypt = await import('bcryptjs')
    
    // Check if data already exists
    const userCount = await User.countDocuments()
    const vendorCount = await Vendor.countDocuments()
    const itemCount = await Item.countDocuments()
    
    if (userCount === 0) {
        const hashedUser = await bcrypt.default.hash('user', 10)
        const hashedAdmin = await bcrypt.default.hash('admin', 10)
        await User.create([
            { email: 'user@example.com', name: 'User', role: 'USER', password: hashedUser },
            { email: 'admin@example.com', name: 'Admin', role: 'ADMIN', password: hashedAdmin }
        ])
        console.log('Seeded users')
    }
    
    if (vendorCount === 0) {
        const hashedVendor = await bcrypt.default.hash('vendor', 10)
        const hashedVendor2 = await bcrypt.default.hash('vendor2', 10)
        const vendors = await Vendor.create([
            { email: 'vendor@example.com', name: 'Vendor One', role: 'VENDOR', password: hashedVendor },
            { email: 'vendor2@example.com', name: 'Vendor Two', role: 'VENDOR', password: hashedVendor2 }
        ])
        
        if (itemCount === 0 && vendors.length >= 2) {
            await Item.create([
                { name: 'Sample Widget', price: 19.99, status: 'AVAILABLE', vendorId: vendors[0]._id.toString() },
                { name: 'Gadget Pro', price: 49.99, status: 'AVAILABLE', vendorId: vendors[1]._id.toString() }
            ])
            console.log('Seeded items')
        }
        console.log('Seeded vendors')
    }
}

