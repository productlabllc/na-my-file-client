import { Link } from 'react-router-dom';
import myFileLogoIcon from '../../assets/my-file-logo-head.svg';
import myFileLogoFull from '../../assets/my-file-logo-head.svg';

interface MyFileLogoProps {
  center?: boolean;
  variant: 'icon' | 'full';
  notClickable?: boolean; // Clickable and navigating to dashboard by default
}

function MyFileLogo({ center, variant, notClickable }: MyFileLogoProps) {
  const logoClass = center ? 'w-12 mx-auto' : 'w-12';

  const renderImage = () => {
    if (variant === 'icon') {
      return <img src={myFileLogoIcon} className={logoClass} aria-label="MyFile NYC" alt="MyFile NYC" />;
    } else {
      return (
        <img
          src={myFileLogoFull}
          className={`h-[52px] w-[144px] sm:h-[77px] sm:w-[188px]`}
          aria-label="MyFile NYC"
          alt="MyFile NYC"
        />
      );
    }
  };

  if (notClickable) {
    return renderImage();
  } else {
    return (
      <Link to="/dashboard" className="flex-shrink-0">
        {renderImage()}
      </Link>
    );
  }
}

export default MyFileLogo;
