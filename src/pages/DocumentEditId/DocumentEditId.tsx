import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import PDFUploader from '../../components/PDFUploader/PDFUploader';
import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import AlertPopup from '../../components/AlertPopup/AlertPopup';

import documentData from '../../assets/mock-data/mock-documents.json';
import Document from '../../types/Document';

import { Box, Typography } from '@mui/material';

function DocumentEditId() {
  const { id } = useParams();
  const alertText =
    ' Your document could not be uploaded. The document is over 10MB.';
  const document = useMemo<Document | undefined>(
    () => documentData?.find((document) => document.id === id),
    [documentData]
  );
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
          {openAlert && (
            <AlertPopup
              setOpenAlert={setOpenAlert}
              severity="error"
              text={alertText}
            />
          )}
          <Box className="mb-[16px]">
            <BackButton text="Cancel" removeArrowIcon={true} />
          </Box>
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">
            Edit document
          </Typography>
          <Typography className="!m-text-body-md lg:!d-text-body-md">
            You can change the document information and upload a new copy.
          </Typography>
          <PDFUploader
            openAlertProp={openAlertProp}
            buttonNameProp="Save document"
            editDocumentProp={document}
          />
        </Box>
      </Box>
    </>
  );
}

export default DocumentEditId;
