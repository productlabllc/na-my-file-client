import { ArrowBackIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: MouseEventHandler;
  text?: string;
  navigatePath?: string;
  removeArrowIcon?: boolean;
}

function BackButton({
  text,
  navigatePath,
  removeArrowIcon = false
}: BackButtonProps) {
  const navigate = useNavigate();

  const buttonClicked = () => {
    navigate(`${navigatePath ? navigatePath : '/client-dashboard'}`);
  };

  return (
    <Button
      onClick={buttonClicked}
      className="lg:!text-[20px] sm:!m-text-btn-lg !m-text-btn-lg !text-secondary !normal-case !px-1"
    >
      {!removeArrowIcon && (
        <ArrowBackIos className="sm:!m-text-btn-md !m-text-btn-sm !mr-2 !mb-[2px]" />
      )}
      {text || 'Back'}
    </Button>
  );
}

export default BackButton;
