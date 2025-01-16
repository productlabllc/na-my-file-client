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
import customLogo from '../../assets/my-file-logo-head.svg';
import { isValidEmail, isValidPassword } from '../../lib/utils';
import Copyright from '../../components/shared/Copyright';
import { useAppState } from '../../app-state-store';
import FormErrorMessage from '../../components/shared/FormErrorMessage';

const ChangePasswordAfterLogin = () => {
  const appStateAnyData = useAppState((state) => state.anyData);
  const [email, setEmail] = useState(appStateAnyData.data.email);
  const [temporaryPassword, setTemporaryPassword] = useState(appStateAnyData.data.temporaryPassword);
  const [temporaryPasswordIsVisible, setTemporaryPasswordIsVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordConfirmationIsVisible, setPasswordConfirmationIsVisible] = useState(false);
  const [userNotConfirmed, setUserNotConfirmed] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const appStateUser = useAppState((state) => state.appUser);
  const appStateSnackbar = useAppState((state) => state.snackbar);

  const { changePasswordForAuthenticatedUser } = useContext(AccountContext);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errorList: Array<string> = [];

    if (!isValidPassword(temporaryPassword)) {
      errorList = [
        ...errorList,
        'Temporary password does not seem valid. Please check your email to ensure you have the correct temporary password.'
      ];
    } else if (!isValidPassword(password)) {
      errorList = [
        ...errorList,
        'Password must be at least 10 characters in length and contain at least 1 Capital Letter, at least 1 Number, at least 1 Special Character from the following !@#$%^&*()[]_-+='
      ];
    } else if (password !== passwordConfirmation) {
      errorList = [...errorList, 'Password and Password Confirmation do not match.'];
    } else {
      appStateUser.setEmail(email);
      try {
        console.log('changing password...');
        const data = await changePasswordForAuthenticatedUser(
          email,
          password,
          appStateAnyData.data.newPasswordUserAttributes
        );
        console.log('Logged in!', data);
        navigate('/account');
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
        <img src={customLogo} width="64" />
        <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
          You must change your password
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
            disabled={true}
            value={email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="temporaryPassword"
            label="Temporary Password"
            type={temporaryPasswordIsVisible ? 'text' : 'password'}
            id="temporaryPassword"
            value={temporaryPassword}
            onChange={(event) => setTemporaryPassword(event.target.value.trim())}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle temporary password visibility"
                    onClick={() => setTemporaryPasswordIsVisible(!temporaryPasswordIsVisible)}
                  >
                    {passwordIsVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirmation"
            label="Password Confirmation"
            type={passwordConfirmationIsVisible ? 'text' : 'password'}
            id="passwordConfirmation"
            autoComplete="current-password"
            onChange={(event) => setPasswordConfirmation(event.target.value.trim())}
            InputProps={{
              // <-- This is where the toggle button is added.
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password confirmation visibility"
                    onClick={() => setPasswordConfirmationIsVisible(!passwordConfirmationIsVisible)}
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
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Box>
    </Grid>
  );
};

export default ChangePasswordAfterLogin;
