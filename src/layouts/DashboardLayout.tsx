import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogOut, ShoppingCart, Settings, Users, Home, Package, Shield } from 'lucide-react'
import { useAuthStore } from '../store/auth'

export default function DashboardLayout({ sidebar, children }: { sidebar: { title: string; links: { to: string; label: string; icon?: JSX.Element }[] }; children?: React.ReactNode }) {
    const { logout, role, user } = useAuthStore()
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <aside className="md:sticky md:top-0 h-full border-r border-slate-200/70 dark:border-slate-800/70 p-4 space-y-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
                <Link to="/" className="font-bold text-lg inline-flex items-center gap-2 text-brand"><Shield size={18} /> Axciom</Link>
                <div className="text-xs uppercase text-slate-500">{sidebar.title}</div>
                <nav className="flex flex-col gap-1">
                    {sidebar.links.map(link => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${isActive ? 'bg-brand text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            {link.icon}{link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    Signed in as
                    <div className="text-slate-900 dark:text-slate-100 text-sm">{user?.name} ({role})</div>
                </div>
                <button onClick={logout} className="inline-flex items-center gap-2 text-sm mt-2 text-red-600 hover:underline"><LogOut size={16} /> Logout</button>
            </aside>
            <main className="p-4 sm:p-6">
                <header className="flex items-center justify-between mb-6 bg-white/60 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-500">
                        <Home size={18} /> <span>Dashboard</span>
                        <Link to="/" className="ml-3 underline text-xs" title="Chart">Chart</Link>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                        <Link to={role === 'ADMIN' ? '/admin/users-vendors' : '/user/home'} title="Users" aria-label="Users" className="hover:text-brand">
                            <Users size={18} />
                        </Link>
                        <Link to={role === 'VENDOR' ? '/vendor/your-items' : '/user/home'} title="Products" aria-label="Products" className="hover:text-brand">
                            <Package size={18} />
                        </Link>
                        <Link to="/user/cart" title="Cart" aria-label="Cart" className="hover:text-brand">
                            <ShoppingCart size={18} />
                        </Link>
                        <Link to="/" title="Settings" aria-label="Settings" className="hover:text-brand">
                            <Settings size={18} />
                        </Link>
                    </div>
                </header>
                <section className="rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-sm p-4 sm:p-6">
                    {children ?? <Outlet />}
                </section>
            </main>
        </div>
    )
}


