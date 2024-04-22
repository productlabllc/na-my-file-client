import {
  CognitoUserPool,
  ICognitoUserPoolData
} from 'amazon-cognito-identity-js';

const { VITE_COGNITO_CLIENTID = '', VITE_COGNITO_USERPOOLID = '' } = import.meta
  .env;

console.log('2UserPoolId: ', VITE_COGNITO_USERPOOLID);
console.log('2ClientId: ', VITE_COGNITO_CLIENTID);
const poolData: ICognitoUserPoolData = {
  ClientId: VITE_COGNITO_CLIENTID,
  UserPoolId: VITE_COGNITO_USERPOOLID
};

export default new CognitoUserPool(poolData);
