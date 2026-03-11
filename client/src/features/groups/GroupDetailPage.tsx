import { Box, Container, Typography, Paper, Button, Grid, Tab, Tabs, Chip, AvatarGroup, Avatar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const GroupDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [tabIndex, setTabIndex] = useState(0)

    // TODO: Fetch group info from API using `id`
    // Mock Data for now
    const groupName = id === '1' ? 'Giao Lưu Cầu Lông Q9 - Thủ Đức' : 'Team Cầu Lông Đỉnh Cao'

    return (
        <Box sx={{ backgroundColor: '#f8fafc', pb: 4 }}>

            {/* Nav Header */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/groups')}
                        sx={{ my: 1.5, color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#f1f5f9' } }}
                    >
                        Quay lại danh sách
                    </Button>
                </Container>
            </Box>

            {/* Hero Banner Area */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                color: 'white',
                pt: 6,
                pb: 10,
                mb: -6,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative pattern */}
                <Box sx={{
                    position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
                    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography variant="h2" fontWeight="800" sx={{ mb: 2, letterSpacing: '-0.02em', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        {groupName}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                        <Chip
                            label="Nhóm Công khai"
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, border: 'none', backdropFilter: 'blur(10px)' }}
                        />
                        <Chip
                            label="Sân cầu lông Lan Anh, Quận 9"
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500, border: 'none', backdropFilter: 'blur(10px)' }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem', border: '2px solid rgba(255,255,255,0.5)' } }}>
                                <Avatar sx={{ bgcolor: '#bae6fd', color: '#0284c7' }}>A</Avatar>
                                <Avatar sx={{ bgcolor: '#fed7aa', color: '#c2410c' }}>B</Avatar>
                                <Avatar sx={{ bgcolor: '#bbf7d0', color: '#15803d' }}>C</Avatar>
                            </AvatarGroup>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                24 thành viên
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>

                {/* Intro Card */}
                <Paper elevation={0} sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    mb: 4,
                    bgcolor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem' }}>
                                Chào mừng bạn đã vào nhóm. Tại đây chỉ những thành viên mới có thể xem các kèo đấu và danh sách cụ thể của nhóm.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Button
                                variant="contained"
                                size="large"
                                disableElevation
                                sx={{
                                    borderRadius: 8,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(45deg, #f59e0b, #f97316)',
                                    boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.4)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 15px 25px -5px rgba(245, 158, 11, 0.5)',
                                    }
                                }}
                            >
                                Tạo Kèo Đấu Mới
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabs Section */}
                <Box sx={{ borderBottom: 1, borderColor: 'rgba(0,0,0,0.08)', mb: 4, mt: 6 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, nv) => setTabIndex(nv)}
                        sx={{
                            '& .MuiTab-root': { textTransform: 'none', fontSize: 16, fontWeight: 600, color: '#64748b' },
                            '& .Mui-selected': { color: '#0ea5e9 !important' },
                            '& .MuiTabs-indicator': { backgroundColor: '#0ea5e9', height: 3, borderTopLeftRadius: 3, borderTopRightRadius: 3 }
                        }}
                    >
                        <Tab label="Hoạt động / Kèo đấu" sx={{ textTransform: 'none', fontSize: 16 }} />
                        <Tab label="Thành viên" sx={{ textTransform: 'none', fontSize: 16 }} />
                        <Tab label="Bảng xếp hạng" sx={{ textTransform: 'none', fontSize: 16 }} />
                    </Tabs>
                </Box>

                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        {tabIndex === 0 && "Chưa có kèo đấu nào đang diễn ra."}
                        {tabIndex === 1 && "Danh sách thành viên đang được cập nhật."}
                        {tabIndex === 2 && "Bảng xếp hạng tính điểm nội bộ nhóm."}
                    </Typography>
                </Box>

            </Container>
        </Box>
    )
}

export default GroupDetailPage
