import { useMemo, useState } from 'react';
import { Box, Button, Icon, Typography, CircularProgress } from '@mui/material';
import Header from '../../layouts/Header/Header';
import PDFUploader from '../../components/PDFUploader/PDFUploader';
import AlertPopup from '../../components/AlertPopup/AlertPopup';
// import BackButton from '../../components/BackButton/BackButton';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBoundStore } from '../../store/store';
import { FILE_REACHED_MORE_THAN_10_MB, FILE_FAILED_DIMENSIONS } from '../../utils/client-toast-messages';

function UploadGenerator() {
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  const { t } = useTranslation('docs');
  const { uploadSpinner, toastMessageActionTypeClient } = useBoundStore();

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
            text={'One or more files failed. Please, provide minimum dimensions with width and height of 200px.'}
          />
        );
      }
    }
  }, [openAlert]);

  return (
    <>
      <Header />
      <Box className="!px-[20px] pt-[64px] sm:!flex sm:!justify-center !w-full">
        {uploadSpinner ? (
          <Box className="flex justify-center items-center !h-[90dvh]">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="sm:!w-[660px] relative">
            {openAlert && AlertPopupCallback}
            <Box className="!w-full flex justify-end py-[13px] px-[10px] mb-[8px]">
              <Button
                className="!normal-case !text-secondary !m-text-btn-md md:!d-text-btn-md !flex !items-center !p-0"
                onClick={() => navigate('/client-dashboard')}
              >
                <Icon className="mr-2 ">close_icon</Icon> {t('close')}
              </Button>
            </Box>
            <Box className="mb-[24px]">
              <Typography className="!m-text-h5 md:!d-text-h5 !mb-[8px]">{t('addDocumentInformation')}</Typography>
              <Typography className="!m-text-body-md md:!d-text-body-md">{t('addDocumentDescription')}</Typography>
            </Box>

            <PDFUploader openAlertProp={openAlertProp} applicationId={undefined} checklistId={undefined} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default UploadGenerator;
