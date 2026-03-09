import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Chip, Avatar, AvatarGroup } from '@mui/material'
import type { GroupData } from './GroupCard'

interface GroupPreviewModalProps {
    open: boolean
    group: GroupData | null
    onClose: () => void
    onJoin: (id: string) => void
}

const GroupPreviewModal = ({ open, group, onClose, onJoin }: GroupPreviewModalProps) => {
    if (!group) return null

    const handleJoin = () => {
        onJoin(group.id)
        onClose()
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            }}
        >
            <Box sx={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                color: 'white',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    Chi tiết Hội Nhóm
                </Typography>
            </Box>

            <DialogContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ mb: 2, color: '#0f172a', lineHeight: 1.2 }}>
                    {group.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                        label={group.status === 'public' ? 'Công khai' : 'Riêng tư'}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            bgcolor: group.status === 'public' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                            color: group.status === 'public' ? '#0284c7' : '#b45309',
                            border: 'none'
                        }}
                    />
                    <Chip
                        label={group.location}
                        size="small"
                        sx={{
                            fontWeight: 500,
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            border: 'none'
                        }}
                    />
                </Box>

                <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 3, mb: 4, border: '1px solid rgba(0,0,0,0.03)' }}>
                    <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7 }}>
                        {group.description}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Thành viên:
                    </Typography>
                    <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { width: 36, height: 36, border: '2px solid white' } }}>
                        <Avatar sx={{ bgcolor: '#bae6fd', color: '#0284c7' }}>A</Avatar>
                        <Avatar sx={{ bgcolor: '#fed7aa', color: '#c2410c' }}>B</Avatar>
                        <Avatar sx={{ bgcolor: '#bbf7d0', color: '#15803d' }}>C</Avatar>
                        <Avatar sx={{ bgcolor: '#e9d5ff', color: '#7e22ce' }}>D</Avatar>
                    </AvatarGroup>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, ml: 1 }}>
                        +{group.members}
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
                <Button onClick={onClose} sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', px: 3 }}>Đóng</Button>
                {group.status === 'public' && (
                    <Button
                        variant="contained"
                        onClick={handleJoin}
                        sx={{
                            borderRadius: 8,
                            px: 5,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                            boxShadow: '0 8px 20px -5px rgba(2, 132, 199, 0.4)',
                            transition: 'all 0.3s',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #0369a1, #0284c7)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 25px -5px rgba(2, 132, 199, 0.5)',
                            }
                        }}
                    >
                        Xin gia nhập
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default GroupPreviewModal
