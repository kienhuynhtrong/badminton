import { useEffect, useState } from 'react'
import { Alert, Backdrop, Box, CircularProgress, Container, Snackbar } from '@mui/material'
import Group, { type GroupData } from '../../components/group/Group'
import CreateGroup, { type CreateGroupFormData } from '../../components/modal/CreateGroup'
import { apiRequest } from '../../service/apiService'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface FeedbackState {
  message: string
  severity: 'success' | 'error' | 'warning'
}

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGroupsLoading, setIsGroupsLoading] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null)
  const [myGroups, setMyGroups] = useState<GroupData[]>([])
  const [discoverGroups, setDiscoverGroups] = useState<GroupData[]>([])
  const [groupsError, setGroupsError] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [focusMyGroupsSignal, setFocusMyGroupsSignal] = useState(0)
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [requestingGroupId, setRequestingGroupId] = useState<string | null>(null)
  const [processingRequestKey, setProcessingRequestKey] = useState<string | null>(null)

  const refreshGroups = async (showLoader = true) => {
    if (showLoader) {
      setIsGroupsLoading(true)
    }

    try {
      const [myGroupsResponse, discoverGroupsResponse] = await Promise.all([
        apiRequest<GroupData[]>('/groups/me', { method: 'GET' }),
        apiRequest<GroupData[]>('/groups/discover', { method: 'GET' }),
      ])

      setMyGroups(myGroupsResponse)
      setDiscoverGroups(discoverGroupsResponse)
      setGroupsError('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tải dữ liệu nhóm hiện tại.'
      setGroupsError(message)
      throw error
    } finally {
      if (showLoader) {
        setIsGroupsLoading(false)
      }
    }
  }

  useEffect(() => {
    void refreshGroups()
  }, [])

  const handleCreateGroupOpen = () => {
    setEditingGroup(null)
    setIsCreateGroupOpen(true)
  }

  const handleCreateGroupClose = () => {
    setIsCreateGroupOpen(false)
    setEditingGroup(null)
  }

  const handleSubmitCreate = async (data: CreateGroupFormData) => {
    try {
      setIsSubmitting(true)
      setGroupsError('')

      if (editingGroup) {
        setEditingGroupId(editingGroup._id)
        await apiRequest(`/groups/${editingGroup._id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            maxMembers: data.maxMembers,
            avatar: data.avatar,
          }),
        })
      } else {
        await apiRequest('/groups', {
          method: 'POST',
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            maxMembers: data.maxMembers,
            avatar: data.avatar,
          }),
        })
      }

      await refreshGroups(false)
      setFeedback({
        message: editingGroup ? 'Cập nhật nhóm thành công.' : 'Tạo nhóm thành công, danh sách nhóm đã được cập nhật.',
        severity: 'success',
      })
      setFocusMyGroupsSignal(Date.now())
      setIsCreateGroupOpen(false)
      setEditingGroup(null)
      return true
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : editingGroup
          ? 'Cập nhật nhóm thất bại.'
          : 'Tạo nhóm thất bại.'
      console.error('Error saving group:', error)
      setFeedback({
        message,
        severity: 'error',
      })
      return false
    } finally {
      setIsSubmitting(false)
      setEditingGroupId(null)
    }
  }

  const handleEditGroup = (group: GroupData) => {
    if (!user || group.creator_id !== user._id) {
      return
    }

    setEditingGroup(group)
    setIsCreateGroupOpen(true)
  }

  const handleDeleteGroup = async (group: GroupData) => {
    try {
      setDeletingGroupId(group._id)
      setGroupsError('')

      await apiRequest(`/groups/${group._id}`, {
        method: 'DELETE',
      })

      await refreshGroups(false)
      setFeedback({
        message: `Đã xóa nhóm "${group.name}" thành công.`,
        severity: 'success',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Xóa nhóm thất bại.'
      console.error('Error deleting group:', error)
      setFeedback({
        message,
        severity: 'error',
      })
    } finally {
      setDeletingGroupId(null)
    }
  }

  const handleRequestJoin = async (group: GroupData) => {
    try {
      setRequestingGroupId(group._id)
      setGroupsError('')

      await apiRequest(`/groups/${group._id}/join`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      await refreshGroups(false)
      setFeedback({
        message: `Đã gửi yêu cầu tham gia "${group.name}".`,
        severity: 'success',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể gửi yêu cầu tham gia.'
      console.error('Error requesting to join group:', error)
      setFeedback({
        message,
        severity: 'error',
      })
    } finally {
      setRequestingGroupId(null)
    }
  }

  const handleAcceptRequest = async (groupId: string, userId: string) => {
    const requestKey = `${groupId}:${userId}`

    try {
      setProcessingRequestKey(requestKey)
      setGroupsError('')

      await apiRequest(`/groups/${groupId}/requests/${userId}/accept`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      await refreshGroups(false)
      setFeedback({
        message: 'Đã duyệt yêu cầu tham gia nhóm.',
        severity: 'success',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể duyệt yêu cầu tham gia.'
      console.error('Error accepting request:', error)
      setFeedback({
        message,
        severity: 'error',
      })
    } finally {
      setProcessingRequestKey(null)
    }
  }

  const handleRejectRequest = async (groupId: string, userId: string) => {
    const requestKey = `${groupId}:${userId}`

    try {
      setProcessingRequestKey(requestKey)
      setGroupsError('')

      await apiRequest(`/groups/${groupId}/requests/${userId}/reject`, {
        method: 'POST',
        body: JSON.stringify({}),
      })

      await refreshGroups(false)
      setFeedback({
        message: 'Đã từ chối yêu cầu tham gia nhóm.',
        severity: 'success',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể từ chối yêu cầu tham gia.'
      console.error('Error rejecting request:', error)
      setFeedback({
        message,
        severity: 'error',
      })
    } finally {
      setProcessingRequestKey(null)
    }
  }

  const handleOpenGroup = (group: GroupData) => {
    navigate(`/groups/${group._id}`)
  }

  return (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isSubmitting || isGroupsLoading}
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
          <Group
            currentUserId={user?._id}
            handleCreateGroupOpen={handleCreateGroupOpen}
            myGroups={myGroups}
            discoverGroups={discoverGroups}
            errorMessage={groupsError}
            focusMyGroupsSignal={focusMyGroupsSignal}
            deletingGroupId={deletingGroupId}
            editingGroupId={editingGroupId}
            requestingGroupId={requestingGroupId}
            processingRequestKey={processingRequestKey}
            onDeleteGroup={handleDeleteGroup}
            onEditGroup={handleEditGroup}
            onOpenGroup={handleOpenGroup}
            onRequestJoin={handleRequestJoin}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
          <CreateGroup
            isOpen={isCreateGroupOpen}
            handleClose={handleCreateGroupClose}
            handleSubmitCreate={handleSubmitCreate}
            mode={editingGroup ? 'edit' : 'create'}
            initialData={editingGroup
              ? {
                  name: editingGroup.name,
                  description: editingGroup.description || '',
                  maxMembers: editingGroup.maxMembers,
                  avatar: editingGroup.avatar || '',
                }
              : undefined}
          />
        </Container>
      </Box>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {feedback ? (
          <Alert onClose={() => setFeedback(null)} severity={feedback.severity} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}

export default HomePage
