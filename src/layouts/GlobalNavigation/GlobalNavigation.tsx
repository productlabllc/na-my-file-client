// import NYCLogo from '../../components/NYCLogo/NYCLogo';
import { Box } from '@mui/material';
import GlobalLanguageSelector from '../../components/GlobalLanguageSelector/GlobalLanguageSelector';
// import BaseComponent from '../../components/BaseComponent/BaseComponent';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { useBoundStore } from '../../store/store';
import HorizontalMyFileLogo from '../../assets/Horizontal My File Logo.svg';
// import { useTranslation } from 'react-i18next';

function GlobalNavigation() {
  // Getting user data from API and save it to the store
  const auth = useAuth();
  const { useFetchUserData, getTOSAccepted } = useBoundStore();
  const [TOU, setTOU] = useState<boolean | undefined>(getTOSAccepted());
  // const { t } = useTranslation('user');

  useEffect(() => {
    if (auth.isAuthenticated && !TOU) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFetchUserData().then(() => {
        setTOU(getTOSAccepted());
      });
    }
  }, [auth.isAuthenticated, useFetchUserData, TOU, getTOSAccepted]);

  return (
    <Box className="border-b-2  h-[45px] w-full flex items-center pr-[16px] sm:px-[32px] lg:px-[48px] !bg-[#F9F9FA] justify-between !z-10">
      <Box data-testid="parent" className="flex items-center">
        {/* <NYCLogo data-testid="nyc-logo-component" /> */}
        {!auth.isAuthenticated && <img src={HorizontalMyFileLogo} className="w-[150px] h-[20px]"></img>}
        {/* <p data-testid="official-nyc-text" className="hidden lg:block lg:d-text-body-sm">
          {t('nyc')}
        </p> */}
      </Box>
      <GlobalLanguageSelector />
    </Box>
  );
}

export default GlobalNavigation;
