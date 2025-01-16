import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myFileLogoFull from '../../assets/my-file-logo-head.svg';
import { Box, Button, Menu, Toolbar, AppBar, MenuItem, Icon, ClickAwayListener, Fade } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';

function AgentHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { t } = useTranslation('agent');
  const api = useApi();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const { value: user } = useAsync(() => api.getUser());

  const handleClose = () => {
    setAnchorEl(null);
    navigate('/logout');
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="mb-12 sm:mb-16 lg:mb-18 !z-40">
      <AppBar component="nav" elevation={0} className="!bg-secondary h-[64px] !p-0">
        <Toolbar
          variant="dense"
          className="!px-[16px] sm:!px-[48px] lg:!px-[48px] !flex !justify-between !items-center h-full"
        >
          <Box>
            <img src={myFileLogoFull} className={`h-[52px] w-[77px]`} aria-label="MyFile NYC" alt="MyFile NYC" />
          </Box>
          <Box>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? true : undefined}
                  onClick={handleClick}
                  sx={{
                    borderBottom: open ? `0.2px solid rgba(211, 211, 211, 1) !important` : '' // Add black bottom border
                    // borderTopLeftRadius: '8px !important', // Rounded top-left corner
                    // borderTopRightRadius: '8px', // Rounded top-right corner
                    // borderBottomLeftRadius: 0, // No rounding on bottom-left
                    // borderBottomRightRadius: 0 // No rounding on bottom-right
                  }}
                  endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                  className={`!normal-case  hover:!bg-white ${open ? '!bg-[#ffffff] !text-black !border-black' : '!text-[#ffffff]'} hover:!text-black !min-w-fit !rounded-t-[4px]  ${open ? '!rounded-b-none ' : '!rounded-b-[4px]'}`}
                >
                  <Icon className="mr-[8px]">person_outlined_icon</Icon>
                  <span className="!d-text-body-xsm">{`${user?.FirstName} ${user?.LastName}`}</span>
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  // anchorOrigin={{
                  //   vertical: 'bottom',
                  //   horizontal: 'left'
                  // }}
                  // transformOrigin={{
                  //   vertical: 'top',
                  //   horizontal: 'left'
                  // }}
                  slotProps={{
                    paper: {
                      sx: {
                        // borderRadius: 0,
                        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.2)', // Keep bottom shadow only
                        borderTopLeftRadius: '0px !important', // Rounded top-left corner
                        borderTopRightRadius: '0px', // Rounded top-right corner
                        borderBottomLeftRadius: 4, // No rounding on bottom-left
                        borderBottomRightRadius: 4 // No rounding on bottom-right
                      }
                    }
                  }}
                  MenuListProps={{
                    sx: { width: anchorEl && anchorEl.offsetWidth }
                  }}
                  classes={{ paper: 'hover:!bg-[#F3F3F3]' }}
                  TransitionComponent={Fade}
                  className="!rounded-0 !rounded-b-[4px] !rounded-t-none"
                >
                  <MenuItem
                    onClick={handleClose}
                    className="!m-text-body-sm !h-[16px] !py-[12px] !shadow-0 !px-3 hover:!bg-[#F3F3F3]"
                  >
                    <Icon className="text-black mr-[12px]">logout_outlined_icon</Icon>
                    <span className="!d-text-body-xsm">{t('logout')}</span>
                  </MenuItem>
                </Menu>
              </Box>
            </ClickAwayListener>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AgentHeader;
