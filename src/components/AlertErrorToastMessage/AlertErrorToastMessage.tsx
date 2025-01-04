import { Alert, Slide, Snackbar, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useBoundStore } from '../../store/store';

interface AlertSuccessProps {
  text: string;
  handleCloseToastMessage: () => void;
}

function AlertErrorToastMessage({ text, handleCloseToastMessage }: AlertSuccessProps) {
  const { showToastMessageForAction } = useBoundStore();
  const splitText = text.split('.');

  return (
    <Snackbar
      open={showToastMessageForAction}
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
    >
      <Alert
        sx={{
          '.MuiAlert-icon': {
            marginRight: '4px'
          }
        }}
        action={
          <CloseIcon onClick={() => handleCloseToastMessage()} className="!text-[20px] !cursor-pointer mt-[4px]" />
        }
        icon={<InfoIcon className="!text-[24px] !text-errorText !mr-[12px]" />}
        className=" !bg-errorBackground !px-[16px] !py-[8px] !flex !items-start max-w-[320px] "
      >
        {splitText.map((splittedText) => (
          <Typography className="!d-text-body-xsm !text-black ">{`${splittedText}!`}</Typography>
        ))}
      </Alert>
    </Snackbar>
  );
}

export default AlertErrorToastMessage;
