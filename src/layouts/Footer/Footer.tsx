import { Link, Divider, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// import NYCMayorsOffice from '../../assets/nyc-mayors-office.svg';
import { useTranslation } from 'react-i18next';
import CustomLogo from '../../assets/NYC.svg';
import { Box } from '@mui/material';

function Footer() {
  const { t } = useTranslation('user');
  return (
    <>
      <footer
        className={`absolute xl:h-[200px] sm:h-[224px] bottom-0 w-full flex flex-col justify-center !bg-[#F8F9FB] !lg:py-[0px] sm:!py-[40px] !py-[24px] xl:px-[104px] sm:px-[50px] md:px-[90px] px-[16px] pt-0 pb-0 !h-fit`}
      >
        {/* TODO replace with correct logo SVG */}
        <Box className="flex md:flex-row flex-col md:justify-between justify-center w-full">
          <Box className="flex flex-col items-start justify-center mb-[24px] md:mb-0">
            <img alt="nyc-logo" src={CustomLogo} className="h-6 pb-1 fill-white" />
            <Typography className="!d-text-body-md">Official website of the City of New York</Typography>
          </Box>
          {/*md and up */}
          <Box className="d-text-footer mt-[8px] lg:mt-0 flex-row md:flex hidden">
            <Box className="mr-[64px]">
              <Link
                component={RouterLink}
                to="/terms-of-use"
                className="!text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px]"
              >
                {t('tou')}
              </Link>
            </Box>
            <Box className="flex flex-col items-start justify-start">
              <Link
                component={RouterLink}
                to="/support"
                className="!text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px] !mb-[12px]"
              >
                Support
              </Link>

              <Link
                component={RouterLink}
                to="/"
                className="!text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px]"
              >
                More Benefits on ACCESS NYC
              </Link>
            </Box>
          </Box>
        </Box>

        {/*0 and md */}
        <Box className="md:hidden flex flex-row !justify-between">
          <Box className="flex flex-col items-start justify-center">
            <Link
              component={RouterLink}
              to="/terms-of-use"
              className="!mb-[8px] md:!mb-0 !text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px]"
            >
              {t('tou')}
            </Link>
            <Link
              component={RouterLink}
              to="/support"
              className="!text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px] !mb-[12px]"
            >
              Support
            </Link>
          </Box>
          <Box className="w-2/5">
            <Link
              component={RouterLink}
              to="/"
              className="!text-black !d-text-body-xsm-bold !no-underline hover:!underline hover:!decoration-black hover:!decoration-1 hover:!underline-offset-[4px] !text-wrap"
            >
              More Benefits on ACCESS NYC
            </Link>
          </Box>
        </Box>
        <Divider className="w-full !border-1 !border-[#ADB2B9] !my-[24px]" />
        <div className="flex !justify-start w-full ">
          <p
            data-testid="copyright"
            className="text-black text-left !m-text-body-sm md:!d-text-body-xsm flex justify-start"
          >
            {t('copyrightText')}
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
