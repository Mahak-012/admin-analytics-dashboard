import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { ToastProvider } from './components/ui/Toasts'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import CustomersPage from './pages/CustomersPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
