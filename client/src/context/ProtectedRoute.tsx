import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"
import Header from "../components/header/Header"
import { Box } from "@mui/material"

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <Box>
      <Header />
      <Box
        sx={{
          pt: { xs: '64px', sm: '80px' }, // Padding top để tránh bị Header che
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default ProtectedRoute  