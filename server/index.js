import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// In-memory DB
const db = {
    items: [
        { id: 'i1', name: 'Sample Widget', price: 19.99, status: 'AVAILABLE', vendorId: 'v-1' },
        { id: 'i2', name: 'Gadget Pro', price: 49.99, status: 'AVAILABLE', vendorId: 'v-2' },
    ],
    memberships: [],
    users: [
        // Note: passwords will be hashed at startup
        { id: 'u-1', email: 'user@example.com', name: 'User', role: 'USER', password: 'user' },
        { id: 'a-1', email: 'admin@example.com', name: 'Admin', role: 'ADMIN', password: 'admin' },
    ],
    vendors: [
        { id: 'v-1', name: 'Vendor One', role: 'VENDOR', email: 'vendor@example.com', password: 'vendor' },
        { id: 'v-2', name: 'Vendor Two', role: 'VENDOR', email: 'vendor2@example.com', password: 'vendor2' }
    ],
    orders: [],
}

const api = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

// Hash seeded passwords at startup (demo only)
for (const u of db.users) { if (!u.password?.startsWith('$2a$')) u.password = bcrypt.hashSync(u.password, 10) }
for (const v of db.vendors) { if (!v.password?.startsWith('$2a$')) v.password = bcrypt.hashSync(v.password, 10) }

function signToken(user) {
    return jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '2h' })
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
api.post('/auth/login', (req, res) => {
    const { email, password, role } = req.body || {}
    if (!email || !password || !role) return res.status(400).json({ message: 'email, password, role required' })
    const pool = role === 'VENDOR' ? db.vendors : db.users
    const user = pool.find(u => u.email === email && u.role === role)
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = bcrypt.compareSync(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})
api.post('/auth/signup', (req, res) => {
    const { name, email, password, role } = req.body || {}
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'name, email, password, role required' })
    const pool = role === 'VENDOR' ? db.vendors : db.users
    if (pool.some(u => u.email === email)) return res.status(409).json({ message: 'Email already exists' })
    const id = crypto.randomUUID()
    const hash = bcrypt.hashSync(password, 10)
    const record = { id, name, email, password: hash, role }
    pool.unshift(record)
    const token = signToken(record)
    return res.status(201).json({ token, user: { id, name, email, role } })
})
api.get('/auth/me', authRequired, (req, res) => {
    res.json({ user: req.user })
})

// Items
api.get('/items', (req, res) => res.json(db.items))
api.post('/items', authRequired, roleRequired('VENDOR', 'ADMIN'), (req, res) => {
    const item = { id: crypto.randomUUID(), ...req.body }
    db.items.unshift(item)
    res.status(201).json(item)
})
api.put('/items/:id', authRequired, roleRequired('VENDOR', 'ADMIN'), (req, res) => {
    const idx = db.items.findIndex(i => i.id === req.params.id)
    if (idx === -1) return res.sendStatus(404)
    db.items[idx] = { ...db.items[idx], ...req.body }
    res.json(db.items[idx])
})
api.delete('/items/:id', authRequired, roleRequired('VENDOR', 'ADMIN'), (req, res) => {
    const before = db.items.length
    db.items = db.items.filter(i => i.id !== req.params.id)
    return res.json({ deleted: before - db.items.length })
})

// Memberships
api.get('/memberships', (req, res) => res.json(db.memberships))
api.post('/memberships', authRequired, roleRequired('ADMIN'), (req, res) => {
    const m = { id: crypto.randomUUID(), ...req.body }
    db.memberships.unshift(m)
    res.status(201).json(m)
})
api.put('/memberships/:id', authRequired, roleRequired('ADMIN'), (req, res) => {
    const idx = db.memberships.findIndex(m => m.id === req.params.id)
    if (idx === -1) return res.sendStatus(404)
    db.memberships[idx] = { ...db.memberships[idx], ...req.body }
    res.json(db.memberships[idx])
})
api.delete('/memberships/:id', authRequired, roleRequired('ADMIN'), (req, res) => {
    const before = db.memberships.length
    db.memberships = db.memberships.filter(m => m.id !== req.params.id)
    return res.json({ deleted: before - db.memberships.length })
})

// Users & Vendors (minimal)
api.get('/users', (req, res) => res.json(db.users))
api.post('/users', authRequired, roleRequired('ADMIN'), (req, res) => { const u = { id: crypto.randomUUID(), ...req.body }; db.users.unshift(u); res.status(201).json(u) })
api.delete('/users/:id', authRequired, roleRequired('ADMIN'), (req, res) => { db.users = db.users.filter(u => u.id !== req.params.id); res.json({ ok: true }) })

api.get('/vendors', (req, res) => res.json(db.vendors))
api.post('/vendors', authRequired, roleRequired('ADMIN'), (req, res) => { const v = { id: crypto.randomUUID(), ...req.body }; db.vendors.unshift(v); res.status(201).json(v) })
api.delete('/vendors/:id', authRequired, roleRequired('ADMIN'), (req, res) => { db.vendors = db.vendors.filter(v => v.id !== req.params.id); res.json({ ok: true }) })

// Orders
api.get('/orders', (req, res) => res.json(db.orders))
api.post('/orders', authRequired, roleRequired('USER'), (req, res) => {
    const order = { id: crypto.randomUUID(), status: 'PENDING', ...req.body }
    db.orders.unshift(order)
    res.status(201).json(order)
})
api.put('/orders/:id', authRequired, roleRequired('ADMIN', 'VENDOR'), (req, res) => {
    const idx = db.orders.findIndex(o => o.id === req.params.id)
    if (idx === -1) return res.sendStatus(404)
    db.orders[idx] = { ...db.orders[idx], ...req.body }
    res.json(db.orders[idx])
})

app.use('/api', api)

app.get('/', (_, res) => res.send('Axciom mock API running'))

app.listen(PORT, () => console.log(`Mock API on http://localhost:${PORT}`))


