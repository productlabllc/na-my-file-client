import { useState, useMemo, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { useApi } from '../../utils/use-api';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// import { PENDING, UNDER_REVIEW, RE_UPLOAD, ACCEPTED } from '../../types/AcitivityStatuses';
import { Constants } from '@myfile/api-client';
const CaseFileTypes: Constants['CaseFileStatus'] = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECT: 'REJECT',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

import { Box, Typography, Button, Icon, Dialog, IconButton } from '@mui/material';
import TooltipUI from '../../components/TooltipUI/TooltipUI';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AsyncPreviewImage from '../../components/AsyncPreviewImage/AsyncPreviewImage';

import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import PDFReader from '../../components/PDFReader/PDFReader';

import ConfirmDelete from '../../components/ConfirmDelete/ConfirmDelete';
import { useBoundStore } from '../../store/store';

function DocumentId() {
  const api = useApi();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('docs');
  const { isAsyncImageLoaded, isAsyncImageFinishedRefetching, isAsyncImageApiCaughtError } = useBoundStore();

  const documentId = params.id;
  const applicationId = params.applicationId;
  const applicationTitle = params.applicationTitle;
  const checklistId = params.checklistId;
  const checklistTitle = params.checklistTitle;
  const applicationUrlPath = location.pathname.split('/');
  const backNavigation = applicationUrlPath.slice(1, 6).join('/');

  const [openDialog, setOpendDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteSpinner, setIsDeleteSpinner] = useState(false);

  const { value: application } = useAsync(() => {
    if (applicationId && applicationTitle) {
      return api.getCase({ caseId: applicationId, workflowType: applicationTitle });
    } else {
      return Promise as never;
    }
  }, []);

  const document = useMemo(() => {
    const foundChecklistItem = application?.CaseCriteria?.find((cc) => cc.id === checklistId);
    return foundChecklistItem?.CaseFiles?.find((doc) => doc.GeneratedFileId === documentId);
  }, [application?.CaseCriteria, checklistId, documentId]);

  const { value } = useAsync(async () => {
    if (document?.GeneratedFileId) {
      return api.getGeneratedFileDownloadUrl({
        generatedFileId: document?.GeneratedFileId,
        caseFileId: document.id
      });
    }
  }, [document?.GeneratedFileId]);

  const { downloadUrl } = value ?? {};

  const pdfViewer = useCallback(() => <PDFReader id={document?.GeneratedFileId} />, [document?.GeneratedFileId]);

  const onClickDeleteOptionClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteOption = async () => {
    setIsDeleteSpinner(true);
    if (document?.id && applicationId && checklistId) {
      await api.deleteCaseFiles({
        caseId: applicationId ?? '',
        requestBody: { CaseCriterionId: checklistId, GeneratedFileIds: [document?.GeneratedFileId ?? ''] }
      });
      setIsDeleteDialogOpen(false);
    }
    setIsDeleteSpinner(false);
    navigate('/' + backNavigation);
  };

  const downloadFile = async (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownloadOption = async () => {
    if (document?.id && document?.GeneratedFile) {
      const downloadUrl = await api.getGeneratedFileDownloadUrl({
        generatedFileId: document?.GeneratedFileId ?? '',
        caseFileId: document?.id,
        disposition: 'attachment'
      });
      if (downloadUrl) {
        downloadFile(downloadUrl.downloadUrl!);
      }
    }
  };

  const checkIfAnyErrorAppearsOnImg =
    !isAsyncImageLoaded && !isAsyncImageFinishedRefetching && !isAsyncImageApiCaughtError;

  return (
    <Box>
      <Header />
      <Box className="!px-[16px] md:!flex md:!flex-col md:!items-center sm:!px-[42px] pt-[80px]">
        <Box className="md:!w-[700px]">
          <Box className="mb-[16px]">
            <BackButton text={t('return')} navigatePath={'/' + backNavigation} />
          </Box>
          <Box className="mb-[8px]">
            <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
              {t('documentType')}
            </Typography>
            <Typography className="!m-text-body-md md:!d-text-body-md">{document?.GeneratedFile?.FileType}</Typography>
          </Box>
          <Box className="mb-[16px]">
            <Box
              className={`border-x-[1px] ${!checkIfAnyErrorAppearsOnImg ? 'mb-[24px]' : ''}  !h-[300px] md:!h-[400px] border-t-[1px] pt-[4px] sm:pt-[16px] px-[4px] sm:px-[16px] !relative`}
            >
              {document && document?.GeneratedFileId && (
                <AsyncPreviewImage generatedFileId={document?.GeneratedFileId}></AsyncPreviewImage>
              )}
            </Box>
            {!isAsyncImageLoaded && !isAsyncImageFinishedRefetching && !isAsyncImageApiCaughtError && (
              <Box onClick={() => setOpendDialog(true)} className="!w-full !bg-black p-2 flex justify-end mb-[16px]">
                <Icon className="!text-white">open_in_full_icon</Icon>
                <Button className="!m-text-btn-sm md:!m-text-btn-md !normal-case !text-white">{t('fullScreen')}</Button>
              </Box>
            )}

            <Box className="mb-[16px]">
              <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
                {t('documentStatus')}
              </Typography>
              {document?.Status === CaseFileTypes.UNDER_REVIEW.toString() && (
                <Box className="flex !flex-row !items-center">
                  <Icon className="!mr-1 !px-0  !text-[#a99201] !scale-[70%]">circle_icon</Icon>
                  <Typography className=" !text-[#a99201] !m-text-body-md-bold md:!d-text-body-md-bold !w-3/4">
                    {t('underReview')}
                  </Typography>
                </Box>
              )}
              {document?.Status === CaseFileTypes.PENDING.toString() && (
                <Box className="flex !flex-row !items-center">
                  <Icon className="!mr-1 !px-0  !text-disabledBackground !scale-[70%]">circle_icon</Icon>
                  <Typography className=" !text-disabledBackground !m-text-body-md-bold md:!d-text-body-md-bold !w-full">
                    {t('pending')}
                  </Typography>
                </Box>
              )}
              {document?.Status === CaseFileTypes.ACCEPTED.toString() && (
                <Box className="flex !flex-row !items-center">
                  <Icon className="!mr-1 !px-0  !text-[#1f6803] !scale-[70%]">circle_icon</Icon>
                  <Typography className=" !text-[#1f6803] !m-text-body-md-bold md:!d-text-body-md-bold !w-3/4">
                    {t('accepted')}
                  </Typography>
                </Box>
              )}
              {document?.Status === CaseFileTypes.REJECT.toString() && (
                <Box>
                  <Box className="flex !flex-row !items-center mb-[8px]">
                    <Icon className="!mr-1 !px-0  !text-[#ad2108] !scale-[70%]">circle_icon</Icon>
                    <Typography className=" !text-[#ad2108] !m-text-body-md-bold md:!d-text-body-md-bold !w-3/4">
                      {t('reUpload')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className="!text-[#ad2108] md:!d-text-body-md !m-text-body-md !mb-[8px]">
                      {document && document.ReasonForResubmit ? document.ReasonForResubmit : ''}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            <Box className="mb-[16px]">
              <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
                {t('familyMember')}
              </Typography>
              <Typography className="!m-text-body-md md:!d-text-body-md">
                {document?.GeneratedFile?.UserFamilyMember
                  ? document?.GeneratedFile?.UserFamilyMember?.FirstName +
                    ' ' +
                    document?.GeneratedFile?.UserFamilyMember?.LastName
                  : 'Self'}
              </Typography>
            </Box>
            <Box className="mb-[16px]">
              <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
                {t('dateAdded')}
              </Typography>
              <Typography className="!m-text-body-md md:!d-text-body-md">{`Document was added to the application on ${dayjs(
                document?.CreatedAt
              ).format('MM/DD/YYYY')} at ${dayjs(document?.CreatedAt).format('hh:mm A')}`}</Typography>
            </Box>

            <Box className="mb-[16px]">
              <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold !mb-[8px]">
                {t('description')}
              </Typography>
              <Typography className="!m-text-body-md md:!d-text-body-md">
                {document?.GeneratedFile?.Description ? document.GeneratedFile?.Description : t('noDescriptionadded')}
              </Typography>
            </Box>

            {document?.Status === CaseFileTypes.UNDER_REVIEW.toString() && (
              <Box className="flex flex-row items-center !mb-[36px]">
                <Typography className="!text-primary !m-text-body-md-bold md:!d-text-body-md-bold !mr-[4px]">
                  {t('underReviewText')}
                </Typography>
                <Icon id="client-checklist-document-status" className="!text-primary">
                  info_outlined_icon
                </Icon>
                <TooltipUI
                  anchorSelect="#client-checklist-document-status"
                  place="right"
                  content={t('underReviewTextTooltip')}
                />
              </Box>
            )}
            <Box className="!mb-[48px]">
              {document?.Status !== CaseFileTypes.REJECT.toString() && (
                <Button
                  className="!m-text-body-md-bold md:!d-text-body-md-bold  !px-[16px] !py-[12px] !bg-secondary !text-white w-full !normal-case !mb-[16px]"
                  variant="contained"
                  onClick={handleDownloadOption}
                >
                  <FileDownloadOutlinedIcon className="pb-[3px] mr-[8px]" />
                  {t('download')}
                </Button>
              )}
              {document?.Status !== CaseFileTypes.ACCEPTED.toString() &&
                document?.Status !== CaseFileTypes.UNDER_REVIEW.toString() && (
                  <Box>
                    {document?.Status === CaseFileTypes.PENDING.toString() && (
                      <Button
                        variant="outlined"
                        className={`!m-text-body-md-bold md:!d-text-body-md-bold  !px-[16px] !py-[12px] !border-secondary !text-secondary w-full !normal-case`}
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <DeleteOutlineIcon className="pb-[3px] mr-[8px]" />
                        {t('delete')}
                      </Button>
                    )}

                    {document?.Status === CaseFileTypes.REJECT.toString() && (
                      <Button
                        variant="contained"
                        className="!m-text-body-md-bold md:!d-text-body-md-bold  !px-[16px] !py-[12px] !bg-secondary !text-white w-full !normal-case"
                        onClick={() => {
                          navigate(
                            `/application/${applicationTitle}/${applicationId}/${checklistTitle}/${checklistId}/${documentId}/re-upload-generator`
                          );
                        }}
                        // application/HPD/dc7ba48a-fc51-4983-9918-18915e9724ed/identity/6fe7847a-f124-44ac-94f5-eb7e60945812/upload-generator
                        // onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        {/* <DeleteOutlineIcon className="pb-[3px] mr-[8px]" /> */}
                        <FileUploadOutlinedIcon className="pb-[1px] mr-[8px]" />
                        {t('resubmitFromYourDevice')}
                      </Button>
                    )}
                  </Box>
                )}
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

            {downloadUrl ? pdfViewer() : t('documentLoading')}
          </Box>
        </Dialog>

        <ConfirmDelete
          // dialogTitle={t('textForConfirmDeleteFromApplication')}
          // text={t('textForConfirmDeleteWarning')}
          dialogTitle={t('deleteDialogTitle')}
          text={t('deleteDialogTexs', { fileType: document?.GeneratedFile?.FileType })}
          // document={document}
          isDeleteDialogOpen={isDeleteDialogOpen}
          onClickDeleteOptionClose={onClickDeleteOptionClose}
          handleDeleteOption={handleDeleteOption}
          isDeleteSpinner={isDeleteSpinner}
        />
      </Box>
    </Box>
  );
}

export default DocumentId;
