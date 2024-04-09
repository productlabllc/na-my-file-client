import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Icon } from '@mui/material';
import { useBoundStore } from '../../store/store';
import ApplicationChecklistAccordion from '../../components/ApplicationChecklistAccordion/ApplicationChecklistAccordion';

import Header from '../../layouts/Header/Header';
import DHSIcon from '../../assets/HPD.svg';
// import AlertPopup from '../../components/AlertPopup/AlertPopup';
import BackButton from '../../components/BackButton/BackButton';
import PATHApplicationType from '../../types/PATHApplicationType';
import HPDApplicationType from '../../types/HPDApplicationType';

function ApplicationChecklist() {
  // const [openAlert, setOpenAlert] = useState(true);
  const { getApplications } = useBoundStore();
  const location = useLocation();
  const urlApplicationId = location.pathname.split('/')[3];

  const [foundApplication, setFoundApplication] = useState<
    PATHApplicationType | HPDApplicationType
  >();

  useEffect(() => {
    // console.log('ID', urlApplicationId);
    // console.log('CHECKLIST', getApplications());
    const applicationD = getApplications().find(
      (application) => application.id === urlApplicationId
    );
    // console.log(applicationD);
    setFoundApplication(applicationD);
  }, []);

  // console.log('FFFF', foundApplication);

  const warningText = 'Start uploading your documents to the checklist';
  return (
    <div>
      <Header />
      <Box className="!w-full !flex !justify-center">
        <Box className="!w-full sm:!w-[546px] lg:!w-[570px] mt-[70px] px-[16px] md:px-0 pb-[52px]">
          {/*Return button to dashaboard */}
          <Box className="mt-[18px] mb-[16px]">
            <BackButton
              text="Return to dashboard"
              navigatePath="/client-dashboard?tab=applications"
            />
          </Box>
          {/*Warning box */}
          {/* <Box>
            {openAlert && (
              <AlertPopup
                setOpenAlert={setOpenAlert}
                severity="warning"
                text={warningText}
              />
            )}
          </Box> */}
          <Box className="!mb-[24px] !bg-importantBackground !min-h-[120px] !flex !flex-col justify-center !py-[20px]">
            <Box className="flex !d-text-body-lg !px-[15px]">
              <Icon>warning_amber_outlined_icon</Icon>
              <Typography className="!pl-[13px] !d-text-body-sm-bold lg:!d-text-body-md-bold">
                Important
              </Typography>
            </Box>
            <Box>
              <Typography className="!px-[50px] !d-text-body-sm lg:!d-text-body-md">
                {warningText}
              </Typography>
            </Box>
          </Box>
          {/*HPD icon */}
          <Box className="flex justify-center my-[32px]">
            <img
              src={DHSIcon}
              className="!w-[192px] !h-[44px] lg:!w-[240px] lg:!h-[92px]"
            ></img>
          </Box>
          {/*Paragraph with application status */}
          <Box className="!w-full !flex !items-center mb-[16px]">
            <Typography className="!mr-[8px] !inline !m-text-body-md lg:!d-text-body-md">
              Application status
            </Typography>
            <Icon className="!inline !mr-[16px]">info_outlined_icon</Icon>

            {'Active' && (
              <>
                <Icon className="!mr-1 !px-0 !text-applicationActive !scale-75">
                  circle_icon
                </Icon>
                <Typography className="!text-applicationActive sm:!d-text-body-md-bold !m-text-body-md-bold ">
                  Active
                </Typography>
              </>
            )}
            {/* 
                {application.status === 'Closed' && (
                  <>
                    <Icon className="!mr-1 !px-0 !text-applicationClose !scale-50">
                      circle_icon
                    </Icon>
                    <Typography className="!text-applicationClose sm:!m-text-body-md-bold !m-text-body-sm-bold ">
                      {application?.status}
                    </Typography>
                  </>
                )} */}
          </Box>
          <Typography className="!m-text-body-md-bold !mb-[12px]">
            ROI Document Checklist
          </Typography>
          <Box>
            {foundApplication?.checklistItems
              ? foundApplication.checklistItems?.map((checklistType) => (
                  <ApplicationChecklistAccordion
                    key={checklistType.id}
                    checklistType={checklistType}
                  />
                ))
              : 'Loading'}
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ApplicationChecklist;
