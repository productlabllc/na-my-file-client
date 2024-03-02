import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import PDFReader from '../../components/PDFReader/PDFReader';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import ConfirmDownload from '../../components/ConfirmDownload/ConfirmDownload';
import {
  Box,
  Typography,
  Button,
  Icon,
  Dialog,
  IconButton
} from '@mui/material';
import documentData from '../../assets/mock-data/mock-documents.json';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

function DocumentId() {
  const { id } = useParams();
  //   const foundDocument: Document | undefined = documentData?.find(
  //     (document) => document.id === id
  //   );
  //   useEffect(() => {
  //     //   setDocument();
  //     const data = fetch(
  //       'http://localhost/assets/mock-data/mock-documents.json'
  //     ).then((response) => {
  //       console.log(response);
  //     });
  //   }, [documentData]);

  //   const [document, setDocument] = useState<Document>();
  const textForConfirmDelete =
    'Anyone with shared access will no longer be able to view this document. This cannot be undone.';
  const [openDialog, setOpendDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);

  const navigate = useNavigate();

  //   const pdfViewer = useMemo(
  //     () => (
  //       <>
  //         <PDFReader file={document?.documentUrl} />
  //       </>
  //     ),
  //     [document]
  //   );

  const document = useMemo(
    () => documentData?.find((document) => document.id === id),
    [documentData]
  );

  const pdfViewer = useCallback(
    () => <PDFReader file={document?.documentUrl} />,
    [document]
  );

  const handleEdit = () => {
    navigate(`/document/edit/${document?.id}`);
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteOption = () => {
    console.log('Delete action');
  };

  const onClickDownloadOptionClose = () => {
    setIsDownloadDialogOpen(false);
  };

  const handleDownloadOption = () => {
    console.log('Download action');
  };

  console.log(document);
  return (
    <>
      <Header />
      <Box className="!px-[16px] md:!flex md:!flex-col md:!items-center sm:!px-[42px] pt-[80px]">
        <Box className="md:!w-[700px]">
          <Box className="mb-[16px]">
            <BackButton text="Return to dashboard" />
          </Box>
          <Box className="mb-[8px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">
              Document type
            </Typography>
            <Typography className="!m-text-body-md">
              {document?.title}
            </Typography>
          </Box>
          <Box>
            <img
              className="h-[300px] md:!h-[400px] w-full"
              src={document?.documentUrl}
            ></img>
            <Box className="flex justify-end flex-row border-x-[2px] border-b-[2px] p-2 mb-[16px] ">
              <Icon>open_in_full_icon</Icon>
              <Button
                onClick={() => setOpendDialog(true)}
                className="!m-text-btn-sm sm:!m-text-btn-md !normal-case !text-secondary"
              >
                Full screen
              </Button>
            </Box>
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">
              Family Member
            </Typography>
            <Typography className="!m-text-body-md">
              {document?.familyMemberUser}
            </Typography>
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">
              Date Added
            </Typography>
            <Typography className="!m-text-body-md">
              Document uploaded on {document?.createdAt}
            </Typography>
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">
              Description
            </Typography>
            <Typography className="!m-text-body-md">
              {document?.description
                ? document.description
                : 'There is no description added.'}
            </Typography>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !bg-secondary w-full !normal-case"
              variant="contained"
              onClick={handleEdit}
            >
              <EditOutlinedIcon className="pb-[3px] mr-[8px] " />
              Edit
            </Button>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !border-secondary !text-secondary w-full !normal-case"
              variant="outlined"
              onClick={() => setIsDownloadDialogOpen(true)}
            >
              <FileDownloadOutlinedIcon className="pb-[3px] mr-[8px]" />
              Download
            </Button>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !text-secondary w-full !normal-case"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteOutlineIcon className="pb-[3px] mr-[8px]" />
              Delete
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        className="w-full"
        open={openDialog}
        onClose={() => setOpendDialog(false)}
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82vh]' }}
      >
        <Box>
          <Box className="!sticky bg-white !top-0 !z-20 flex justify-end pr-2 py-1">
            <IconButton
              className="!text-secondary !d-text-btn-md "
              onClick={() => setOpendDialog(false)}
            >
              <CloseIcon className="mr-[8px]" fontSize="medium" />
              <Typography className="!d-text-btn-md lg:!d-text-btn-sm pt-[2px]">
                Close
              </Typography>
            </IconButton>
          </Box>

          {pdfViewer()}
        </Box>
      </Dialog>

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

export default DocumentId;
