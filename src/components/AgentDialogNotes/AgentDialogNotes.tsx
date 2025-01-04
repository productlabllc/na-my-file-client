import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface NotesType {
  Id: string;
  Value: string;
  Sender: string;
  Timestamp: string;
}
interface AgentDialogNotesProps {
  loadingSubmittedNote: boolean;
  handleCloseNotesDialog: () => void;
  openNotesDialog: boolean;
  notes?: NotesType;
  handleNoteFieldChange: (updatedNote: string) => void;
}

function AgentDialogNotes({
  handleCloseNotesDialog,
  openNotesDialog,
  handleNoteFieldChange,
  loadingSubmittedNote
}: AgentDialogNotesProps) {
  const [changedNote, setChangedNote] = useState('');
  const { t } = useTranslation('agent');
  const handleChangeNotes = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setChangedNote(e.target.value);
  };
  const submitNote = () => {
    handleNoteFieldChange(changedNote);
    setChangedNote('');
  };

  return (
    <Box>
      {' '}
      <Dialog
        onClose={handleCloseNotesDialog}
        classes={{ paper: 'min-w-[700px] min-h-[280px] px-[24px]', container: 'w-full' }}
        className=""
        open={openNotesDialog}
      >
        <DialogTitle sx={{}} className="!py-[36px] !border-b-[1px] !mb-[16px]" id="customized-dialog-title">
          <Button
            onClick={handleCloseNotesDialog}
            // sx={{
            //   position: 'absolute',
            //   right: 8,
            //   top: 8
            // }}
            className="!absolute !right-[24px] !top-[20px]  !normal-case !text-secondary !d-text-body-sm-bold"
          >
            <CloseIcon className="mr-[4px]" />
            {t('close')}
          </Button>
        </DialogTitle>

        <DialogContent className="!w-full !px-0">
          <Typography className="!d-text-h5 !mb-[16px]">{t('addNotesTitle')}</Typography>
          <Typography className="!d-text-body-sm !mb-[24px]">{t('addNotesHelp')}</Typography>
          <TextField
            placeholder={t('addNotesPlaceholder')}
            className="!w-full"
            helperText={`${changedNote.length}/600`}
            value={changedNote}
            variant="outlined"
            onChange={(e) => handleChangeNotes(e)}
            inputProps={{ maxLength: 600 }}
            multiline
          />
        </DialogContent>
        <DialogActions className="flex flex-row !py-[16px] !px-0">
          <Button
            onClick={handleCloseNotesDialog}
            variant="text"
            className="!text-secondary !d-text-btn-sm !normal-case !min-w-[127px]"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            className={
              changedNote.length !== 0
                ? `!bg-secondary !d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]`
                : '!d-text-btn-sm !normal-case !py-[12px] !min-w-[127px]'
            }
            onClick={submitNote}
            disabled={changedNote.length === 0}
          >
            {loadingSubmittedNote ? <CircularProgress className="!text-white " size="15px" /> : t('saveChanges')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AgentDialogNotes;
