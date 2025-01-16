import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import { AccountContext } from './Account';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import customLogo from '../../assets/my-file-logo-head.svg';
import { isValidEmail, isValidPassword } from '../../lib/utils';
import Copyright from '../../components/shared/Copyright';
import { useAppState } from '../../app-state-store';

const ConfirmRegistration = () => {
  const [email, setEmail] = useState('');
  const [emailIsDisabled, setEmailIsDisabled] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const navigate = useNavigate();
  const appStateUser = useAppState((state) => state.appUser);
  const appStateSnackbar = useAppState((state) => state.snackbar);

  useEffect(() => {
    console.log('set email');
    console.log(appStateUser);
    setEmail(appStateUser.email);
    setEmailIsDisabled(true);
  }, []);

  const { confirmUserRegistration } = useContext(AccountContext);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    confirmUserRegistration(email, confirmationCode)
      .then((data) => {
        console.log('Registration code validated.');
        console.log(data);
        navigate('/login');
      })
      .catch((err) => {
        console.log('Error on registration code validation:');
        console.log(err);
      });
  };

  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img src={customLogo} width="64" />
        <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
          My File Registration Confirmation
        </Typography>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1, width: '80%', maxWidth: '600px' }}>
          <Typography variant="body2">
            You must validate your email before logging in for the first time. Please enter the code sent to your email.
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label=""
            name="email"
            value={email}
            autoComplete="email"
            disabled={emailIsDisabled}
            type={'email'}
          />
          <TextField
            margin="normal"
            type={'text'}
            required
            fullWidth
            id="confirmationCode"
            label="Confirmation Code"
            name="confirmationCode"
            autoComplete="confirmationCode"
            autoFocus
            onChange={(event) => setConfirmationCode(event.target.value.trim())}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Confirm Registration Code
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Box>
    </Grid>
  );
};

export default ConfirmRegistration;
