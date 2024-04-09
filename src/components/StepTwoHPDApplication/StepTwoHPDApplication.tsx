import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Icon
} from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';

interface StepTwoHPDApplicationProps {
  shelterData: string;
  handleChangeShelter: (e: SelectChangeEvent<string>) => void;
  shelters: string[];
  handleSSN: (e: ChangeEvent<HTMLInputElement>) => void;
  organization: string;
  ssn: string;
  prevStep: () => void;
  nextStep: () => void;
}

function StepTwoHPDApplication({
  shelterData,
  handleChangeShelter,
  shelters,
  handleSSN,
  organization,
  ssn,
  prevStep,
  nextStep
}: StepTwoHPDApplicationProps) {
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
        Apply for affordable housing with HPD.
      </Typography>
      <Box className="!mb-[16px]">
        <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
          What shelter do you live in ?
          <Icon className="ml-2 !flex" id="shelter-info">
            info_outlined_icon
          </Icon>
        </Typography>
        <TooltipUI
          anchorSelect="#shelter-info"
          place="bottom"
          content="If you don't know which shelter you live in. Ask a shelter staff to help you answer this question."
        />
      </Box>

      <Select
        defaultValue={shelterData}
        value={shelterData}
        onChange={handleChangeShelter}
        className="!w-full !mb-[24px]"
      >
        {shelters.map((shelter, index) => (
          <MenuItem key={index} value={shelter}>
            {shelter}
          </MenuItem>
        ))}
      </Select>

      <Box className="!mb-[16px]">
        <Typography className=" !m-text-body-md lg:!d-text-body-md !flex !items-center">
          What is your Socail Security Number ?
          <Icon className="ml-2" id="ssn-info">
            info_outlined_icon
          </Icon>
        </Typography>
        <TooltipUI
          anchorSelect="#ssn-info"
          place="bottom"
          content="We ask for your Social Security Number to process your application."
        />
      </Box>

      <TextField
        {...register('ssn', {
          onChange: (e) => {
            handleSSN(e);
          },
          required: organization === 'HPD',
          minLength: {
            value: 11,
            message: 'Please, provide full Social Security Number'
          }
        })}
        error={!!errors.ssn}
        helperText={
          errors.ssn?.message
            ? `${errors.ssn?.message}`
            : 'Example: ###-##-####'
        }
        value={ssn}
        className="!w-full !mb-[24px]"
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

export default StepTwoHPDApplication;
