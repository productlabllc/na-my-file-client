import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Icon
} from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';

interface StepTwoPATHApplicationProps {
  organization: string;
  handleChangeCasenumber: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  caseNumber: string;
}

function StepTwoPATHApplication({
  organization,
  handleChangeCasenumber,
  nextStep,
  caseNumber,
  prevStep
}: StepTwoPATHApplicationProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  return (
    <>
      <Typography className="!mb-[8px] italic !m-text-body-md lg:!d-text-body-md">
        Step 2
      </Typography>
      <Typography className="!mb-[8px] !m-text-h5 lg:!d-text-h5">
        Start a service
      </Typography>
      <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">
        Apply for temporary shelter intake at PATH.
      </Typography>
      <Box className="!mb-[8px]">
        <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
          What is your DHS CARES ID ?
          <Icon className="ml-2" id="dhs-cares-info">
            info_outlined_icon
          </Icon>
        </Typography>

        <TooltipUI
          anchorSelect="#dhs-cares-info"
          place="bottom"
          content="Your CARES ID can be found on your ticket. If you can't find your CARES ID then ask a staff employee at the PATH Center."
        />
      </Box>
      <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md">
        Add your DHS CARES ID. If you are a returning family or if you are new
        to PATH, add the ticket number you received when you came to PATH.
      </Typography>
      <TextField
        {...register('caseNumber', {
          onChange: (e) => {
            handleChangeCasenumber(e);
          },
          required: organization === 'PATH' && 'Field requires your CARES ID'
        })}
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">CL</InputAdornment>
        }}
        value={caseNumber}
        error={!!errors.caseNumber}
        // helperText={`${errors.caseNumber?.message}`}
        helperText={
          errors.caseNumber
            ? `${errors.caseNumber?.message}`
            : 'Example: CL #####'
        }
        className="!w-full"
        sx={{
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            {
              display: 'none'
            },
          '& input[type=number]': {
            MozAppearance: 'textfield'
          }
        }}
      />
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
            className={`!m-text-btn-md !flex-1 ${
              !formState.isValid ? '' : '!text-white !bg-secondary'
            } !ml-2 sm:!min-w-[290px] !h-[48px] !normal-case`}
            onClick={nextStep}
            disabled={!formState.isValid}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default StepTwoPATHApplication;
