import { Link, Typography } from '@mui/material';

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'MIT License'}
      <Link color="inherit" href="https://newamerica.org/">
        New America
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
