import { useEffect, useState } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import EmailIcon from '@mui/icons-material/Email'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import { getUsers } from '../../service/apiService'

interface MemberData {
  _id: string
  username: string
  nickname: string
  email: string
  phone?: string
}

const renderMemberCard = (member: MemberData) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
        transition: 'transform 0.2s, boxShadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: 40,
          }}
        >
          {member.nickname?.charAt(0) || member.username?.charAt(0) || '?'}
        </Avatar>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: '#1a1a1a' }}>
          {member.nickname || member.username}
        </Typography>

        <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 2 }}>
          {member.username}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: 14 }}>
          <EmailIcon sx={{ fontSize: 18, color: '#667eea' }} />
          <Typography variant="body2" sx={{ color: '#666' }}>
            {member.email}
          </Typography>
        </Box>

        {member.phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontSize: 14 }}>
            <PhoneIcon sx={{ fontSize: 18, color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              {member.phone}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid #eee',
          }}
        >
          <Typography variant="caption" sx={{ color: '#999' }}>
            ID: {member._id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

const Member = () => {
  const [members, setMembers] = useState<MemberData[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const users = await getUsers()
        setMembers(users)
      } catch (error) {
        console.error('Error fetching members:', error)
        setMembers([])
      }
    }

    void fetchMembers()
  }, [])

  return (
    <Box sx={{ py: 2 }}>
      <Container sx={{ my: 4, mx: 4, display: 'block' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a1a1a' }}>
            Hội viên cầu lông
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            {`Danh sách hội viên hiện có: ${members.length} người`}
          </Typography>
        </Box>

        {members.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {members.map((member) => (
              <Box key={member._id}>{renderMemberCard(member)}</Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: 2,
              border: '2px dashed #667eea',
            }}
          >
            <PersonIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666' }}>
              Chưa có thành viên nào
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Member
