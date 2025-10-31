import { useState } from 'react'
import { useDataStore } from '../../../store/data'
import { useAuthStore } from '../../../store/auth'
import { pushToast } from '../../../components/feedback/Toaster'

export default function AddItem() {
    const { role, user } = useAuthStore()
    const { addProduct, deleteProduct, products } = useDataStore()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)

    const add = () => {
        if (role !== 'VENDOR' || !user) return
        const p = addProduct({ name, price: Number(price), status: 'AVAILABLE', vendorId: user.id })
        pushToast({ title: `Added ${p.name}`, type: 'success' })
        setName(''); setPrice(0)
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add New Item</h2>
            <div className="grid sm:grid-cols-3 gap-2">
                <input className="border rounded px-2 py-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <input type="number" className="border rounded px-2 py-1" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} />
                <button className="bg-brand text-white rounded px-3" onClick={add}>Insert</button>
            </div>
            <h3 className="font-medium">Your Recent Items</h3>
            <ul className="space-y-2">
                {products.filter(p => p.vendorId === user?.id).map(p => (
                    <li key={p.id} className="border rounded p-2 flex justify-between">
                        <span>{p.name} - ${p.price.toFixed(2)}</span>
                        <button className="text-red-600 underline" onClick={() => { deleteProduct(p.id); pushToast({ title: 'Deleted item' }) }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


