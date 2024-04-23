import { Typography, useTheme } from '@mui/material';
// import { Link, Typography, useTheme } from '@mui/material';
import { colorTokens } from '../../theme';

type FormErrorMessagePropsType = {
  message: string;
};

const FormErrorMessage = (props: FormErrorMessagePropsType) => {
  const theme = useTheme();
  const colors = colorTokens(theme.palette.mode);
  return (
    <Typography variant="body2" sx={{ color: colors.redAccent[500] }}>
      {props.message}
    </Typography>
  );
};

export default FormErrorMessage;
