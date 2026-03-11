import { useState } from 'react'
import { Box, Container, Typography, Button, Tabs, Tab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const Group: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCreateGroup = () => {
    // TODO: Mở modal tạo nhóm
    console.log('Tạo nhóm mới')
  }

  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="lg">
        {/* Header với tiêu đề và nút tạo nhóm */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#fff',
            }}
          >
            Hội Nhóm
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateGroup}
            sx={{
              bgcolor: '#fff',
              color: '#667eea',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Tạo nhóm
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.3)' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: 16,
                color: 'rgba(255,255,255,0.7)',
              },
              '& .Mui-selected': {
                color: '#fff !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#fff',
              },
            }}
          >
            <Tab label="Nhóm của tôi" />
            <Tab label="Các nhóm khác" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              border: '2px dashed rgba(255,255,255,0.5)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
              Bạn chưa tham gia nhóm nào
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Hãy tạo nhóm mới hoặc tham gia các nhóm khác
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              border: '2px dashed rgba(255,255,255,0.5)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
              Chưa có nhóm nào
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Các nhóm công khai sẽ hiển thị ở đây
            </Typography>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  )
}

export default Group