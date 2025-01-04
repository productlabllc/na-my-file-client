import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface AgentDialogResubmitDocumentProps {
  handleCloseResubmitDocumentDialog: () => void;
  openResubmitDocumentDialog: boolean;
  updateIssueDescription: (issue: string) => void;
  handleSubmitCloseDialog: () => void;
}
function AgentDialogResubmitDocument({
  handleCloseResubmitDocumentDialog,
  openResubmitDocumentDialog,
  updateIssueDescription,
  handleSubmitCloseDialog
}: AgentDialogResubmitDocumentProps) {
  const [otherOption, setOtherOption] = useState('');
  const [issue, setIssue] = useState('');
  const { t } = useTranslation('agent');

  const handleChangeNotes = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOtherOption(e.target.value);
  };

  const handleIssue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIssue(e.target.value);
  };

  const onSend = () => {
    if (issue === 'Other') updateIssueDescription(otherOption);
    else updateIssueDescription(issue);
    setOtherOption('');
    setIssue('');
    handleSubmitCloseDialog();
  };

  const closeAndRemoveIssueText = () => {
    handleCloseResubmitDocumentDialog();
    setOtherOption('');
    setIssue('');
  };
  return (
    <div>
      <Box>
        {' '}
        <Dialog
          onClose={closeAndRemoveIssueText}
          classes={{ paper: 'w-[450px] min-h-[280px] !px-[24px]', container: 'w-full' }}
          className=""
          open={openResubmitDocumentDialog}
        >
          <DialogTitle sx={{}} className="!py-[28px] !border-b-[1px] !mb-[24px]" id="customized-dialog-title">
            <Button
              onClick={closeAndRemoveIssueText}
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
              <Typography className="!d-text-body-md-bold !mb-[16px]">{t('resubmitModalTitle')}</Typography>
              <Typography className="!d-text-body-sm !mb-[8px]">{t('selectOption')}</Typography>
              <Box className="mb-[16px]">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => handleIssue(e)}
                  >
                    <FormControlLabel
                      value={t('blurryDocument')}
                      control={<Radio />}
                      label={t('blurryDocument')}
                      className="!d-text-body-xsm"
                    />
                    <FormControlLabel
                      value={t('moreThenOneDocument')}
                      control={<Radio />}
                      label={t('moreThenOneDocument')}
                      className="!d-text-body-sm"
                    />
                    <FormControlLabel
                      value={t('wrongDocument')}
                      control={<Radio />}
                      label={t('wrongDocument')}
                      className="!d-text-body-sm"
                    />
                    <FormControlLabel
                      value={t('incorrectInformation')}
                      control={<Radio />}
                      label={t('incorrectInformation')}
                      className="!d-text-body-sm"
                    />
                    <FormControlLabel
                      value={t('outdatedDocument')}
                      control={<Radio />}
                      label={t('outdatedDocument')}
                      className="!d-text-body-sm"
                    />
                    <FormControlLabel value={t('otherReason')} control={<Radio />} label={t('otherReason')} />
                  </RadioGroup>
                </FormControl>
              </Box>
              {issue === 'Other' && (
                <Box>
                  <TextField
                    placeholder={t('provideIssueOtherPlaceholder')}
                    className="!w-full"
                    helperText={`${otherOption.length}/100`}
                    value={otherOption}
                    variant="outlined"
                    onChange={(e) => handleChangeNotes(e)}
                    inputProps={{ maxLength: 100 }}
                    multiline
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions className="flex flex-row !py-[16px] !px-0">
            <Button
              onClick={closeAndRemoveIssueText}
              variant="text"
              className="!text-secondary !d-text-btn-sm !normal-case !min-w-[127px] !py-[12px]"
            >
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              className={
                (issue === 'Other' && otherOption.length === 0) || issue.length === 0
                  ? '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]'
                  : `!bg-secondary !text-white !d-text-btn-sm !normal-case !min-w-[127px] !py-[12px]`
              }
              onClick={onSend}
              disabled={(issue === 'Other' && otherOption.length === 0) || issue.length === 0}
            >
              {/* {loadingSubmittedNote ? <CircularProgress className="!text-white " size="15px" /> : 'Save changes'} */}
              {t('send')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default AgentDialogResubmitDocument;
