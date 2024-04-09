import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import Header from '../../layouts/Header/Header';
import BackButton from '../../components/BackButton/BackButton';
import { useBoundStore } from '../../store/store';

import ChecklistItemType from '../../types/ChecklistItemType';

function ApplicationChecklistItemPage() {
  const location = useLocation();
  const { getAllCheckListItems } = useBoundStore();
  const applicationUrlPath = location.pathname.split('/');
  const applicationId = applicationUrlPath[3];
  const checklistItemId = applicationUrlPath[5];
  const backNavigation = applicationUrlPath.splice(1, 3).join('/');

  const [typeOfDocument, setTypeOfDocument] = useState<
    ChecklistItemType | undefined
  >();

  useEffect(() => {
    getAllCheckListItems(applicationId).forEach((blockCheckList) => {
      console.log('Found Type Of Documents', blockCheckList);
      const foundInfo = blockCheckList.typeOfDocument.find(
        (checklistItem) => checklistItemId === checklistItem.id
      );
      setTypeOfDocument(foundInfo);
    });
  }, []);
  console.log(typeOfDocument);

  return (
    <>
      <Header />
      <Box className="!w-full !flex !justify-center">
        <Box className="!w-full sm:!w-[546px] lg:!w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
          <Box className="!mt-[20px] !mb-[16px]">
            <BackButton
              text="Return to checklist"
              navigatePath={'/' + backNavigation}
            />
          </Box>
          <Box>
            <Typography className="!m-text-body-lg-bold !mb-[8px]">
              {typeOfDocument?.title}
            </Typography>
            <Typography className="!m-text-body-lg !mb-[16px]">
              All minors in your family
            </Typography>
            <Box className="!bg-primaryPress !bg-opacity-5 !p-[12px] !rounded-lg !border-dashed !border-2 !border-black">
              <Typography className="!m-text-body-lg !mb-[24px]">
                Upload your documents here or select previously uploaded
                documents from your dashboard.
              </Typography>
              <Button
                variant="contained"
                className="!bg-secondary !m-text-btn-md w-full h-12 !normal-case !mb-[20px]"
              >
                Upload new document
              </Button>
              <Button
                variant="outlined"
                className="!text-secondary !border-secondary !m-text-btn-md w-full h-12 !normal-case"
              >
                Select existing documents
              </Button>
            </Box>
          </Box>
          <Box
            sx={{ boxShadow: '0px -4px 4px -4px black' }}
            className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
          >
            <Box className="!w-[94%] md:!w-[660px] flex justify-center">
              <Button
                variant="text"
                className={`!ml-2 sm:!min-w-[290px] !m-text-btn-md !text-secondary !h-[48px] !normal-case`}
                // onClick={nextStep}
                // disabled={!formState.isValid}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ApplicationChecklistItemPage;
