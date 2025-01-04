import { Alert, Slide, Snackbar, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useBoundStore } from '../../store/store';

interface AlertSuccessProps {
  text: string;
  handleCloseToastMessage: () => void;
  showToast?: boolean;
}

function AlertSuccessToastMessage({ text, handleCloseToastMessage, showToast }: AlertSuccessProps) {
  // Must redo showToastMessageForAction, it takes boolean value for agent
  const { showToastMessageForAction } = useBoundStore();
  return (
    // <ClickAwayListener onClickAway={() => false}>
    <Snackbar
      open={showToast ? showToast : showToastMessageForAction}
      onClose={(_, r) => {
        if (r === 'clickaway') {
          return;
        }
        return handleCloseToastMessage();
      }}
      TransitionComponent={Slide}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={4000} // Adjust duration as needed
      className="mt-[60px]"
      disableWindowBlurListener={true}
    >
      <Alert
        sx={{
          '.MuiAlert-icon': {
            marginRight: '4px'
          }
        }}
        action={<CloseIcon onClick={() => handleCloseToastMessage()} className="!text-[20px] !cursor-pointer" />}
        icon={<CheckIcon className="!text-[24px] !text-successText !mr-[12px]" />}
        className="!bg-successBackground !px-[16px] !py-[8px] flex items-center !max-w-[320px]"
      >
        <Typography className="!m-text-body-xsm md:!d-text-body-xsm !text-black">{text}</Typography>
      </Alert>
    </Snackbar>
    // </ClickAwayListener>
  );
}

export default AlertSuccessToastMessage;
