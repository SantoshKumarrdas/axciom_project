import { useState } from 'react'
import { useDataStore, Membership } from '../../store/data'
import { pushToast } from '../../components/feedback/Toaster'

export default function Memberships() {
    const { memberships, addMembership, updateMembership, deleteMembership } = useDataStore()
    const [vendorId, setVendorId] = useState('v-1')
    const [level, setLevel] = useState<Membership['level']>('Basic')
    const [expiresAt, setExpiresAt] = useState<string>(new Date(Date.now() + 86_400_000 * 30).toISOString().slice(0, 10))

    const onAdd = () => {
        addMembership({ vendorId, level, expiresAt })
        pushToast({ title: 'Membership added', type: 'success' })
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Manage Memberships</h2>
            <div className="grid sm:grid-cols-4 gap-2">
                <input value={vendorId} onChange={e => setVendorId(e.target.value)} className="border rounded px-2 py-1" placeholder="Vendor ID" />
                <select value={level} onChange={e => setLevel(e.target.value as Membership['level'])} className="border rounded px-2 py-1">
                    <option>Basic</option><option>Pro</option><option>Enterprise</option>
                </select>
                <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="border rounded px-2 py-1" />
                <button onClick={onAdd} className="rounded bg-brand text-white px-3">Add</button>
            </div>
            <table className="w-full text-sm border">
                <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr><th className="p-2 text-left">Vendor</th><th className="p-2 text-left">Level</th><th className="p-2">Expires</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                    {memberships.map(m => (
                        <tr key={m.id} className="border-t">
                            <td className="p-2">{m.vendorId}</td>
                            <td className="p-2">{m.level}</td>
                            <td className="p-2 text-center">{m.expiresAt}</td>
                            <td className="p-2 text-center space-x-2">
                                <button className="underline" onClick={() => { updateMembership(m.id, { level: 'Pro' }); pushToast({ title: 'Updated', type: 'success' }) }}>Upgrade</button>
                                <button className="text-red-600 underline" onClick={() => { deleteMembership(m.id); pushToast({ title: 'Deleted', type: 'info' }) }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


