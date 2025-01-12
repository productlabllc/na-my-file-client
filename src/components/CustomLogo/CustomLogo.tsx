import CustomLogoIcon from '../../assets/custom-logo.svg';

function CustomLogo() {
  return (
    <div className="mr-[8px]">
      <img src={CustomLogoIcon} className="h-[20px] lg:h-[16px]" aria-label="Logo" alt="Logo" />
    </div>
  );
}

export default CustomLogo;
