import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authSignup, setAuthToken } from '../../utils/api'
import { pushToast } from '../../components/feedback/Toaster'

export default function UserSignup() {
    const navigate = useNavigate()
    const [name, setName] = useState('User')
    const [email, setEmail] = useState('user@example.com')
    const [password, setPassword] = useState('user')
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const { token } = await authSignup({ name, email, password, role: 'USER' })
            setAuthToken(token)
            pushToast({ title: 'User registered', type: 'success' })
            navigate('/auth/user/login')
        } catch (err: any) {
            pushToast({ title: err?.response?.data?.message || 'Signup failed', type: 'error' })
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-center">User Signup</h2>
                <div className="space-y-2 text-sm"><label>Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                <div className="space-y-2 text-sm"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                <div className="space-y-2 text-sm"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                <div className="flex gap-2"><button type="button" className="border rounded px-4 py-2" onClick={() => navigate('/')}>Back</button><button className="bg-brand text-white rounded px-4 py-2">Sign Up</button></div>
            </form>
        </div>
    )
}


