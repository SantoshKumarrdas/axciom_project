import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, Role } from '../store/auth'
import { pushToast } from '../components/feedback/Toaster'
import { authLogin, setAuthToken } from '../utils/api'

export default function Login() {
    const { login, isAuthenticated, role, hydrate } = useAuthStore()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [selectedRole, setSelectedRole] = useState<Role>('USER')

    useEffect(() => { hydrate() }, [hydrate])
    useEffect(() => {
        if (isAuthenticated && role) {
            navigate(role === 'ADMIN' ? '/admin/dashboard' : role === 'VENDOR' ? '/vendor/main' : '/user/home', { replace: true })
        }
    }, [isAuthenticated, role, navigate])

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { token, user } = await authLogin({ email, password: password || 'password', role: selectedRole })
            setAuthToken(token)
            login({ role: user.role, email: user.email, name: user.name, token })
            pushToast({ title: `Logged in as ${user.role}`, type: 'success' })
        } catch (err: any) {
            pushToast({ title: err?.response?.data?.message || 'Login failed', type: 'error' })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-3">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-6 sm:p-7 bg-white/80 dark:bg-slate-900/70 shadow-lg backdrop-blur">
                <h2 className="text-xl font-semibold">Login</h2>
                <div className="space-y-2 text-sm">
                    <label className="block text-slate-600 dark:text-slate-300">Email</label>
                    <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="you@example.com" />
                </div>
                <div className="space-y-2 text-sm">
                    <label className="block text-slate-600 dark:text-slate-300">Password</label>
                    <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="••••••••" />
                </div>
                <div className="space-y-2 text-sm">
                    <label className="block text-slate-600 dark:text-slate-300">Role</label>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value as Role)} className="w-full rounded-md border px-3 py-2 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/50">
                        <option value="ADMIN">Admin</option>
                        <option value="VENDOR">Vendor</option>
                        <option value="USER">User</option>
                    </select>
                </div>
                <button type="submit" className="w-full rounded-md bg-brand text-white px-4 py-2 shadow hover:brightness-110 transition">Sign In</button>
                <div className="text-sm text-center">
                    No account? <Link to="/signup" className="underline">Sign up</Link>
                </div>
            </form>
        </div>
    )
}


