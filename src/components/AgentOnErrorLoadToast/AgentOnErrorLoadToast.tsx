import { Alert, CircularProgress, ClickAwayListener, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useBoundStore } from '../../store/store';

function AgentOnErrorLoadToast() {
  const { showToastMessageForAction } = useBoundStore();
  const { t } = useTranslation('agent');

  return (
    <Modal
      open={showToastMessageForAction}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.5)' // Darkened backdrop
      }}
    >
      <ClickAwayListener onClickAway={() => false}>
        {/* <Snackbar
          open={showToastMessageForAction}
          //   onClose={handleCloseToastMessage}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          //   autoHideDuration={3000} // Adjust duration as needed
          className="mt-[60px]"
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'fit-content'
          }} 
        >*/}
        <Alert
          sx={{
            '.MuiAlert-icon': {
              marginRight: '4px'
            }
          }}
          icon={<CircularProgress className="!w-[40px] !text-secondary !mr-[12px]" />}
          className="!d-text-body-xsm !bg-white !text-secondary !p-[24px] !flex !items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {t('loading')}
          {/* <CloseIcon onClick={() => handleCloseToastMessage()} className="!text-[20px] ml-[18px] !cursor-pointer" /> */}
        </Alert>
        {/* </Snackbar> */}
      </ClickAwayListener>
    </Modal>
  );
}

export default AgentOnErrorLoadToast;
