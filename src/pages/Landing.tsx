import { Link } from 'react-router-dom'

export default function Landing() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-xl text-center space-y-6">
                <h1 className="text-3xl font-bold">Welcome to Axciom</h1>
                <p className="text-slate-600 dark:text-slate-300">A multi-role demo app showcasing Admin, Vendor, and User flows with role-based routing and simulated CRUD.</p>
                <div className="flex items-center justify-center gap-3">
                    <Link to="/login" className="rounded-md bg-brand text-white px-4 py-2">Go to Login</Link>
                    <a href="https://react.dev" target="_blank" rel="noreferrer" className="rounded-md border px-4 py-2">Docs</a>
                </div>
            </div>
        </div>
    )
}


