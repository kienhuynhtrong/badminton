import Box from '@mui/material/Box'
import { Typography, Button } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      minWidth: '100vw',
      height: { xs: 64, sm: 80 },
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: { xs: 1.5, sm: 2 },
      px: { xs: 2, sm: 3 },
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
      zIndex: 1000,
    }} className="header">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 40, sm: 50 },
            height: { xs: 40, sm: 50 },
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <SportsTennisIcon 
            sx={{ 
              fontSize: { xs: 24, sm: 30 }, 
              color: '#fff',
            }} 
          />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 0.25, sm: 0.5 },
        }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1,
              fontSize: { xs: 18, sm: 24 },
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Badminton Arena
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1,
              fontSize: { xs: 11, sm: 14 },
            }}
          >
            Quản lý và bình chọn
          </Typography>
        </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              borderColor: '#fff',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            },
            fontSize: { xs: 12, sm: 14 },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          Đăng xuất
        </Button>
    </Box>
  )
}
export default Header