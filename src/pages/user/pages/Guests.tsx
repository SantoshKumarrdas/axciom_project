import { useState } from 'react'

type Guest = { id: string; name: string }

export default function Guests() {
    const [guests, setGuests] = useState<Guest[]>([])
    const [name, setName] = useState('')
    const add = () => { setGuests([{ id: crypto.randomUUID(), name }, ...guests]); setName('') }
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Guest List</h2>
            <div className="flex gap-2">
                <input className="border rounded px-2" placeholder="Guest name" value={name} onChange={e => setName(e.target.value)} />
                <button className="bg-brand text-white rounded px-3" onClick={add}>Add</button>
            </div>
            <ul className="space-y-2">
                {guests.map(g => (
                    <li key={g.id} className="border rounded p-2 flex justify-between">
                        <span>{g.name}</span>
                        <button className="text-red-600 underline" onClick={() => setGuests(guests.filter(x => x.id !== g.id))}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


