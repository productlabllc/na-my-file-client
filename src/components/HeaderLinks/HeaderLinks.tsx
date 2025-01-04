import { Button, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
interface HeaderLinksProps {
  isInSidebar?: boolean;
}

function HeaderLinks({ isInSidebar }: HeaderLinksProps) {
  const { t } = useTranslation('user');
  return (
    <>
      <Button className="!d-text-body-sm !text-white !normal-case !mr-[12px]" component={Link} to="/terms-of-use">
        <PolicyOutlinedIcon fontSize="medium" className="!mb-1 !mr-3"></PolicyOutlinedIcon>
        {t('TOU')}
      </Button>

      <Button className="!d-text-body-sm !text-white !normal-case !mr-[12px]" component={Link} to="/support">
        <HelpOutlineOutlinedIcon fontSize="medium" className="!mb-1 !mr-3"></HelpOutlineOutlinedIcon>
        {t('support')}
      </Button>

      <Button
        className="!d-text-body-sm !text-white !normal-case !mr-[12px]"
        fullWidth={isInSidebar}
        component={Link}
        to="/activity"
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          history
        </Icon>
        <div className="">{t('activityLog')}</div>
      </Button>

      <Button
        className="!d-text-body-sm !text-white !normal-case !mr-[12px]"
        fullWidth={isInSidebar}
        component={Link}
        to="/profile"
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          perm_identity
        </Icon>
        <div className="">{t('myProfile')}</div>
      </Button>

      <Button
        className="!d-text-body-sm !text-white !normal-case"
        fullWidth={isInSidebar}
        component={Link}
        to="/logout"
      >
        <Icon fontSize="medium" className="!mb-1 !mr-3">
          logout
        </Icon>
        {t('logOut')}
      </Button>
    </>
  );
}

export default HeaderLinks;
