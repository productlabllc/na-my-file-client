import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import BackButton from '../../components/BackButton/BackButton';

import Header from '../../layouts/Header/Header';
import PDFUploader from '../../components/PDFUploader/PDFUploader';
import AlertPopup from '../../components/AlertPopup/AlertPopup';

function UploadGenerator() {
  // const navigate = useNavigate();
  const alertText =
    'Your document could not be uploaded. The document is over 10MB.';

  const [openAlert, setOpenAlert] = useState(false);

  const openAlertProp = () => {
    setOpenAlert(true);
  };
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

          <BackButton text="Cancel" removeArrowIcon={true} />
          <PDFUploader openAlertProp={openAlertProp} />
        </Box>
      </Box>
    </>
  );
}

export default UploadGenerator;
