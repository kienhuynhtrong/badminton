import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"
import Header from "../components/header/Header"
import { Box, CircularProgress } from "@mui/material"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()
  
  // Đợi check token xong
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#fff' }} size={60} />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
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