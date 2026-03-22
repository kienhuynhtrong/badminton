import { Box } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import AppLoader from '../components/common/AppLoader'
import Header from '../components/header/Header'
import { useAuth } from './AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <AppLoader message="Đang xác thực tài khoản..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          marginTop: { md: '80px', xs: '64px' },
        }}
      >
        <Outlet />
      </Box>
    </>
  )
}

export default ProtectedRoute
