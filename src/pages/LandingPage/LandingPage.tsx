import { Box, Button, Link } from '@mui/material';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import Footer from '../../layouts/Footer/Footer';
import MDContent from '../../components/MDContent/MDContent';
import { useBoundStore } from '../../store/store';
import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import { Link as LinkRouter } from 'react-router-dom';

function LandingPage() {
  const myFileDescrip =
    'Keep your personal files secure on **My File NYC.** Upload pictures of your files, download files whenever you need, and share files with NYC agencies when applying for benefits.';
  const loginText =
    'Log into or create a **NYC account (NYC.ID)** to get started. You can also use your **ACCESS HRA** account to sign in.';
  const createAccountLink =
    'https://accounts-nonprd.nyc.gov/account/register.htm?target=aHR0cHM6Ly9teWZpbGUtc3RnLmNpdHlvZm5ld3lvcmsudXM=&lang=en';
  // const loginLink =
  //   'https://accounts-nonprd.nyc.gov/account/login.htm?spName=accounts-nonprd.nyc.gov-account&samlContext=us1_7991201_ec246b71-7ed6-4a62-95c7-a7bfe17c10ce';

  const { setLoggedIn, getLoggedIn } = useBoundStore();
  console.log(getLoggedIn());

  return (
    <div className="min-h-[100vh] relative">
      <Box className="fixed top-0 w-full !z-20">
        <GlobalNavigation />
      </Box>
      <div className="flex justify-center items-center  w-full min-h-[100vh] ">
        <div className="flex flex-col content-start justify-center w-[570px] !min-h-full mt-[70px] lg:mb-[200px] mb-[250px] sm:px-0 px-[16px]">
          {/* Logo */}
          <Box className="flex justify-start">
            <MyFileLogo variant="full" />
          </Box>

          {/* Text - need to add bold text */}
          <Box className="m-text-body-md sm:d-text-body-md lg:d-text-body-lg mb-[4px] !w-9/10">
            <MDContent content={myFileDescrip} />
            <MDContent content={loginText} />
          </Box>

          {/* Buttons */}

          <Button
            href={createAccountLink}
            variant="outlined"
            className="w-full !mb-[20px] !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md  !normal-case"
          >
            Create account
          </Button>
          <LinkRouter to="terms-of-use">
            <Button
              // href="/terms-of-use"
              variant="contained"
              className="!w-full !mb-[24px] !h-12 !bg-primary lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case"
              onClick={() => {
                setLoggedIn(true);
              }}
            >
              Log in
            </Button>
          </LinkRouter>

          {/* Link */}
          <Box className="!flex !items-center !justify-center m-text-btn-md-link lg:d-text-btn-lg-link !underline-offset-8 !underline !decoration-2 !decoration-primary">
            <Link href="/nycid">Having trouble logging in?</Link>
          </Box>

          {/* Divider */}
          <div className="border-gray-400 mt-6"></div>

          {/* Language Selector */}
          {/* <LanguageSelector lang={Languages} /> */}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
