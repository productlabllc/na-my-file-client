import NYCLogo from '../../components/NYCLogo/NYCLogo';
import GlobalLanguageSelector from '../../components/GlobalLanguageSelector/GlobalLanguageSelector';

function GlobalNavigation() {
  return (
    <div className="border-b-2 border-b-black h-[40px] w-full flex items-center px-[16px] sm:px-[32px] lg:px-[48px] bg-disabledText justify-between !z-10">
      <div data-testid="parent" className="flex items-center">
        <NYCLogo data-testid="nyc-logo-component" />
        <p
          data-testid="official-nyc-text"
          className="hidden lg:block lg:d-text-body-sm"
        >
          Official website of the City of New York
        </p>
      </div>
      <GlobalLanguageSelector />
    </div>
  );
}

export default GlobalNavigation;
