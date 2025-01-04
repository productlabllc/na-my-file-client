import { useBoundStore } from '../../store/store';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

function Logout() {
  const { resetUserData, setShowToastMessageLogout } = useBoundStore();
  const auth = useAuth();
  const navigate = useNavigate();

  const { t } = useTranslation('user');
  const focusItem = useRef<null | HTMLElement>(null);

  useEffect(() => {
    const targetElement = focusItem.current;
    if (targetElement && targetElement.offsetHeight === 0) {
      targetElement.focus();
    }
    const idpLogoutFrame = document.createElement('iframe');
    document.body.append(idpLogoutFrame);
    idpLogoutFrame.style.visibility = 'hidden';
    idpLogoutFrame.style.height = '0px';
    idpLogoutFrame.src =
      'https://accounts-nonprd.nyc.gov/account/idpLogout.htm?x-frames-allow-from=https%3A%2F%2Fmyfile-dev.cityofnewyork.us';
    setTimeout(async () => {
      console.log('remove user and logging out');
      await auth.removeUser();
      await auth.signoutRedirect();

      resetUserData();
    }, 3000);
    setTimeout(() => {
      console.log('remove iframe');
      document.body.removeChild(idpLogoutFrame);
      setShowToastMessageLogout(true);
      navigate({ pathname: '/' });
    }, 3000);
  }, []);

  return (
    <Box
      ref={focusItem}
      className="!h-[100vh] !max-h-[full] w-full flex justify-center items-center !bg-darkGreyBorder !overscroll-none"
    >
      <Box className="flex flex-row items-center justify-center !bg-white p-[24px] w-fit rounded">
        <CircularProgress className="!text-secondary !mr-[16px]" size={36} />
        <Typography className="!m-text-label-md md:!d-text-label-md !text-secondary">{t('logout')}</Typography>
      </Box>
    </Box>
  );
}

export default Logout;
