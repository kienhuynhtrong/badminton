import { Card, CardContent, Typography, Box, Button, Chip, AvatarGroup, Avatar } from '@mui/material'
import { CheckCircle as CheckIcon, LocationOn as LocationIcon } from '@mui/icons-material'

export interface GroupData {
    id: string
    name: string
    description: string
    location: string
    status: 'public' | 'private'
    members: number
    hasJoined: boolean
}

interface GroupCardProps {
    group: GroupData
    onJoin: (id: string) => void
    onClickCard?: (group: GroupData) => void
}

const GroupCard = ({ group, onJoin, onClickCard }: GroupCardProps) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'rgba(59, 130, 246, 0.15)', // Lighter blue tinted border
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.08), 0 4px 10px -4px rgba(0, 0, 0, 0.04)', // Stronger definition shadow
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.15), 0 10px 20px -5px rgba(14, 165, 233, 0.1)',
                    borderColor: 'rgba(14, 165, 233, 0.4)', // Highlight border on hover
                }
            }}
            onClick={() => onClickCard && onClickCard(group)}
        >
            {/* Absolute badge for joined status */}
            {group.hasJoined && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                    }}
                >
                    <CheckIcon sx={{ fontSize: 14 }} /> Đã tham gia
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: '#1e293b'
                    }}>
                        {group.name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                        label={group.status === 'public' ? 'Công khai' : 'Riêng tư'}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            bgcolor: group.status === 'public' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: group.status === 'public' ? '#0284c7' : '#d97706',
                            border: 'none'
                        }}
                    />
                    <Chip
                        icon={<LocationIcon sx={{ fontSize: '14px !important' }} />}
                        label={group.location.split(',')[0]} // Show only first part of location for brevity
                        size="small"
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            bgcolor: '#f1f5f9',
                            color: '#475569',
                            border: 'none',
                            '& .MuiChip-icon': { color: '#64748b' }
                        }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{
                    mb: 4,
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6
                }}>
                    {group.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AvatarGroup
                            max={3}
                            sx={{
                                '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem', border: '1px solid white' }
                            }}
                        >
                            <Avatar sx={{ bgcolor: '#bae6fd', color: '#0284c7' }}>A</Avatar>
                            <Avatar sx={{ bgcolor: '#fed7aa', color: '#c2410c' }}>B</Avatar>
                            <Avatar sx={{ bgcolor: '#bbf7d0', color: '#15803d' }}>C</Avatar>
                        </AvatarGroup>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                            +{group.members}
                        </Typography>
                    </Box>

                    {group.hasJoined ? (
                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2, bgcolor: 'rgba(2, 132, 199, 0.05)', '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.15)' } }}
                            disableElevation
                        >
                            Vào nhóm →
                        </Button>
                    ) : group.status === 'public' ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation() // Prevent card click
                                onJoin(group.id)
                            }}
                            sx={{
                                borderRadius: 8,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                background: 'linear-gradient(45deg, #0284c7, #38bdf8)',
                                boxShadow: '0 4px 14px 0 rgba(2, 132, 199, 0.39)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #0369a1, #0284c7)',
                                    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.23)',
                                }
                            }}
                        >
                            Tham gia
                        </Button>
                    ) : (
                        <Button
                            variant="text"
                            size="small"
                            disabled
                            sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 600, bgcolor: '#f1f5f9', color: '#94a3b8' }}
                        >
                            Kín
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card >
    )
}

export default GroupCard
