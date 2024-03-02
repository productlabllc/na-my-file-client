import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon
} from '@mui/material';

import Document from '../../types/Document';
import FamilyMember from '../../types/FamilyMember';

interface ConfirmDeleteProps {
  document?: Document | null;
  familyMember?: FamilyMember | null;
  isDeleteDialogOpen: boolean;
  onClickDeleteOptionClose?: () => void;
  handleDeleteOption?: () => void;
  text: string;
  dialogTitle: string;
}

function ConfirmDelete({
  text,
  isDeleteDialogOpen,
  onClickDeleteOptionClose,
  handleDeleteOption,
  dialogTitle
}: ConfirmDeleteProps) {
  return (
    <Dialog
      classes={{ paper: 'w-[343px] sm:w-[434px] relative' }}
      open={isDeleteDialogOpen}
      onClose={onClickDeleteOptionClose}
    >
      <Button
        onClick={onClickDeleteOptionClose}
        className="!text-black !absolute !right-1 !top-3"
      >
        <Icon>close</Icon>
      </Button>
      <DialogTitle className="!m-text-body-lg-bold sm:!d-text-body-lg-bold">
        Delete this {dialogTitle}?
      </DialogTitle>

      <DialogContent>
        <DialogContentText className="!m-text-body-md sm:!d-text-body-sm !text-black">
          {text}
        </DialogContentText>
      </DialogContent>

      <DialogActions className="!mr-[16px] !mb-[8px]">
        <Button
          className="!text-secondary !d-text-btn-sm sm:!d-text-btn-md !normal-case"
          onClick={onClickDeleteOptionClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className="!bg-secondary !d-text-btn-sm sm:!d-text-btn-md !normal-case h-12"
          onClick={handleDeleteOption}
          autoFocus
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDelete;
