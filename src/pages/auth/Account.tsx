import { createContext } from 'react';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute
  // IAuthenticationCallback
} from 'amazon-cognito-identity-js';
import Pool from '../../lib/user-pool';
import { AppStateType, useAppState } from '../../app-state-store';
import { getPlatformUserProfile } from '../../api-service';

let appState: AppStateType | undefined = undefined;

type AccountContextType = {
  getSession: () => Promise<Record<string, any>>;
  getPlatformUser: () => Promise<any>;
  authenticate: (
    Username: string,
    Password: string
  ) => Promise<CognitoUserSession>;
  logout: () => void;
  confirmUserRegistration: (email: string, code: string) => Promise<any>;
  sendForgotPasswordCode: (email: string) => Promise<any>;
  changePasswordWithCode: (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => Promise<any>;
  changePasswordForAuthenticatedUser: (
    email: string,
    newPassword: string,
    sessionUserAttributes: any
  ) => Promise<any>;
};

let _getSessionLastSuccessfulRetrievalTimestamp: number = 0;
const isLessThanXMinutes = (
  valueInMinutes: number,
  timestampReference: number
) => {
  const diff = Date.now() - timestampReference;
  const minutesInMs = valueInMinutes * 60 * 1000;
  return diff < minutesInMs;
};

export const getSession = () => {
  return new Promise<Record<string, any>>((resolve, reject) => {
    if (
      appState!.appUser.userSessionData &&
      isLessThanXMinutes(10, _getSessionLastSuccessfulRetrievalTimestamp)
    ) {
      resolve(appState!.appUser.userSessionData);
    } else {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession(
          async (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject();
            } else {
              const attributes = await new Promise<Record<string, any>>(
                (resolve, reject) => {
                  user.getUserAttributes(
                    (
                      err: Error | undefined,
                      userAttributes:
                        | Array<CognitoUserAttribute>
                        | undefined = []
                    ) => {
                      if (err) {
                        reject(err);
                      } else {
                        const results: Record<string, any> = {};

                        for (let attribute of userAttributes) {
                          const { Name, Value } = attribute;
                          results[Name] = Value;
                        }

                        resolve(results);
                      }
                    }
                  );
                }
              );

              const userSessionData = { user, ...session, ...attributes };
              appState!.appUser.setUserSessionData(userSessionData);
              _getSessionLastSuccessfulRetrievalTimestamp = Date.now();
              resolve(userSessionData);
            }
          }
        );
      } else {
        reject();
      }
    }
  });
};

export const getPlatformUser = async () => {
  let platformUserProfile = appState?.appUser.platformUserProfile;
  if (!platformUserProfile || !platformUserProfile.email) {
    platformUserProfile = await getPlatformUserProfile();
    console.log(`retrieved platform user profile:
    ${JSON.stringify(platformUserProfile)}
    `);
  }
  appState!.appUser.setPlatformUserProfile(platformUserProfile);
  return platformUserProfile;
};

const authenticate = (Username: string, Password: string) => {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool });

    const authDetails = new AuthenticationDetails({ Username, Password });
    appState!.appUser.setEmail(Username);

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log('onSuccess: ', data);
        resolve(data);
      },
      onFailure: (err) => {
        console.error('onFailure: ', err);
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log('newPasswordRequired User Atts: ', userAttributes);
        console.log('newPasswordRequired Required Atts: ', requiredAttributes);
        console.log(user);

        user.getSession(
          async (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              console.log(
                `get user session from new password required error: ${JSON.stringify(err, null, 2)}`
              );
            } else {
              console.log(
                `get user session from new password required: ${JSON.stringify(session, null, 2)}`
              );
            }
          }
        );
        const { email_verified, ...newPasswordUserAttributes } = userAttributes;
        reject({ name: 'NewPasswordRequired', newPasswordUserAttributes });
      }
    });
  });
};

const confirmUserRegistration = (email: string, code: string) => {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool });
    appState!.appUser.setEmail(email);

    user.confirmRegistration(code, true, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sendForgotPasswordCode = (email: string) => {
  appState!.appUser.setEmail(email);
  return new Promise<any>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool });
    user.forgotPassword({
      onSuccess: (data) => {
        console.log('onSuccess: ', data);
        resolve(data);
      },
      onFailure: (err) => {
        console.error('onFailure: ', err);
        reject(err);
      },
      inputVerificationCode: (data: any) => {
        console.log(data);
        resolve(data);
      }
    });
  });
};

const changePasswordWithCode = (
  email: string,
  verificationCode: string,
  newPassword: string
) => {
  appState!.appUser.setEmail(email);
  return new Promise<any>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool });
    user.confirmPassword(verificationCode, newPassword, {
      onSuccess: (data) => {
        console.log('onSuccess: ', data);
        resolve(data);
      },
      onFailure: (err) => {
        console.error('onFailure: ', err);
        reject(err);
      }
    });
  });
};

const changePasswordForAuthenticatedUser = (
  email: string,
  newPassword: string,
  sessionUserAttributes: any
) => {
  return new Promise<any>((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool });
    console.log(`user from session:
    ${JSON.stringify(user, null, 2)}
    `);

    user?.completeNewPasswordChallenge(newPassword, sessionUserAttributes, {
      onSuccess: (data) => {
        console.log('onSuccess: ', data);
        resolve(data);
      },
      onFailure: (err) => {
        console.error('onFailure: ', err);
        reject(err);
      }
    });
  });
};

const logout = () => {
  const user = Pool.getCurrentUser();
  if (user) {
    appState!.reset();
    user.signOut();
  }
};

const AccountContext = createContext<AccountContextType>({
  getSession,
  getPlatformUser,
  authenticate,
  logout,
  sendForgotPasswordCode,
  changePasswordWithCode,
  confirmUserRegistration,
  changePasswordForAuthenticatedUser
});

const Account = (props: any) => {
  appState = useAppState();

  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        getPlatformUser,
        logout,
        sendForgotPasswordCode,
        changePasswordWithCode,
        confirmUserRegistration,
        changePasswordForAuthenticatedUser
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};
export { Account, AccountContext };
