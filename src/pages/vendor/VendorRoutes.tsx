import { Routes, Route, Navigate } from 'react-router-dom'
import { RoleGuard } from '../../components/common/Protected'
import DashboardLayout from '../../layouts/DashboardLayout'
import Main from './pages/Main'
import AddItem from './pages/AddItem'
import ProductStatus from './pages/ProductStatus'
import YourItems from './pages/YourItems'
import Transactions from './pages/Transactions'

const sidebar = {
    title: 'Vendor',
    links: [
        { to: '/vendor/main', label: 'Main' },
        { to: '/vendor/add', label: 'Add New Item' },
        { to: '/vendor/status', label: 'Product Status' },
        { to: '/vendor/your-items', label: 'Your Items' },
        { to: '/vendor/transactions', label: 'Transactions' },
    ],
}

export default function VendorRoutes() {
    return (
        <RoleGuard allow={["VENDOR"]}>
            <DashboardLayout sidebar={sidebar as any}>
                <Routes>
                    <Route path="main" element={<Main />} />
                    <Route path="add" element={<AddItem />} />
                    <Route path="status" element={<ProductStatus />} />
                    <Route path="your-items" element={<YourItems />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="*" element={<Navigate to="/vendor/main" replace />} />
                </Routes>
            </DashboardLayout>
        </RoleGuard>
    )
}


