import { Box, CircularProgress, Typography } from '@mui/material'

interface AppLoaderProps {
  message?: string
}

const AppLoader = ({ message = 'Đang tải dữ liệu...' }: AppLoaderProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <CircularProgress sx={{ color: '#fff' }} size={56} />
      <Typography sx={{ color: '#fff', fontWeight: 600 }}>{message}</Typography>
    </Box>
  )
}

export default AppLoader
