import { type SyntheticEvent, useEffect, useState } from 'react'
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  completeGroupEvent,
  createGroupEvent,
  getGroupWorkspace,
  lockGroupEvent,
  submitGroupEventVote,
  toggleGroupEventPayment,
  updateGroupEventPayment,
  type CreateGroupEventPayload,
  type GroupEvent,
  type GroupWorkspace,
  type VoteOptionInput,
} from '../../service/apiService'

interface FeedbackState {
  message: string
  severity: 'success' | 'error'
}

interface EventFormState {
  title: string
  description: string
  scheduleOptions: VoteOptionInput[]
  locationOptions: VoteOptionInput[]
  courtOptions: VoteOptionInput[]
  totalCost: string
  paymentNote: string
}

const defaultCreateEventForm = (): EventFormState => ({
  title: 'Kèo tuần này',
  description: 'Vote nhanh để chốt lịch và sân cho buổi chơi gần nhất.',
  scheduleOptions: [
    { label: 'Thứ 3 - 19:00 đến 21:00', startAt: '', endAt: '' },
    { label: 'Thứ 5 - 19:00 đến 21:00', startAt: '', endAt: '' },
    { label: 'Chủ nhật - 08:00 đến 10:00', startAt: '', endAt: '' },
  ],
  locationOptions: [
    { label: 'Sân Lan Anh', address: 'Quận 9' },
    { label: 'Sân Phú Thọ', address: 'Quận 11' },
  ],
  courtOptions: [
    { label: '2 sân', courtCount: 2 },
    { label: '3 sân', courtCount: 3 },
    { label: '4 sân', courtCount: 4 },
  ],
  totalCost: '540000',
  paymentNote: 'Chia đều tiền sân cho các thành viên tham gia.',
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : ''
}

const getVotePercent = (voteCount: number, totalVotes: number) => {
  if (totalVotes <= 0) {
    return 0
  }

  return Math.round((voteCount / totalVotes) * 100)
}

const CreateEventDialog = ({
  open,
  loading,
  value,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean
  loading: boolean
  value: EventFormState
  onClose: () => void
  onChange: (nextValue: EventFormState) => void
  onSubmit: () => void
}) => {
  const updateScheduleOption = (index: number, field: keyof VoteOptionInput, nextValue: string) => {
    onChange({
      ...value,
      scheduleOptions: value.scheduleOptions.map((option, optionIndex) => (
        optionIndex === index ? { ...option, [field]: nextValue } : option
      )),
    })
  }

  const updateLocationOption = (index: number, field: keyof VoteOptionInput, nextValue: string) => {
    onChange({
      ...value,
      locationOptions: value.locationOptions.map((option, optionIndex) => (
        optionIndex === index ? { ...option, [field]: nextValue } : option
      )),
    })
  }

  const updateCourtOption = (index: number, field: keyof VoteOptionInput, nextValue: string) => {
    onChange({
      ...value,
      courtOptions: value.courtOptions.map((option, optionIndex) => (
        optionIndex === index
          ? { ...option, [field]: field === 'courtCount' ? Number(nextValue) || undefined : nextValue }
          : option
      )),
    })
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>Tạo phiên vote mới</DialogTitle>
      <DialogContent dividers sx={{ display: 'grid', gap: 3 }}>
        <TextField
          label="Tên buổi chơi"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          fullWidth
        />
        <TextField
          label="Mô tả ngắn"
          value={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          fullWidth
          multiline
          minRows={2}
        />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Lựa chọn khung giờ
          </Typography>
          <Stack spacing={1.5}>
            {value.scheduleOptions.map((option, index) => (
              <Box key={`schedule-${index}`} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr 1fr' } }}>
                <TextField
                  label={`Khung giờ ${index + 1}`}
                  value={option.label || ''}
                  onChange={(event) => updateScheduleOption(index, 'label', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Bắt đầu"
                  type="datetime-local"
                  value={typeof option.startAt === 'string' ? option.startAt : ''}
                  onChange={(event) => updateScheduleOption(index, 'startAt', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Kết thúc"
                  type="datetime-local"
                  value={typeof option.endAt === 'string' ? option.endAt : ''}
                  onChange={(event) => updateScheduleOption(index, 'endAt', event.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            ))}
          </Stack>
          <Button
            onClick={() => onChange({
              ...value,
              scheduleOptions: [...value.scheduleOptions, { label: '', startAt: '', endAt: '' }],
            })}
            sx={{ mt: 1.5, textTransform: 'none', fontWeight: 700 }}
            startIcon={<AddRoundedIcon />}
          >
            Thêm khung giờ
          </Button>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Lựa chọn địa điểm
          </Typography>
          <Stack spacing={1.5}>
            {value.locationOptions.map((option, index) => (
              <Box key={`location-${index}`} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <TextField
                  label={`Tên sân ${index + 1}`}
                  value={option.label || ''}
                  onChange={(event) => updateLocationOption(index, 'label', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Địa chỉ / khu vực"
                  value={option.address || ''}
                  onChange={(event) => updateLocationOption(index, 'address', event.target.value)}
                  fullWidth
                />
              </Box>
            ))}
          </Stack>
          <Button
            onClick={() => onChange({
              ...value,
              locationOptions: [...value.locationOptions, { label: '', address: '' }],
            })}
            sx={{ mt: 1.5, textTransform: 'none', fontWeight: 700 }}
            startIcon={<AddRoundedIcon />}
          >
            Thêm địa điểm
          </Button>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
            Lựa chọn số sân
          </Typography>
          <Stack spacing={1.5}>
            {value.courtOptions.map((option, index) => (
              <Box key={`court-${index}`} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 180px' } }}>
                <TextField
                  label={`Nhãn hiển thị ${index + 1}`}
                  value={option.label || ''}
                  onChange={(event) => updateCourtOption(index, 'label', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Số sân"
                  type="number"
                  value={option.courtCount || ''}
                  onChange={(event) => updateCourtOption(index, 'courtCount', event.target.value)}
                  fullWidth
                  inputProps={{ min: 1 }}
                />
              </Box>
            ))}
          </Stack>
          <Button
            onClick={() => onChange({
              ...value,
              courtOptions: [...value.courtOptions, { label: '', courtCount: 1 }],
            })}
            sx={{ mt: 1.5, textTransform: 'none', fontWeight: 700 }}
            startIcon={<AddRoundedIcon />}
          >
            Thêm số sân
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '220px 1fr' } }}>
          <TextField
            label="Tổng chi phí dự kiến"
            type="number"
            value={value.totalCost}
            onChange={(event) => onChange({ ...value, totalCost: event.target.value })}
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Ghi chú thanh toán"
            value={value.paymentNote}
            onChange={(event) => onChange({ ...value, paymentNote: event.target.value })}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Hủy
        </Button>
        <Button onClick={onSubmit} variant="contained" disableElevation disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo phiên vote'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const GroupDetailPage = () => {
  const { id: groupId = '' } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [workspace, setWorkspace] = useState<GroupWorkspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [eventForm, setEventForm] = useState<EventFormState>(defaultCreateEventForm())
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [selectedCourtId, setSelectedCourtId] = useState('')
  const [voteNote, setVoteNote] = useState('')
  const [paymentTotalCost, setPaymentTotalCost] = useState('')
  const [paymentNote, setPaymentNote] = useState('')

  const activeTab = searchParams.get('tab') === 'payment' ? 'payment' : 'vote'
  const activeEvent = workspace?.activeEvent ?? null
  const group = workspace?.group ?? null

  const syncLocalState = (nextWorkspace: GroupWorkspace) => {
    setWorkspace(nextWorkspace)
    setSelectedScheduleId(nextWorkspace.activeEvent?.myVote?.scheduleOptionId || '')
    setSelectedLocationId(nextWorkspace.activeEvent?.myVote?.locationOptionId || '')
    setSelectedCourtId(nextWorkspace.activeEvent?.myVote?.courtOptionId || '')
    setVoteNote(nextWorkspace.activeEvent?.myVote?.note || '')
    setPaymentTotalCost(String(nextWorkspace.activeEvent?.payment.totalCost ?? 0))
    setPaymentNote(nextWorkspace.activeEvent?.payment.note || '')
  }

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!groupId) {
        return
      }

      try {
        setIsLoading(true)
        const nextWorkspace = await getGroupWorkspace(groupId)
        syncLocalState(nextWorkspace)
      } catch (error) {
        setFeedback({
          message: error instanceof Error ? error.message : 'Không thể tải dữ liệu nhóm.',
          severity: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchWorkspace()
  }, [groupId])

  const updateTab = (nextTab: string) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', nextTab)
    setSearchParams(nextParams, { replace: true })
  }

  const handleTabChange = (_event: SyntheticEvent, nextTab: string) => {
    updateTab(nextTab)
  }

  const handleCreateEvent = async () => {
    if (!groupId) {
      return
    }

    try {
      const payload: CreateGroupEventPayload = {
        title: eventForm.title,
        description: eventForm.description,
        scheduleOptions: eventForm.scheduleOptions.filter((option) => option.label?.trim()),
        locationOptions: eventForm.locationOptions.filter((option) => option.label?.trim()),
        courtOptions: eventForm.courtOptions.filter((option) => option.courtCount),
        totalCost: Number(eventForm.totalCost || 0),
        paymentNote: eventForm.paymentNote,
      }

      setIsSubmitting(true)
      const nextWorkspace = await createGroupEvent(groupId, payload)
      syncLocalState(nextWorkspace)
      setIsCreateDialogOpen(false)
      setEventForm(defaultCreateEventForm())
      setFeedback({
        message: 'Phiên vote mới đã được tạo cho nhóm.',
        severity: 'success',
      })
      updateTab('vote')
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể tạo phiên vote.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitVote = async () => {
    if (!groupId || !activeEvent) {
      return
    }

    if (!selectedScheduleId || !selectedLocationId || !selectedCourtId) {
      setFeedback({
        message: 'Bạn cần chọn đủ thời gian, địa điểm và số sân trước khi gửi vote.',
        severity: 'error',
      })
      return
    }

    try {
      setIsSubmitting(true)
      const nextWorkspace = await submitGroupEventVote(groupId, activeEvent._id, {
        scheduleOptionId: selectedScheduleId,
        locationOptionId: selectedLocationId,
        courtOptionId: selectedCourtId,
        note: voteNote,
      })
      syncLocalState(nextWorkspace)
      setFeedback({
        message: 'Bình chọn của bạn đã được lưu.',
        severity: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể lưu bình chọn.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLockEvent = async () => {
    if (!groupId || !activeEvent) {
      return
    }

    try {
      setIsSubmitting(true)
      const nextWorkspace = await lockGroupEvent(groupId, activeEvent._id)
      syncLocalState(nextWorkspace)
      setFeedback({
        message: 'Buổi chơi đã được chốt từ kết quả vote hiện tại.',
        severity: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể chốt buổi chơi.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSavePayment = async () => {
    if (!groupId || !activeEvent) {
      return
    }

    try {
      setIsSubmitting(true)
      const nextWorkspace = await updateGroupEventPayment(groupId, activeEvent._id, {
        totalCost: Number(paymentTotalCost || 0),
        note: paymentNote,
      })
      syncLocalState(nextWorkspace)
      setFeedback({
        message: 'Thông tin thanh toán đã được cập nhật.',
        severity: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể cập nhật thanh toán.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTogglePayment = async (userId: string, isPaid: boolean) => {
    if (!groupId || !activeEvent) {
      return
    }

    try {
      setIsSubmitting(true)
      const nextWorkspace = await toggleGroupEventPayment(groupId, activeEvent._id, userId, !isPaid)
      syncLocalState(nextWorkspace)
      setFeedback({
        message: 'Trạng thái thanh toán đã được cập nhật.',
        severity: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái thanh toán.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteEvent = async () => {
    if (!groupId || !activeEvent) {
      return
    }

    try {
      setIsSubmitting(true)
      const nextWorkspace = await completeGroupEvent(groupId, activeEvent._id)
      syncLocalState(nextWorkspace)
      setFeedback({
        message: 'Buổi chơi đã được hoàn tất. Bạn có thể tạo phiên vote mới.',
        severity: 'success',
      })
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Không thể hoàn tất buổi chơi.',
        severity: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderVoteSection = (event: GroupEvent) => {
    return (
      <Box sx={{ display: 'grid', gap: 3 }}>
        {event.status !== 'voting' && event.finalSelection && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(53,198,255,0.18), rgba(111,227,193,0.16))',
              border: '1px solid rgba(255,255,255,0.16)',
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
              Kết quả đã chốt
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.8 }}>
              {event.finalSelection.scheduleLabel} tại {event.finalSelection.locationLabel} ({event.finalSelection.locationAddress || 'đang cập nhật'}) với {event.finalSelection.courtLabel.toLowerCase()}.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.68)', mt: 1 }}>
              Chốt lúc {formatDateTime(event.finalSelection.lockedAt)}
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTimeRoundedIcon />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Chọn khung giờ</Typography>
            </Box>
            <Stack spacing={1.5}>
              {event.scheduleOptions.map((option) => {
                const isSelected = selectedScheduleId === option._id
                return (
                  <Paper
                    key={option._id}
                    onClick={() => event.status === 'voting' && setSelectedScheduleId(option._id)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      cursor: event.status === 'voting' ? 'pointer' : 'default',
                      bgcolor: isSelected ? 'rgba(53,198,255,0.22)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: isSelected ? '1px solid rgba(53,198,255,0.7)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                    elevation={0}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{option.label}</Typography>
                        {(option.startAt || option.endAt) && (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>
                            {formatDateTime(option.startAt)} {option.endAt ? `- ${formatDateTime(option.endAt)}` : ''}
                          </Typography>
                        )}
                      </Box>
                      <Chip label={`${option.voteCount} phiếu`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getVotePercent(option.voteCount, event.totalVotes)}
                      sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)' }}
                    />
                  </Paper>
                )
              })}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PlaceRoundedIcon />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Chọn địa điểm</Typography>
            </Box>
            <Stack spacing={1.5}>
              {event.locationOptions.map((option) => {
                const isSelected = selectedLocationId === option._id
                return (
                  <Paper
                    key={option._id}
                    onClick={() => event.status === 'voting' && setSelectedLocationId(option._id)}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      cursor: event.status === 'voting' ? 'pointer' : 'default',
                      bgcolor: isSelected ? 'rgba(53,198,255,0.22)' : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: isSelected ? '1px solid rgba(53,198,255,0.7)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                    elevation={0}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{option.label}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>
                          {option.address || 'Chưa có địa chỉ chi tiết'}
                        </Typography>
                      </Box>
                      <Chip label={`${option.voteCount} phiếu`} sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getVotePercent(option.voteCount, event.totalVotes)}
                      sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)' }}
                    />
                  </Paper>
                )
              })}
            </Stack>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SportsScoreRoundedIcon />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Chọn số sân</Typography>
          </Box>
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
            {event.courtOptions.map((option) => {
              const isSelected = selectedCourtId === option._id
              return (
                <Paper
                  key={option._id}
                  onClick={() => event.status === 'voting' && setSelectedCourtId(option._id)}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: event.status === 'voting' ? 'pointer' : 'default',
                    bgcolor: isSelected ? 'rgba(53,198,255,0.22)' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: isSelected ? '1px solid rgba(53,198,255,0.7)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                  elevation={0}
                >
                  <Typography sx={{ fontWeight: 800 }}>{option.label}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', mt: 0.5 }}>
                    {option.voteCount} phiếu
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getVotePercent(option.voteCount, event.totalVotes)}
                    sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)' }}
                  />
                </Paper>
              )
            })}
          </Box>
          <TextField
            label="Ghi chú cho trưởng nhóm"
            value={voteNote}
            onChange={(eventValue) => setVoteNote(eventValue.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 2.5 }}
            InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{
              sx: {
                color: '#fff',
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.16)',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
              Tổng cộng {event.totalVotes} thành viên đã gửi bình chọn.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {event.permissions.canManage && event.status === 'voting' && (
                <Button variant="outlined" color="inherit" onClick={handleLockEvent}>
                  Chốt kết quả
                </Button>
              )}
              {event.status === 'voting' && (
                <Button variant="contained" disableElevation onClick={handleSubmitVote}>
                  Gửi bình chọn
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    )
  }

  const renderPaymentSection = (event: GroupEvent) => {
    return (
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '300px 1fr' } }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mb: 1 }}>
              Tổng chi phí sân
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              {formatCurrency(event.payment.totalCost)}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 2 }}>
              Đã thu {event.payment.paidCount}/{event.payment.items.length} người
            </Typography>
            <LinearProgress
              variant="determinate"
              value={event.payment.items.length > 0 ? (event.payment.paidCount / event.payment.items.length) * 100 : 0}
              sx={{ mt: 1.5, height: 9, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)' }}
            />
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Cập nhật thanh toán
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '220px 1fr auto' } }}>
              <TextField
                label="Tổng chi phí"
                type="number"
                value={paymentTotalCost}
                onChange={(eventValue) => setPaymentTotalCost(eventValue.target.value)}
                disabled={!event.permissions.canManage}
                fullWidth
              />
              <TextField
                label="Ghi chú"
                value={paymentNote}
                onChange={(eventValue) => setPaymentNote(eventValue.target.value)}
                disabled={!event.permissions.canManage}
                fullWidth
              />
              {event.permissions.canManage && (
                <Button variant="contained" disableElevation onClick={handleSavePayment}>
                  Lưu tiền
                </Button>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)', mt: 2 }}>
              Hệ thống đang chia đều chi phí cho tất cả thành viên trong nhóm ở buổi chơi này.
            </Typography>
          </Paper>
        </Box>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Danh sách đóng tiền
          </Typography>
          <Stack spacing={1.25}>
            {event.payment.items.map((item) => (
              <Box
                key={item.userId}
                sx={{
                  display: 'grid',
                  gap: 1.5,
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 150px 180px' },
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)' }}>
                    {(item.nickname || item.username || '?').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700 }}>{item.nickname || item.username}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>
                      {item.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 800 }}>{formatCurrency(item.amount)}</Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={item.isPaid ? <CheckCircleRoundedIcon /> : <PaymentsRoundedIcon />}
                    label={item.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    sx={{
                      bgcolor: item.isPaid ? 'rgba(111,227,193,0.2)' : 'rgba(255,217,120,0.2)',
                      color: '#fff',
                    }}
                  />
                  {event.permissions.canManage && (
                    <Button variant="outlined" color="inherit" onClick={() => handleTogglePayment(item.userId, item.isPaid)}>
                      {item.isPaid ? 'Hoàn tác' : 'Đánh dấu đã trả'}
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>

          {event.permissions.canManage && event.status === 'locked' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5 }}>
              <Button
                variant="contained"
                color="success"
                disableElevation
                startIcon={<DoneAllRoundedIcon />}
                onClick={handleCompleteEvent}
              >
                Hoàn tất buổi chơi
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    )
  }

  return (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading || isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pb: 6 }}>
        <Container maxWidth="xl" sx={{ pt: 4 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/')}
            sx={{ color: '#fff', textTransform: 'none', fontWeight: 700, mb: 2 }}
          >
            Quay về danh sách nhóm
          </Button>

          {group && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 5,
                color: '#fff',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08))',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(14px)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', fontWeight: 700, letterSpacing: '0.08em' }}>
                    GROUP WORKSPACE
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>
                    {group.name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.76)', mt: 1.5, maxWidth: 900, lineHeight: 1.7 }}>
                    {group.description || 'Nhóm này chưa có mô tả. Hãy dùng workspace này để vote lịch chơi, chốt sân và theo dõi thanh toán cho từng buổi.'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', alignContent: 'flex-start' }}>
                  <Chip label={`${group.memberCount}/${group.maxMembers} thành viên`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700 }} />
                  <Chip label={group.myRole === 'admin' ? 'Trưởng nhóm' : 'Thành viên'} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#fff', fontWeight: 700 }} />
                  {group.myRole === 'admin' && (!activeEvent || activeEvent.status === 'completed') && (
                    <Button
                      variant="contained"
                      disableElevation
                      startIcon={<EventAvailableRoundedIcon />}
                      onClick={() => setIsCreateDialogOpen(true)}
                      sx={{ borderRadius: 999, px: 2.5 }}
                    >
                      Tạo phiên vote
                    </Button>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.12)' }} />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {group.members.map((member) => (
                  <Chip
                    key={member.userId}
                    avatar={<Avatar>{member.nickname.charAt(0).toUpperCase()}</Avatar>}
                    label={`${member.nickname}${member.role === 'admin' ? ' • admin' : ''}`}
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          {!activeEvent && !isLoading && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 4,
                borderRadius: 5,
                textAlign: 'center',
                color: '#fff',
                background: 'rgba(255,255,255,0.1)',
                border: '1px dashed rgba(255,255,255,0.25)',
              }}
            >
              <HowToVoteRoundedIcon sx={{ fontSize: 54, opacity: 0.9 }} />
              <Typography variant="h5" sx={{ fontWeight: 900, mt: 1.5 }}>
                Chưa có phiên vote nào cho nhóm này
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.76)', mt: 1.5, maxWidth: 680, mx: 'auto' }}>
                Khi trưởng nhóm tạo một phiên vote, mọi thành viên sẽ vào đây để bình chọn thời gian, địa điểm và số sân cho buổi chơi tiếp theo.
              </Typography>
              {group?.myRole === 'admin' && (
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<AddRoundedIcon />}
                  onClick={() => setIsCreateDialogOpen(true)}
                  sx={{ mt: 3, borderRadius: 999, px: 3 }}
                >
                  Tạo phiên vote đầu tiên
                </Button>
              )}
            </Paper>
          )}

          {activeEvent && (
            <Box sx={{ mt: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 5,
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Box sx={{ px: { xs: 2, md: 3 }, pt: 2.5 }}>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900 }}>
                    {activeEvent.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 0.75 }}>
                    {activeEvent.description || 'Phiên vote đang giúp nhóm chọn lịch chơi, sân và chi phí cho buổi gần nhất.'}
                  </Typography>

                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' }, mt: 2.5, mb: 2.5 }}>
                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }} elevation={0}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>Trạng thái</Typography>
                      <Typography sx={{ fontWeight: 800, mt: 0.75 }}>{activeEvent.status === 'voting' ? 'Đang vote' : activeEvent.status === 'locked' ? 'Đã chốt' : 'Hoàn tất'}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }} elevation={0}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>Số phiếu</Typography>
                      <Typography sx={{ fontWeight: 800, mt: 0.75 }}>{activeEvent.totalVotes}/{activeEvent.memberCount}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }} elevation={0}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>Đã thu</Typography>
                      <Typography sx={{ fontWeight: 800, mt: 0.75 }}>{activeEvent.payment.paidCount}/{activeEvent.payment.items.length}</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }} elevation={0}>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.66)' }}>Chi phí</Typography>
                      <Typography sx={{ fontWeight: 800, mt: 0.75 }}>{formatCurrency(activeEvent.payment.totalCost)}</Typography>
                    </Paper>
                  </Box>
                </Box>

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    px: 2,
                    '& .MuiTab-root': {
                      color: 'rgba(255,255,255,0.72)',
                      fontWeight: 800,
                      textTransform: 'none',
                    },
                    '& .Mui-selected': {
                      color: '#fff !important',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#fff',
                      height: 3,
                    },
                  }}
                >
                  <Tab icon={<HowToVoteRoundedIcon />} iconPosition="start" value="vote" label="Vote lịch và sân" />
                  <Tab icon={<PaymentsRoundedIcon />} iconPosition="start" value="payment" label="Thanh toán" />
                </Tabs>
              </Paper>

              <Box sx={{ mt: 3 }}>
                {activeTab === 'vote' ? renderVoteSection(activeEvent) : renderPaymentSection(activeEvent)}
              </Box>
            </Box>
          )}
        </Container>
      </Box>

      <CreateEventDialog
        open={isCreateDialogOpen}
        loading={isSubmitting}
        value={eventForm}
        onClose={() => {
          setIsCreateDialogOpen(false)
          setEventForm(defaultCreateEventForm())
        }}
        onChange={setEventForm}
        onSubmit={handleCreateEvent}
      />

      <Snackbar
        open={!!feedback}
        autoHideDuration={3500}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}

export default GroupDetailPage
