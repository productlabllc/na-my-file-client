// import NYCLogo from '../../components/NYCLogo/NYCLogo';
import GlobalLanguageSelector from '../../components/GlobalLanguageSelector/GlobalLanguageSelector';
// import BaseComponent from '../../components/BaseComponent/BaseComponent';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { useBoundStore } from '../../store/store';

function GlobalNavigation() {
  // Getting user data from API and save it to the store
  const auth = useAuth();
  const { getUserData, useFetchUserData, getAcceptedTermsOfUse } =
    useBoundStore();
  const [userData, setUserData] = useState<object | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated && !userData) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useFetchUserData(auth.user?.id_token).then(() => {
        const fetchedData = getUserData();
        setUserData(fetchedData);
        // setTos(fetchedData.TOSAcceptedAt);
      });
    }
  }, [
    auth.isAuthenticated,
    auth.user?.id_token,
    getAcceptedTermsOfUse,
    useFetchUserData,
    getUserData,
    userData
  ]);

  return (
    <div className="border-b-2 border-b-black h-[40px] w-full flex items-center px-[16px] sm:px-[32px] lg:px-[48px] bg-disabledText justify-between !z-10">
      <div data-testid="parent" className="flex items-center">
        {/* <NYCLogo data-testid="nyc-logo-component" /> */}
        <p
          data-testid="official-nyc-text"
          className="hidden lg:block lg:d-text-body-sm"
        >
          Official Website of My File
        </p>
      </div>
      <GlobalLanguageSelector />
    </div>
  );
}

export default GlobalNavigation;
