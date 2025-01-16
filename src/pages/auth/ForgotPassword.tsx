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
import { Visibility, VisibilityOff } from '@mui/icons-material';
import customLogo from '../../assets/my-file-logo-head.svg';
import Copyright from '../../components/shared/Copyright';
import { AccountContext } from './Account';
import { isValidEmail, isValidPassword } from '../../lib/utils';
import FormErrorMessage from '../../components/shared/FormErrorMessage';

export default () => {
  const [stage, setStage] = useState<'request-code' | 'change-password'>('request-code');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordConfirmationIsVisible, setPasswordConfirmationIsVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);
  const navigate = useNavigate();

  const { sendForgotPasswordCode, changePasswordWithCode } = useContext(AccountContext);

  useEffect(() => {
    if (stage === 'change-password') {
      // console.log('enforce set stage');
      // setStage('change-password');
    }
  }, [stage]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errorList: Array<string> = [];
    if (stage === 'request-code') {
      if (isValidEmail(email)) {
        try {
          console.log('sending code...');
          const result = await sendForgotPasswordCode(email);
          console.log('initial stage set');
          setStage('change-password');
        } catch (err: any) {
          if (err.name === 'UserNotFoundException') {
            errorList = [...errorList, 'Email address is not registered.'];
          }
          console.log('error');
        }
      } else {
        errorList = [...errorList, 'Email address is not valid.'];
      }
    } else {
      if (!isValidPassword(password)) {
        errorList = [
          ...errorList,
          'Password must be at least 10 characters in length and contain at least 1 Capital Letter, at least 1 Number, at least 1 Special Character from the following !@#$%^&*()[]_-+='
        ];
      } else if (password !== passwordConfirmation) {
        errorList = [...errorList, 'Password and Password Confirmation do not match.'];
      } else {
        try {
          const result = await changePasswordWithCode(email, verificationCode, password);
          navigate('/login');
        } catch (err: any) {
          if (err.name === 'CodeMismatchException') {
            errorList = [
              ...errorList,
              "Confirmation code provided is not valid. You can use the 'Resend' link below to receive a new one."
            ];
          }
          console.log(err);
        }
      }
    }
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
          {stage === 'request-code'
            ? 'Enter your account email to receive verification code.'
            : 'Please check your email for the verification code to change your password.'}
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={async (event) => await onSubmit(event)}
          sx={{ mt: 1, width: '80%', maxWidth: '600px' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            disabled={stage === 'change-password'}
            onChange={(event) => setEmail(event.target.value.trim())}
          />
          {stage === 'change-password' && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="verificationCode"
                label="Verification Code"
                name="verificationCode"
                autoComplete="verificationCode"
                autoFocus
                onChange={(event) => setVerificationCode(event.target.value.trim())}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
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
                label="New Password Confirmation"
                type={passwordIsVisible ? 'text' : 'password'}
                id="passwordConfirmation"
                onChange={(event) => setPasswordConfirmation(event.target.value.trim())}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setPasswordConfirmationIsVisible(!passwordConfirmationIsVisible)}
                      >
                        {passwordConfirmationIsVisible ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </>
          )}

          {errorMessages.map((m, idx) => (
            <FormErrorMessage message={m} key={idx} />
          ))}
          {stage === 'change-password' && (
            <Typography>
              Didn't receive code?{' '}
              <Link
                href="#"
                onClick={() => {
                  sendForgotPasswordCode(email);
                }}
              >
                Resend
              </Link>
              .{' '}
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {stage === 'request-code' ? 'Get Verification Code' : 'Change Password'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/login" variant="body2">
                Back to Login
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
