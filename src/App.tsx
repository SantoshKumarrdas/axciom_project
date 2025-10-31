import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from './components/feedback/Toaster'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminRoutes from './pages/admin/AdminRoutes'
import VendorRoutes from './pages/vendor/VendorRoutes'
import UserRoutes from './pages/user/UserRoutes'
import { ThemeToggle } from './components/common/ThemeToggle'

function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {children}
        </motion.div>
    )
}

export default function App() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
            <div className="fixed right-3 bottom-3 z-10"><ThemeToggle /></div>
            <Toaster />
            <AnimatePresence mode="wait">
                <Routes location={location}>
                    <Route
                        path="/"
                        element={<PageTransition><Landing /></PageTransition>}
                    />
                    <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                    <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />

                    {/* Role areas */}
                    <Route path="/admin/*" element={<AdminRoutes />} />
                    <Route path="/vendor/*" element={<VendorRoutes />} />
                    <Route path="/user/*" element={<UserRoutes />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </div>
    )
}


