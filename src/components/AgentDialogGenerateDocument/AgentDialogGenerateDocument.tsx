import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { GetUser } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';

interface AgentDialogApprovedROIGroupProps {
  handleCloseConfirmDialog: () => void;
  documentType: string;
  client?: GetUser;
  openConfirmDialog: boolean;
  submitDocumentSpinner: boolean;
}

function AgentDialogGenerateDocument({
  handleCloseConfirmDialog,
  documentType,
  client,
  openConfirmDialog,
  submitDocumentSpinner
}: AgentDialogApprovedROIGroupProps) {
  const { t } = useTranslation('agent');

  console.log('Client: ', client?.FirstName);
  console.log('Document type: ', documentType);

  const { setNavigateAfterGeneratedDocument, navigateAfterGeneratedDocument } = useBoundStore();
  return (
    <div>
      <Dialog
        onClose={handleCloseConfirmDialog}
        classes={{ paper: 'min-w-[550px] min-h-[280px] !px-[24px]', container: 'w-full' }}
        className=""
        open={openConfirmDialog}
      >
        <DialogTitle sx={{}} className="!py-[28px] !border-b-[1px] !mb-[16px]" id="customized-dialog-title">
          <Button
            onClick={handleCloseConfirmDialog}
            // sx={{
            //   position: 'absolute',
            //   right: 8,
            //   top: 8
            // }}
            className="!absolute !right-[24px] !top-[12px] !normal-case !text-secondary !d-text-body-sm-bold"
          >
            <CloseIcon className="mr-[4px]" />
            {t('close')}
          </Button>
        </DialogTitle>

        <DialogContent className="!w-full !px-0">
          <Box>
            <Box>
              <Box className="!w-[40px] !h-[40px] !rounded-full flex justify-center items-center bg-successText mb-[16px]">
                <CheckIcon className="!text-white" />
              </Box>
            </Box>
            <Typography className="!d-text-body-lg-bold !mb-[16px]">
              {t('youUploaded', { documentType: documentType })}
            </Typography>
            <Typography className="!d-text-body-sm">
              {t('beAbletoSeeUploadedDocs', {
                lastName: client?.LastName,
                firstName: client?.FirstName,
                documentType: documentType
              })}
            </Typography>
            {/* <Typography className="!d-text-body-sm !mb-[8px]">
              {t('continueUplaod', { documentType: documentType })}
            </Typography> */}
          </Box>
        </DialogContent>
        <DialogActions className="flex flex-row !py-[16px] !px-0">
          <Button
            onClick={() => setNavigateAfterGeneratedDocument(false)}
            variant="text"
            className="!text-secondary !d-text-btn-sm !normal-case !min-w-[127px]"
            type="submit"
            form="hook-form"
            disabled={submitDocumentSpinner && !navigateAfterGeneratedDocument}
          >
            {submitDocumentSpinner && !navigateAfterGeneratedDocument ? (
              <CircularProgress className="!text-secondary" size={18} />
            ) : (
              t('yesDone')
            )}
          </Button>
          <Button
            variant="contained"
            className={`!bg-secondary !text-white !d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]`}
            // onClick={handleGenerateDocument}
            onClick={() => setNavigateAfterGeneratedDocument(true)}
            type="submit"
            form="hook-form"
            disabled={submitDocumentSpinner && navigateAfterGeneratedDocument}
          >
            {/* {loadingSubmittedNote ? <CircularProgress className="!text-white " size="15px" /> : 'Save changes'} */}
            {submitDocumentSpinner && navigateAfterGeneratedDocument ? (
              <CircularProgress className="!text-white" size={18} />
            ) : (
              t('noDone')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AgentDialogGenerateDocument;
