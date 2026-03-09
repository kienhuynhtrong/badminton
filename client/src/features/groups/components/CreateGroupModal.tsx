import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

interface CreateGroupForm {
    name: string
    description: string
    location: string
    status: 'public' | 'private'
}

interface CreateGroupModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: CreateGroupForm) => void
}

const STATUS_OPTIONS = [
    { value: 'public', label: 'Công khai' },
    { value: 'private', label: 'Riêng tư' }
]

const CreateGroupModal = ({ open, onClose, onSubmit }: CreateGroupModalProps) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateGroupForm>({
        defaultValues: {
            name: '',
            description: '',
            location: '',
            status: 'public'
        }
    })

    const formSubmit = (data: CreateGroupForm) => {
        onSubmit(data)
        reset()
        onClose()
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo Hội Nhóm Mới</DialogTitle>

            <form onSubmit={handleSubmit(formSubmit)}>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Vui lòng nhập tên nhóm' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Tên nhóm"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />

                        <Controller
                            name="location"
                            control={control}
                            rules={{ required: 'Vui lòng nhập định vị / sân cầu lông' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Khu vực / Tên sân"
                                    fullWidth
                                    error={!!errors.location}
                                    helperText={errors.location?.message}
                                />
                            )}
                        />

                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: 'Vui lòng chọn trạng thái' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Trạng thái nhóm"
                                    fullWidth
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                >
                                    {STATUS_OPTIONS.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Vui lòng nhập mô tả' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Mô tả"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" disableElevation>
                        Tạo nhóm
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CreateGroupModal
