import NYCLogoIcon from '../../assets/NYC.svg';

function NYCLogo() {
  return (
    <div className="mr-[8px]">
      <img
        src={NYCLogoIcon}
        className="h-[20px] lg:h-[16px]"
        aria-label="NYC"
        alt="NYC"
      />
    </div>
  );
}

export default NYCLogo;
