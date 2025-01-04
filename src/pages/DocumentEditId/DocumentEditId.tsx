import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import PDFUploader from '../../components/PDFUploader/PDFUploader';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import AlertPopup from '../../components/AlertPopup/AlertPopup';
import { FILE_REACHED_MORE_THAN_10_MB, FILE_FAILED_DIMENSIONS } from '../../utils/client-toast-messages';

import { Box, Typography, CircularProgress } from '@mui/material';
import { useApi } from '../../utils/use-api';
import { useAsync } from 'react-use';
import { useTranslation } from 'react-i18next';
import { useBoundStore } from '../../store/store';

function DocumentEditId() {
  const { id } = useParams();

  const { t } = useTranslation('docs');
  // const alertText = t('docToBig');

  const api = useApi();
  const { value: document } = useAsync(() => {
    return api.getGenerateFileById({ id: id! });
  });
  const [openAlert, setOpenAlert] = useState(false);
  const { uploadSpinner, toastMessageActionTypeClient } = useBoundStore();

  const openAlertProp = () => {
    console.log('Open alert');
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
            text={'One or more files failed. Please, provide minimum dimensions with width and height of 200px.'}
          />
        );
      }
    }
  }, [openAlert]);

  return (
    <>
      <Header />
      <Box className="!px-[20px] pt-[68px] sm:!flex sm:!justify-center !w-full">
        {uploadSpinner ? (
          <Box className="flex justify-center items-center !h-[90dvh]">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="sm:!w-[660px] relative">
            {openAlert && AlertPopupCallback}
            <Box className="mb-[16px]">
              <BackButton text={t('returnButton')} />
            </Box>
            <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">{t('editDoc')}</Typography>
            <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[24px]">{t('changeAbility')}</Typography>
            <PDFUploader
              openAlertProp={openAlertProp}
              buttonNameProp="Save document"
              editDocumentProp={document}
              applicationId={undefined}
              checklistId={undefined}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default DocumentEditId;
