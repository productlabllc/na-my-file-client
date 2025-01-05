import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Typography } from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import ConfirmDelete from '../ConfirmDelete/ConfirmDelete';
import ConfirmDownload from '../ConfirmDownload/ConfirmDownload';

import { GeneratedUserFile } from '@namyfile/api-client';

import { useApi } from '../../utils/use-api';
import { useTranslation } from 'react-i18next';

interface OptionsDocumentsProps {
  anchorEl: null | HTMLElement;
  userFile: GeneratedUserFile;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  setData: Dispatch<SetStateAction<(GeneratedUserFile | undefined)[]>>;
  data: (GeneratedUserFile | undefined)[];
  editUrl?: string | null;
}

function OptionsDocuments({ anchorEl, userFile, setAnchorEl, setData, editUrl, data }: OptionsDocumentsProps) {
  const api = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation('docs');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  const handleCloseOption = () => {
    setAnchorEl(null);
  };

  const handleEditOption = () => {
    setAnchorEl(null);
    if (editUrl) navigate(`/${editUrl}/document/edit/${userFile?.id}`);
    else navigate(`/document/edit/${userFile?.id}`);
  };

  const handleDeleteOption = async () => {
    await api.deleteGeneratedFileById({ id: userFile.id }).then(() => {
      const newData = data?.filter((element) => element?.id !== userFile.id);
      setData(newData);
      setIsDeleteDialogOpen(!isDeleteDialogOpen);
      setAnchorEl(null);
    });
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
    setAnchorEl(null);
  };

  const downloadFile = async (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadOption = async () => {
    const downloadUrl = await api.getGeneratedFileDownloadUrl({
      // @ts-expect-error UserFile type error
      generatedFileId: userFile.GeneratedFileId!,
      disposition: 'attachment'
    });

    if (isDownloadDialogOpen) {
      // @ts-expect-error download URL
      downloadFile(downloadUrl.downloadUrl, userFile.OriginalFilename)
        .then(() => console.log('File downloaded'))
        .catch((error) => console.error('Error downloading file:', error));
    }

    setIsDownloadDialogOpen(!isDownloadDialogOpen);
    setAnchorEl(null);
  };

  const onClickDownloadOptionClose = () => {
    setIsDownloadDialogOpen(!isDownloadDialogOpen);
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseOption}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{
          '.MuiMenu-paper': {
            boxShadow: '1px',
            width: '170px'
          }
        }}
      >
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={handleEditOption}>
          <EditOutlinedIcon className="pb-[3px] mr-[8px] " />
          <Typography>{t('edit')}</Typography>
        </MenuItem>
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={handleDownloadOption}>
          <FileDownloadOutlinedIcon className="pb-[3px] mr-[8px]" />
          <Typography>{t('download')}</Typography>
        </MenuItem>
        <MenuItem className="!text-secondary !m-text-body-md sm:!d-text-body-md" onClick={onClickDeleteOptionClose}>
          <DeleteOutlineIcon className="pb-[3px] mr-[8px]" />
          <Typography>{t('delete')}</Typography>
        </MenuItem>
      </Menu>

      <ConfirmDelete
        dialogTitle="document"
        text={t('textForConfirmDelete')}
        document={userFile}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onClickDeleteOptionClose={onClickDeleteOptionClose}
        handleDeleteOption={handleDeleteOption}
      />

      <ConfirmDownload
        document={userFile}
        isDownloadDialogOpen={isDownloadDialogOpen}
        onClickDownloadOptionClose={onClickDownloadOptionClose}
        handleDownloadOption={handleDownloadOption}
      />
    </>
  );
}

export default OptionsDocuments;
