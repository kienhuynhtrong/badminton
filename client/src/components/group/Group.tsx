import { useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'

type GroupRole = 'admin' | 'member'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface GroupMember {
  user_id: string
  role: GroupRole
  joinedAt?: string
}

interface PendingRequestUser {
  _id: string
  username: string
  nickname: string
  email: string
}

export interface GroupPendingRequest {
  _id: string
  userId: string
  user: PendingRequestUser | null
  message: string
  requestedAt?: string
}

export interface GroupData {
  _id: string
  name: string
  description?: string
  avatar?: string
  creator_id?: string
  maxMembers: number
  members: GroupMember[]
  memberCount: number
  myRole?: GroupRole | null
  hasPendingRequest?: boolean
  pendingRequests?: GroupPendingRequest[]
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

interface GroupProps {
  currentUserId?: string
  handleCreateGroupOpen: () => void
  myGroups: GroupData[]
  discoverGroups: GroupData[]
  errorMessage?: string
  focusMyGroupsSignal?: number
  deletingGroupId?: string | null
  editingGroupId?: string | null
  requestingGroupId?: string | null
  processingRequestKey?: string | null
  onDeleteGroup: (group: GroupData) => Promise<void> | void
  onEditGroup: (group: GroupData) => void
  onOpenGroup: (group: GroupData) => void
  onRequestJoin: (group: GroupData) => Promise<void> | void
  onAcceptRequest: (groupId: string, userId: string) => Promise<void> | void
  onRejectRequest: (groupId: string, userId: string) => Promise<void> | void
}

const cardSx = {
  textAlign: 'left',
  bgcolor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 3,
  border: '1px solid rgba(255,255,255,0.2)',
  p: { xs: 2, md: 3 },
  backdropFilter: 'blur(10px)',
}

const Group: React.FC<GroupProps> = ({
  currentUserId,
  handleCreateGroupOpen,
  myGroups,
  discoverGroups,
  errorMessage,
  focusMyGroupsSignal = 0,
  deletingGroupId = null,
  editingGroupId = null,
  requestingGroupId = null,
  processingRequestKey = null,
  onDeleteGroup,
  onEditGroup,
  onOpenGroup,
  onRequestJoin,
  onAcceptRequest,
  onRejectRequest,
}) => {
  const [tabValue, setTabValue] = useState(0)
  const [groupToDelete, setGroupToDelete] = useState<GroupData | null>(null)

  useEffect(() => {
    if (focusMyGroupsSignal > 0) {
      setTabValue(0)
    }
  }, [focusMyGroupsSignal])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleConfirmDelete = async () => {
    if (!groupToDelete) {
      return
    }

    await onDeleteGroup(groupToDelete)
    setGroupToDelete(null)
  }

  const isCreator = (group: GroupData) => Boolean(currentUserId && group.creator_id === currentUserId)

  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
            Hội Nhóm
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateGroupOpen}
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
            <Tab label={`Nhóm của tôi (${myGroups.length})`} />
            <Tab label={`Các nhóm khác (${discoverGroups.length})`} />
          </Tabs>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          {myGroups.length > 0 ? (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {myGroups.map((group) => {
                const creator = isCreator(group)

                return (
                  <Box key={group._id} sx={cardSx}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Avatar
                          src={group.avatar || undefined}
                          variant="rounded"
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 2.5,
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#fff',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {group.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
                            {group.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
                            {group.description?.trim() || 'Nhóm này chưa có mô tả.'}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={group.myRole === 'admin' ? 'Trưởng nhóm' : 'Thành viên'}
                        sx={{
                          bgcolor: group.myRole === 'admin' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                      <Chip
                        icon={<PeopleAltOutlinedIcon sx={{ color: '#fff !important' }} />}
                        label={`${group.memberCount}/${group.maxMembers} thành viên`}
                        sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}
                      />
                      {creator && (
                        <Chip
                          label="Bạn là người tạo"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#fff',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {group.myRole === 'admin' && group.pendingRequests && group.pendingRequests.length > 0 && (
                      <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1.5 }}>
                          Yêu cầu chờ duyệt ({group.pendingRequests.length})
                        </Typography>

                        <Box sx={{ display: 'grid', gap: 1.5 }}>
                          {group.pendingRequests.map((request) => {
                            const requestKey = `${group._id}:${request.userId}`
                            const isProcessing = processingRequestKey === requestKey

                            return (
                              <Box
                                key={requestKey}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 2,
                                  flexWrap: 'wrap',
                                  bgcolor: 'rgba(255,255,255,0.06)',
                                  borderRadius: 2,
                                  p: 1.5,
                                }}
                              >
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                                    {request.user?.nickname || request.user?.username || 'Người dùng'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {request.user?.email || 'Đang chờ xác nhận tham gia nhóm'}
                                  </Typography>
                                  {request.message && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)', mt: 0.5 }}>
                                      "{request.message}"
                                    </Typography>
                                  )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  <Button
                                    variant="outlined"
                                    color="inherit"
                                    disabled={isProcessing}
                                    onClick={() => {
                                      void onRejectRequest(group._id, request.userId)
                                    }}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      borderRadius: 2,
                                      borderColor: 'rgba(255,255,255,0.35)',
                                      color: '#fff',
                                    }}
                                  >
                                    Từ chối
                                  </Button>
                                  <Button
                                    variant="contained"
                                    disableElevation
                                    disabled={isProcessing}
                                    onClick={() => {
                                      void onAcceptRequest(group._id, request.userId)
                                    }}
                                    sx={{
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      borderRadius: 2,
                                    }}
                                  >
                                    {isProcessing ? 'Đang xử lý...' : 'Duyệt'}
                                  </Button>
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        disableElevation
                        onClick={() => onOpenGroup(group)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2,
                          bgcolor: '#fff',
                          color: '#667eea',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.92)',
                          },
                        }}
                      >
                        Vào nhóm
                      </Button>
                    </Box>

                    {creator && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => onEditGroup(group)}
                          disabled={editingGroupId === group._id}
                          sx={{
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.35)',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: 'rgba(255,255,255,0.65)',
                              bgcolor: 'rgba(255,255,255,0.08)',
                            },
                          }}
                        >
                          {editingGroupId === group._id ? 'Đang lưu...' : 'Chỉnh sửa'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => setGroupToDelete(group)}
                          disabled={deletingGroupId === group._id}
                          sx={{
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.35)',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: 'rgba(255,255,255,0.65)',
                              bgcolor: 'rgba(255,255,255,0.08)',
                            },
                          }}
                        >
                          {deletingGroupId === group._id ? 'Đang xóa...' : 'Xóa nhóm'}
                        </Button>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          ) : (
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
                Hãy tạo nhóm mới hoặc gửi yêu cầu tham gia các nhóm khác
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {discoverGroups.length > 0 ? (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {discoverGroups.map((group) => (
                <Box key={group._id} sx={cardSx}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Avatar
                        src={group.avatar || undefined}
                        variant="rounded"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2.5,
                          bgcolor: 'rgba(255,255,255,0.18)',
                          color: '#fff',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {group.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.6 }}>
                          {group.description?.trim() || 'Nhóm này chưa có mô tả.'}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      icon={<PeopleAltOutlinedIcon sx={{ color: '#fff !important' }} />}
                      label={`${group.memberCount}/${group.maxMembers} thành viên`}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 2 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.82)', fontWeight: 600 }}>
                        Chủ nhóm sẽ duyệt yêu cầu trước khi bạn tham gia.
                      </Typography>
                      {group.hasPendingRequest && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                          Yêu cầu của bạn đã được gửi, vui lòng chờ phản hồi.
                        </Typography>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      disableElevation
                      disabled={group.hasPendingRequest || requestingGroupId === group._id}
                      onClick={() => {
                        void onRequestJoin(group)
                      }}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        minWidth: 170,
                        bgcolor: '#fff',
                        color: '#667eea',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.92)',
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(255,255,255,0.22)',
                          color: '#fff',
                        },
                      }}
                      startIcon={group.hasPendingRequest ? <HourglassTopRoundedIcon /> : undefined}
                    >
                      {requestingGroupId === group._id
                        ? 'Đang gửi...'
                        : group.hasPendingRequest
                          ? 'Đã gửi yêu cầu'
                          : 'Yêu cầu tham gia'}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
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
                Chưa có nhóm phù hợp để tham gia
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Khi có nhóm mới, bạn sẽ thấy và có thể gửi yêu cầu tham gia tại đây
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Container>

      <Dialog
        open={!!groupToDelete}
        onClose={() => {
          if (!deletingGroupId) {
            setGroupToDelete(null)
          }
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa nhóm</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Bạn có chắc muốn xóa nhóm "{groupToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hành động này sẽ xóa toàn bộ thông tin nhóm và không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setGroupToDelete(null)}
            disabled={!!deletingGroupId}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={!!deletingGroupId}
            variant="contained"
            disableElevation
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          >
            {deletingGroupId ? 'Đang xóa...' : 'Xóa nhóm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Group
