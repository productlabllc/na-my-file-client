import { Box, Button, Typography } from '@mui/material';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import Footer from '../../layouts/Footer/Footer';
// import { LOGOUT_TOAST_MESSAGE } from '../../utils/client-toast-messages';
// import MDContent from '../../components/MDContent/MDContent';
// import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useBoundStore } from '../../store/store';
import CircularProgress from '@mui/material/CircularProgress';
import { UserBase as User } from '@namyfile/api-client';
import ApproveImg from '../../assets/Approve.svg';
import ShareImg from '../../assets/Share.svg';
import UploadImg from '../../assets/Upload.svg';
import CircleImg from '../../assets/Line.svg';
import AlertSuccessToastMessage from '../../components/AlertSuccessToastMessage/AlertSuccessToastMessage';
import { useTranslation } from 'react-i18next';

function LandingPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { useFetchUserData, getUserData, showToastMessageLogout, setShowToastMessageLogout } = useBoundStore();

  const [spinner, setSpinner] = useState(false);

  const { t } = useTranslation('user');

  const redirect = useCallback(
    (user: User) => {
      console.log('redirect', user);
      if (auth.isAuthenticated && user.TOSAccepted) {
        if (
          user?.StakeholderGroupRoles?.[0].StakeholderGroupRole?.Name === 'Client' ||
          user?.StakeholderGroupRoles?.[0].StakeholderGroupRole?.Name === 'Client Trusted User'
        ) {
          if (!user.FirstName || !user.LastName || !user.DOB) {
            navigate('/create-profile');
          } else {
            navigate('/client-dashboard');
          }
        } else {
          navigate('/agent-dashboard');
        }
      } else if (auth.isAuthenticated && !user.TOSAccepted) {
        navigate({ pathname: '/terms-of-use' });
      }
      setSpinner(false);
    },
    [auth.isAuthenticated, navigate]
  );

  useEffect(() => {
    console.log('useEffect auth.isAuthenticated', auth.isAuthenticated);
    if (auth.isAuthenticated) {
      setSpinner(true);
      useFetchUserData().then(() => {
        const user = getUserData();
        redirect(user);
      });
    }
  }, [auth.isAuthenticated, getUserData, redirect, useFetchUserData]);

  let createAccountLink = '/signup';
  const handleCloseToastMessage = () => {
    setShowToastMessageLogout(false);
  };

  const renderToastMessage = useCallback(() => {
    return (
      <AlertSuccessToastMessage
        handleCloseToastMessage={handleCloseToastMessage}
        text={t('toastLoggedOut')}
        showToast={showToastMessageLogout}
      />
    );
  }, [showToastMessageLogout]);

  if (auth.isAuthenticated && spinner) {
    return <CircularProgress />;
  } else {
    return (
      <Box className="min-h-[100vh] relative">
        <Box className="fixed top-0 w-full !z-20">
          <GlobalNavigation />
          {renderToastMessage()}
        </Box>
        <Box className="w-full min-h-[100vh] bg-gradient-to-b from-[#7FA3FF]/40 to-transparent to-40% bg-grad">
          <Box className="w-full flex flex-col px-[16px]">
            <Box className="w-full flex flex-col items-center mb-[100px] md:mb-[144px] pt-[100px] md:pt-[184px]">
              <Box className="w-full lg:w-[1100px] 2xl:w-full mb-[48px]">
                <Typography className="!d-text-h3 md:!d-text-h1 !text-center !relative">
                  A{' '}
                  <span className="relative inline-block">
                    <span className="z-10">quick and secure</span>
                    <span className="absolute inset-0 flex justify-center items-center">
                      <img src={CircleImg} className="min-w-[107%]" alt="Circle"></img>
                    </span>
                  </span>{' '}
                  way to share your documents{' '}
                </Typography>
              </Box>
              <Box className="w-full md:!w-[620px] mb-[48px]">
                <Typography className="!text-center !m-text-body-lg md:!d-text-body-md">
                  {
                    "Keep your family's documents secure and organized with My File and easily share them for housing services, all in one convenient place"
                  }
                </Typography>
              </Box>
              <Box className="flex md:justify-center flex-col w-full md:flex-row mb-[24px] md:mb-[12px]">
                <Button
                  href={createAccountLink}
                  variant="contained"
                  className="!w-full md:max-w-[140px] !mb-[16px] md:!mr-[16px] !h-10 !bg-primary lg:!m-text-btn-md sm:!m-text-btn-md !m-text-btn-md !normal-case"
                >
                  Sign up
                </Button>
                <Button
                  variant="outlined"
                  className="!w-full md:max-w-[140px] !h-10 lg:!m-text-btn-md sm:!m-text-btn-md !m-text-btn-md !normal-case hover:!bg-transparent"
                  onClick={() => {
                    // setLoggedIn(true);
                    auth.signinRedirect();
                  }}
                >
                  Log in
                </Button>
              </Box>
              <Box>
                <Button
                  onClick={() => {
                    // setLoggedIn(true);
                    auth.signinRedirect();
                  }}
                  variant="text"
                  className="text-[#1A90E5] !px-0 !w-full !m-text-body-md-bold md:!d-text-body-md-bold hover:!underline hover:!underline-offset-4 !normal-case"
                >
                  Use your ACCESS HRA account to log in
                </Button>
              </Box>
            </Box>
            <Box className="w-full mb-[220px] md:mb-[309px] flex flex-col !items-center ">
              <Box className="!min-w-[280px] md:!min-w-[420px] relative mb-[40px] md:mb-[86px]">
                <Box className="!m-text-h3 md:!d-text-h2 !text-center !relative">
                  How does it work?
                  <Box
                    className="h-10 !min-w-full md:min-w-full bg-[#B3F1E6] !rotate-3 !-z-10 absolute top-7 md:top-10"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 15%, 0 50%)' }}
                  ></Box>
                </Box>
              </Box>
              <Box className="flex flex-col items-center md:flex-row justify-center w-full mb-[120px]">
                <Box className="flex flex-col md:items-start px-[24px] md:px-0 w-full md:w-[250px] 2xl:w-[350px] md:mr-[64px]">
                  <Box className="w-full flex justify-center">
                    <img className="h-[225px] w-[225px]" src={UploadImg}></img>
                  </Box>
                  <Box className="flex flex-col items-start lg:pl-[24px]">
                    <Typography className="!d-text-body-xsm !mb-[8px] !text-[#4C4E52]">Step 1</Typography>
                    <Typography className="!d-text-body-md-bold !mb-[8px]">Upload your documents</Typography>
                    <Typography className="!d-text-body-sm">
                      Take pictures of your documents or upload copies already on your device.{' '}
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex flex-col md:items-start px-[24px] md:px-0 w-full  md:w-[250px] 2xl:w-[374px] md:mr-[64px]">
                  <Box className="w-full flex justify-center">
                    <img className="h-[225px] w-[225px]" src={ShareImg}></img>
                  </Box>
                  <Box className="flex flex-col items-start lg:pl-[24px]">
                    <Typography className="!d-text-body-xsm !mb-[8px] !text-[#4C4E52]">Step 2</Typography>
                    <Typography className="!d-text-body-md-bold !mb-[8px]">Share your documents</Typography>
                    <Typography className="!d-text-body-sm">
                      Know what and when to submit for DHS PATH shelter or HPD Set Aside Affordable Housing.
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex flex-col md:items-start  px-[24px] md:px-0 w-full md:w-[250px] 2xl:w-[350px]">
                  <Box className="w-full flex justify-center">
                    <img className="h-[225px] w-[225px]" src={ApproveImg}></img>
                  </Box>
                  <Box className="flex flex-col items-start lg:pl-[24px]">
                    <Typography className="!d-text-body-xsm !mb-[8px] !text-[#4C4E52]">Step 3</Typography>
                    <Typography className="!d-text-body-md-bold !mb-[8px]">Track your documents</Typography>
                    <Typography className="!d-text-body-sm">
                      Get notified when your documents are approved or if additional actions are needed.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* <div className="flex flex-col content-start justify-center w-[570px] !min-h-full mt-[70px] lg:mb-[200px] mb-[250px] sm:px-0 px-[16px]">
            <Box className="flex justify-start">
              <MyFileLogo variant="full" />
            </Box>


            <Box className="m-text-body-md sm:d-text-body-md lg:d-text-body-lg mb-[4px] !w-9/10">
              <MDContent content={t('myFileDescrip')} />
              <MDContent content={t('loginText')} />
            </Box>



            <Button
              href={createAccountLink}
              variant="outlined"
              className="w-full !mb-[20px] !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md  !normal-case"
            >
              {t('createAccount')}
            </Button>

            <Button
              // href="/terms-of-use"
              variant="contained"
              className="!w-full !mb-[24px] !h-12 !bg-primary lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case"
              onClick={() => {
                // setLoggedIn(true);
                auth.signinRedirect();
              }}
            >
              {t('logIn')}
            </Button>


            <Box className="!flex !items-center !justify-center m-text-btn-md-link lg:d-text-btn-lg-link !underline-offset-8 !underline !decoration-2 !decoration-primary">
              <Link href="/nycid">{t('trouble')}</Link>
            </Box>

            <div className="border-gray-400 mt-6"></div>

          </div> */}
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    );
  }
}

export default LandingPage;
