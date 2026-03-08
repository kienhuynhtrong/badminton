import { Box, Container, Typography, Paper } from '@mui/material'

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Chào mừng đến với Badminton Arena
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: 18 }}>
            Hệ thống quản lý và bình chọn cầu lông
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
export default HomePage 