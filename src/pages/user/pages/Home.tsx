import { useDataStore } from '../../../store/data'
import { pushToast } from '../../../components/feedback/Toaster'

export default function Home() {
    const { products, addToCart, requestProduct } = useDataStore()
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Browse Products</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map(p => (
                    <li key={p.id} className="border rounded p-3 space-y-2">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-slate-600 dark:text-slate-300">${p.price.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{p.status}</div>
                        <div className="flex gap-2">
                            <button className="bg-brand text-white rounded px-3 py-1 text-sm" onClick={() => { addToCart(p.id, 1); pushToast({ title: 'Added to cart', type: 'success' }) }}>Add</button>
                            <button className="rounded border px-3 py-1 text-sm" onClick={() => { requestProduct(p.id); pushToast({ title: 'Requested item' }) }}>Request</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}


