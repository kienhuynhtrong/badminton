import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff, SportsTennis } from '@mui/icons-material'
import { useAuth } from '../../context/AuthContext'
import { loginUser, setStoredToken } from '../../service/apiService'

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')

      const result = await loginUser({
        email: data.email,
        password: data.password,
      })

      if (result.token) {
        setStoredToken(result.token)
      }

      await login()
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
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
              <SportsTennis
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
              Chào mừng trở lại
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Đăng nhập để tiếp tục trải nghiệm
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              autoComplete="email"
              autoFocus
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

            <TextField
              fullWidth
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password', {
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ color: '#667eea', fontWeight: 'bold' }}
              >
                Quên mật khẩu?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              sx={{
                mt: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
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
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Chưa có tài khoản?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{
                    color: '#667eea',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Đăng ký
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
