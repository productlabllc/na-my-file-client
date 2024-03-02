import { Box, Divider, Drawer } from '@mui/material';
import HeaderLinks from '../../components/HeaderLinks/HeaderLinks';
import NYCMayorsOffice from '../../assets/nyc-mayors-office.svg';
interface SideNavigationProps {
  open: boolean;
  onClose: () => void;
}

function SideNavigation({ open, onClose }: SideNavigationProps) {
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
        <Box className="px-[12px]">
          <Box className="mt-[150px] mb-[12px] pl-[4px] pb-[16px]">
            <HeaderLinks />
          </Box>

          <Divider className="bg-white" />

          <Box className="fixed bottom-3">
            <img
              alt="nyc-logo"
              src={NYCMayorsOffice}
              className="h-9 pb-1 fill-white"
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default SideNavigation;
