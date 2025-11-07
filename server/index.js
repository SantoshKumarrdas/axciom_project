import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB, seedData } from './db.js'
import { User } from './models/User.js'
import { Vendor } from './models/Vendor.js'
import { Item } from './models/Item.js'
import { Order } from './models/Order.js'
import { Membership } from './models/Membership.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const api = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

function signToken(user) {
    return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
}

function authRequired(req, res, next) {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Missing token' })
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        req.user = payload
        next()
    } catch {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

function roleRequired(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).end()
        if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
        next()
    }
}

// Auth
api.post('/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body || {}
        if (!email || !password || !role) return res.status(400).json({ message: 'email, password, role required' })

        const Model = role === 'VENDOR' ? Vendor : User
        const user = await Model.findOne({ email, role })
        if (!user) return res.status(401).json({ message: 'Invalid credentials' })

        const ok = bcrypt.compareSync(password, user.password)
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

        const token = signToken(user)
        return res.json({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {}
        if (!name || !email || !password || !role) return res.status(400).json({ message: 'name, email, password, role required' })

        const Model = role === 'VENDOR' ? Vendor : User
        const exists = await Model.findOne({ email })
        if (exists) return res.status(409).json({ message: 'Email already exists' })

        const hash = bcrypt.hashSync(password, 10)
        const record = await Model.create({ name, email, password: hash, role })
        const token = signToken(record)

        return res.status(201).json({
            token,
            user: {
                id: record._id.toString(),
                name,
                email,
                role
            }
        })
    } catch (error) {
        console.error('Signup error:', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

api.get('/auth/me', authRequired, (req, res) => {
    res.json({ user: req.user })
})

// Items
api.get('/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 })
        res.json(items.map(item => ({
            id: item._id.toString(),
            name: item.name,
            price: item.price,
            status: item.status,
            vendorId: item.vendorId
        })))
    } catch (error) {
        console.error('Get items error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/items', authRequired, roleRequired('VENDOR', 'ADMIN'), async (req, res) => {
    try {
        const item = await Item.create(req.body)
        res.status(201).json({
            id: item._id.toString(),
            name: item.name,
            price: item.price,
            status: item.status,
            vendorId: item.vendorId
        })
    } catch (error) {
        console.error('Create item error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.put('/items/:id', authRequired, roleRequired('VENDOR', 'ADMIN'), async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!item) return res.sendStatus(404)
        res.json({
            id: item._id.toString(),
            name: item.name,
            price: item.price,
            status: item.status,
            vendorId: item.vendorId
        })
    } catch (error) {
        console.error('Update item error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.delete('/items/:id', authRequired, roleRequired('VENDOR', 'ADMIN'), async (req, res) => {
    try {
        const result = await Item.findByIdAndDelete(req.params.id)
        return res.json({ deleted: result ? 1 : 0 })
    } catch (error) {
        console.error('Delete item error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Memberships
api.get('/memberships', async (req, res) => {
    try {
        const memberships = await Membership.find().sort({ createdAt: -1 })
        res.json(memberships.map(m => ({
            id: m._id.toString(),
            vendorId: m.vendorId,
            level: m.level,
            expiresAt: m.expiresAt
        })))
    } catch (error) {
        console.error('Get memberships error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/memberships', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        const m = await Membership.create(req.body)
        res.status(201).json({
            id: m._id.toString(),
            vendorId: m.vendorId,
            level: m.level,
            expiresAt: m.expiresAt
        })
    } catch (error) {
        console.error('Create membership error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.put('/memberships/:id', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        const m = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!m) return res.sendStatus(404)
        res.json({
            id: m._id.toString(),
            vendorId: m.vendorId,
            level: m.level,
            expiresAt: m.expiresAt
        })
    } catch (error) {
        console.error('Update membership error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.delete('/memberships/:id', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        const result = await Membership.findByIdAndDelete(req.params.id)
        return res.json({ deleted: result ? 1 : 0 })
    } catch (error) {
        console.error('Delete membership error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Users & Vendors (minimal)
api.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users.map(u => ({
            id: u._id.toString(),
            email: u.email,
            name: u.name,
            role: u.role
        })))
    } catch (error) {
        console.error('Get users error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/users', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        const hash = req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined
        const u = await User.create({ ...req.body, password: hash || 'temp' })
        res.status(201).json({
            id: u._id.toString(),
            email: u.email,
            name: u.name,
            role: u.role
        })
    } catch (error) {
        console.error('Create user error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.delete('/users/:id', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ ok: true })
    } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.get('/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find()
        res.json(vendors.map(v => ({
            id: v._id.toString(),
            email: v.email,
            name: v.name,
            role: v.role
        })))
    } catch (error) {
        console.error('Get vendors error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/vendors', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        const hash = req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined
        const v = await Vendor.create({ ...req.body, password: hash || 'temp' })
        res.status(201).json({
            id: v._id.toString(),
            email: v.email,
            name: v.name,
            role: v.role
        })
    } catch (error) {
        console.error('Create vendor error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.delete('/vendors/:id', authRequired, roleRequired('ADMIN'), async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id)
        res.json({ ok: true })
    } catch (error) {
        console.error('Delete vendor error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

// Orders
api.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        res.json(orders.map(o => ({
            id: o._id.toString(),
            userId: o.userId,
            items: o.items,
            total: o.total,
            status: o.status
        })))
    } catch (error) {
        console.error('Get orders error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.post('/orders', authRequired, roleRequired('USER'), async (req, res) => {
    try {
        const order = await Order.create({ status: 'PENDING', ...req.body })
        res.status(201).json({
            id: order._id.toString(),
            userId: order.userId,
            items: order.items,
            total: order.total,
            status: order.status
        })
    } catch (error) {
        console.error('Create order error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

api.put('/orders/:id', authRequired, roleRequired('ADMIN', 'VENDOR'), async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!order) return res.sendStatus(404)
        res.json({
            id: order._id.toString(),
            userId: order.userId,
            items: order.items,
            total: order.total,
            status: order.status
        })
    } catch (error) {
        console.error('Update order error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

app.use('/api', api)

app.get('/', (_, res) => res.send('Axciom API running with MongoDB'))

// Connect to MongoDB and start server
connectDB().then(() => {
    seedData().then(() => {
        app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`))
    })
})
