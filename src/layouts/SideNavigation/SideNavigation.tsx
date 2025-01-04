import { Box, Button, Divider, Drawer, Icon } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Link } from 'react-router-dom';
interface SideNavigationProps {
  open: boolean;
  onClose: () => void;
}

function SideNavigation({ open, onClose }: SideNavigationProps) {
  const { t } = useTranslation('user');
  return (
    <Box component="nav">
      <Drawer
        anchor="right"
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#031553'
          }
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 }
          // zIndex: 11
        }}
        className="block sm:none !z-20"
      >
        <Box className="px-[12px] pb-[40px] flex flex-col justify-between !h-full">
          <Box className="mt-[150px] mb-[12px] pl-[4px] pb-[16px]">
            <Button
              className="!d-text-body-sm !text-white !normal-case !mr-[12px] !mb-[4px]"
              component={Link}
              to="/profile"
            >
              <Icon fontSize="medium" className="!mb-1 !mr-3">
                perm_identity
              </Icon>
              <div className="">{t('myProfile')}</div>
            </Button>

            <Button className="!d-text-body-sm !text-white !normal-case" component={Link} to="/logout">
              <Icon fontSize="medium" className="!mb-1 !mr-3">
                logout
              </Icon>
              {t('logOut')}
            </Button>
          </Box>

          <Box className="">
            <Divider className="bg-white !mb-[16px]" />

            <Button className="!d-text-body-sm !text-white !normal-case !mb-[4px]" component={Link} to="/terms-of-use">
              <PolicyOutlinedIcon fontSize="medium" className="!mb-1 !mr-3"></PolicyOutlinedIcon>
              {t('TOU')}
            </Button>

            <Button className="!d-text-body-sm !text-white !normal-case" component={Link} to="/support">
              <HelpOutlineOutlinedIcon fontSize="medium" className="!mb-1 !mr-3"></HelpOutlineOutlinedIcon>
              {t('support')}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SideNavigation;
