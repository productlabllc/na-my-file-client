import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import PDFReader from '../../components/PDFReader/PDFReader';
import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import ConfirmDownload from '../../components/ConfirmDownload/ConfirmDownload';
import { Box, Typography, Button, Icon, Dialog, IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';
// import * as pdfjsLib from 'pdfjs-dist';
// import AsyncImage from '../../components/AsyncImage/AsyncImage';
import AsyncPreviewImage from '../../components/AsyncPreviewImage/AsyncPreviewImage';

function DocumentId() {
  const { id } = useParams();
  const { isAsyncImageLoaded, isAsyncImageFinishedRefetching, isAsyncImageApiCaughtError } = useBoundStore();

  const [openDialog, setOpendDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  // const [isPDFDocumentIsReady, setPDFDocumentIsReady] = useState(false);

  // const [fileExists, setFileExists] = useState<boolean | null>(false);

  const navigate = useNavigate();

  const { t } = useTranslation('docs');

  const api = useApi();

  const { value: userFile } = useAsync(() => api.getGenerateFileById({ id: id! }), [id]);

  const pdfViewer = useCallback(() => <PDFReader id={id} />, [id]);

  const handleEdit = () => {
    // Should edit generated file.
    navigate(`/document/edit/${userFile?.id}`);
  };

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteOption = async () => {
    /// Delete Generated file and corresponding user files.
    await api.deleteGeneratedFileById({ id: id! });
    navigate(-1);
  };

  const onClickDownloadOptionClose = async () => {
    setIsDownloadDialogOpen(false);
  };

  const downloadFile = async (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadOption = async () => {
    const downloadUrl = await api.getGeneratedFileDownloadUrl({
      generatedFileId: id!,
      disposition: 'attachment'
    });

    if (isDownloadDialogOpen) {
      downloadFile(downloadUrl.downloadUrl!);
    }

    setIsDownloadDialogOpen(!isDownloadDialogOpen);
  };
  const checkIfAnyErrorAppearsOnImg =
    !isAsyncImageLoaded && !isAsyncImageFinishedRefetching && !isAsyncImageApiCaughtError;

  return (
    <>
      <Header />
      <Box className="!px-[16px] md:!flex md:!flex-col md:!items-center sm:!px-[42px] pt-[80px]">
        <Box className="md:!w-[700px]">
          <Box className="mb-[16px]">
            <BackButton text={t('returnButton')} />
          </Box>
          <Box className="mb-[8px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">{t('docType')}</Typography>
            <Typography className="!m-text-body-md">{userFile?.FileType}</Typography>
          </Box>
          <Box
            className={`border-[2px] ${!checkIfAnyErrorAppearsOnImg ? 'mb-[24px]' : ''}  !h-[300px] md:!h-[400px] w-full pt-[4px] sm:pt-[16px] py-[4px] px-[4px] sm:px-[16px] sm:py-[16px]`}
          >
            {id && <AsyncPreviewImage generatedFileId={id}></AsyncPreviewImage>}
          </Box>
          {!isAsyncImageLoaded && !isAsyncImageFinishedRefetching && !isAsyncImageApiCaughtError && (
            <Box className="!w-full !bg-black p-2 flex justify-end mb-[16px]">
              <Icon className="!text-white">open_in_full_icon</Icon>
              <Button
                onClick={() => setOpendDialog(true)}
                className="!m-text-btn-sm md:!m-text-btn-md !normal-case !text-white"
              >
                {t('fullScreen')}
              </Button>
            </Box>
          )}
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">{t('familyMember')}</Typography>
            <Typography className="!m-text-body-md">
              {!userFile?.FromUserFiles?.[0]?.UserFamilyMember
                ? 'Self'
                : userFile?.FromUserFiles?.[0]?.UserFamilyMember?.FirstName +
                  ' ' +
                  userFile?.FromUserFiles?.[0]?.UserFamilyMember?.LastName}{' '}
            </Typography>
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">{t('dateAdded')}</Typography>
            <Typography className="!m-text-body-md">
              {t('uploadedAt')} {dayjs(userFile?.CreatedAt).format('MM/DD/YYYY')}
            </Typography>
          </Box>
          <Box className="mb-[16px]">
            <Typography className="!m-text-body-md-bold !mb-[8px]">{t('description')}</Typography>
            <Typography className="!m-text-body-md">
              {userFile?.Description ? userFile.Description : t('noDescriptionadded')}
            </Typography>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !bg-secondary w-full !normal-case"
              variant="contained"
              onClick={handleEdit}
            >
              <EditOutlinedIcon className="pb-[3px] mr-[8px] " />
              {t('edit')}
            </Button>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !border-secondary !text-secondary w-full !normal-case"
              variant="outlined"
              onClick={() => setIsDownloadDialogOpen(true)}
            >
              <FileDownloadOutlinedIcon className="pb-[3px] mr-[8px]" />
              {t('download')}
            </Button>
          </Box>
          <Box className="!mb-[16px]">
            <Button
              className="!m-text-btn-md !h-[40px] !text-secondary w-full !normal-case"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <DeleteOutlineIcon className="pb-[3px] mr-[8px]" />
              {t('delete')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        className="w-full"
        open={openDialog}
        onClose={() => setOpendDialog(false)}
        classes={{ paper: '!min-w-[90%] lg:!min-w-[50%] h-[82vh] !bg-[#EEEEEE]' }}
      >
        <Box>
          <Box className="!sticky bg-white !top-0 !z-20 flex justify-end pr-2 py-1">
            <IconButton className="!text-secondary !d-text-btn-md " onClick={() => setOpendDialog(false)}>
              <CloseIcon className="mr-[8px]" fontSize="medium" />
              <Typography className="!d-text-btn-md lg:!d-text-btn-sm pt-[2px]">{t('close')}</Typography>
            </IconButton>
          </Box>

          {pdfViewer()}
        </Box>
      </Dialog>

      <ConfirmDelete
        dialogTitle={t('detelteDocument')}
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

export default DocumentId;
