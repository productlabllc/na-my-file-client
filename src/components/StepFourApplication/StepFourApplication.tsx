import { Box, Button, Typography, List, Icon } from '@mui/material';
import FamilyMember from '../../types/FamilyMember';
import FamilyMemberListItemNoAction from '../FamilyMemberListItemNoAction/FamilyMemberListItemNoAction';
interface StepFourApplicationProps {
  organization: string;
  shelterData: string;
  caseNumber: string;
  ssn: string;
  prevStep: () => void;
  familyMembers: FamilyMember[];
}

function StepFourApplication({
  organization,
  shelterData,
  caseNumber,
  ssn,
  familyMembers,
  prevStep
}: StepFourApplicationProps) {
  return (
    <>
      <Typography className="!mb-[8px] !m-text-h5 lg:!d-text-h5">
        Please review!
      </Typography>
      <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">
        Thank you for applying for this service. Make sure to review your
        information before you submit.
      </Typography>
      <Typography className="!mb-[16px] !m-text-body-md-bold lg:!d-text-body-md">
        I want to share documents with:
      </Typography>
      {organization === 'PATH' && (
        <Box className="flex flex-row">
          <Icon className="!text-primary mr-[16px]">
            radio_button_checked_icon
          </Icon>
          <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">
            PATH for Temporary Shelter Intake
          </Typography>
        </Box>
      )}
      {organization === 'HPD' && (
        <Box className="flex flex-row">
          <Icon className="!text-primary mr-[16px]">
            radio_button_checked_icon
          </Icon>
          <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">
            HPD for Set Aside Affordable Housing
          </Typography>
        </Box>
      )}
      {organization === 'HPD' && (
        <Typography className="!mb-[16px] !m-text-body-md-bold lg:!d-text-body-md">
          What shelter do you live in?
        </Typography>
      )}
      {organization === 'HPD' && (
        <Typography className="!opacity-60 !mb-[24px] !m-text-body-md lg:!d-text-body-md">
          {shelterData}
        </Typography>
      )}
      {caseNumber && (
        <Box>
          <Typography className="!mb-[8px] !m-text-body-md-bold lg:!d-text-body-md">
            What is your DHS CARES ID ?
          </Typography>

          <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md">
            Add your DHS CARES ID. If you are a returning family or if you are
            new to PATH, add the ticket nummber you received when you came to
            PATH
          </Typography>
        </Box>
      )}
      {ssn && (
        <Box>
          <Typography className="!mb-[16px] !m-text-body-md-bold lg:!d-text-body-md">
            What is your Social Security Number ?
          </Typography>
        </Box>
      )}
      <Typography className="!opacity-60 !w-fit !mb-[24px] !m-text-body-md lg:!d-text-body-md">
        {ssn || `CL ${caseNumber}`}
      </Typography>
      <Typography className="!mb-[8px] !m-text-h5 lg:!d-text-h5">
        Family member
      </Typography>
      <Box className="w-full pb-[70px] relative">
        {/* Show List of data items when the screen size is x-large and down */}
        {familyMembers.length > 0 ? (
          <List dense className="w-full">
            {familyMembers.map((member) => {
              return (
                <FamilyMemberListItemNoAction key={member.id} member={member} />
              );
            })}
          </List>
        ) : (
          'There is no family members added here.'
        )}
      </Box>
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        <Box className="!flex !flex-row !w-[94%] md:!w-[660px] !justify-between">
          <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            variant="contained"
            className="!m-text-btn-md !flex-1 !bg-secondary !ml-2 sm:!min-w-[290px] !h-[48px] !normal-case"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default StepFourApplication;
