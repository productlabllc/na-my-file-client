import { Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NYCMayorsOffice from '../../assets/nyc-mayors-office.svg';

function Footer() {
  const copyrightText = `© 2023 City of New York. All Rights Reserved. NYC Mayor’s Office for Economic Opportunity is a trademark and service mark of the City of New York.`;
  return (
    <>
      <footer
        className={`absolute xl:h-[200px] sm:h-[224px] bottom-0 w-full flex flex-col justify-center bg-secondary items-center !lg:py-[0px] !sm:py-[32px] !py-[24px] xl:px-[48px] sm:px-[32px] px-[16px] pt-0 pb-0 !h-fit`}
      >
        {/* TODO replace with correct logo SVG */}
        <div className="flex xl:flex-row flex-col lg:justify-between justify-center items-center w-full">
          <img
            alt="nyc-logo"
            src={NYCMayorsOffice}
            className="h-12 pb-1 fill-white"
          />

          <div className="d-text-footer mt-[8px] lg:mt-0 ">
            <Link
              component={RouterLink}
              to="/about"
              className="!text-slate-50  !underline !decoration-white !decoration-2 !underline-offset-[6px]"
            >
              About
            </Link>

            <Link
              component={RouterLink}
              to="/faq"
              className="!text-slate-50 px-[24px] !underline !decoration-white !decoration-2 !underline-offset-[6px]"
            >
              FAQ
            </Link>

            <Link
              component={RouterLink}
              to="/terms-of-use"
              className="!text-slate-50 pr-4 !underline !decoration-white !decoration-2 !underline-offset-[6px]"
            >
              Terms of Use
            </Link>
          </div>
        </div>
        <Divider
          variant="middle"
          className="w-full !border-1 !border-white opacity-60 !my-[24px]"
        />
        <div className="flex !justify-start xl:w-full sm:w-[70%] w-full ">
          <p
            data-testid="copyright"
            className="text-white xl:text-left sm:text-center text-center m-text-body-xsm flex justify-start"
          >
            {copyrightText}
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
