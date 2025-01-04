import { ArrowBackIos } from '@mui/icons-material';
import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: MouseEventHandler;
  text?: string;
  navigatePath?: string;
  removeArrowIcon?: boolean;
  callbackAction?: () => void;
  step?: () => void;
}

function BackButton({ text, navigatePath, removeArrowIcon = false, callbackAction, step }: BackButtonProps) {
  const navigate = useNavigate();

  const buttonClicked = () => {
    if (callbackAction !== undefined) {
      callbackAction();
    }
    if (step) {
      step();
    } else {
      navigate(`${navigatePath ? navigatePath : '/client-dashboard'}`);
    }
  };

  return (
    <Button
      onClick={buttonClicked}
      className="md:!d-text-btn-md !m-text-btn-md !text-secondary !normal-case !px-[10px] !py-[13px]"
    >
      {!removeArrowIcon && <ArrowBackIos className="sm:!m-text-btn-md !m-text-btn-sm !mr-2 !mb-[2px]" />}
      {text || 'Back'}
    </Button>
  );
}

export default BackButton;
