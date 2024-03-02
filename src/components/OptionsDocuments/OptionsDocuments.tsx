import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, Typography } from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import ConfirmDelete from '../ConfirmDelete/ConfirmDelete';
import ConfirmDownload from '../ConfirmDownload/ConfirmDownload';

import Document from '../../types/Document';

interface OptionsDocumentsProps {
  anchorEl: null | HTMLElement;
  document: null | Document;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
  setData: Dispatch<SetStateAction<Document[] | null>>;
  data: Document[];
}

function OptionsDocuments({
  anchorEl,
  document,
  setAnchorEl,
  setData,
  data
}: OptionsDocumentsProps) {
  //   console.log(anchorEl);
  //   console.log(document);
  const navigate = useNavigate();
  const textForConfirmDelete =
    'Anyone with shared access will no longer be able to view this document. This cannot be undone.';

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  //   console.log(anchorElement);
  //   console.log(open);

  const handleCloseOption = () => {
    setAnchorEl(null);
  };

  const handleEditOption = () => {
    setAnchorEl(null);
    navigate(`/document/edit/${document?.id}`);
  };

  const handleDeleteOption = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
    setAnchorEl(null);
    const filteredData = data.filter((doc) => doc.id !== document?.id);
    setData(filteredData);
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(!isDeleteDialogOpen);
    setAnchorEl(null);
  };

  const handleDownloadOption = () => {
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
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={handleEditOption}
        >
          <EditOutlinedIcon className="pb-[3px] mr-[8px] " />
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={handleDownloadOption}
        >
          <FileDownloadOutlinedIcon className="pb-[3px] mr-[8px]" />
          <Typography>Download</Typography>
        </MenuItem>
        <MenuItem
          className="!text-secondary !m-text-body-md sm:!d-text-body-md"
          onClick={onClickDeleteOptionClose}
        >
          <DeleteOutlineIcon className="pb-[3px] mr-[8px]" />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>

      <ConfirmDelete
        dialogTitle="document"
        text={textForConfirmDelete}
        document={document}
        isDeleteDialogOpen={isDeleteDialogOpen}
        onClickDeleteOptionClose={onClickDeleteOptionClose}
        handleDeleteOption={handleDeleteOption}
      />

      <ConfirmDownload
        document={document}
        isDownloadDialogOpen={isDownloadDialogOpen}
        onClickDownloadOptionClose={onClickDownloadOptionClose}
        handleDownloadOption={handleDownloadOption}
      />
    </>
  );
}

export default OptionsDocuments;
