import { Box, Drawer, Typography, Tooltip } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AgentSideBar() {
  const navigate = useNavigate();
  const { t } = useTranslation('agent');
  return (
    <Box>
      <Drawer
        anchor="left"
        variant="permanent"
        ModalProps={{
          keepMounted: true
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#F2F5FA'
            // boxShadowRight: '2px'
          }
        }}
        sx={{
          '& .MuiDrawer-paper': { boxShadow: '0px 0px 16px #E3E6EA' }
          // zIndex: 11
        }}
        classes={{ paper: '2xl:w-[230px] w-[104px]' }}
      >
        <Box className="flex justify-center h-full">
          <Box className="!flex !flex-col !justify-between !w-full px-[16px] pb-[48px] pt-[96px]">
            <Box className="flex flex-col items-center justify-center 2xl:!items-start w-full 2xl:px-[12px] my-[24px]">
              <Box
                className="!flex !flex-row !justify-center !cursor-pointer !items-center"
                onClick={() => navigate('/agent-dashboard')}
              >
                <Tooltip
                  title={<Box className="!d-text-body-xsm w-fit text-white">Dashboard</Box>}
                  className="block 2xl:hidden"
                  placement="right"
                  arrow
                  classes={{ tooltip: '!bg-secondary', arrow: '!text-secondary' }}
                >
                  <Box className="!px-[16px] !py-[8px] hover:!bg-[#ffffff] !rounded-[4px]">
                    <HomeOutlinedIcon className="!text-black hover:!bg-[#ffffff] hover:!text-black mr-[0px] 2xl:mr-[8px]" />
                  </Box>
                </Tooltip>
                <Box className="!hidden 2xl:!flex flex-row items-center !px-[16px] !py-[8px] !rounded-[4px] hover:!bg-[#ffffff] !w-full">
                  <HomeOutlinedIcon className="!text-black mr-0 2xl:mr-[8px] " />
                  <Typography className="!text-black !d-text-body-sm">{t('dashboard')}</Typography>
                </Box>
              </Box>
            </Box>

            <Box className="flex flex-col items-center 2xl:block border-t-[2px] border-t-black border-opacity-10 pt-[36px] 2xl:px-[12px]">
              <Box className="!flex !flex-row !items-center !cursor-pointer" onClick={() => navigate('/terms-of-use')}>
                <Tooltip
                  title={<Box className="!d-text-body-xsm w-fit text-white">Terms of Use</Box>}
                  className="block 2xl:hidden"
                  placement="right"
                  arrow
                  classes={{ tooltip: '!bg-secondary', arrow: '!text-secondary' }}
                >
                  <Box className="!px-[16px] !py-[8px] hover:!bg-[#ffffff] !rounded-[4px] !mb-[24px]">
                    <PolicyOutlinedIcon className="!text-black mr-[0px] 2xl:mr-[8px] " />
                  </Box>
                </Tooltip>
                <Box className="!hidden 2xl:!flex flex-row items-center !px-[16px] !py-[8px] !rounded-[4px] hover:!bg-[#ffffff] mb-[12px] w-full">
                  <PolicyOutlinedIcon className="!text-black mr-[0px] 2xl:mr-[8px]" />
                  <Typography className="text-black !d-text-body-sm ">Terms of Use</Typography>
                </Box>
              </Box>
              <Box className="!flex !flex-row !items-center !cursor-pointer" onClick={() => navigate('/support')}>
                <Tooltip
                  title={<Box className="!d-text-body-xsm w-fit text-white ">Support</Box>}
                  className="block 2xl:hidden"
                  placement="right"
                  arrow
                  classes={{ tooltip: '!bg-secondary', arrow: '!text-secondary' }}
                >
                  <Box className="!px-[16px] !py-[8px] hover:!bg-[#ffffff] !rounded-[4px]">
                    <HelpOutlineOutlinedIcon className="!text-black mr-[0px] 2xl:mr-[8px]" />
                  </Box>
                </Tooltip>
                <Box className="!hidden 2xl:!flex flex-row items-center !px-[16px] !py-[8px] !rounded-[4px] hover:!bg-[#ffffff] w-full">
                  <HelpOutlineOutlinedIcon className="!text-black mr-[0px] 2xl:mr-[8px] !hidden 2xl:!block" />
                  <Typography className="text-black !d-text-body-sm hidden 2xl:block">Support</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

export default AgentSideBar;
