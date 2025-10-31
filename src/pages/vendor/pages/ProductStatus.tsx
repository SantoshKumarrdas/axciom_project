import { useDataStore } from '../../../store/data'
import { useAuthStore } from '../../../store/auth'

export default function ProductStatus() {
    const { user } = useAuthStore()
    const { products, updateProduct } = useDataStore()
    const mine = products.filter(p => p.vendorId === user?.id)
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Status</h2>
            <table className="w-full text-sm border">
                <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-2 text-left">Name</th><th className="p-2">Price</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                <tbody>
                    {mine.map(p => (
                        <tr key={p.id} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2 text-center">${p.price.toFixed(2)}</td>
                            <td className="p-2 text-center">{p.status}</td>
                            <td className="p-2 text-center space-x-2">
                                <button className="underline" onClick={() => updateProduct(p.id, { status: 'AVAILABLE' })}>Available</button>
                                <button className="underline" onClick={() => updateProduct(p.id, { status: 'OUT_OF_STOCK' })}>Out</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


