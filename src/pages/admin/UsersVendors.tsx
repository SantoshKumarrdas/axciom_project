import { useState } from 'react'

type Entry = { id: string; name: string; type: 'User' | 'Vendor' }

export default function UsersVendors() {
    const [entries, setEntries] = useState<Entry[]>([
        { id: 'u-1', name: 'Alice', type: 'User' },
        { id: 'v-1', name: 'Beta Store', type: 'Vendor' },
    ])
    const [name, setName] = useState('')
    const [type, setType] = useState<Entry['type']>('User')
    const add = () => setEntries([{ id: crypto.randomUUID(), name, type }, ...entries])
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">User & Vendor Management</h2>
            <div className="flex gap-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder={`${type} name`} className="border rounded px-2" />
                <select value={type} onChange={e => setType(e.target.value as Entry['type'])} className="border rounded px-2">
                    <option>User</option><option>Vendor</option>
                </select>
                <button onClick={add} className="bg-brand text-white rounded px-3">Add</button>
            </div>
            <ul className="space-y-2">
                {entries.map(e => (
                    <li key={e.id} className="border rounded p-2 flex justify-between items-center">
                        <div>
                            <div className="font-medium">{e.name}</div>
                            <div className="text-xs text-slate-500">{e.type}</div>
                        </div>
                        <button className="text-red-600 underline" onClick={() => setEntries(entries.filter(x => x.id !== e.id))}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


