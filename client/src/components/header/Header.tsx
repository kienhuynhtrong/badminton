import Box from '@mui/material/Box'
import { Button, Typography, Drawer, IconButton, Avatar } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../../context/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

interface MenuItemData {
  label: string
  link: string
  isActive: boolean
}

const Header = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenu, setOpenMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getAvatarLetter = () => {
    if (!user?.nickname) return '?'
    return user.nickname.charAt(0).toUpperCase()
  }

  const isGroupWorkspace = /^\/groups\/[^/]+$/.test(location.pathname)
  const activeGroupTab = location.search === '?tab=payment' ? 'payment' : 'vote'

  const listDataMenu: MenuItemData[] = isGroupWorkspace
    ? [
        { label: 'Vote kèo', link: `${location.pathname}?tab=vote`, isActive: activeGroupTab === 'vote' },
        { label: 'Thanh toán', link: `${location.pathname}?tab=payment`, isActive: activeGroupTab === 'payment' },
      ]
    : [
        { label: 'Hội nhóm', link: '/', isActive: location.pathname === '/' },
        { label: 'Thành viên', link: '/members', isActive: location.pathname === '/members' },
      ]

  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
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
              {isGroupWorkspace ? 'Vote và thanh toán theo từng nhóm' : 'Quản lý nhóm và bình chọn'}
            </Typography>
          </Link>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
      }}>
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 3,
        }}>
          {listDataMenu.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              style={{ textDecoration: 'none' }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: item.isActive ? '#fff' : 'rgba(255, 255, 255, 0.78)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </Typography>
            </Link>
          ))}
        </Box>

        <IconButton
          onClick={() => setOpenMenu(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: '#fff',
          }}
        >
          <MenuIcon />
        </IconButton>

        {user && (
          <Avatar
            onClick={() => navigate('/profile')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              width: 40,
              height: 40,
              bgcolor: 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
              border: '2px solid rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.4)',
              },
              transition: 'all 0.2s',
            }}
            title={user.nickname}
          >
            {getAvatarLetter()}
          </Avatar>
        )}

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
          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                pb: 2,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: '#667eea',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {getAvatarLetter()}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#333' }}>
                  {user.nickname}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#999' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}
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
                  color: item.isActive ? '#4f46e5' : '#667eea',
                  fontWeight: 700,
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
