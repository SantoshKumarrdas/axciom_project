import { useState } from 'react'
import { useDataStore, Membership } from '../../store/data'
import { pushToast } from '../../components/feedback/Toaster'

export default function Memberships() {
    const { memberships, addMembership, updateMembership, deleteMembership } = useDataStore()
    const [vendorId, setVendorId] = useState('')
    const [level, setLevel] = useState<Membership['level']>('Basic')
    const [addTerm, setAddTerm] = useState<'6m' | '1y' | '2y'>('6m')
    const [membershipIdForUpdate, setMembershipIdForUpdate] = useState('')
    const [updateAction, setUpdateAction] = useState<'extend' | 'cancel'>('extend')

    const calcExpiry = (from = new Date(), t: '6m' | '1y' | '2y') => {
        const d = new Date(from)
        if (t === '6m') d.setMonth(d.getMonth() + 6)
        if (t === '1y') d.setFullYear(d.getFullYear() + 1)
        if (t === '2y') d.setFullYear(d.getFullYear() + 2)
        return d.toISOString().slice(0, 10)
    }

    const onAdd = () => {
        if (!vendorId) { pushToast({ title: 'Vendor ID required', type: 'error' }); return }
        const expiresAt = calcExpiry(new Date(), addTerm)
        addMembership({ vendorId, level, expiresAt })
        pushToast({ title: 'Membership added', type: 'success' })
        setVendorId('')
    }

    const onUpdate = () => {
        if (!membershipIdForUpdate) { pushToast({ title: 'Membership Number required', type: 'error' }); return }
        const current = memberships.find(m => m.id === membershipIdForUpdate)
        if (!current) { pushToast({ title: 'Membership not found', type: 'error' }); return }
        if (updateAction === 'cancel') {
            deleteMembership(current.id)
            pushToast({ title: 'Membership cancelled', type: 'success' })
            setMembershipIdForUpdate('')
            return
        }
        const newExpiry = calcExpiry(new Date(current.expiresAt), updateTerm)
        updateMembership(current.id, { expiresAt: newExpiry })
        pushToast({ title: 'Membership extended', type: 'success' })
    }

    // independent update term selection
    const [updateTerm, setUpdateTerm] = useState<'6m' | '1y' | '2y'>('6m')

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Maintenance - Memberships</h2>

            <div className="rounded-lg border p-4 space-y-3">
                <div className="font-medium">Add Membership (All fields mandatory)</div>
                <div className="grid sm:grid-cols-3 gap-2 items-center">
                    <input value={vendorId} onChange={e => setVendorId(e.target.value)} className="border rounded px-2 py-1" placeholder="Vendor ID" />
                    <select value={level} onChange={e => setLevel(e.target.value as Membership['level'])} className="border rounded px-2 py-1">
                        <option>Basic</option><option>Pro</option><option>Enterprise</option>
                    </select>
                    <div className="flex items-center gap-4 text-sm">
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_add" checked={addTerm === '6m'} onChange={() => setAddTerm('6m')} /> 6 months (default)</label>
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_add" checked={addTerm === '1y'} onChange={() => setAddTerm('1y')} /> 1 year</label>
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_add" checked={addTerm === '2y'} onChange={() => setAddTerm('2y')} /> 2 years</label>
                    </div>
                </div>
                <button onClick={onAdd} className="rounded bg-brand text-white px-3 py-1.5">Add</button>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
                <div className="font-medium">Update Membership</div>
                <div className="grid sm:grid-cols-3 gap-2 items-center">
                    <input value={membershipIdForUpdate} onChange={e => setMembershipIdForUpdate(e.target.value)} className="border rounded px-2 py-1" placeholder="Membership Number (mandatory)" />
                    <div className="flex items-center gap-4 text-sm">
                        <label className="inline-flex items-center gap-1"><input type="radio" name="upd_action" checked={updateAction === 'extend'} onChange={() => setUpdateAction('extend')} /> Extend</label>
                        <label className="inline-flex items-center gap-1"><input type="radio" name="upd_action" checked={updateAction === 'cancel'} onChange={() => setUpdateAction('cancel')} /> Cancel</label>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_update" checked={updateTerm === '6m'} onChange={() => setUpdateTerm('6m')} /> +6 months (default)</label>
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_update" checked={updateTerm === '1y'} onChange={() => setUpdateTerm('1y')} /> +1 year</label>
                        <label className="inline-flex items-center gap-1"><input type="radio" name="term_update" checked={updateTerm === '2y'} onChange={() => setUpdateTerm('2y')} /> +2 years</label>
                    </div>
                </div>
                <button onClick={onUpdate} className="rounded bg-brand text-white px-3 py-1.5">Apply</button>
            </div>

            <table className="w-full text-sm border">
                <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr><th className="p-2 text-left">Membership #</th><th className="p-2 text-left">Vendor</th><th className="p-2 text-left">Level</th><th className="p-2">Expires</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                    {memberships.map(m => (
                        <tr key={m.id} className="border-t">
                            <td className="p-2">{m.id.slice(0, 8)}</td>
                            <td className="p-2">{m.vendorId}</td>
                            <td className="p-2">{m.level}</td>
                            <td className="p-2 text-center">{m.expiresAt}</td>
                            <td className="p-2 text-center space-x-2">
                                <button className="underline" onClick={() => { setMembershipIdForUpdate(m.id); setUpdateAction('extend') }}>Select</button>
                                <button className="text-red-600 underline" onClick={() => { deleteMembership(m.id); pushToast({ title: 'Deleted', type: 'info' }) }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


