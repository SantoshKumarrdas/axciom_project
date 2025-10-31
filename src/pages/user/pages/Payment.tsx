import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth'
import { useDataStore } from '../../../store/data'
import { pushToast } from '../../../components/feedback/Toaster'

export default function Payment() {
    const { user } = useAuthStore()
    const { cart, products, clearCart, placeOrder } = useDataStore()
    const navigate = useNavigate()
    const total = cart.reduce((sum, it) => sum + (products.find(p => p.id === it.productId)?.price ?? 0) * it.qty, 0)

    const pay = () => {
        if (!user) return
        const order = placeOrder(user.id)
        clearCart()
        pushToast({ title: `Order ${order.id.slice(0, 8)} placed`, type: 'success' })
        navigate('/user/orders')
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment</h2>
            <div className="rounded border p-4">
                <div className="mb-2">Total Amount</div>
                <div className="text-3xl font-bold mb-4">${total.toFixed(2)}</div>
                <div className="flex gap-2">
                    <button className="bg-brand text-white rounded px-4 py-2" onClick={pay}>Pay</button>
                    <button className="border rounded px-4 py-2" onClick={() => navigate('/user/cart')}>Cancel</button>
                </div>
            </div>
        </div>
    )
}


