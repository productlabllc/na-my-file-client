import { Typography, Box, useTheme } from '@mui/material';
import { colorTokens } from '../../theme';

type HeaderPropsType = {
  title: string;
  subtitle: string;
};

const Header = ({ title, subtitle }: HeaderPropsType) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  return (
    <Box
      sx={{
        marginBottom: '30px'
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginBottom: '5px',
          color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.grey[400],
          fontWeight: 'bold'
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: colors.greenAccent[400]
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
