import AuthProvider from './context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './features/auth/Login'
import Register from './features/auth/Register'
import HomePage from './features/home/HomePage'
import Member from './features/members/Member'
import Payment from './features/payment/Payment'
import ProtectedRoute from './context/ProtectedRoute'
import NotFoundPage from './features/notFoundPage/notFound'

function App() {
  return (
    <AuthProvider>  
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/members" element={<Member />} />
            <Route path="/payment" element={<Payment />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
