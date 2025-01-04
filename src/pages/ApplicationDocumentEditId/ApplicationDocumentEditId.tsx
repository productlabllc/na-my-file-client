import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import PDFUploaderApplication from '../../components/PDFUploaderApplication/PDFUploaderApplication';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import AlertPopup from '../../components/AlertPopup/AlertPopup';
import { useBoundStore } from '../../store/store';

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DocumentEditId() {
  const { id } = useParams();
  const { getUserFiles } = useBoundStore();

  const { t } = useTranslation('applications');

  const documentData = getUserFiles();

  const document = useMemo(() => documentData?.find((document) => document.id === id), [documentData, id]);

  const [openAlert, setOpenAlert] = useState(false);

  const openAlertProp = () => {
    console.log('Open alert');
    setOpenAlert(true);
  };
  console.log(document);

  return (
    <>
      <Header />
      <Box className="!px-[20px] pt-[68px] sm:!flex sm:!justify-center !w-full">
        <Box className="sm:!w-[660px] relative">
          {openAlert && <AlertPopup setOpenAlert={setOpenAlert} severity="error" text={t('docToBig')} />}
          <Box className="mb-[16px]">
            <BackButton text="Cancel" removeArrowIcon={true} />
          </Box>
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">{t('editDoc')}</Typography>
          <Typography className="!m-text-body-md lg:!d-text-body-md">{t('reauploadDisclamer')}</Typography>
          <PDFUploaderApplication
            openAlertProp={openAlertProp}
            buttonNameProp={t('saveDoc')}
            editDocumentProp={document}
          />
        </Box>
      </Box>
    </>
  );
}

export default DocumentEditId;
