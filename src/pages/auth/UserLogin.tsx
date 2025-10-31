import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { authLogin, setAuthToken } from '../../utils/api'
import { pushToast } from '../../components/feedback/Toaster'

export default function UserLogin() {
    const { login } = useAuthStore()
    const navigate = useNavigate()
    const [email, setEmail] = useState('user@example.com')
    const [password, setPassword] = useState('user')
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { token, user } = await authLogin({ email, password, role: 'USER' })
            setAuthToken(token)
            login({ role: 'USER', email: user.email, name: user.name, token })
            pushToast({ title: 'User logged in', type: 'success' })
            navigate('/user/home')
        } catch (err: any) {
            pushToast({ title: err?.response?.data?.message || 'Login failed', type: 'error' })
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-center">User Login</h2>
                <div className="space-y-2 text-sm"><label>User Id</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                <div className="space-y-2 text-sm"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                <div className="flex gap-2"><button type="button" className="border rounded px-4 py-2" onClick={() => navigate('/')}>Cancel</button><button className="bg-brand text-white rounded px-4 py-2">Login</button></div>
            </form>
        </div>
    )
}


