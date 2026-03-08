import Container from '@mui/material/Container'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

const Member = () => {
  const [members, setMembers] = useState([])
  useEffect(() => {
    // Fetch danh sách hội viên từ API
    const fetchMembers = async () => {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setMembers(data)
    }
    fetchMembers()
  }, [])
  return (
    <Container sx={{ my: 4, mx: 4, display: 'block' }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Hội viên cầu lông
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Danh sách hội viên đang được phát triển...
        </Typography>
      </Box>
    </Container>
  )
}
export default Member