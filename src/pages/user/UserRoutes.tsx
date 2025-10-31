import { Routes, Route, Navigate } from 'react-router-dom'
import { RoleGuard } from '../../components/common/Protected'
import DashboardLayout from '../../layouts/DashboardLayout'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import OrderStatus from './pages/OrderStatus'
import Guests from './pages/Guests'

const sidebar = {
    title: 'User',
    links: [
        { to: '/user/home', label: 'Home' },
        { to: '/user/cart', label: 'Cart' },
        { to: '/user/payment', label: 'Payment' },
        { to: '/user/orders', label: 'Order Status' },
        { to: '/user/guests', label: 'Guest List' },
    ],
}

export default function UserRoutes() {
    return (
        <RoleGuard allow={["USER"]}>
            <DashboardLayout sidebar={sidebar as any}>
                <Routes>
                    <Route path="home" element={<Home />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="payment" element={<Payment />} />
                    <Route path="orders" element={<OrderStatus />} />
                    <Route path="guests" element={<Guests />} />
                    <Route path="*" element={<Navigate to="/user/home" replace />} />
                </Routes>
            </DashboardLayout>
        </RoleGuard>
    )
}


