import Header from '../../layouts/Header/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function ApplicationSubmitConfirmation() {
  // const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useTranslation('applications');
  const [backNavigationToChecklist, setBackNavigationToChecklist] = useState('');
  const [backNavigationToChecklistItem, setBackNavigationToChecklistItem] = useState('');

  useEffect(() => {
    setBackNavigationToChecklist('application/' + params.applicationTitle + '/' + params.applicationId);
    setBackNavigationToChecklistItem(
      'application/' +
        params.applicationTitle +
        '/' +
        params.applicationId +
        '/' +
        params.checklistTitle +
        '/' +
        params.checklistId
    );
  }, [params]);

  console.log(params.applicationTitle);

  return (
    <>
      <Box className="">
        <Header />
      </Box>
      <Box className="!px-[20px] pt-[68px]  sm:!flex sm:!justify-center !w-full">
        <Box className="sm:!w-[550px] relative mb-[160px] !overflow-auto">
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[48px] !mt-[24px]">{t('thanksOnSubmit')}</Typography>

          <Box className="grid grid-cols-6 lg:grid-cols-6 mb-[24px]">
            <Box className="col-span-1 border-2 !w-[40px] !h-[40px] rounded-full border-secondary text-black flex items-center justify-center">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">1</Typography>
            </Box>
            <Typography className="!col-span-5 !m-text-body-md lg:!d-text-body-md !mb-[8px]">
              {params.applicationTitle === 'PATH' ? t('PATHemailNotification') : t('emailNotification')}
            </Typography>
          </Box>
          <Box className="grid grid-cols-6 mb-[24px]">
            <Box className="col-span-1 border-2 !w-[40px] !h-[40px] rounded-full border-secondary text-black flex items-center justify-center">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">2</Typography>
            </Box>
            <Typography className="!col-span-5 !m-text-body-md lg:!d-text-body-md !mb-[8px]">
              {t('keepAddingDocs')}
            </Typography>
          </Box>
          <Box className="grid grid-cols-6 mb-[24px]">
            <Box className="col-span-1 border-2 !w-[40px] !h-[40px] rounded-full border-secondary text-black flex items-center justify-center">
              <Typography className="!m-text-body-md-bold lg:!d-text-body-md-bold">3</Typography>
            </Box>
            <Typography className="!col-span-5 !m-text-body-md lg:!d-text-body-md !mb-[8px]">
              {t('editDocIfNeeded')}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{ boxShadow: '0px -4px 4px -4px black' }}
          className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
        >
          <Box className="!w-[94%] md:!w-[600px] flex justify-center">
            <Button
              variant="contained"
              className={`!ml-2 sm:!min-w-[290px] !m-text-btn-md !bg-secondary !text-white !w-[98%] !h-[48px] !normal-case !mb-[12px]`}
              onClick={() => navigate('/' + backNavigationToChecklistItem)}

              // disabled={!formState.isValid}
            >
              {t('continue')}
            </Button>
          </Box>
          <Box className="!w-[94%] md:!w-[600px] flex justify-center">
            <Button
              variant="text"
              className={`!ml-2 sm:!min-w-[290px] !m-text-btn-md  !text-secondary !w-[98%] !h-[48px] !normal-case`}
              onClick={() => navigate('/' + backNavigationToChecklist)}

              // disabled={!formState.isValid}
            >
              {t('goToChecklist')}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ApplicationSubmitConfirmation;
