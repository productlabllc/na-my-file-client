import {
  Typography,
  Dialog,
  Button,
  Icon,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import { GeneratedUserFile } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';

interface ConfirmDownloadProps {
  document?: GeneratedUserFile | null;
  isDownloadDialogOpen: boolean;
  onClickDownloadOptionClose?: () => void;
  handleDownloadOption?: () => void;
}

function ConfirmDownload({
  document,
  isDownloadDialogOpen,
  onClickDownloadOptionClose,
  handleDownloadOption
}: ConfirmDownloadProps) {
  const { t } = useTranslation('docs');
  return (
    <Dialog
      classes={{ paper: 'w-[343px] sm:w-[434px] relative' }}
      open={isDownloadDialogOpen}
      onClose={onClickDownloadOptionClose}
    >
      <Button onClick={onClickDownloadOptionClose} className="!text-black !absolute !right-1 !top-3">
        <Icon>close</Icon>
      </Button>
      <DialogTitle className="!m-text-body-lg-bold sm:!d-text-body-lg-bold !pb-0 !pl-3">
        {t('downloadWarning')}
      </DialogTitle>

      <DialogContent className="!pl-5 !pb-1">
        <List className="w-full">
          <ListItem key={document?.id} className="!py-[8px] !px-0 border-b-2 flex">
            <ListItemAvatar className="!min-w-10">
              <InsertDriveFileOutlinedIcon />
            </ListItemAvatar>
            <ListItemText className="flex flex-col flex-4 !w-3/4 ">
              <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm !w-full !truncate !...">
                {document?.Title}
              </Typography>
              <Typography className="pb-[4px] sm:!m-text-body-md !m-text-body-sm opacity-60 w-3/4">
                {document?.CreatedAt}
              </Typography>
              <Typography className="sm:!m-text-body-md !m-text-body-sm !w-3/4">
                {document?.FromUserFiles?.[0]?.UserFamilyMember?.FirstName}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
      </DialogContent>

      <DialogActions className="!mr-[16px] !mb-[8px]">
        <Button
          className="!text-secondary !d-text-btn-sm sm:!d-text-btn-md !normal-case"
          onClick={onClickDownloadOptionClose}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          className="!bg-secondary !d-text-btn-sm sm:!d-text-btn-md !normal-case h-12"
          onClick={handleDownloadOption}
          autoFocus
        >
          {t('downloadConfirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDownload;
