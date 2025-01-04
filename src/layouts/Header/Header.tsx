import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Icon, IconButton, Toolbar, Typography, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import MyFileLogoWhite from '../../components/MyFileLogoWhite/MyFileLogoWhite';
import HeaderLinks from '../../components/HeaderLinks/HeaderLinks';
import SideNavigation from '../SideNavigation/SideNavigation';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// This component is taken from MUI documentation:
// https://mui.com/material-ui/react-app-bar/
import { useTranslation } from 'react-i18next';

function Header() {
  // TODO different header items for agents
  const navigate = useNavigate();
  const { t } = useTranslation('user');

  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const handleDrawerMenuToggle = () => {
    setDrawerMenuOpen((prevState) => !prevState);
  };

  return (
    <Box className="mb-12 sm:mb-16 lg:mb-18">
      <AppBar component="nav" elevation={0} className="!bg-secondary h-[64px] !p-0 !z-30">
        <Toolbar className="!px-[16px] sm:!px-[32px] lg:!px-[48px] flex justify-between">
          <MyFileLogoWhite />

          <Box>
            {/* <Button className="!d-text-body-sm !text-white !normal-case !mr-[12px]">
              <Icon fontSize="medium" className="!mb-1 !mr-3">
                history
              </Icon>
              Activity Log
            </Button> */}
            <IconButton
              color="inherit"
              aria-label="history"
              edge="start"
              onClick={() => navigate('/activity')}
              className="md:!hidden flex flex-col !mr-[12px]"
            >
              <Icon>history</Icon>
              <Typography className="!m-text-body-xsm !text-white !normal-case">{t('activityLogHeader')}</Typography>
            </IconButton>
            {drawerMenuOpen ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open menu"
                  edge="start"
                  onClick={handleDrawerMenuToggle}
                  className="md:!hidden flex flex-col"
                >
                  <CloseIcon />
                  <Typography className="!m-text-body-xsm !text-white !normal-case">{t('close')}</Typography>
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open menu"
                  edge="start"
                  onClick={handleDrawerMenuToggle}
                  className="md:!hidden flex flex-col"
                >
                  <MenuIcon />
                  <Typography className="!m-text-body-xsm !text-white !normal-case">{t('menuHeader')}</Typography>
                </IconButton>
              </>
            )}
          </Box>
          <Box className="hidden md:block">
            <HeaderLinks />
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="!fixed w-full top-[62px] sm:pt-0 !z-30">
        <GlobalNavigation />
      </Box>

      <SideNavigation open={drawerMenuOpen} onClose={handleDrawerMenuToggle} />

      {/* <ActivitySideBar /> */}
    </Box>
  );
}

export default Header;
