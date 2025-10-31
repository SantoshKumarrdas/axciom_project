import { Routes, Route, Navigate } from 'react-router-dom'
import { RoleGuard } from '../../components/common/Protected'
import DashboardLayout from '../../layouts/DashboardLayout'
import AdminDashboard from './Dashboard'
import Memberships from './Memberships'
import UsersVendors from './UsersVendors'

const sidebar = {
    title: 'Admin',
    links: [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/memberships', label: 'Memberships' },
        { to: '/admin/users-vendors', label: 'User & Vendor Mgmt' },
    ],
}

export default function AdminRoutes() {
    return (
        <RoleGuard allow={["ADMIN"]}>
            <DashboardLayout sidebar={sidebar as any}>
                <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="memberships" element={<Memberships />} />
                    <Route path="users-vendors" element={<UsersVendors />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
            </DashboardLayout>
        </RoleGuard>
    )
}


