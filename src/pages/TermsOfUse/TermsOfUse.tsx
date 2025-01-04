// import { useTranslation } from 'react-i18next';
import { useRef, useEffect } from 'react';
import { Button, Box, Typography, Divider } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

// import GlobalNavigation from '../../layouts/GlobalNavigation/GlobalNavigation';
// import BackButton from '../../components/BackButton/BackButton';
// import MyFileLogo from '../../components/MyFileLogo/MyFileLogo';
// import Footer from '../../layouts/Footer/Footer';
// import MDContent from '../../components/MDContent/MDContent';
// import { getMarkDownFile } from '../../utils/importMarkdownFile';
import { useBoundStore } from '../../store/store';
import { useAuth } from 'react-oidc-context';
import { UpdateUserRequest } from '@myfile/api-client';
import { useTranslation, Trans } from 'react-i18next';
import BackButton from '../../components/BackButton/BackButton';

function TermsOfUse() {
  // TODO fetch from CMS based on locale
  // const content = `\nAn h1 header\n============\n\nParagraphs are separated by a blank line.\n\n2nd paragraph. *Italic*, **bold**, and \`monospace\`. Itemized lists\nlook like:\n\n  * this one\n  * that one\n  * the other one\n\nAn h2 header\n------------\n\nHere's a numbered list:\n\n 1. first item\n 2. second item\n 3. third item\n`
  // const { i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation('termsOfUse');
  // getLoggedIn
  const { getTOSAccepted, updateUser } = useBoundStore();

  const topRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.focus();
      window.scrollTo(0, 0);
    }
  }, []);

  // console.log('getMarkDownUrl', getTOSAccepted());
  // console.log(getLoggedIn());

  // const [mdText, setMdText] = useState('');
  // const paddingBottom = !getTOSAccepted() && getLoggedIn() ? 'pb-[50px] md:pb-[80px] lg:pb-[88px]' : 'pb-[250px]';
  const TOU = getTOSAccepted();

  // useEffect(() => {
  //   if (i18n.language) {
  //     const fetchData = async () => {
  //       try {
  //         const data = await getMarkDownFile('terms-of-use', i18n.language);

  //         setMdText(data);
  //       } catch (error) {
  //         // console.log(lang)
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [i18n.language]);

  const approveTermsOfUse = () => {
    const updatedUser: UpdateUserRequest = {
      TOSAccepted: true
    };

    updateUser(updatedUser).then(() => {
      navigate('/create-profile');
    });
  };

  // const navigateToPrevPage = () => {
  //   navigate(-1);
  // };

  return (
    <Box className="min-h-[100vh] relative block lg:flex lg:justify-center">
      {/* <Box className="fixed top-0 w-full !z-20">
        <GlobalNavigation />
      </Box> */}
      {/* <div className={`flex items-center flex-col !pt-[70px] !w-full px-[16px] sm:px-0 !h-full ${paddingBottom}`}>
        <div className="lg:w-[570px] sm:w-[546px]">
          <div className="mb-[24px] relative">
            {(TOU && auth.isAuthenticated) || !getLoggedIn() ? <BackButton navigatePath="/" /> : ''}
          </div>
          <Container className="!pb-[30px] !px-0">
            <div>
              <MyFileLogo variant="full" notClickable={true} />
            </div>
            <MDContent content={mdText} />
          </Container>
          {!TOU && auth.isAuthenticated ? (
            <>
              <Button
                variant="outlined"
                className="w-full !mb-[20px] !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md  !normal-case"
                component={Link}
                to="/logout"
              >
                {t('declineTOU')}
              </Button>
              <Button
                onClick={approveTermsOfUse}
                variant="contained"
                className="!w-full !mb-[24px] !h-12 !bg-primary lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case"
              >
                {t('acceptTOU')}
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
      </div> */}
      {/* {(getTOSAccepted() && getLoggedIn()) || !getLoggedIn() ? <Footer /> : ''} */}
      <Box
        ref={topRef}
        tabIndex={0}
        className="w-full mt-[48px] lg:w-[805px] lg:mt-[116px] px-[16px] focus:outline-none"
      >
        {(auth.isAuthenticated && TOU) || !auth.isAuthenticated ? (
          <Box className="mb-[46px] lg:mb-[56px]">
            <BackButton navigatePath="/" text="Back" />
          </Box>
        ) : (
          ''
        )}
        <Box className="mb-[40px] lg:!mb-[56px]">
          <Typography className="!m-text-h2 lg:!d-text-h2 !text-secondary !mb-[24px] lg:!mb-[32px]">
            {t('termsOfUseHeader')}
          </Typography>
          <Divider className="!border-[1px] !border-[#999CA4] !border-opacity-30"></Divider>
        </Box>
        <Box>
          <Box className="!mb-[36px]">
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              {t('acceptingFollowingTermsParagraph')}
            </Typography>
          </Box>

          <Box className="mb-[24px]">
            <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold">{t('defitionTitle')}</Typography>
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              <Trans ns="termsOfUse" i18nKey={'definitionsParagraph'} components={{ br: <br /> }} />
            </Typography>
          </Box>

          <Box className="mb-[24px]">
            <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold">{t('purposeTitle')}</Typography>
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              <Trans ns="termsOfUse" i18nKey={'purposeParagraph'} components={{ br: <br /> }} />
            </Typography>
          </Box>

          <Box className="mb-[24px]">
            <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold">{t('useTitle')}</Typography>
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              <Trans ns="termsOfUse" i18nKey={'useParagraph'} components={{ br: <br /> }} />
            </Typography>
          </Box>

          <Box className="mb-[48px]">
            <Typography className="!m-text-body-lg-bold lg:!d-text-body-lg-bold">{t('scopeTitle')}</Typography>
            <Typography className="!m-text-body-lg lg:!d-text-body-lg">
              <Trans ns="termsOfUse" i18nKey={'scopeParagraph'} components={{ br: <br /> }} />
            </Typography>
          </Box>

          <Box className="mb-[76px]">
            <Typography>{t('reservedRights')}</Typography>
          </Box>

          {!TOU && auth.isAuthenticated ? (
            <Box className="mb-[76px]">
              <Button
                variant="outlined"
                className="w-full !mb-[20px] !h-12 lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md  !normal-case"
                component={Link}
                to="/logout"
              >
                {t('declineTOU')}
              </Button>
              <Button
                onClick={approveTermsOfUse}
                variant="contained"
                className="!w-full !mb-[24px] !h-12 !bg-primary lg:!m-text-btn-lg sm:!m-text-btn-md !m-text-btn-md !normal-case"
              >
                {t('acceptTOU')}
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default TermsOfUse;
