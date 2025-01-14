import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useBoundStore } from '../../store/store';

function Logout() {
  const { resetUserData, setShowToastMessageLogout } = useBoundStore();
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('user');
  const focusItem = useRef<null | HTMLElement>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await auth.removeUser();
        resetUserData();
        setShowToastMessageLogout(true);
        await auth.signoutRedirect();
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/');
      }
    };

    performLogout();
  }, [auth, resetUserData, setShowToastMessageLogout, navigate]);

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
