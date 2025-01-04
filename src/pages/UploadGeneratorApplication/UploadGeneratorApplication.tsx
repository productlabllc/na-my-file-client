import { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Icon, Typography, CircularProgress } from '@mui/material';
import queryString from 'query-string';

import Header from '../../layouts/Header/Header';
// import PDFUploaderApplication from '../../components/PDFUploaderApplication/PDFUploaderApplication';
import AlertPopup from '../../components/AlertPopup/AlertPopup';
import PDFUploader from '../../components/PDFUploader/PDFUploader';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';
import { Constants } from '@myfile/api-client';
import { FILE_REACHED_MORE_THAN_10_MB, FILE_FAILED_DIMENSIONS } from '../../utils/client-toast-messages';
const CaseFileTypes: Constants['CaseFileStatus'] = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECT: 'REJECT',
  UNDER_REVIEW: 'UNDER_REVIEW'
};

function UploadGenerator() {
  const location = useLocation();
  const params = useParams();
  const api = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation('docs');
  const { uploadSpinner, toastMessageActionTypeClient } = useBoundStore();

  const { fileTypes: allowedFileTypes = [] } = (queryString.parse(location.search) ?? {}) as { fileTypes?: string[] };

  const applicationUrlPath = location.pathname.split('/');
  const backNavigation = applicationUrlPath.splice(1, 5).join('/');
  // const alertText = t('docToBig');
  const applicationId = params.applicationId;
  const checklistId = params.checklistId;
  const documentId = params.documentId;
  const applicationTitle = params.applicationTitle;
  const reUpload = location.pathname.split('/').pop() === 're-upload-generator';

  const [openAlert, setOpenAlert] = useState(false);

  const [canFetch, setCanFetch] = useState(false);

  useEffect(() => {
    if (documentId) {
      setCanFetch(true);
    } else {
      setCanFetch(false);
    }
  }, [documentId]);

  const { value: application } = useAsync(() => {
    if (applicationId && applicationTitle) {
      return api.getCase({ caseId: applicationId, workflowType: applicationTitle });
    } else {
      return Promise as never;
    }
  }, []);

  const documentFromApplication = useMemo(() => {
    const foundChecklistItem = application?.CaseCriteria?.find((cc) => cc.id === checklistId);
    return foundChecklistItem?.CaseFiles?.find((doc) => doc.GeneratedFileId === documentId);
  }, [application?.CaseCriteria, checklistId, documentId]);

  const { value: document } = useAsync(async () => {
    if (canFetch && documentId) {
      return await api.getGenerateFileById({ id: documentId });
    }
  }, [canFetch, documentId]);

  const openAlertProp = () => {
    setOpenAlert(true);
  };

  const AlertPopupCallback = useMemo(() => {
    switch (toastMessageActionTypeClient) {
      case FILE_REACHED_MORE_THAN_10_MB: {
        return <AlertPopup setOpenAlert={setOpenAlert} severity="error" text={t('docToBig')} />;
      }
      case FILE_FAILED_DIMENSIONS: {
        return (
          <AlertPopup
            setOpenAlert={setOpenAlert}
            severity="error"
            text={'One or more files failed. Please, provide minimum dimensions width and height of 200px.'}
          />
        );
      }
    }
  }, [openAlert]);

  // console.log('documdocumentFromApplicationnt', documentFromApplication);

  return (
    <>
      <Header />
      <Box className="!px-[20px] pt-[68px] sm:!flex sm:!justify-center !w-full">
        {uploadSpinner ? (
          <Box className="flex justify-center items-center !h-[80dvh]">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="sm:!w-[660px] relative">
            {openAlert && AlertPopupCallback}
            {/* <Box className="mt-[16px]">
            <BackButton text="Cancel" navigatePath={'/' + backNavigation} removeArrowIcon={true} />
          </Box> */}
            <Box className="!w-full flex justify-end py-[13px] px-[10px] mb-[8px]">
              <Button
                className="!normal-case !text-secondary !m-text-btn-md md:!d-text-btn-md !flex !items-center !p-0"
                onClick={() => navigate('/' + backNavigation)}
              >
                <Icon className="mr-2 ">close_icon</Icon> {t('close')}
              </Button>
            </Box>
            <Box className="mb-[24px]">
              <Typography className="!m-text-h5 md:!d-text-h5 !mb-[8px]">
                {reUpload ? t('resubmitYourDocument') : t('addDocumentInformation')}
              </Typography>
              <Typography className="!m-text-body-md md:!d-text-body-md">
                {reUpload ? t('resubmitDescription') : t('addDocumentDescription')}
              </Typography>
              {documentFromApplication?.Status === CaseFileTypes.REJECT.toString() &&
                reUpload &&
                documentFromApplication &&
                documentFromApplication.ReasonForResubmit && (
                  <Box className="mt-[8px]">
                    <Typography className="!m-text-body-md md:!d-text-body-md !text-[#A81D35]">
                      {documentFromApplication.ReasonForResubmit}
                    </Typography>
                  </Box>
                )}
            </Box>
            <PDFUploader
              allowedFileTypes={Array.isArray(allowedFileTypes) ? allowedFileTypes : [allowedFileTypes]}
              openAlertProp={openAlertProp}
              editDocumentProp={document}
              applicationId={applicationId}
              checklistId={checklistId}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default UploadGenerator;
