import { useState } from 'react'
import { Container, Typography, Box, Button, Grid, Snackbar, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GroupCard from './components/GroupCard'
import type { GroupData } from './components/GroupCard'
import CreateGroupModal from './components/CreateGroupModal'
import GroupPreviewModal from './components/GroupPreviewModal'
import { useNavigate } from 'react-router-dom'

const INITIAL_GROUPS: GroupData[] = [
    {
        id: '1',
        name: 'Giao Lưu Cầu Lông Q9 - Thủ Đức',
        description: 'Tụ tập anh em quận 9 đánh cầu vào các tối thứ 3, 5, 7. Trình độ trung bình khá (Yếu có thể tập thêm)',
        location: 'Sân cầu lông Lan Anh, Quận 9',
        status: 'public',
        members: 24,
        hasJoined: false
    },
    {
        id: '2',
        name: 'Team Cầu Lông Đỉnh Cao Gò Vấp',
        description: 'Chuyên đánh độ, rèn luyện thể lực và kỹ chiến thuật. Yêu cầu trình độ khá trở lên.',
        location: 'Sân cầu lông Đạt Đức, Gò Vấp',
        status: 'private',
        members: 12,
        hasJoined: true
    },
    {
        id: '3',
        name: 'Hội Gà Mờ Cầu Lông',
        description: 'Nhóm dành cho các bạn mới tập chơi, giao lưu vui vẻ nâng cao sức khỏe là chính.',
        location: 'Sân cầu lông Viettel, Quận 10',
        status: 'public',
        members: 45,
        hasJoined: false
    }
]

const GroupsPage = () => {
    const [groups, setGroups] = useState<GroupData[]>(INITIAL_GROUPS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [tabIndex, setTabIndex] = useState(0)

    const [previewGroup, setPreviewGroup] = useState<GroupData | null>(null)
    const navigate = useNavigate()

    const myGroups = groups.filter(g => g.hasJoined)
    const publicGroups = groups.filter(g => !g.hasJoined && g.status === 'public')

    const handleJoinGroup = (id: string) => {
        const groupName = groups.find(g => g.id === id)?.name

        // Giả lập API call delay
        setTimeout(() => {
            setGroups(prev => prev.map(group => {
                if (group.id === id) {
                    return { ...group, hasJoined: true, members: group.members + 1 }
                }
                return group
            }))
            setToastMessage(`Đã gửi yêu cầu tham gia "${groupName}" !`)
        }, 600)
    }

    const handleCreateGroup = (data: { name: string, description: string, location: string, status: 'public' | 'private' }) => {
        const newGroup: GroupData = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description,
            location: data.location,
            status: data.status,
            members: 1,
            hasJoined: true
        }
        setGroups(prev => [newGroup, ...prev])
        setToastMessage('Đã tạo nhóm thành công!')
    }

    const handleCardClick = (group: GroupData) => {
        if (group.hasJoined) {
            navigate(`/groups/${group.id}`)
        } else if (group.status === 'public') {
            setPreviewGroup(group)
        }
    }

    return (
        <Box sx={{ backgroundColor: '#f8fafc', pb: 4 }}>

            {/* Hero Header Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                pt: 8,
                pb: 6,
                mb: 4,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background circle */}
                <Box sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ maxWidth: 600 }}>
                            <Typography variant="h3" fontWeight="800" sx={{ mb: 2, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Cộng Đồng Cầu Lông
                            </Typography>
                            <Typography variant="h6" color="#94a3b8" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
                                Nơi tụ hội đam mê, tìm kiếm đồng đội, và tổ chức các kèo đấu rực lửa mỗi ngày.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsModalOpen(true)}
                            disableElevation
                            sx={{
                                borderRadius: 8,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 15px 25px -5px rgba(59, 130, 246, 0.5)',
                                }
                            }}
                        >
                            Tạo Hội Nhóm Mới
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                {/* Custom Segmented Control Tabs */}
                <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '100px',
                    p: 0.75,
                    display: 'inline-flex',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    mb: 5
                }}>
                    <Button
                        disableRipple
                        onClick={() => setTabIndex(0)}
                        sx={{
                            borderRadius: '100px',
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: tabIndex === 0 ? 'white' : '#64748b',
                            background: tabIndex === 0 ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)' : 'transparent',
                            boxShadow: tabIndex === 0 ? '0 4px 12px rgba(14, 165, 233, 0.3)' : 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: tabIndex === 0 ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(0,0,0,0.02)',
                            }
                        }}
                    >
                        Nhóm của tôi ({myGroups.length})
                    </Button>
                    <Button
                        disableRipple
                        onClick={() => setTabIndex(1)}
                        sx={{
                            borderRadius: '100px',
                            px: 4,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: tabIndex === 1 ? 'white' : '#64748b',
                            background: tabIndex === 1 ? 'linear-gradient(135deg, #0ea5e9, #3b82f6)' : 'transparent',
                            boxShadow: tabIndex === 1 ? '0 4px 12px rgba(14, 165, 233, 0.3)' : 'none',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: tabIndex === 1 ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'rgba(0,0,0,0.02)',
                            }
                        }}
                    >
                        Khám phá ({publicGroups.length})
                    </Button>
                </Box>

                {tabIndex === 0 && (
                    <Grid container spacing={3}>
                        {myGroups.map(group => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.id}>
                                <GroupCard group={group} onJoin={handleJoinGroup} onClickCard={handleCardClick} />
                            </Grid>
                        ))}
                        {myGroups.length === 0 && (
                            <Grid size={12}>
                                <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>
                                    Bạn chưa tham gia nhóm nào. Hãy chuyển qua tab Khám phá!
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}

                {tabIndex === 1 && (
                    <Grid container spacing={3}>
                        {publicGroups.map(group => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={group.id}>
                                <GroupCard group={group} onJoin={handleJoinGroup} onClickCard={handleCardClick} />
                            </Grid>
                        ))}
                        {publicGroups.length === 0 && (
                            <Grid size={12}>
                                <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>
                                    Không có nhóm công khai nào khả dụng.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>

            <CreateGroupModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateGroup}
            />

            <GroupPreviewModal
                open={!!previewGroup}
                group={previewGroup}
                onClose={() => setPreviewGroup(null)}
                onJoin={handleJoinGroup}
            />

            <Snackbar
                open={!!toastMessage}
                autoHideDuration={3000}
                onClose={() => setToastMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setToastMessage('')} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default GroupsPage
