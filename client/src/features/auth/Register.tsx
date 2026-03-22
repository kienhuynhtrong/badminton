import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  SportsTennis as BadmintonIcon,
} from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { registerUser, setStoredToken } from '../../service/apiService'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Tên đăng nhập không được để trống')
      return false
    }
    if (!formData.nickname.trim()) {
      setError('Tên hiển thị không được để trống')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email không được để trống')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email không hợp lệ')
      return false
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }
    return true
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        username: formData.username,
        nickname: formData.nickname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      if (result.token) {
        setStoredToken(result.token)
      }

      await login()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backgroundColor: '#fff',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 1.5,
              }}
            >
              <BadmintonIcon
                sx={{
                  fontSize: 40,
                  color: '#667eea',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                  },
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1a1a1a',
                mb: 0.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tham gia cộng đồng
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Tạo tài khoản để bắt đầu chơi cầu lông
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleRegister} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2} direction="column">
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập tên đăng nhập"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Tên hiển thị"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập tên hiển thị"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="example@gmail.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại (tùy chọn)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="0123456789"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Nhập lại mật khẩu"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={12}>
                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Đăng ký'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Đã có tài khoản?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#667eea',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  p: 0,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Đăng nhập
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Register
