import { Box, Container, Typography, Paper } from '@mui/material'

const Payment = () => {
  return (
    <Box
      sx={{
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
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tính tiền
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Trang tính tiền đang được phát triển...
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Payment
