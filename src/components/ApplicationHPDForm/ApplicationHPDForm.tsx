import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Select,
  Box,
  Button,
  Icon,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';

import HPDApplicationType from '../../types/HPDApplicationType';

interface ApplicationHPDFormProps {
  application: HPDApplicationType | null | undefined;
  handleCloseDialog: () => void;
}

interface FormInput {
  shelterName: string;
  ssn: string;
}

const shelters = [
  "Willow Men's Shelter-Bronx",
  "Franklin Women's Shelter-Bronx",
  'Seneca Houses Family Shelter-Bronx',
  'Nelson Fam Resid Family Shelter-Bronx',
  'Dean Street Family Shelter-Brooklyn',
  'Legacy Family Residence Family Shelter-Brooklyn',
  'Regent Family Residence Family Shelter-Manhattan',
  'Briarwood Family Residence Family Shelter-Queens',
  'Jamaica Residence Family Shelter-Queens'
];

function ApplicationHPDForm({
  handleCloseDialog,
  application
}: ApplicationHPDFormProps) {
  const { register, formState, handleSubmit, setValue } = useForm<FormInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    console.log(shelter);
    // navigate('/family-members');
    // reset();
    handleCloseDialog();
  };

  const [shelter, setShelter] = useState(application?.shelterName);
  const [ssn, setSnn] = useState(application?.ssn);

  const handleChangeShelter = (e: SelectChangeEvent<string>) => {
    setValue('shelterName', e.target.value);
    setShelter(e.target.value);
  };

  function formatSSN(value: string) {
    if (!value) return value;
    const ssn = value.replace(/[^\d]/g, '');
    const ssnLength = ssn.length;

    if (ssnLength < 4) return ssn;

    if (ssnLength < 6) {
      return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }

    // finally, if the ssnLength is greater then 6, we add the last
    // bit of formatting and return it.
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  }

  const handleSSN = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setSnn(e.target.value);
    // setValue('ssn', e.target.value);
    const formattedSSN = formatSSN(e.target.value);
    setValue('ssn', formattedSSN);
    setSnn(formattedSSN);
  };

  const { errors } = formState;
  return (
    <div>
      <Box className="sm:flex sm:justify-center w-[100%] !pt-[24px]">
        <Box className="!px-[16px] w-full sm:w-[600px]">
          <Box className="!w-full flex justify-end mb-[24px]">
            <Button
              className="!normal-case !text-secondary !d-text-btn-md"
              onClick={handleCloseDialog}
            >
              <Icon fontSize="medium" className="mr-2">
                close_icon
              </Icon>{' '}
              Close
            </Button>
          </Box>
          <Typography className="!m-text-h5 lg:!d-text-h5 !mb-[8px]">
            Edit application
          </Typography>
          <Typography className="!m-text-body-md lg:!d-text-body-md !mb-[24px]">
            You can update the information
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="!mb-[16px] ">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                What shelter do you live in ?
                <Icon className="ml-2 !flex" id="edit-shelter-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI
                anchorSelect="#edit-shelter-info"
                place="bottom"
                content="If you don't know which shelter you live in. Ask a shelter staff to help you answer this question"
              />
            </Box>

            <Select
              defaultValue={shelter}
              value={shelter}
              onChange={(e) => handleChangeShelter(e)}
              className="!w-full !mb-[24px]"
            >
              {shelters.map((shelter, index) => (
                <MenuItem key={index} value={shelter}>
                  {shelter}
                </MenuItem>
              ))}
            </Select>

            <Box className="!mb-[16px]">
              <Typography className="!m-text-body-md lg:!d-text-body-md !flex !items-center">
                What is your Socail Security Number ?
                <Icon className="ml-2 !flex" id="edit-ssn-info">
                  info_outlined_icon
                </Icon>
              </Typography>
              <TooltipUI
                anchorSelect="#edit-ssn-info"
                place="bottom-end"
                content="We ask for your Social Security Number to process your application"
              />
            </Box>

            <TextField
              {...register('ssn', {
                onChange: (e) => {
                  handleSSN(e);
                },
                required: 'Provide Social Security Number',
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
            <Button
              variant="outlined"
              className={`!absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 !bottom-0 !py-[16px] !w-[90%] sm:!w-[570px] !h-12 ${
                application?.ssn === ssn || !formState.isValid
                  ? ''
                  : '!text-secondary !border-secondary'
              } !m-text-btn-md !normal-case`}
              disabled={application?.ssn === ssn || !formState.isValid}
              type="submit"
            >
              Save
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
}

export default ApplicationHPDForm;
