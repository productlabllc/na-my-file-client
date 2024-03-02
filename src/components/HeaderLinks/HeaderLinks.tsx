import { Button, Icon } from '@mui/material';
import { Link } from 'react-router-dom';

interface HeaderLinksProps {
  isInSidebar?: boolean;
}

function HeaderLinks({ isInSidebar }: HeaderLinksProps) {
  // Dark text for white sidebar

  return (
    <>
      <Button
        className="!d-text-body-sm !text-white !normal-case !mr-[12px]"
        fullWidth={isInSidebar}
        component={Link}
        to="/account"
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
