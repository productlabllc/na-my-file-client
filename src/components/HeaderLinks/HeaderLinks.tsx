import { Button, Icon } from '@mui/material';
import { useAuth } from 'react-oidc-context';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderLinksProps {
  isInSidebar?: boolean;
}

function HeaderLinks({ isInSidebar }: HeaderLinksProps) {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Button
        className="!d-text-body-sm !text-white !normal-case !mr-[12px]"
        fullWidth={isInSidebar}
        component={Link}
        to="/profile"
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          perm_identity
        </Icon>
        <div className=""> My Profile</div>
      </Button>

      <Button
        className="!d-text-body-sm !text-white !normal-case !mr-[12px]"
        fullWidth={isInSidebar}
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          history
        </Icon>
        Activity Log
      </Button>

      <Button
        className="!d-text-body-sm !text-white !normal-case"
        fullWidth={isInSidebar}
        onClick={() => {
          const idpLogoutFrame = document.createElement('iframe');
          document.body.append(idpLogoutFrame);
          idpLogoutFrame.style.visibility = 'hidden';
          idpLogoutFrame.src =
            'https://accounts-nonprd.nyc.gov/account/idpLogout.htm?x-frames-allow-from=https%3A%2F%2Fmyfile-dev.cityofnewyork.us';
          setTimeout(async () => {
            document.body.removeChild(idpLogoutFrame);
            console.log('remove user and logging out');
            await auth.removeUser();
            auth.signoutRedirect();
            navigate({ pathname: '/' });
          }, 1500);
        }}
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          logout
        </Icon>
        Sign out
      </Button>
    </>
  );
}

export default HeaderLinks;
