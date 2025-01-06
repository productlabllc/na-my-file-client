import Signup from './Signup';
import Login from './Login';
import { Account } from './Account';
import Status from './Status';
import Settings from './Settings';

const Auth = () => {
  return (
    <Account>
      <Status />
      <Signup />
      <Login />
      <Settings />
    </Account>
  );
};

export default Auth;
