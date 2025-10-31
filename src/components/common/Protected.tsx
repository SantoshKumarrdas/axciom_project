import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, Role } from '../../store/auth'

export function ProtectedRoute() {
    const isAuth = useAuthStore(s => s.isAuthenticated)
    if (!isAuth) return <Navigate to="/login" replace />
    return <Outlet />
}

export function RoleGuard({ allow, children }: { allow: Role[]; children?: React.ReactNode }) {
    const { isAuthenticated, role } = useAuthStore()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!role || !allow.includes(role)) return <Navigate to="/" replace />
    // When used as a wrapper, render children directly
    if (children) return <>{children}</>
    // When mounted inside a <Route element={<RoleGuard/>}>, render nested routes
    return <Outlet />
}


