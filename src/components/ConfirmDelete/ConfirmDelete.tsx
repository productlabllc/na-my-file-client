import {
  Button,
  Dialog,
  // DialogActions,
  DialogContent,
  DialogContentText,
  Icon,
  CircularProgress,
  Divider,
  Box,
  Typography
} from '@mui/material';

import { FamilyMember, GeneratedUserFile } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';

interface ConfirmDeleteProps {
  document?: GeneratedUserFile | null;
  familyMember?: FamilyMember | null;
  isDeleteDialogOpen: boolean;
  onClickDeleteOptionClose?: () => void;
  handleDeleteOption?: () => void;
  isDeleteSpinner?: boolean;
  text: string;
  dialogTitle: string;
  isProfilePage?: boolean;
}

function ConfirmDelete({
  text,
  isDeleteDialogOpen,
  onClickDeleteOptionClose,
  handleDeleteOption,
  isDeleteSpinner,
  dialogTitle,
  isProfilePage
}: ConfirmDeleteProps) {
  const { t } = useTranslation('docs');
  return (
    <Dialog
      classes={{ paper: 'w-[90%] md:w-fit relative p-[16px] md:p-[24px]' }}
      open={isDeleteDialogOpen}
      onClose={onClickDeleteOptionClose}
    >
      <Box className="!m-text-body-lg-bold sm:!d-text-body-lg-bold !p-0 !mb-[8px]">
        {/* {t('deleteThis')} {dialogTitle} */}
        <Box className="flex justify-end">
          <Button
            onClick={onClickDeleteOptionClose}
            className="!text-secondary !flex !items-center !normal-case !mb-[8px] !m-text-btn-md sm:!d-text-btn-md"
          >
            <Icon className="mr-1">close</Icon>
            {t('close')}
          </Button>
        </Box>

        <Divider className="!mb-[16px]"></Divider>
        <Box className="flex items-start flex-row">
          <Box className="!bg-importantBackground w-[40px] h-[40px] flex justify-center items-center rounded-full mr-[16px] !mb-[16px]">
            <Icon className="!text-importantText">warning_amber_outlined_icon</Icon>
          </Box>
          <Typography className="!m-text-body-lg-bold md:!d-text-body-lg-bold">{dialogTitle}</Typography>
        </Box>
      </Box>

      <DialogContent className="!p-0 mb-[24px]">
        <DialogContentText className="!m-text-body-lg md:!d-text-body-lg !text-black">{text}</DialogContentText>
      </DialogContent>

      <Box className="!p-0 w-full flex flex-row justify-around md:justify-end">
        <Button
          className="!text-secondary !d-text-btn-sm sm:!d-text-btn-md !normal-case !px-[32px] !py-[13px]"
          onClick={onClickDeleteOptionClose}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          className="!bg-secondary !d-text-btn-sm sm:!d-text-btn-sm !normal-case !py-[13px] !px-[32px]"
          onClick={handleDeleteOption}
          autoFocus
        >
          {isDeleteSpinner ? (
            <CircularProgress className="!text-white text-[20px]" />
          ) : isProfilePage ? (
            'Continue'
          ) : (
            t('deleteConfirm')
          )}
        </Button>
      </Box>
    </Dialog>
  );
}

export default ConfirmDelete;
