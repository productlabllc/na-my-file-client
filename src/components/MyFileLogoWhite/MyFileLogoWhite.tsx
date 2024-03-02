import myFileLogoFull from '../../assets/my-file-logo-white.svg';

function MyFileLogoWhite() {
  return (
    <img
      src={myFileLogoFull}
      className={`h-[77px] w-[90px]`}
      aria-label="MyFile NYC"
      alt="MyFile NYC"
    />
  );
}

export default MyFileLogoWhite;
