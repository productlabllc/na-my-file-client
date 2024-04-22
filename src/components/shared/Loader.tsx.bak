import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Blocks } from 'react-loader-spinner';
import { colorTokens } from '../../theme';
import { isMobileSize, isNotDesktopSize } from '../../lib/media-queries-implemented'; // Media Query Size

type LoaderPropsType = {
  isLoading: boolean;
};

const Loader = (props: LoaderPropsType) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  const isMobile = useMediaQuery(`(max-width: ${isMobileSize}px)`); // Media Query for Mobile
  const isNotDesktop = useMediaQuery(`(max-width: ${isNotDesktopSize}px)`); // Media Query for Mobile
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        zIndex: 1000,
        top: 0,
        left: 0,
        display: props.isLoading ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: `${colors.primary[500]}BB`,
      }}
    >
      <Box sx={{ marginLeft: isMobile ? '0' : '300px' }}>
        <Blocks />
        <Typography variant="body2">- loading -</Typography>
      </Box>
    </Box>
  );
};

export default Loader;
