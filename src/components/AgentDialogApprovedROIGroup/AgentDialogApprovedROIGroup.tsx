import { Box, Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { GetUser } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';

interface AgentDialogApprovedROIGroupProps {
  handleCloseROIApprovedDialog: () => void;
  openROIApprovedDialog: boolean;
  handleApprovedChecklist: () => void;
  user: GetUser;
}
function AgentDialogApprovedROIGroup({
  handleCloseROIApprovedDialog,
  openROIApprovedDialog,
  handleApprovedChecklist,
  user
}: AgentDialogApprovedROIGroupProps) {
  const { t } = useTranslation('agent');
  return (
    <Box>
      {' '}
      <Dialog
        onClose={handleCloseROIApprovedDialog}
        classes={{ paper: 'min-w-[606px] !px-[24px]', container: 'w-full' }}
        className=""
        open={openROIApprovedDialog}
      >
        <DialogTitle sx={{}} className="!py-[36px] !border-b-[1px]" id="customized-dialog-title">
          <Button
            onClick={handleCloseROIApprovedDialog}
            // sx={{
            //   position: 'absolute',
            //   right: 8,
            //   top: 8
            // }}
            className="!absolute !right-[24px] !top-[20px] !normal-case !text-secondary !d-text-body-sm-bold"
          >
            <CloseIcon className="mr-[4px]" />
            {t('close')}
          </Button>
        </DialogTitle>

        <DialogContent className="!w-full !px-0 !py-[16px]">
          <Box>
            <Box>
              <Box className="!w-[40px] !h-[40px] !rounded-full flex justify-center items-center bg-importantBackground mb-[16px]">
                <WarningAmberIcon className="!text-importantText" />
              </Box>
            </Box>
            <Typography className="!d-text-body-lg-bold !mb-[16px]">
              {t('approveChecklistText', { firstName: user?.FirstName, lastName: user?.LastName })}
            </Typography>
            <Typography className="!d-text-body-sm !mb-[16px]">
              {`${user?.FirstName} ${t('approveChecklistDescription')}`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="flex flex-row !py-[16px] !px-0">
          <Button
            onClick={handleCloseROIApprovedDialog}
            variant="text"
            className="!text-secondary !py-[12px] !d-text-btn-sm !normal-case !min-w-[127px]"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            className={`!bg-secondary !d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]`}
            onClick={handleApprovedChecklist}
          >
            {/* {loadingSubmittedNote ? <CircularProgress className="!text-white " size="15px" /> : 'Save changes'} */}
            {t('sendToClient')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AgentDialogApprovedROIGroup;
