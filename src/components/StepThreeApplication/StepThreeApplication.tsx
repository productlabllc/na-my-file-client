import { Box, Button, Typography } from '@mui/material';
import FamilyMembersBlock from '../FamilyMembersBlock/FamilyMembersBlock';
import { useBoundStore } from '../../store/store';

interface StepThreeApplicationProps {
  prevStep: () => void;
  nextStep: () => void;
}

function StepThreeApplication({
  prevStep,
  nextStep
}: StepThreeApplicationProps) {
  const { setIsAddFamilyFormOpened } = useBoundStore();
  return (
    <>
      <Typography className="!mb-[8px] italic !m-text-body-md lg:!d-text-body-md">
        Step 3
      </Typography>
      <FamilyMembersBlock />
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        <Button
          className="!mb-[16px] !w-[94%] md:!w-[660px] !h-10 !m-text-btn-md !normal-case !text-secondary !border-secondary"
          variant="outlined"
          onClick={() => setIsAddFamilyFormOpened(true)}
        >
          Add family member
        </Button>
        <Box className="!flex !flex-row !w-[94%] md:!w-[660px] !justify-between">
          <Button
            variant="text"
            className="!m-text-btn-md !flex-1 !border-secondary !mr-2 !text-secondary !min-w-[170px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            variant="contained"
            className="!m-text-btn-md !flex-1 !bg-secondary !ml-2 !min-w-[170px] !h-[48px] !normal-case"
            onClick={nextStep}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default StepThreeApplication;
