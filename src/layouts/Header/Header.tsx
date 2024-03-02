import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import MyFileLogoWhite from '../../components/MyFileLogoWhite/MyFileLogoWhite';
import HeaderLinks from '../../components/HeaderLinks/HeaderLinks';
import SideNavigation from '../SideNavigation/SideNavigation';
// import ActivitySideBar from '../ActivitySideBar/ActivitySideBar';
import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// This component is taken from MUI documentation:
// https://mui.com/material-ui/react-app-bar/

function Header() {
  // TODO different header items for agents

  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const handleDrawerMenuToggle = () => {
    setDrawerMenuOpen((prevState) => !prevState);
  };

  return (
    <Box className="mb-12 sm:mb-16 lg:mb-18">
      <AppBar
        component="nav"
        elevation={0}
        className="!bg-secondary h-[64px] !p-0 !z-30"
      >
        <Toolbar className="!px-[16px] sm:!px-[32px] lg:!px-[48px] flex justify-between">
          <MyFileLogoWhite />
          {drawerMenuOpen ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={handleDrawerMenuToggle}
                className="block md:!hidden"
              >
                <CloseIcon />
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
                <Typography className="!m-text-body-xsm !text-white !normal-case">
                  Menu
                </Typography>
              </IconButton>
            </>
          )}
          <Box className="hidden md:block">
            <HeaderLinks />
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="fixed w-full pt-[14px] sm:pt-0 !z-30">
        <GlobalNavigation />
      </Box>

      <SideNavigation open={drawerMenuOpen} onClose={handleDrawerMenuToggle} />

      {/* <ActivitySideBar /> */}
    </Box>
  );
}

export default Header;
