import { useAuthStore } from '../../../store/auth'
import { useDataStore } from '../../../store/data'

export default function Cart() {
    const { cart, updateCart, removeFromCart, products } = useDataStore()
    const total = cart.reduce((sum, it) => sum + (products.find(p => p.id === it.productId)?.price ?? 0) * it.qty, 0)
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cart</h2>
            <ul className="space-y-2">
                {cart.map(item => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null
                    return (
                        <li key={item.productId} className="border rounded p-2 flex justify-between items-center">
                            <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-slate-500">${product.price.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" className="w-20 border rounded px-2 py-1" value={item.qty} onChange={e => updateCart(item.productId, Number(e.target.value))} />
                                <button className="text-red-600 underline" onClick={() => removeFromCart(item.productId)}>Delete</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="text-right font-semibold">Total: ${total.toFixed(2)}</div>
        </div>
    )
}


