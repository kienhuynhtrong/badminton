import { Box, Container, Paper, Typography, Avatar, Button, Divider } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BadgeIcon from '@mui/icons-material/Badge'
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Lấy chữ cái đầu từ tên user
  const getAvatarLetter = () => {
    if (!user?.nickname) return '?'
    return user.nickname.charAt(0).toUpperCase()
  }

  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header với Avatar */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: 48,
                fontWeight: 700,
                border: '4px solid rgba(255, 255, 255, 0.5)',
                mb: 2,
              }}
            >
              {getAvatarLetter()}
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {user?.nickname || 'Người dùng'}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 14,
              }}
            >
              @{user?.username}
            </Typography>
          </Box>

          {/* Thông tin chi tiết */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: 1,
                mb: 2,
              }}
            >
              Thông tin cá nhân
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon sx={{ color: '#667eea' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#999' }}>Tên đăng nhập</Typography>
                <Typography sx={{ fontWeight: 600, color: '#333' }}>{user?.username}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BadgeIcon sx={{ color: '#667eea' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#999' }}>Biệt danh</Typography>
                <Typography sx={{ fontWeight: 600, color: '#333' }}>{user?.nickname}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmailIcon sx={{ color: '#667eea' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 12, color: '#999' }}>Email</Typography>
                <Typography sx={{ fontWeight: 600, color: '#333' }}>{user?.email}</Typography>
              </Box>
            </Box>

            {user?.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PhoneIcon sx={{ color: '#667eea' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, color: '#999' }}>Số điện thoại</Typography>
                  <Typography sx={{ fontWeight: 600, color: '#333' }}>{user?.phone}</Typography>
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Các nút hành động */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{
                  color: '#667eea',
                  borderColor: '#667eea',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    borderColor: '#667eea',
                  },
                }}
              >
                Chỉnh sửa thông tin
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                  },
                }}
              >
                Đăng xuất
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ProfilePage
