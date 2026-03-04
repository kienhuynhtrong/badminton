import { Link } from 'react-router-dom'
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import SportsTennisIcon from '@mui/icons-material/SportsTennis'

const NotFoundPage = () => {
	const theme = useTheme()
	const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

	return (
		<Box
			sx={{
				width: '100%',
				minWidth: '100vw',
				minHeight: '100svh',
				height: '100svh',
				boxSizing: 'border-box',
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: { xs: 2.5, sm: 4 },
				py: { xs: 4, sm: 6 },
				bgcolor: '#0f2b1f',
				backgroundImage:
					'radial-gradient(circle at 15% 20%, rgba(255, 215, 130, 0.35), transparent 50%),' +
					'radial-gradient(circle at 80% 10%, rgba(46, 164, 95, 0.35), transparent 55%),' +
					'linear-gradient(135deg, #0f2b1f 0%, #1d4b34 45%, #e7f3ea 120%)',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: 980,
					bgcolor: 'rgba(255, 255, 255, 0.95)',
					borderRadius: { xs: 3, sm: 4 },
					boxShadow: '0 24px 60px rgba(8, 30, 20, 0.35)',
					p: { xs: 3, sm: 5 },
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						inset: 16,
						borderRadius: { xs: 2.5, sm: 3 },
						border: '2px dashed rgba(18, 68, 42, 0.2)',
						pointerEvents: 'none',
					}}
				/>

				<Stack spacing={{ xs: 3, sm: 4 }} sx={{ position: 'relative' }}>
					<Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
						<Typography
							variant={isSmUp ? 'h1' : 'h2'}
							sx={{
								fontWeight: 800,
								color: '#0f3b29',
								lineHeight: 0.9,
								fontSize: { xs: 56, sm: 88, md: 120 },
							}}
						>
							4
						</Typography>
						<Box
							sx={{
								width: { xs: 72, sm: 96, md: 120 },
								height: { xs: 72, sm: 96, md: 120 },
								borderRadius: '50%',
								bgcolor: '#f6c453',
								display: 'grid',
								placeItems: 'center',
								boxShadow: '0 12px 24px rgba(15, 60, 40, 0.25)',
							}}
						>
							<SportsTennisIcon sx={{ fontSize: { xs: 36, sm: 48, md: 56 }, color: '#0f3b29' }} />
						</Box>
						<Typography
							variant={isSmUp ? 'h1' : 'h2'}
							sx={{
								fontWeight: 800,
								color: '#0f3b29',
								lineHeight: 0.9,
								fontSize: { xs: 56, sm: 88, md: 120 },
							}}
						>
							4
						</Typography>
					</Stack>

					<Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
						<Typography
							variant="overline"
							sx={{
								letterSpacing: '0.2em',
								color: 'rgba(15, 59, 41, 0.7)',
							}}
						>
							Badminton arena
						</Typography>
						<Typography
							variant={isSmUp ? 'h3' : 'h4'}
							sx={{
								fontWeight: 700,
								textTransform: 'uppercase',
								color: '#0f3b29',
								textAlign: { xs: 'left', sm: 'center' },
							}}
						>
							This page is out of bounds
						</Typography>
						<Typography
							variant="body1"
							sx={{
								maxWidth: 560,
								color: 'rgba(15, 59, 41, 0.7)',
								textAlign: { xs: 'left', sm: 'center' },
							}}
						>
							The shuttle went long. Head back to the home court or sign in to
							continue your match.
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
								bgcolor: '#1f7a4d',
								'&:hover': { bgcolor: '#0f5a35' },
								px: 4,
							}}
						>
							Back to home
						</Button>
						<Button
							component={Link}
							to="/login"
							variant="outlined"
							size={isSmUp ? 'large' : 'medium'}
							sx={{
								borderColor: 'rgba(15, 59, 41, 0.5)',
								color: '#0f3b29',
								px: 4,
							}}
						>
							Go to login
						</Button>
					</Stack>
				</Stack>
			</Box>
		</Box>
	)
}

export default NotFoundPage
