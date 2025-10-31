import { create } from 'zustand'

export interface Product {
    id: string
    name: string
    price: number
    status: 'AVAILABLE' | 'REQUESTED' | 'OUT_OF_STOCK'
    vendorId: string
}

export interface Membership {
    id: string
    vendorId: string
    level: 'Basic' | 'Pro' | 'Enterprise'
    expiresAt: string
}

export interface OrderItem { productId: string; qty: number }
export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    total: number
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'SHIPPED'
}

interface DataState {
    products: Product[]
    memberships: Membership[]
    vendorItems: Record<string, string[]>
    orders: Order[]
    cart: OrderItem[]

    // CRUD simulators
    addProduct: (p: Omit<Product, 'id'>) => Product
    updateProduct: (id: string, patch: Partial<Product>) => void
    deleteProduct: (id: string) => void

    requestProduct: (id: string) => void

    addToCart: (productId: string, qty?: number) => void
    updateCart: (productId: string, qty: number) => void
    removeFromCart: (productId: string) => void
    clearCart: () => void

    placeOrder: (userId: string) => Order

    addMembership: (m: Omit<Membership, 'id'>) => Membership
    updateMembership: (id: string, patch: Partial<Membership>) => void
    deleteMembership: (id: string) => void
}

const initialProducts: Product[] = [
    { id: crypto.randomUUID(), name: 'Sample Widget', price: 19.99, status: 'AVAILABLE', vendorId: 'v-1' },
    { id: crypto.randomUUID(), name: 'Gadget Pro', price: 49.99, status: 'AVAILABLE', vendorId: 'v-2' },
]

export const useDataStore = create<DataState>((set, get) => ({
    products: initialProducts,
    memberships: [],
    vendorItems: {},
    orders: [],
    cart: [],

    addProduct: (p) => {
        const product = { ...p, id: crypto.randomUUID() }
        set({ products: [product, ...get().products] })
        return product
    },
    updateProduct: (id, patch) => set({ products: get().products.map(x => x.id === id ? { ...x, ...patch } : x) }),
    deleteProduct: (id) => set({ products: get().products.filter(x => x.id !== id) }),

    requestProduct: (id) => set({ products: get().products.map(x => x.id === id ? { ...x, status: 'REQUESTED' } : x) }),

    addToCart: (productId, qty = 1) => {
        const exists = get().cart.find(i => i.productId === productId)
        if (exists) {
            set({ cart: get().cart.map(i => i.productId === productId ? { ...i, qty: i.qty + qty } : i) })
        } else {
            set({ cart: [...get().cart, { productId, qty }] })
        }
    },
    updateCart: (productId, qty) => set({ cart: get().cart.map(i => i.productId === productId ? { ...i, qty } : i) }),
    removeFromCart: (productId) => set({ cart: get().cart.filter(i => i.productId !== productId) }),
    clearCart: () => set({ cart: [] }),

    placeOrder: (userId) => {
        const items = get().cart
        const products = get().products
        const total = items.reduce((sum, it) => {
            const p = products.find(pr => pr.id === it.productId)
            return sum + (p ? p.price * it.qty : 0)
        }, 0)
        const order: Order = { id: crypto.randomUUID(), userId, items, total, status: 'PENDING' }
        set({ orders: [order, ...get().orders] })
        return order
    },

    addMembership: (m) => {
        const membership = { ...m, id: crypto.randomUUID() }
        set({ memberships: [membership, ...get().memberships] })
        return membership
    },
    updateMembership: (id, patch) => set({ memberships: get().memberships.map(x => x.id === id ? { ...x, ...patch } : x) }),
    deleteMembership: (id) => set({ memberships: get().memberships.filter(x => x.id !== id) }),
}))


