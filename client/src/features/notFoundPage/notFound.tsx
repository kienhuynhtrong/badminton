import { Link } from 'react-router-dom'
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'

const NotFoundPage = () => {
	const theme = useTheme()
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				display: 'flex',
				alignItems: 'center',
				py: 2,
				px: { xs: 2, sm: 0 },
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: 600,
					margin: '0 auto',
					bgcolor: '#fff',
					borderRadius: 3,
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
					p: { xs: 3, sm: 5 },
				}}
			>

				<Stack spacing={{ xs: 3, sm: 4 }}>
					<Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
						<Typography
							variant={isSmUp ? 'h1' : 'h2'}
							sx={{
								fontWeight: 800,
								color: '#1a1a1a',
								lineHeight: 0.9,
								fontSize: { xs: 56, sm: 88, md: 120 },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}
						>
							4
						</Typography>
						<Box
							sx={{
								width: { xs: 72, sm: 96, md: 120 },
								height: { xs: 72, sm: 96, md: 120 },
								borderRadius: '50%',
								bgcolor: '#667eea',
								display: 'grid',
								placeItems: 'center',
								boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
							}}
						>
							<SportsTennisIcon 
								sx={{ 
									fontSize: { xs: 36, sm: 48, md: 56 }, 
									color: '#fff',
									animation: 'bounce 2s infinite',
									'@keyframes bounce': {
										'0%, 100%': { transform: 'translateY(0)' },
										'50%': { transform: 'translateY(-10px)' },
									},
								}} 
							/>
						</Box>
						<Typography
							variant={isSmUp ? 'h1' : 'h2'}
							sx={{
								fontWeight: 800,
								color: '#1a1a1a',
								lineHeight: 0.9,
								fontSize: { xs: 56, sm: 88, md: 120 },
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
							}}
						>
							4
						</Typography>
					</Stack>

					<Stack spacing={1} alignItems="center">
						<Typography
							variant="overline"
							sx={{
								letterSpacing: '0.2em',
								color: '#999',
								textTransform: 'uppercase',
							}}
						>
							Sân cầu lông
						</Typography>
						<Typography
							variant={isSmUp ? 'h3' : 'h4'}
							sx={{
								fontWeight: 700,
								textTransform: 'uppercase',
								color: '#1a1a1a',
								textAlign: 'center',
							}}
						>
							Trang này không tồn tại
						</Typography>
						<Typography
							variant="body1"
							sx={{
								maxWidth: 560,
								color: '#666',
								textAlign: 'center',
							}}
						>
							Trang bạn tìm kiếm không tồn tại. Vui lòng quay lại trang chủ hoặc đăng nhập để tiếp tục.
						</Typography>
					</Stack>

					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={2}
						justifyContent="center"
					>
						<Button
							component={Link}
							to="/"
							variant="contained"
							size={isSmUp ? 'large' : 'medium'}
							sx={{
								bgcolor: '#667eea',
								'&:hover': { bgcolor: '#5568d3' },
								px: 4,
								boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
							}}
						>
							Về trang chủ
						</Button>
						<Button
							component={Link}
							to="/login"
							variant="outlined"
							size={isSmUp ? 'large' : 'medium'}
							sx={{
								borderColor: '#667eea',
								color: '#667eea',
								'&:hover': {
									borderColor: '#5568d3',
									bgcolor: 'rgba(102, 126, 234, 0.04)',
								},
								px: 4,
							}}
						>
							Đến trang đăng nhập
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Box>
	)
}

export default NotFoundPage
