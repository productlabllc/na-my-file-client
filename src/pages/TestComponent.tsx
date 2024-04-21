// import React from 'react';

// const TestComponent = () => {
//   return <div>This is a test component</div>;
// };

// export default TestComponent;

import React, { useContext } from 'react';
import { AccountContext } from './auth/Account';

// const TestComponent = () => {
//   const {
//     authenticate,
//     getSession,
//     getPlatformUser,
//     logout,
//     sendForgotPasswordCode,
//     changePasswordWithCode,
//     confirmUserRegistration,
//     changePasswordForAuthenticatedUser
//   } = useContext(AccountContext);

//   const handleLogin = async () => {
//     try {
//       const session = await authenticate('username', 'password');
//       console.log('Login successful:', session);
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   const handleGetSession = async () => {
//     try {
//       const session = await getSession();
//       console.log('Session:', session);
//     } catch (error) {
//       console.error('Failed to get session:', error);
//     }
//   };

//   const handleGetPlatformUser = async () => {
//     try {
//       const user = await getPlatformUser();
//       console.log('Platform user:', user);
//     } catch (error) {
//       console.error('Failed to get platform user:', error);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     console.log('Logged out');
//   };

//   const handleSendForgotPasswordCode = async () => {
//     try {
//       await sendForgotPasswordCode('user@example.com');
//       console.log('Forgot password code sent');
//     } catch (error) {
//       console.error('Failed to send forgot password code:', error);
//     }
//   };

//   const handleChangePasswordWithCode = async () => {
//     try {
//       await changePasswordWithCode(
//         'user@example.com',
//         'verificationCode',
//         'newPassword'
//       );
//       console.log('Password changed successfully');
//     } catch (error) {
//       console.error('Failed to change password:', error);
//     }
//   };

//   const handleConfirmUserRegistration = async () => {
//     try {
//       await confirmUserRegistration('user@example.com', 'confirmationCode');
//       console.log('User registration confirmed');
//     } catch (error) {
//       console.error('Failed to confirm user registration:', error);
//     }
//   };

//   const handleChangePasswordForAuthenticatedUser = async () => {
//     try {
//       await changePasswordForAuthenticatedUser(
//         'user@example.com',
//         'newPassword',
//         {}
//       );
//       console.log('Password changed for authenticated user');
//     } catch (error) {
//       console.error('Failed to change password for authenticated user:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Test Authentication</h1>
//       <button onClick={handleLogin}>Login</button>
//       <button onClick={handleGetSession}>Get Session</button>
//       <button onClick={handleGetPlatformUser}>Get Platform User</button>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={handleSendForgotPasswordCode}>
//         Send Forgot Password Code
//       </button>
//       <button onClick={handleChangePasswordWithCode}>
//         Change Password with Code
//       </button>
//       <button onClick={handleConfirmUserRegistration}>
//         Confirm User Registration
//       </button>
//       <button onClick={handleChangePasswordForAuthenticatedUser}>
//         Change Password for Authenticated User
//       </button>
//     </div>
//   );
// };

// export default TestComponent;

const TestComponent = () => {
  //   const { authenticate, getSession, logout } = useContext(AccountContext);

  // Test the authentication methods
  //   const handleLogin = async () => {
  //     try {
  //       const session = await authenticate('username', 'password');
  //       console.log('Login successful:', session);
  //     } catch (error) {
  //       console.error('Login failed:', error);
  //     }
  //   };

  //   const handleGetSession = async () => {
  //     try {
  //       const session = await getSession();
  //       console.log('Session:', session);
  //     } catch (error) {
  //       console.error('Failed to get session:', error);
  //     }
  //   };

  //   const handleLogout = () => {
  //     logout();
  //     console.log('Logged out');
  //   };

  return (
    <div>
      Try <h1>Test Authentication</h1>
      {/* <button onClick={handleLogin}>Login</button> */}
      {/* <button onClick={handleGetSession}>Get Session</button> */}
      {/* <button onClick={handleLogout}>Logout</button> */}
    </div>
  );
};

export default TestComponent;
