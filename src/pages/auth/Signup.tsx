import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Link, Paper, Box, Grid, Typography, InputAdornment, IconButton } from '@mui/material';
import { AccountContext } from './Account';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import customLogo from '../../assets/my-file-logo-head.svg';
import { isValidEmail, isValidPassword } from '../../lib/utils';
// import Copyright from '../../components/shared/Copyright';

import UserPool from '../../lib/user-pool';
import PhoneNumber from '../../components/shared/PhoneNumber';
import { MuiTelInput } from 'mui-tel-input';
import { useAppState } from '../../app-state-store';
import FormErrorMessage from '../../components/shared/FormErrorMessage';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('+1');
  const [email, setEmail] = useState('');
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [passwordConfirmationIsVisible, setPasswordConfirmationIsVisible] = useState(false);
  const [emailIsLockedDown, setEmailIsLockedDown] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Array<string>>([]);

  const navigate = useNavigate();
  const appStateUser = useAppState((state) => state.appUser);
  const appStateSnackbar = useAppState((state) => state.snackbar);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const qsEmail = qs.get('email');
    const qsFirstName = qs.get('firstName');
    const qsLastName = qs.get('lastName');
    setEmail(qsEmail || '');
    setEmailConfirmation(qsEmail || '');
    setFirstName(qsFirstName || '');
    setLastName(qsLastName || '');
    setEmailIsLockedDown(qsEmail ? true : false);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let errorList: Array<string> = [];

    if (firstName.trim() === '' || lastName.trim() === '') {
      errorList = [...errorList, 'First Name and Last Name are both required fields.'];
    } else if (!isValidEmail(email)) {
      errorList = [...errorList, 'Email address is not valid.'];
    } else if (email !== emailConfirmation) {
      errorList = [...errorList, 'Email and Email Confirmation do not match.'];
    } else if (!isValidPassword(password)) {
      errorList = [
        ...errorList,
        'Password must be at least 10 characters in length and contain at least 1 Capital Letter, at least 1 Number, at least 1 Special Character from the following !@#$%^&*()[]_-+='
      ];
    } else if (password !== passwordConfirmation) {
      errorList = [...errorList, 'Password and Password Confirmation do not match.'];
    } else {
      try {
        UserPool.signUp(
          email,
          password,
          [
            new CognitoUserAttribute({
              Name: 'given_name',
              Value: firstName
            }),
            new CognitoUserAttribute({
              Name: 'family_name',
              Value: lastName
            })
          ],
          [],
          async (err, data) => {
            if (err) {
              console.error(err);
              errorList = [...errorList, `Signup error occurred: ${err.name}`];
            } else {
              console.log(data);
              const { userSub } = data!;
              appStateUser.setEmail(email);
              navigate('/login');
            }
          }
        );
      } catch (err) {
        console.log(`An Error Occurred With Fetch:
        ${JSON.stringify(err, null, 2)}
        `);
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
          My File Signup
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={onSubmit}
          autoComplete="off"
          sx={{ mt: 1, width: '80%', maxWidth: '600px' }}
        >
          {/* FIRST NAME */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="firstName"
            autoFocus
            value={firstName}
            onChange={(event) => setFirstName(event.target.value.trim())}
          />

          {/* LAST NAME */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value.trim())}
          />

          {/* MOBILE PHONE */}
          <MuiTelInput
            margin="normal"
            placeholder="Phone Number *"
            fullWidth
            defaultCountry="US"
            value={mobile}
            onChange={(value) => {
              console.log(`val: ${value}`);
              setMobile(value || '');
            }}
          />

          {/* EMAIL */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            disabled={emailIsLockedDown}
            onChange={(event) => setEmail(event.target.value.trim())}
          />

          {/* CONFIRM EMAIL */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmEmail"
            label="Confirm Email Address"
            name="emailConfirmation"
            autoComplete="confirmEmail"
            value={emailConfirmation}
            disabled={emailIsLockedDown}
            onChange={(event) => setEmailConfirmation(event.target.value.trim())}
          />

          {/* PASSWORD */}
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

          {/* CONFIRM PASSWORD */}
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
                    aria-label="toggle password visibility"
                    onClick={() => setPasswordConfirmationIsVisible(!passwordConfirmationIsVisible)}
                  >
                    {passwordConfirmationIsVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {errorMessages.map((m, idx) => (
            <FormErrorMessage message={m} key={idx} />
          ))}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                Have an account? Login here.
              </Link>
            </Grid>
          </Grid>
          {/* <Copyright sx={{ mt: 5 }} /> */}
        </Box>
      </Box>
    </Grid>
  );
};

export default Signup;

// import {
//   CognitoUserAttribute,
//   ISignUpResult
// } from 'amazon-cognito-identity-js';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Button,
//   TextField,
//   Link,
//   Paper,
//   Box,
//   Grid,
//   Typography,
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import { AccountContext } from './Account';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import customLogo from '../../assets/my-file-logo-head.svg';
// import { isValidEmail, isValidPassword } from '../../lib/utils';
// import Copyright from '../../components/shared/Copyright';

// import UserPool from '../../lib/user-pool';
// import PhoneNumber from '../../components/shared/PhoneNumber';
// import { MuiTelInput } from 'mui-tel-input';
// import { useAppState } from '../../app-state-store';
// import {
//   confirmPartnerUserRegistration,
//   validateRegistrationData
// } from '../../api-service';
// import FormErrorMessage from '../../components/shared/FormErrorMessage';

// const Signup = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [mobile, setMobile] = useState('+1');
//   const [email, setEmail] = useState('');
//   const [emailConfirmation, setEmailConfirmation] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordConfirmation, setPasswordConfirmation] = useState('');
//   const [registrationCode, setRegistrationCode] = useState('');
//   const [passwordIsVisible, setPasswordIsVisible] = useState(false);
//   const [passwordConfirmationIsVisible, setPasswordConfirmationIsVisible] =
//     useState(false);
//   const [emailIsLockedDown, setEmailIsLockedDown] = useState(false);
//   const [registrationCodeIsLockedDown, setRegistrationCodeIsLockedDown] =
//     useState(false);
//   const [errorMessages, setErrorMessages] = useState<Array<string>>([]);

//   const navigate = useNavigate();
//   const appStateUser = useAppState((state) => state.appUser);
//   const appStateSnackbar = useAppState((state) => state.snackbar);

//   useEffect(() => {
//     const qs = new URLSearchParams(location.search);
//     const qsEmail = qs.get('email');
//     const qsRegistrationCode = qs.get('registrationCode');
//     const qsFirstName = qs.get('firstName');
//     const qsLastName = qs.get('lastName');
//     console.log(qs);
//     console.log(qsEmail);
//     console.log(qsRegistrationCode);
//     setEmail(qsEmail || '');
//     setEmailConfirmation(qsEmail || '');
//     setFirstName(qsFirstName || '');
//     setLastName(qsLastName || '');
//     setRegistrationCode(qsRegistrationCode || '');
//     setEmailIsLockedDown(qsEmail ? true : false);
//     setRegistrationCodeIsLockedDown(qsRegistrationCode ? true : false);
//   }, []);

//   const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     let errorList: Array<string> = [];

//     if (firstName.trim() === '' || lastName.trim() === '') {
//       errorList = [
//         ...errorList,
//         'First Name and Last Name are both required fields.'
//       ];
//     } else if (!isValidEmail(email)) {
//       errorList = [...errorList, 'Email address is not valid.'];
//     } else if (email !== emailConfirmation) {
//       errorList = [...errorList, 'Email and Email Confirmation do not match.'];
//     } else if (!isValidPassword(password)) {
//       errorList = [
//         ...errorList,
//         'Password must be at least 10 characters in length and contain at least 1 Capital Letter, at least 1 Number, at least 1 Special Character from the following !@#$%^&*()[]_-+='
//       ];
//     } else if (password !== passwordConfirmation) {
//       errorList = [
//         ...errorList,
//         'Password and Password Confirmation do not match.'
//       ];
//     } else if (registrationCode.trim() === '') {
//       errorList = [...errorList, 'Registration code is not valid.'];
//     } else {
//       try {
//         const { status, PartnerAccountId } = (await validateRegistrationData({
//           registrationCode,
//           email
//         })) as any;
//         if (status !== 200) {
//           errorList = [
//             ...errorList,
//             `The registration code provided is not valid.`
//           ];
//         } else {
//           console.log(`Retrieved PartnerAccountId: ${PartnerAccountId}`);
//           UserPool.signUp(
//             email,
//             password,
//             [
//               new CognitoUserAttribute({
//                 Name: 'given_name',
//                 Value: firstName
//               }),
//               new CognitoUserAttribute({
//                 Name: 'family_name',
//                 Value: lastName
//               }),
//               new CognitoUserAttribute({
//                 Name: 'nickname',
//                 Value: registrationCode
//               })
//             ],
//             [],
//             async (err, data) => {
//               if (err) {
//                 console.error(err);
//                 errorList = [
//                   ...errorList,
//                   `Signup error occurred: ${err.name}`
//                 ];
//               } else {
//                 console.log(data);
//                 const { userSub } = data!;
//                 const confirmedRegistrationResponse =
//                   await confirmPartnerUserRegistration({
//                     email,
//                     partnerId: PartnerAccountId,
//                     regCognitoId: userSub
//                   });
//                 console.log(`Confirmed Platform Registration Response:
//               ${JSON.stringify(confirmPartnerUserRegistration, null, 2)}
//               `);
//                 appStateUser.setEmail(email);
//                 navigate('/login');
//               }
//             }
//           );
//         }
//       } catch (err) {
//         console.log(`An Error Occurred With Fetch:
//         ${JSON.stringify(err, null, 2)}
//         `);
//       }
//     }
//     console.log(errorList);
//     setErrorMessages(errorList);
//   };

//   return (
//     // <div>
//     //   <form onSubmit={onSubmit}>
//     //     <label htmlFor='email'>Email</label>
//     //     <input
//     //       value={email}
//     //       onChange={(event) => setEmail(event.target.value)}
//     //     ></input>
//     //     <label htmlFor='password'>Password</label>
//     //     <input
//     //       value={password}
//     //       onChange={(event) => setPassword(event.target.value)}
//     //     ></input>

//     //     <button type='submit'>Signup</button>
//     //   </form>
//     // </div>

//     <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//       <Box
//         sx={{
//           my: 8,
//           mx: 4,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center'
//         }}
//       >
//         <img src={customLogo} width="64" />
//         <Typography component="h1" variant="h5" sx={{ marginTop: '10px' }}>
//           My File Signup
//         </Typography>
//         <Box
//           component="form"
//           noValidate
//           onSubmit={onSubmit}
//           autoComplete="off"
//           sx={{ mt: 1, width: '80%', maxWidth: '600px' }}
//         >
//           {/* FIRST NAME */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="firstName"
//             label="First Name"
//             name="firstName"
//             autoComplete="firstName"
//             autoFocus
//             value={firstName}
//             onChange={(event) => setFirstName(event.target.value.trim())}
//           />

//           {/* LAST NAME */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="lastName"
//             label="Last Name"
//             name="lastName"
//             autoComplete="lastName"
//             value={lastName}
//             onChange={(event) => setLastName(event.target.value.trim())}
//           />

//           {/* MOBILE PHONE */}
//           <MuiTelInput
//             margin="normal"
//             placeholder="Phone Number *"
//             fullWidth
//             defaultCountry="US"
//             value={mobile}
//             onChange={(value) => {
//               console.log(`val: ${value}`);
//               setMobile(value || '');
//             }}
//           />

//           {/* EMAIL */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             value={email}
//             disabled={emailIsLockedDown}
//             onChange={(event) => setEmail(event.target.value.trim())}
//           />

//           {/* CONFIRM EMAIL */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="confirmEmail"
//             label="Confirm Email Address"
//             name="emailConfirmation"
//             autoComplete="confirmEmail"
//             value={emailConfirmation}
//             disabled={emailIsLockedDown}
//             onChange={(event) =>
//               setEmailConfirmation(event.target.value.trim())
//             }
//           />

//           {/* PASSWORD */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type={passwordIsVisible ? 'text' : 'password'}
//             id="password"
//             autoComplete="current-password"
//             onChange={(event) => setPassword(event.target.value.trim())}
//             InputProps={{
//               // <-- This is where the toggle button is added.
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setPasswordIsVisible(!passwordIsVisible)}
//                   >
//                     {passwordIsVisible ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />

//           {/* CONFIRM PASSWORD */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="passwordConfirmation"
//             label="Password Confirmation"
//             type={passwordConfirmationIsVisible ? 'text' : 'password'}
//             id="passwordConfirmation"
//             autoComplete="current-password"
//             onChange={(event) =>
//               setPasswordConfirmation(event.target.value.trim())
//             }
//             InputProps={{
//               // <-- This is where the toggle button is added.
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() =>
//                       setPasswordConfirmationIsVisible(
//                         !passwordConfirmationIsVisible
//                       )
//                     }
//                   >
//                     {passwordConfirmationIsVisible ? (
//                       <Visibility />
//                     ) : (
//                       <VisibilityOff />
//                     )}
//                   </IconButton>
//                 </InputAdornment>
//               )
//             }}
//           />

//           {/* REGISTRATION CODE */}
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="registrationCode"
//             label="Registration Code"
//             name="registrationCode"
//             autoComplete="registrationCode"
//             value={registrationCode}
//             disabled={registrationCodeIsLockedDown}
//             onChange={(event) => setRegistrationCode(event.target.value.trim())}
//           />

//           {errorMessages.map((m, idx) => (
//             <FormErrorMessage message={m} key={idx} />
//           ))}

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Register
//           </Button>
//           <Grid container>
//             <Grid item xs>
//               <Link href="/forgot-password" variant="body2">
//                 Forgot password?
//               </Link>
//             </Grid>
//             <Grid item>
//               <Link href="/login" variant="body2">
//                 Have an account? Login here.
//               </Link>
//             </Grid>
//           </Grid>
//           <Copyright sx={{ mt: 5 }} />
//         </Box>
//       </Box>
//     </Grid>
//   );
// };

// export default Signup;
