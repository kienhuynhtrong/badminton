import { Box, Container, Backdrop, CircularProgress } from '@mui/material'
import Group from '../../components/group/Group'
import {useState} from 'react'
import CreateGroup from '../../components/modal/CreateGroup'
import { apiRequest } from '../../service/apiService'

interface GetDataResponse {
  status: string;
  data: any;
}
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const handleCreateGroupOpen = () => {
    console.log('Open Create Group Modal')
    setIsCreateGroupOpen(true)
  }
  const handleCreateGroupClose = () => {
    setIsCreateGroupOpen(false)
  }
  const handleSubmitCreate = async (data: {name: string, description: string, maxMembers: number | null}) => {
    try {
      setIsLoading(true);
      const response: GetDataResponse = await apiRequest('/groups', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          maxMembers: data.maxMembers,
        }),
      })
      if(response.status === 'success') {
        console.log('Group created successfully');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsLoading(false);
      setIsCreateGroupOpen(false);
    }
  }

  return (
    <>
    <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
    </Backdrop>
    <Box
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Group handleCreateGroupOpen={handleCreateGroupOpen}/>
        <CreateGroup isOpen={isCreateGroupOpen} handleClose={handleCreateGroupClose} handleSubmitCreate={handleSubmitCreate}/>
      </Container>
      
    </Box>
    </>
  )
}
export default HomePage 