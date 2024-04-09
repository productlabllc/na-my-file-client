import {
  Box,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent } from 'react';

import { useFormContext } from 'react-hook-form';

interface StepOneApplicationProps {
  organization: string;
  handleChangeOrganization: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}

function StepOneApplication({
  organization,
  handleChangeOrganization,
  nextStep
}: StepOneApplicationProps) {
  const { register } = useFormContext();
  const navigate = useNavigate();
  return (
    <>
      <Typography className="!mb-[8px] italic !m-text-body-md lg:!d-text-body-md">
        Step 1
      </Typography>
      <Typography className="!mb-[8px] !m-text-h5 lg:!d-text-h5">
        Start a service
      </Typography>
      <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">
        Apply to any type of service you need for yourself and your family.
      </Typography>
      <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md">
        I want to share documents with:
      </Typography>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          //   defaultValue="PATH"
          value={organization}
          {...(register('organization'),
          {
            onChange: (e) => {
              handleChangeOrganization(e);
            }
          })}
        >
          <FormControlLabel
            className="!m-text-body-md sm:!d-text-body-md"
            value="PATH"
            control={<Radio />}
            label="PATH for Temporary Shelter Intake"
          />
          <FormControlLabel
            className="!m-text-body-md sm:!d-text-body-m"
            value="HPD"
            control={<Radio />}
            label="HPD for Set Aside Affordable Housing"
          />
        </RadioGroup>
      </FormControl>
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        <Box className="!flex !flex-row !w-[94%] md:!w-[660px] !justify-between">
          <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={() => navigate('/client-dashboard')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            className="!m-text-btn-md !flex-1 !bg-secondary !ml-2 sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={nextStep}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default StepOneApplication;
