import { Box, Button, Typography, List } from '@mui/material';
import FamilyMemberListItemNoAction from '../FamilyMemberListItemNoAction/FamilyMemberListItemNoAction';
// import { useApi } from '../../utils/use-api';
import { FamilyMember } from '@myfile/api-client';
import { useTranslation } from 'react-i18next';
import BackButton from '../BackButton/BackButton';

interface StepFourApplicationProps {
  organization?: string;
  shelterData: string;
  organizationType: string;
  caseNumber: string;
  ssn: string;
  prevStep: () => void;
  familyMembers: FamilyMember[];
}

function StepFourApplication({
  shelterData,
  organizationType,
  caseNumber,
  ssn,
  familyMembers,
  prevStep
}: StepFourApplicationProps) {
  const { t } = useTranslation('applications');

  return (
    <>
      <Box className="mb-[24px]">
        <BackButton text={t('return')} step={prevStep} />
      </Box>
      <Typography className="!mb-[8px] !m-text-h5 md:!d-text-h5">{t('review')}</Typography>
      <Typography className="!mb-[24px] !m-text-body-md md:!d-text-body-md">{t('infoCorrect')}</Typography>
      <Typography className="!mb-[16px] !m-text-body-md md:!d-text-body-md">{t('shareWith')}</Typography>
      {organizationType === 'PATH' && (
        <Box className="flex flex-row !mb-[24px]">
          {/* <Icon className="!text-primary mr-[16px]">radio_button_checked_icon</Icon> */}
          <Typography className=" !m-text-body-md-bold md:!d-text-body-md-bold">{t('PATH')}</Typography>
        </Box>
      )}
      {organizationType === 'HPD' && (
        <Box className="flex flex-row !mb-[24px]">
          {/* <Icon className="!text-primary mr-[16px]">radio_button_checked_icon</Icon> */}
          <Typography className="!m-text-body-md-bold md:!d-text-body-md-bold">{t('HPD')}</Typography>
        </Box>
      )}
      {organizationType === 'HPD' && (
        <Box className="!mb-[16px] ">
          <Typography className="!m-text-body-md md:!d-text-body-md">{t('shelter')}</Typography>
        </Box>
      )}
      {organizationType === 'HPD' && (
        <Box className="!mb-[24px]">
          <Typography className=" !m-text-body-md-bold md:!d-text-body-md-bold">{shelterData}</Typography>
        </Box>
      )}
      {caseNumber && (
        <Box>
          <Typography className="!mb-[16px] !m-text-body-md md:!d-text-body-md">
            {t('yourIdentifyingInformation')}
          </Typography>
        </Box>
      )}
      {ssn && (
        <Box>
          <Typography className="!mb-[16px] !m-text-body-md md:!d-text-body-md">{t('caseNumber')}</Typography>
        </Box>
      )}
      <Typography className="!w-fit !mb-[24px] !m-text-body-md-bold md:!d-text-body-md-bold">
        {ssn || `${caseNumber}`}
      </Typography>
      <Typography className="!mb-[8px] !m-text-h5 md:!d-text-h5">{t('familymembers')}</Typography>
      <Box className="w-full pb-[70px] relative">
        {/* Show List of data items when the screen size is x-large and down */}
        {familyMembers.length > 0 ? (
          <List dense className="w-full">
            {familyMembers.map((member) => {
              return <FamilyMemberListItemNoAction key={member.id} member={member} />;
            })}
          </List>
        ) : (
          t('noFamilyMembers')
        )}
      </Box>
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        {/* <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            {t('back')}
          </Button> */}
        <Button
          variant="contained"
          className="!m-text-btn-md !bg-secondary !w-[94%] md:!w-[660px] sm:!min-w-[290px] !h-[48px] !normal-case"
          type="submit"
        >
          {t('startSharing')}
        </Button>
      </Box>
    </>
  );
}

export default StepFourApplication;
