import { useDataStore } from '../../../store/data'

export default function OrderStatus() {
    const { orders } = useDataStore()
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order Status</h2>
            <table className="w-full text-sm border">
                <thead className="bg-slate-50 dark:bg-slate-800"><tr><th className="p-2 text-left">Order</th><th className="p-2">Items</th><th className="p-2">Total</th><th className="p-2">Status</th></tr></thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o.id} className="border-t">
                            <td className="p-2">{o.id.slice(0, 8)}</td>
                            <td className="p-2 text-center">{o.items.length}</td>
                            <td className="p-2 text-center">${o.total.toFixed(2)}</td>
                            <td className="p-2 text-center">{o.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


