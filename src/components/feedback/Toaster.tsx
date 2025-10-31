import { useEffect, useState } from 'react'

type Toast = { id: string; title: string; type?: 'success' | 'error' | 'info' }

let pushFn: ((t: Omit<Toast, 'id'>) => void) | null = null
export function pushToast(t: Omit<Toast, 'id'>) { pushFn?.(t) }

export function Toaster() {
    const [toasts, setToasts] = useState<Toast[]>([])
    useEffect(() => {
        pushFn = (t) => {
            const toast: Toast = { id: crypto.randomUUID(), ...t }
            setToasts((prev) => [toast, ...prev])
            setTimeout(() => setToasts((prev) => prev.filter(x => x.id !== toast.id)), 2500)
        }
        return () => { pushFn = null }
    }, [])
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(t => (
                <div key={t.id} className={`rounded-md px-4 py-2 shadow-md text-sm text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-slate-700'}`}>
                    {t.title}
                </div>
            ))}
        </div>
    )
}


