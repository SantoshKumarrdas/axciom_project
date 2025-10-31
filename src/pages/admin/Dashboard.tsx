import { useDataStore } from '../../store/data'

export default function AdminDashboard() {
    const { products, memberships, orders } = useDataStore()
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
            <div className="grid sm:grid-cols-3 gap-4">
                <Stat label="Products" value={products.length} />
                <Stat label="Memberships" value={memberships.length} />
                <Stat label="Orders" value={orders.length} />
            </div>
        </div>
    )
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border p-4">
            <div className="text-slate-500 text-sm">{label}</div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    )
}


