import { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Button, Typography, TextField, Icon } from '@mui/material';
import TooltipUI from '../TooltipUI/TooltipUI';
import { useTranslation } from 'react-i18next';
import BackButton from '../BackButton/BackButton';

interface StepTwoPATHApplicationProps {
  organization: string;
  handleChangeCasenumber: (e: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  caseNumber: string;
}

function StepTwoPATHApplication({
  handleChangeCasenumber,
  nextStep,
  caseNumber,
  prevStep
}: StepTwoPATHApplicationProps) {
  const { register, formState } = useFormContext();
  const { errors } = formState;

  const { t } = useTranslation('applications');

  return (
    <>
      <Box className="mb-[24px]">
        <BackButton text={t('return')} step={prevStep} />
      </Box>
      <Typography className="!mb-[8px] !m-text-italic md:!d-text-italic">{t('stepTwo')}</Typography>
      <Typography className="!mb-[24px] !m-text-h5 md:!d-text-h5">{t('addYourIdentifyingInformation')}</Typography>
      {/* <Typography className="!mb-[24px] !m-text-body-md lg:!d-text-body-md">{t('applyDSS')}</Typography> */}
      <Box className="!mb-[8px]">
        <Typography className="!m-text-body-md md:!d-text-body-md !flex !items-center">
          {t('whatYourCaresId')}
          <Icon className="ml-2" id="dhs-cares-info">
            info_outlined_icon
          </Icon>
        </Typography>

        <TooltipUI anchorSelect="#dhs-cares-info" place="bottom" content={t('caresIdTooltip')} />
      </Box>
      <Typography className="!mb-[24px] !m-text-body-md md:!d-text-body-md">{t('caresIdReturnFamily')}</Typography>
      <TextField
        {...register('caseNumber', {
          onChange: (e) => {
            handleChangeCasenumber(e);
          },
          required: t('caresIdRequired')
        })}
        type="number"
        // InputProps={{
        //   startAdornment: <InputAdornment position="start">CL</InputAdornment>
        // }}
        value={caseNumber}
        error={!!errors.caseNumber}
        label={t('caresIdLabel')}
        // helperText={`${errors.caseNumber?.message}`}
        // helperText={errors.caseNumber ? `${errors.caseNumber?.message}` : t('exampleDSS')}
        // placeholder="CARES ID, Ticket Number or SSN"
        className="!w-full"
        sx={{
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
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
        {/* <Button
            variant="text"
            className="sm:!mr-[16px] !flex-1 !m-text-btn-md !mr-2 !border-secondary !text-secondary sm:!min-w-[290px] !h-[48px] !normal-case"
            onClick={prevStep}
          >
            {t('back')}
          </Button> */}
        <Button
          variant="contained"
          className={`!m-text-btn-md !w-[94%] md:!w-[660px] ${
            !formState.isValid ? '' : '!text-white !bg-secondary'
          } !h-[48px] !normal-case`}
          onClick={nextStep}
          disabled={!formState.isValid}
        >
          {t('continue')}
        </Button>
      </Box>
    </>
  );
}

export default StepTwoPATHApplication;
