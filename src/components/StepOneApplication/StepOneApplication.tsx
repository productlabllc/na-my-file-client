import { Box, Button, FormControl, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Workflow } from '@namyfile/api-client';
import { useTranslation } from 'react-i18next';
import BackButton from '../BackButton/BackButton';

interface StepOneApplicationProps {
  organization: string;
  workflows?: Workflow[];
  handleChangeOrganization: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
}

function StepOneApplication({ organization, workflows, handleChangeOrganization, nextStep }: StepOneApplicationProps) {
  const { register } = useFormContext();
  // const navigate = useNavigate();

  const { t } = useTranslation('applications');

  return (
    <Box>
      <Box className="mb-[24px]">
        <BackButton navigatePath="/client-dashboard?tab=applications" text={t('returnButton')} />
      </Box>
      <Typography className="!mb-[8px] !m-text-italic md:!d-text-italic ">{t('stepOne')}</Typography>
      <Typography className="!mb-[24px] !m-text-h5 md:!d-text-h5">{t('startService')}</Typography>
      {/* <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">{t('apply')}</Typography> */}
      <Typography className="!mb-[16px] !m-text-body-md lg:!d-text-body-md">{t('shareDocsWith')}</Typography>
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
          {workflows?.map((workflow) => (
            <FormControlLabel
              key={workflow.id}
              classes={{ label: '!m-text-body-md md:!d-text-body-md' }}
              value={workflow.id}
              control={<Radio />}
              label={workflow.Name}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Box
        sx={{ boxShadow: '0px -4px 4px -4px black' }}
        className="!fixed !py-[16px] !h-min-[70px] !z-20 bottom-0 w-full inset-x-0 !flex !flex-col !justify-center !bg-white !items-center"
      >
        {/* <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={() => navigate('/client-dashboard')}
          >
            {t('back')}
          </Button> */}
        <Button
          variant="contained"
          className="!w-[94%] md:!w-[660px] !m-text-btn-md  !bg-secondary !h-[48px] !normal-case"
          onClick={() => nextStep()}
        >
          {t('continue')}
        </Button>
      </Box>
    </Box>
  );
}

export default StepOneApplication;
