import Box from '@mui/material/Box'
import { Button, Typography, Drawer, IconButton } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  const listDataMenu = [
    { label: 'Hội nhóm', link: '/groups' },
    { label: 'Vote kèo', link: '/' },
    { label: 'Thành viên', link: '/members' },
    { label: 'Tính tiền', link: '/payment' },
  ]
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
        <Link to="/" style={{ textDecoration: 'none' }}>
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
        </Link>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 0.25, sm: 0.5 },
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
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
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
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
          </Link>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
      }}>
        {/* Desktop Menu - Ẩn trên mobile */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 3,
        }}>
          {
            listDataMenu.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                style={{ textDecoration: 'none' }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { color: '#fff' },
                    transition: 'color 0.2s',
                  }}
                >
                  {item.label}
                </Typography>
              </Link>
            ))
          }
        </Box>

        {/* Hamburger Menu - Chỉ hiển thị trên mobile */}
        <IconButton
          onClick={() => setOpenMenu(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: '#fff',
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logout Button */}
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
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

        {/* Logout Icon Button - Chỉ hiển thị trên mobile */}
        <IconButton
          onClick={handleLogout}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            color: '#fff',
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: '#fff',
            width: '80%',
            maxWidth: 300,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setOpenMenu(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          {listDataMenu.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              style={{ textDecoration: 'none' }}
              onClick={() => setOpenMenu(false)}
            >
              <Typography
                sx={{
                  py: 1.5,
                  color: '#667eea',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                    pl: 1,
                  },
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </Typography>
            </Link>
          ))}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={() => {
              setOpenMenu(false)
              handleLogout()
            }}
            sx={{
              mt: 2,
              color: '#667eea',
              borderColor: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                borderColor: '#667eea',
              },
            }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}
export default Header