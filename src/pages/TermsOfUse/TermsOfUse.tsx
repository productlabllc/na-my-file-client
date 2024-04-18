import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
import BackButton from '../../components/BackButton/BackButton';
import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
import Footer from '../../layouts/Footer/Footer';
import MDContent from '../../components/MDContent/MDContent';
import { getMarkDownFile } from '../../utils/importMarkdownFile';
import { useBoundStore } from '../../store/store';
import { useAuth } from 'react-oidc-context';
import { UpdateUserRequest } from '@myfile/api-client';

function TermsOfUse() {
  // TODO fetch from CMS based on locale
  // const content = `\nAn h1 header\n============\n\nParagraphs are separated by a blank line.\n\n2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists\nlook like:\n\n  * this one\n  * that one\n  * the other one\n\nAn h2 header\n------------\n\nHere's a numbered list:\n\n 1. first item\n 2. second item\n 3. third item\n`
  // const { i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    getAcceptedTermsOfUse,
    setAcceptedTermsOfUse,
    getLoggedIn,
    updateUser,
    getUserData,
    resetUserData
  } = useBoundStore();
  const { getLang } = useBoundStore();
  const lang = getLang();

  console.log('getMarkDownUrl', getAcceptedTermsOfUse());
  console.log(getLoggedIn());

  const [mdText, setMdText] = useState('');
  const paddingBottom =
    !getAcceptedTermsOfUse() && getLoggedIn()
      ? 'pb-[50px] md:pb-[80px] lg:pb-[88px]'
      : 'pb-[250px]';

  useEffect(() => {
    console.log(getAcceptedTermsOfUse());
    if (lang) {
      const fetchData = async () => {
        try {
          const data = await getMarkDownFile('terms-of-use', lang);

          setMdText(data);
        } catch (error) {
          // console.log(lang)
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [lang, getAcceptedTermsOfUse]);

  const approveTermsOfUse = () => {
    const userData = getUserData();
    const updatedUser: UpdateUserRequest = {
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      Email: userData.Email ? userData.Email : '',
      DOB: userData.DOB,
      LanguageIsoCode: userData.LanguageIsoCode || 'en-us',
      TOSAccepted: true
    };

    updateUser(updatedUser, auth.user?.id_token).then(() => {
      const fetchedData = getUserData();
      console.log(fetchedData);
      setAcceptedTermsOfUse(true);
      navigate('/create-profile');
    });
  };

  const declineTermsOfUse = () => {
    setTimeout(async () => {
      const idpLogoutFrame = document.createElement('iframe');
      document.body.append(idpLogoutFrame);
      idpLogoutFrame.style.visibility = 'hidden';
      idpLogoutFrame.src =
        'https://accounts-nonprd.nyc.gov/account/idpLogout.htm?x-frames-allow-from=https%3A%2F%2Fmyfile-dev.cityofnewyork.us';
      document.body.removeChild(idpLogoutFrame);
      console.log('remove user and logging out');
      resetUserData();
      await auth.removeUser();
      auth.signoutRedirect();
      navigate({ pathname: '/' });
    }, 1500);
  };

  return (
    <div className="min-h-[100vh] relative">
      <Box className="fixed top-0 w-full !z-20">
        <GlobalNavigation />
      </Box>
      <div
        className={`flex items-center flex-col !pt-[70px] !w-full px-[16px] sm:px-0 !h-full ${paddingBottom}`}
      >
        <div className="lg:w-[570px] sm:w-[546px]">
          <div className="mb-[24px] relative">
            {(getAcceptedTermsOfUse() && auth.isAuthenticated) ||
            !getLoggedIn() ? (
              <BackButton navigatePath="/" />
            ) : (
              ''
            )}
          </div>
          <Container className="!pb-[30px] !px-0">
            <div>
              <MyFileLogo variant="full" notClickable={true} />
            </div>
            <MDContent content={mdText} />
          </Container>
          {!getAcceptedTermsOfUse() && auth.isAuthenticated ? (
            <>
              <Button
                variant="outlined"
                className="w-full !mb-[20px] !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md  !normal-case"
                onClick={declineTermsOfUse}
              >
                Decline & log out
              </Button>
              <Button
                onClick={approveTermsOfUse}
                // href="/family-members"
                variant="contained"
                className="!w-full !mb-[24px] !h-12 !bg-primary lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case"
              >
                Agree
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      {(getAcceptedTermsOfUse() && getLoggedIn()) || !getLoggedIn() ? (
        <Footer />
      ) : (
        ''
      )}
    </div>
  );
}

export default TermsOfUse;
