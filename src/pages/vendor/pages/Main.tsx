import { Link } from 'react-router-dom'

export default function Main() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Vendor Main</h2>
            <div className="grid sm:grid-cols-2 gap-3">
                <Card to="/vendor/add" title="Add New Item" />
                <Card to="/vendor/transactions" title="Transaction" />
                <Card to="/vendor/status" title="Product Status" />
                <Card to="/vendor/your-items" title="Your Items" />
            </div>
        </div>
    )
}

function Card({ to, title }: { to: string; title: string }) {
    return (
        <Link to={to} className="rounded-lg border p-6 hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="font-medium">{title}</div>
        </Link>
    )
}


