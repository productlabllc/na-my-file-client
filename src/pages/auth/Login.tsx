import React, { useState, useContext } from 'react';
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
import ddnLogo from '../../assets/my-file-logo.svg';
import { isValidEmail, isValidPassword } from '../../lib/utils';
import { useAppState } from '../../app-state-store';
import FormErrorMessage from '../../components/shared/FormErrorMessage';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [userNotConfirmed, setUserNotConfirmed] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const appStateAnyData = useAppState((state) => state.anyData);
  const appStateUser = useAppState((state) => state.appUser);
  const appStateSnackbar = useAppState((state) => state.snackbar);

  const { authenticate, sendForgotPasswordCode } = useContext(AccountContext);
  const auth = useAuth();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errorList: Array<string> = [];

    if (!isValidEmail(email)) {
      errorList = [...errorList, 'Email is not valid.'];
    } else if (!isValidPassword(password)) {
      errorList = [
        ...errorList,
        'Password must be at least 10 characters in length and contain at least 1 of each: (Capital Letter, Number, Special Character)'
      ];
    } else {
      appStateUser.setEmail(email);
      try {
        const data = await authenticate!(email, password);
        console.log('Logged in!', data);
        navigate('/');
      } catch (err: any) {
        if (err.name === 'UserNotConfirmedException') {
          errorList = [...errorList, 'Email not confirmed for user.'];
          navigate(`/confirm-registration?email=${email}`);
        } else if (err.name === 'UserNotFoundException') {
          errorList = [...errorList, 'Credentials do not match for an existing user.'];
        } else if (err.name === 'NotAuthorizedException') {
          errorList = [...errorList, 'Credentials do not match for an existing user.'];
        } else if (err.name === 'NewPasswordRequired') {
          errorList = [
            ...errorList,
            'You must reset your password. Please use the Forgot Password link to proceed resetting your password.'
          ];
          const { newPasswordUserAttributes } = err;
          appStateAnyData.setData({
            email,
            temporaryPassword: password,
            newPasswordUserAttributes
          });
          navigate('/change-password');
        } else {
          console.log(err);
        }
      }
    }
    console.log(errorList);
    setErrorMessages(errorList);
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
        <img src={ddnLogo} width="64" />
        <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
          My File Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1, width: '80%', maxWidth: '600px' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            type={'email'}
            onChange={(event) => setEmail(event.target.value.trim())}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={passwordIsVisible ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value.trim())}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                  >
                    {passwordIsVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {errorMessages.map((m, idx) => (
            <FormErrorMessage message={m} key={idx} />
          ))}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
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
        </Box>
      </Box>
    </Grid>
  );
};

export default Login;
