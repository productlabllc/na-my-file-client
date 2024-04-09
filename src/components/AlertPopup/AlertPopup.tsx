import {
  Box,
  ClickAwayListener,
  Alert,
  IconButton,
  AlertColor
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';

interface AlertProps {
  setOpenAlert: Dispatch<SetStateAction<boolean>>;
  severity?: AlertColor;
  text: string;
}

function AlertPopup({ setOpenAlert, severity, text }: AlertProps) {
  return (
    <>
      <ClickAwayListener onClickAway={() => setOpenAlert(false)}>
        <Box className="!sticky !top-[110px] z-10 pb-[10px] !w-full">
          <Alert
            variant="filled"
            severity={severity}
            sx={{
              backgroundColor: severity === 'warning' ? '#FFDF8D' : '',
              color: severity === 'warning' ? 'black' : ''
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {text}
          </Alert>
        </Box>
      </ClickAwayListener>
    </>
  );
}

export default AlertPopup;
