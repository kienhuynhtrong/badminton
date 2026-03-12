import { Box, Container, Typography, Paper } from '@mui/material'
import Group from '../../components/group/Group'
import React, {useState} from 'react'
import CreateGroup from '../../components/modal/CreateGroup'

const HomePage = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const handleCreateGroupOpen = () => {
    console.log('Open Create Group Modal')
    setIsCreateGroupOpen(true)
  }
  const handleCreateGroupClose = () => {
    setIsCreateGroupOpen(false)
  }
  const handleSubmitCreate = (data: {name: string, description: string, maxMembers: number | null}) => {
    console.log('Create Group with data:', data)
  }

  return (
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
  )
}
export default HomePage 