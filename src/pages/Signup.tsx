import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authSignup, setAuthToken } from '../utils/api'
import { Role, useAuthStore } from '../store/auth'
import { pushToast } from '../components/feedback/Toaster'

export default function Signup() {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<Role>('USER')

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { token, user } = await authSignup({ name, email, password, role })
            setAuthToken(token)
            login({ role: user.role, email: user.email, name: user.name, token })
            pushToast({ title: 'Account created', type: 'success' })
            navigate(user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'VENDOR' ? '/vendor/main' : '/user/home', { replace: true })
        } catch (err: any) {
            pushToast({ title: err?.response?.data?.message || 'Signup failed', type: 'error' })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-3">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-6 sm:p-7 bg-white/80 dark:bg-slate-900/70 shadow-lg backdrop-blur">
                <h2 className="text-xl font-semibold text-center">Sign Up</h2>
                <div className="space-y-2 text-sm">
                    <label>Name</label>
                    <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2 text-sm">
                    <label>Email</label>
                    <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2 text-sm">
                    <label>Password</label>
                    <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="space-y-2 text-sm">
                    <label>Role</label>
                    <select className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/50" value={role} onChange={e => setRole(e.target.value as Role)}>
                        <option value="ADMIN">Admin</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="USER">User</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="button" className="border rounded px-4 py-2" onClick={() => navigate('/')}>Back</button>
                    <button className="bg-brand text-white rounded px-4 py-2 shadow hover:brightness-110 transition">Create Account</button>
                </div>
            </form>
        </div>
    )
}


