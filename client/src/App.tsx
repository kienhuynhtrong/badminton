import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import ProtectedRoute from './context/ProtectedRoute'
import AppLoader from './components/common/AppLoader'

const LoginPage = lazy(() => import('./features/auth/Login'))
const Register = lazy(() => import('./features/auth/Register'))
const HomePage = lazy(() => import('./features/home/HomePage'))
const Member = lazy(() => import('./features/members/Member'))
const Payment = lazy(() => import('./features/payment/Payment'))
const GroupDetailPage = lazy(() => import('./features/groups/GroupDetailPage'))
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'))
const NotFoundPage = lazy(() => import('./features/notFoundPage/notFound'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<AppLoader message="Đang tải trang..." />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/members" element={<Member />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/groups/:id" element={<GroupDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
