import { useAuthStore } from '../../../store/auth'
import { useDataStore } from '../../../store/data'

export default function YourItems() {
    const { user } = useAuthStore()
    const { products } = useDataStore()
    const mine = products.filter(p => p.vendorId === user?.id)
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Items</h2>
            <ul className="space-y-2">
                {mine.map(p => (
                    <li key={p.id} className="border rounded p-2 flex justify-between">
                        <span>{p.name}</span>
                        <span className="text-slate-500">${p.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}


