import { Box } from '@mui/material';
// import GlobalLanguageSelector from '../../components/GlobalLanguageSelector/GlobalLanguageSelector';
import { useContext, useEffect, useState } from 'react';
import { useBoundStore } from '../../store/store';
import HorizontalMyFileLogo from '../../assets/Horizontal My File Logo.svg';
import { AccountContext } from '../../pages/auth/Account';

function GlobalNavigation() {
  const { getSession } = useContext(AccountContext);
  const { useFetchUserData, getTOSAccepted } = useBoundStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [TOU, setTOU] = useState<boolean | undefined>(getTOSAccepted());

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getSession();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [getSession]);

  // Handle TOS and user data
  useEffect(() => {
    // if (isAuthenticated && !TOU) { // for now removed TOU check. This SKIPS the TOU check! Warning
      if (isAuthenticated) {
      useFetchUserData().then(() => {
        setTOU(getTOSAccepted());
      });
    }
  }, [isAuthenticated, useFetchUserData, TOU, getTOSAccepted]);

  return (
    <Box className="border-b-2  h-[45px] w-full flex items-center pr-[16px] sm:px-[32px] lg:px-[48px] !bg-[#F9F9FA] justify-between !z-10">
      <Box data-testid="parent" className="flex items-center">
        {!isAuthenticated && <img src={HorizontalMyFileLogo} className="w-[150px] h-[20px]" alt="My File Logo" />}
      </Box>
      {/* <GlobalLanguageSelector /> */}
    </Box>
  );
}

export default GlobalNavigation;
