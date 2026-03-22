import { useEffect, useRef, useState } from 'react'
import { Camera, Users } from 'lucide-react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

export interface CreateGroupFormData {
  name: string
  description: string
  maxMembers: number | null
  avatar: string
}

interface CreateGroupProps {
  isOpen: boolean
  handleClose?: () => void
  handleSubmitCreate: (data: CreateGroupFormData) => Promise<boolean> | boolean
  mode?: 'create' | 'edit'
  initialData?: Partial<CreateGroupFormData>
}

interface ErrorGroup {
  isError: boolean
  message: string
}

const MAX_AVATAR_SIZE = 2 * 1024 * 1024

const getDefaultFormData = (initialData?: Partial<CreateGroupFormData>): CreateGroupFormData => ({
  name: initialData?.name ?? '',
  description: initialData?.description ?? '',
  maxMembers: initialData?.maxMembers ?? null,
  avatar: initialData?.avatar ?? '',
})

const CreateGroup = ({
  isOpen,
  handleClose,
  handleSubmitCreate,
  mode = 'create',
  initialData,
}: CreateGroupProps) => {
  const [formData, setFormData] = useState<CreateGroupFormData>(getDefaultFormData(initialData))
  const [nameGroupErrors, setNameGroupErrors] = useState<ErrorGroup>({ isError: false, message: '' })
  const [descriptionGroupErrors, setDescriptionGroupErrors] = useState<ErrorGroup>({ isError: false, message: '' })
  const [avatarGroupErrors, setAvatarGroupErrors] = useState<ErrorGroup>({ isError: false, message: '' })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const resetFormState = (nextData?: Partial<CreateGroupFormData>) => {
    setFormData(getDefaultFormData(nextData))
    setNameGroupErrors({ isError: false, message: '' })
    setDescriptionGroupErrors({ isError: false, message: '' })
    setAvatarGroupErrors({ isError: false, message: '' })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (isOpen) {
      resetFormState(initialData)
    }
  }, [isOpen, initialData])

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setAvatarGroupErrors({ isError: true, message: 'Vui lòng chọn file hình ảnh hợp lệ.' })
      event.target.value = ''
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarGroupErrors({ isError: true, message: 'Ảnh đại diện phải nhỏ hơn 2MB.' })
      event.target.value = ''
      return
    }

    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Không thể đọc file ảnh'))
      reader.readAsDataURL(file)
    }).catch(() => '')

    if (!imageDataUrl) {
      setAvatarGroupErrors({ isError: true, message: 'Không thể tải ảnh đại diện, vui lòng thử lại.' })
      event.target.value = ''
      return
    }

    setAvatarGroupErrors({ isError: false, message: '' })
    setFormData((prev) => ({ ...prev, avatar: imageDataUrl }))
  }

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: '' }))
    setAvatarGroupErrors({ isError: false, message: '' })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmitGroup = async () => {
    let hasError = false

    if (!formData.name.trim()) {
      setNameGroupErrors({ isError: true, message: 'Tên nhóm không được để trống' })
      hasError = true
    } else {
      setNameGroupErrors({ isError: false, message: '' })
    }

    if (!formData.maxMembers || formData.maxMembers < 1) {
      setDescriptionGroupErrors({ isError: true, message: 'Số lượng thành viên tối đa phải lớn hơn 0' })
      hasError = true
    } else {
      setDescriptionGroupErrors({ isError: false, message: '' })
    }

    if (hasError) return

    const isSuccess = await handleSubmitCreate(formData)

    if (isSuccess) {
      resetFormState()
    }
  }

  const handleCloseModal = () => {
    resetFormState(initialData)
    handleClose?.()
  }

  return (
    <Dialog open={isOpen} onClose={handleCloseModal} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, borderBottom: '1px solid #eee' }}>
        <Users size={24} style={{ marginRight: 8 }} />
        <Box>
          <Typography variant="h6" component="div">
            {mode === 'edit' ? 'Chỉnh Sửa Nhóm Cầu Lông' : 'Tạo Nhóm Cầu Lông Mới'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mode === 'edit'
              ? 'Cập nhật thông tin nhóm để giao diện và dữ liệu luôn đồng bộ.'
              : 'Hãy điền thông tin để bắt đầu tạo hội nhóm của bạn.'}
          </Typography>
        </Box>
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 'bold' }}>x</span>
        </IconButton>
      </DialogTitle>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmitGroup()
        }}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            required
            fullWidth
            label="Tên Nhóm (Bắt buộc)"
            placeholder="CLB cau long IT"
            value={formData.name}
            error={nameGroupErrors.isError}
            helperText={nameGroupErrors.message}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          />

          <TextField
            sx={{ mt: 2 }}
            multiline
            rows={3}
            name="description"
            fullWidth
            label="Mô tả & Quy định nhóm (Tùy chọn)"
            placeholder="Nhập quy định, trình độ yêu cầu, giờ chơi cố định, cách chia tiền sân..."
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Ảnh đại diện nhóm (Tùy chọn)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={formData.avatar || undefined} sx={{ width: 56, height: 56, bgcolor: 'action.hover' }}>
                {!formData.avatar && <Camera size={24} color="#757575" />}
              </Avatar>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="outlined" size="small" onClick={() => fileInputRef.current?.click()}>
                  {formData.avatar ? 'Đổi ảnh' : 'Tải ảnh lên'}
                </Button>
                {formData.avatar && (
                  <Button variant="text" size="small" color="inherit" onClick={handleRemoveAvatar}>
                    Xóa ảnh
                  </Button>
                )}
              </Box>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                void handleAvatarChange(event)
              }}
            />

            {avatarGroupErrors.isError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {avatarGroupErrors.message}
              </Typography>
            )}
          </Box>

          <TextField
            required
            onKeyDown={(event) => {
              if (['e', 'E', '+', '-', '.'].includes(event.key)) {
                event.preventDefault()
              }
            }}
            fullWidth
            type="number"
            sx={{
              mt: 2,
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                display: 'none',
                WebkitAppearance: 'none',
                margin: 0,
              },
              '& input[type=number]': {
                MozAppearance: 'textfield',
              },
            }}
            label="Số lượng thành viên tối đa (bắt buộc)"
            placeholder="Nhập số lượng thành viên tối đa..."
            InputProps={{
              inputProps: { min: 1, max: 20 },
            }}
            error={descriptionGroupErrors.isError}
            helperText={descriptionGroupErrors.message}
            value={formData.maxMembers ?? ''}
            onChange={(event) => {
              const value = event.target.value
              setFormData({
                ...formData,
                maxMembers: value ? Number(value) : null,
              })
            }}
          />
        </DialogContent>
      </form>

      <DialogActions>
        <Button onClick={handleCloseModal} variant="outlined" color="inherit">
          Hủy Bỏ
        </Button>
        <Button onClick={() => void handleSubmitGroup()} variant="contained" color="primary">
          {mode === 'edit' ? 'Lưu thay đổi' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateGroup
