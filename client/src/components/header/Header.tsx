import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import { COLORS } from '../../constants/colors'

const Header = () => {
  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      minWidth: '100vw',
      height: { xs: 64, sm: 80 },
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 1.5, sm: 2 },
      px: { xs: 2, sm: 3 },
      bgcolor: COLORS.main,
      borderBottom: `1px solid ${COLORS.border}`,
    }} className="header">
        <Box
          component="img"
          src="/images/logo.png"
          alt="Badminton Logo"
          sx={{
            height: { xs: 44, sm: 60 },
            width: 'auto',
          }}
        />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 0.5, sm: 1 },
        }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: COLORS.textWhite,
              lineHeight: 1,
              fontSize: { xs: 18, sm: 24 },
            }}
          >
            Badmintion
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: COLORS.textWhite,
              lineHeight: 1,
              fontSize: { xs: 12, sm: 18 },
            }}
          >
            Voting and Maning Tools
          </Typography>
        </Box>
    </Box>
  )
}
export default Header